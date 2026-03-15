"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface AIReviewResult {
    overall_score: number;
    content_accuracy: {
        score: number;
        issues: { text: string; severity: "high" | "medium" | "low"; explanation: string }[];
    };
    grammar_check: {
        score: number;
        errors: { original: string; suggestion: string; type: string }[];
    };
    source_reliability: {
        score: number;
        sources: { url: string; reliability: "high" | "medium" | "low" | "unknown"; reason: string }[];
    };
    source_content_match: {
        score: number;
        mismatches: { claim: string; source: string; issue: string }[];
    };
    suggestions: string[];
    readability_score?: number;
    tone_analysis?: string;
}

interface ArticleReference {
    url?: string;
    title: string;
    authors?: string;
    publisher?: string;
    year?: string;
    doi?: string;
}

const REVIEW_PROMPT = `Sen FizikHub platformunun yapay zeka editörüsün (FizikHubGPT-1.0 AI). Görevin bilimsel makaleleri en yüksek standartlarda incelemek.

Aşağıdaki Türkçe bilim makalesini detaylı bir şekilde incele ve JSON formatında rapor döndür.

İnceleme Kriterleri:
1. **İçerik Doğruluğu (content_accuracy)**: Makaledeki bilimsel iddiaları kontrol et. Yanlış, eksik veya şüpheli bilgiler varsa belirt. Bilimsel terminolojinin doğru kullanılıp kullanılmadığını kontrol et.
2. **Yazım & Dilbilgisi (grammar_check)**: Türkçe yazım hataları, noktalama, cümle yapısı sorunlarını tespit et. Akademik Türkçe standartlarına uygunluğu değerlendir.
3. **Kaynak Güvenilirliği (source_reliability)**: Verilen kaynakların akademik, güvenilir ve erişilebilir olup olmadığını değerlendir. Nature, Science, arXiv gibi Tier-1 kaynaklara bonus puan ver.
4. **Kaynak-İçerik Uyumu (source_content_match)**: Makaledeki iddialar ile kaynaklardaki bilgiler arasındaki tutarlılığı kontrol et. Kaynaklar gerçekten iddiayı destekliyor mu?
5. **Okunabilirlik (readability_score)**: Makalenin genel anlaşılırlığını 0-100 arası puanla. Karmaşık kavramlar yeterince açıklanmış mı? Analojiler doğru kullanılmış mı?
6. **Ton Analizi (tone_analysis)**: Makalenin üslubu hakkında kısa yorum (akademik, popüler bilim, çok teknik, vs.).
7. **Genel Öneriler (suggestions)**: Makaleyi geliştirmek için somut, uygulanabilir öneriler sun. En az 3, en fazla 7 öneri ver.

Her kategori için 0-100 arası puan ver. Genel puanı (overall_score) kategorilerin ağırlıklı ortalaması olarak hesapla:
- İçerik: %30, Yazım: %20, Kaynak Güvenilirliği: %20, Kaynak-İçerik Uyumu: %20, Okunabilirlik: %10

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir yazı ekleme:

{
  "overall_score": 75,
  "content_accuracy": {
    "score": 80,
    "issues": [
      {"text": "sorunlu metin", "severity": "high|medium|low", "explanation": "açıklama"}
    ]
  },
  "grammar_check": {
    "score": 90,
    "errors": [
      {"original": "hatalı metin", "suggestion": "doğru hali", "type": "yazım|noktalama|gramer"}
    ]
  },
  "source_reliability": {
    "score": 70,
    "sources": [
      {"url": "kaynak url", "reliability": "high|medium|low|unknown", "reason": "neden"}
    ]
  },
  "source_content_match": {
    "score": 85,
    "mismatches": [
      {"claim": "makaledeki iddia", "source": "kaynak", "issue": "uyumsuzluk açıklaması"}
    ]
  },
  "readability_score": 78,
  "tone_analysis": "Makale popüler bilim tarzında yazılmış...",
  "suggestions": [
    "Öneri 1",
    "Öneri 2",
    "Öneri 3"
  ]
}`;

