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
        fizikhub_tone_and_readability: string;
        structure_and_depth: string;
        google_eeat: string;
    };
    ai_originality_analysis?: {
        detailed_verdict: string;
        human_touch_points: string;
        robotic_language_issues: string;
        originality_score: number;
    };
    final_verdict?: {
        publishability: "Uygun" | "Revizyon" | "Red";
        final_notes: string;
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

const PHASE1_GEMINI_PROMPT = `Sen FizikHub platformunun yapay zeka editörüsün. Görevin bilimsel makaleleri incelemek.
Aşağıdaki makaleyi detaylı bir şekilde incele ve SADECE JSON formatında rapor döndür.

İnceleme Kriterleri:
1. content_accuracy: Hatalı bilgi var mı? (0-100 puan, high/medium/low severity hatalar)
2. grammar_check: Yazım & dilbilgisi hataları (0-100 puan, orijinal vs öneri)
3. source_reliability: Kaynak güvenilirliği (0-100 puan)
4. source_content_match: Kaynak iddia uyumu (0-100 puan)
5. readability_score: Okunabilirlik (0-100 puan)
6. tone_analysis: Üslup analizi (kısa metin)
7. suggestions: Makaleyi geliştirmek için 3-7 somut öneri
8. deep_analysis:
   - source_claim_agreement: İddia ve kaynaklar örtüşüyor mu? Detaylı eleştiri.
   - fizikhub_tone_and_readability: FizikHub okuyucusuna uygun sade bir dille mi anlatılmış?
   - structure_and_depth: Giriş, Gelişme, Sonuç nasıl? Kompleks kısımlar fazla yüzeysel geçilmiş mi? (Örn: Hawking ışıması çok kısa mı kalmış)
   - google_eeat: Google Deneyim, Uzmanlık, Otorite, Güvenilirlik standartlarına uygun mu?

Genel puan (overall_score) hesapla: İçerik %30, Yazım %20, Kaynak Güv %20, Kaynak Uyum %20, Okunabilirlik %10.

SADECE bu yapıdaki JSON formatını döndür başka bir şey ekleme:
{
  "overall_score": 85,
  "content_accuracy": { "score": 90, "issues": [ { "text": "...", "severity": "low", "explanation": "..." } ] },
  "grammar_check": { "score": 90, "errors": [ { "original": "...", "suggestion": "...", "type": "yazım" } ] },
  "source_reliability": { "score": 80, "sources": [ { "url": "...", "reliability": "medium", "reason": "..." } ] },
  "source_content_match": { "score": 85, "mismatches": [ { "claim": "...", "source": "...", "issue": "..." } ] },
  "readability_score": 80,
  "tone_analysis": "...",
  "suggestions": [ "...", "..." ],
  "deep_analysis": {
    "source_claim_agreement": "...",
    "fizikhub_tone_and_readability": "...",
    "structure_and_depth": "...",
    "google_eeat": "..."
  }
}`;

const PHASE2_GEMMA27B_PROMPT = `Sen FizikHub platformunun Kıdemli Özgünlük (AI Detection) Uzmanısın. Karşında bir makale ve Aşama-1 ön raporu bulunuyor. 
Senin tek görevin: "Yazının baştan sona AI tarafından mı üretildiği yoksa insan öznelliği barındırıp sadece AI rötüşü mü aldığı incelenir." kuralına göre karar vermektir.

Robotik dili, tipik AI kalıplarını (örn. "Sonuç olarak...", "Bununla birlikte..."), insani yazarın bıraktığı izleri ve yorumları denetle.

SADECE JSON döndür:
{
  "detailed_verdict": "Metin %100 AI üretimi gibi duruyor çünkü... VEYA Metnin iskeleti insan, sadece düzeltmeler AI ile yapılmış çünkü...",
  "human_touch_points": "İnsani öznellik barındıran cümle/örnekler...",
  "robotic_language_issues": "Klasik yapay zeka jargonu, zorlama akademik kelimeler...",
  "originality_score": 60 
}
(originality_score: %0 tamamen robotik chatgpt çıktısı, %100 tamamen insani doğal metin)
`;

const PHASE3_GEMMA12B_PROMPT = `Sen FizikHub platformunun Genel Yayın Yönetmenisin (Baş Editör). 
Karşında; Yazarın Makalesi, Aşama-1 (Gemini) teknik raporu, ve Aşama-2 (Gemma 27B) AI-Özgünlük raporu duruyor.

Tüm bu raporları sentezle ve son bir karar ver.

SADECE JSON döndür:
{
  "publishability": "Uygun" VEYA "Revizyon" VEYA "Red",
  "final_notes": "Tüm raporları okuyup makaleyi incelediğimde, özellikle özgünlük eksikliği (veya tam tersi çok iyi olması), yapısal detayların azlığı vb. sebeplerle yazarın şunları şunları mutlaka düzeltmesi lazımdır / makale bu haliyle harikadır..."
}
`;

export async function reviewArticleWithAI(
    title: string,
    content: string,
    references: ArticleReference[]
): Promise<AIReviewResult | null> {
    if (!apiKey) {
        console.error("[FizikHubGPT] API key not found.");
        return null;
    }

    const MAX_RETRIES = 2;
    let initialReviewResult: AIReviewResult | null = null;
    
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

    // --- PHASE 1: Gemini 2.5 Flash ---
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const geminiModel = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: "application/json" }
            });

            const result = await geminiModel.generateContent([PHASE1_GEMINI_PROMPT, userMessage]);
            let cleanedJson = result.response.text().trim();
            if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

            const parsed = JSON.parse(cleanedJson) as AIReviewResult;
            
            // Normalize safety
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

            if (!parsed.deep_analysis) {
                parsed.deep_analysis = {
                    source_claim_agreement: "Yorum yok.", fizikhub_tone_and_readability: "Yorum yok.",
                    structure_and_depth: "Yorum yok.", google_eeat: "Yorum yok."
                };
            }
            initialReviewResult = parsed;
            break; 
        } catch (error: any) {
            console.error(`[FizikHubGPT - Phase 1] Attempt ${attempt + 1} failed:`, error?.message || error);
            if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
    }

    if (!initialReviewResult) return null;

    // --- PHASE 2: Gemma 3 27B ---
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const gemma27bModel = genAI.getGenerativeModel({ 
                model: "gemma-3-27b-it",
                generationConfig: { temperature: 0.3, maxOutputTokens: 8192, responseMimeType: "application/json" }
            });

            const p2Message = `${userMessage}\n\nAŞAMA 1 (Teknik) RAPOR:\n${JSON.stringify({
                overall_score: initialReviewResult.overall_score,
                readability_score: initialReviewResult.readability_score,
                deep_analysis: initialReviewResult.deep_analysis // Include deep analysis for context
            })}`;

            const result = await gemma27bModel.generateContent([PHASE2_GEMMA27B_PROMPT, p2Message]);
            let cleanedJson = result.response.text().trim();
            if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

            initialReviewResult.ai_originality_analysis = JSON.parse(cleanedJson);
            initialReviewResult.ai_originality_analysis!.originality_score = clamp(initialReviewResult.ai_originality_analysis!.originality_score ?? 50, 0, 100);
            break;
        } catch (error: any) {
            console.error(`[FizikHubGPT - Phase 2] Attempt ${attempt + 1} failed:`, error?.message || error);
            if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
    }

    // --- PHASE 3: Gemma 3 12B ---
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const gemma12bModel = genAI.getGenerativeModel({ 
                model: "gemma-3-12b-it",
                generationConfig: { temperature: 0.4, maxOutputTokens: 8192, responseMimeType: "application/json" }
            });

            const p3Message = `${userMessage}\n\nAŞAMA 1 RAPORU (Derin Analiz Dahil):\n${JSON.stringify(initialReviewResult.deep_analysis)}\n\nAŞAMA 2 RAPORU (Özgünlük - Yapay Zeka Tespiti):\n${JSON.stringify(initialReviewResult.ai_originality_analysis)}`;

            const result = await gemma12bModel.generateContent([PHASE3_GEMMA12B_PROMPT, p3Message]);
            let cleanedJson = result.response.text().trim();
            if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

            initialReviewResult.final_verdict = JSON.parse(cleanedJson);
            break;
        } catch (error: any) {
            console.error(`[FizikHubGPT - Phase 3] Attempt ${attempt + 1} failed:`, error?.message || error);
            if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
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
