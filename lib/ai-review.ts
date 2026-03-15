"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
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
}

interface ArticleReference {
    url?: string;
    title: string;
    authors?: string;
    publisher?: string;
    year?: string;
    doi?: string;
}

const REVIEW_PROMPT = `Sen bilimsel bir makale editörüsün. Aşağıdaki Türkçe bilim makalesini detaylı bir şekilde incele ve JSON formatında rapor döndür.

İnceleme Kriterleri:
1. **İçerik Doğruluğu (content_accuracy)**: Makaledeki bilimsel iddiaları kontrol et. Yanlış veya şüpheli bilgiler varsa belirt.
2. **Yazım & Dilbilgisi (grammar_check)**: Türkçe yazım hataları, noktalama, cümle yapısı sorunlarını tespit et.
3. **Kaynak Güvenilirliği (source_reliability)**: Verilen kaynakların akademik, güvenilir ve erişilebilir olup olmadığını değerlendir.
4. **Kaynak-İçerik Uyumu (source_content_match)**: Makaledeki iddialar ile kaynaklardaki bilgiler arasındaki tutarlılığı kontrol et.
5. **Genel Öneriler (suggestions)**: Makaleyi geliştirmek için somut öneriler sun.

Her kategori için 0-100 arası puan ver. Genel puanı (overall_score) kategorilerin ağırlıklı ortalaması olarak hesapla.

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
  "suggestions": [
    "Öneri 1",
    "Öneri 2"
  ]
}`;

export async function reviewArticleWithAI(
    title: string,
    content: string,
    references: ArticleReference[]
): Promise<AIReviewResult | null> {
    if (!apiKey) {
        console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
        return null;
    }

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
                let refStr = `[${i + 1}] ${ref.title}`;
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

        // Parse JSON response
        const parsed = JSON.parse(responseText) as AIReviewResult;

        // Validate and clamp scores
        parsed.overall_score = clamp(parsed.overall_score, 0, 100);
        parsed.content_accuracy.score = clamp(parsed.content_accuracy?.score ?? 0, 0, 100);
        parsed.grammar_check.score = clamp(parsed.grammar_check?.score ?? 0, 0, 100);
        parsed.source_reliability.score = clamp(parsed.source_reliability?.score ?? 0, 0, 100);
        parsed.source_content_match.score = clamp(parsed.source_content_match?.score ?? 0, 0, 100);

        return parsed;
    } catch (error: any) {
        console.error("AI Review error Details:", error?.message || error);
        return null;
    }
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 15000); // Limit to avoid token overflow
}
