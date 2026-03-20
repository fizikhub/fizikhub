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
    deep_analysis?: {
        source_claim_agreement: string;
        ai_detection: string;
        fizikhub_tone_and_readability: string;
        structure_and_depth: string;
        google_eeat: string;
    };
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

const GEMMA_DEEP_REVIEW_PROMPT = `Sen FizikHub platformunun Kıdemli Baş Editörüsün. Görevin bir taslak makaleyi ve daha düşük seviyeli bir yapay zeka asistanın çıkardığı yüzeysel analiz raporunu inceleyip çok daha derinlemesine, kritik bir analizi JSON formatında üretmektir.

Analiz etmen gereken 5 ana başlık şunlardır:
1. **Kaynak - İddia Uyumu (source_claim_agreement)**: Yazarın makalede bulunduğu iddialar gerçekten kaynaklarda geçiyor mu? Yazar kaynaktan ne kadar sapmış? (Metin şeklinde detaylı eleştiri yaz).
2. **Yapay Zeka Etkisi (ai_detection)**: Bu makale sence baştan sona bir yapay zekaya mı yazdırılmış, yoksa yazar sadece ufak rötüşler mi yaptırmış? Anlatım doğallığını değerlendir.
3. **FizikHub Tonu ve Okunabilirlik (fizikhub_tone_and_readability)**: Yazının dili okuyucuların anlayabileceği sadelikte mi yoksa boğucu ve akademik mi? Kavramlar iyi açıklanmış mı?
4. **Yapı ve Detay Derinliği (structure_and_depth)**: Yazar kompleks bir konuyu ele almış ama çok yüzeysel mi bırakmış? (Örneğin "Hawking Radyasyonu anlatılmış ama sadece 2 paragraf"). Giriş, Gelişme ve Sonuç kısımlarının uzunluğu ve tatmin ediciliği yeterli mi? Ne tür başlıklar/kısımlar eklenmeli?
5. **Google E-E-A-T Uyum (google_eeat)**: Google Kalite Standartları olan Deneyim (Experience), Uzmanlık (Expertise), Otorite (Authoritativeness) ve Güvenilirlik (Trustworthiness) kurallarına uyuyor mu? SEO ve içerik zenginliği açısından nasıl?

**Mutlaka** sadece JSON formatında yanıt dön. Anahtarlar şunlar olmalı:
{
  "source_claim_agreement": "...",
  "ai_detection": "...",
  "fizikhub_tone_and_readability": "...",
  "structure_and_depth": "...",
  "google_eeat": "..."
}
`;

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
    let initialReviewResult: AIReviewResult | null = null;
    
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

    // Phase 1: Gemini 2.5 Flash for base metrics
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const geminiModel = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json",
                }
            });

            const result = await geminiModel.generateContent([REVIEW_PROMPT, userMessage]);
            const responseText = result.response.text();

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

            initialReviewResult = parsed;
            break; // Success on first wave
        } catch (error: any) {
            lastError = error;
            console.error(`[FizikHubGPT - Phase 1] Attempt ${attempt + 1} failed:`, error?.message || error);

            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }

    if (!initialReviewResult) {
        console.error(`[FizikHubGPT] Phase 1 Gemini 2.5 Failed completely. Last error:`, lastError?.message);
        return null; // Don't proceed to phase 2 if phase 1 failed
    }

    // Phase 2: Gemma 3 12B for Deep Analysis
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const gemmaModel = genAI.getGenerativeModel({ 
                model: "gemma-3-12b-it",
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json",
                }
            });

            const deepUserMessage = `
MAKALE BAŞLIĞI: ${title}

MAKALE İÇERİĞİ:
${stripHtml(content)}

KAYNAKLAR:
${referencesText}

ÖN İNCELEME (Düşük Seviye Asistan Çıktısı):
${JSON.stringify({
    content_accuracy: initialReviewResult.content_accuracy,
    grammar_check: initialReviewResult.grammar_check,
    source_reliability: initialReviewResult.source_reliability,
    source_content_match: initialReviewResult.source_content_match,
    suggestions: initialReviewResult.suggestions
})}
`;

            const result = await gemmaModel.generateContent([GEMMA_DEEP_REVIEW_PROMPT, deepUserMessage]);
            const responseText = result.response.text();

            let cleanedJson = responseText.trim();
            if (cleanedJson.startsWith("```")) {
                cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }

            const deepAnalysisParsed = JSON.parse(cleanedJson);
            initialReviewResult.deep_analysis = {
                source_claim_agreement: deepAnalysisParsed.source_claim_agreement || "Yorum yok.",
                ai_detection: deepAnalysisParsed.ai_detection || "Yorum yok.",
                fizikhub_tone_and_readability: deepAnalysisParsed.fizikhub_tone_and_readability || "Yorum yok.",
                structure_and_depth: deepAnalysisParsed.structure_and_depth || "Yorum yok.",
                google_eeat: deepAnalysisParsed.google_eeat || "Yorum yok.",
            };
            
            break; // Success
        } catch (error: any) {
            console.error(`[FizikHubGPT - Phase 2] Attempt ${attempt + 1} failed:`, error?.message || error);
            // If it's the last attempt, we still return initialReviewResult (without deep_analysis)
            // so we don't drop the whole review because gemma failed.
            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }

    return initialReviewResult;
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