export async function reviewArticleWithAI(
    title: string,
    content: string,
    references: ArticleReference[]
): Promise<AIReviewResult | null> {
    if (!apiKey) {
        console.error("[FizikHubGPT] API key not found. Checked: GOOGLE_GENERATIVE_AI_API_KEY, NEXT_PUBLIC_GEMINI_API_KEY, GOOGLE_AI_API_KEY");
        return null;
    }

    const MAX_RETRIES = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json",
                }
            });

            // Build references text
            const referencesText = references.length > 0 
                ? references.map((ref, i) => {
                    let refStr = `[${i + 1}] ${ref.title || "Başlıksız"}`;
                    if (ref.authors) refStr += ` — ${ref.authors}`;
                    if (ref.publisher) refStr += `, ${ref.publisher}`;
                    if (ref.year) refStr += ` (${ref.year})`;
                    if (ref.url) refStr += ` URL: ${ref.url}`;
                    if (ref.doi) refStr += ` DOI: ${ref.doi}`;
                    return refStr;
                }).join("\n")
                : "Kaynak belirtilmemiş.";

            const userMessage = `
MAKALE BAŞLIĞI: ${title}

MAKALE İÇERİĞİ:
${stripHtml(content)}

KAYNAKLAR:
${referencesText}
`;

            const result = await model.generateContent([REVIEW_PROMPT, userMessage]);
            const responseText = result.response.text();

            // Parse JSON response — handle potential markdown code blocks
            let cleanedJson = responseText.trim();
            if (cleanedJson.startsWith("```")) {
                cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }

            const parsed = JSON.parse(cleanedJson) as AIReviewResult;

            // Validate and clamp all scores, ensure null safety
            parsed.overall_score = clamp(parsed.overall_score ?? 50, 0, 100);
            
            if (!parsed.content_accuracy) parsed.content_accuracy = { score: 50, issues: [] };
            parsed.content_accuracy.score = clamp(parsed.content_accuracy.score ?? 50, 0, 100);
            if (!Array.isArray(parsed.content_accuracy.issues)) parsed.content_accuracy.issues = [];

            if (!parsed.grammar_check) parsed.grammar_check = { score: 50, errors: [] };
            parsed.grammar_check.score = clamp(parsed.grammar_check.score ?? 50, 0, 100);
            if (!Array.isArray(parsed.grammar_check.errors)) parsed.grammar_check.errors = [];

            if (!parsed.source_reliability) parsed.source_reliability = { score: 50, sources: [] };
            parsed.source_reliability.score = clamp(parsed.source_reliability.score ?? 50, 0, 100);
            if (!Array.isArray(parsed.source_reliability.sources)) parsed.source_reliability.sources = [];

            if (!parsed.source_content_match) parsed.source_content_match = { score: 50, mismatches: [] };
            parsed.source_content_match.score = clamp(parsed.source_content_match.score ?? 50, 0, 100);
            if (!Array.isArray(parsed.source_content_match.mismatches)) parsed.source_content_match.mismatches = [];

            if (!Array.isArray(parsed.suggestions)) parsed.suggestions = [];
            
            parsed.readability_score = clamp(parsed.readability_score ?? 60, 0, 100);
            if (typeof parsed.tone_analysis !== 'string') parsed.tone_analysis = '';

            return parsed;
        } catch (error: any) {
            lastError = error;
            console.error(`[FizikHubGPT] AI Review attempt ${attempt + 1} failed:`, error?.message || error);

            if (attempt < MAX_RETRIES) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }
        }
    }

    console.error(`[FizikHubGPT] All ${MAX_RETRIES + 1} attempts failed. Last error:`, lastError?.message);
    return null;
}

function clamp(value: number, min: number, max: number): number {
    if (typeof value !== 'number' || isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
}

function stripHtml(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 20000); // Increased limit for longer articles
}
