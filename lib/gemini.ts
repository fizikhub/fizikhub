import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
export const GEMINI_EMBEDDING_DIMENSIONS = 768;

type EmbedContentRequestWithDimensions = {
    content: { role: "user"; parts: Array<{ text: string }> };
    outputDimensionality: number;
};

let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Centralized Gemini API key resolver.
 * Checks multiple environment variable names for maximum deployment flexibility.
 */
export function getGeminiApiKey(): string {
    return (
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GOOGLE_AI_API_KEY ||
        ""
    );
}

/**
 * Singleton Gemini client shared across all modules (ai-review, moderation, embeddings).
 * Returns null when no API key is configured — callers must handle this gracefully.
 */
export function getGeminiClient(): GoogleGenerativeAI | null {
    const apiKey = getGeminiApiKey();
    if (!apiKey) return null;

    if (!geminiClient) {
        geminiClient = new GoogleGenerativeAI(apiKey);
    }

    return geminiClient;
}

const MAX_RETRIES = 4;
const BASE_DELAY = 1000; // 1 second
const MAX_DELAY = 10000; // 10 seconds

type EmbeddingOptions = {
    maxRetries?: number;
    timeoutMs?: number;
};

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
        return await Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error("Embedding request timed out")), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
}

export async function generateEmbedding(text: string, options: EmbeddingOptions = {}): Promise<number[] | null> {
    const genAI = getGeminiClient();

    if (!genAI) {
        console.warn("GEMINI_API_KEY is not set. Semantic search will be skipped.");
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: GEMINI_EMBEDDING_MODEL });
        const embeddingRequest: EmbedContentRequestWithDimensions = {
            content: { role: "user", parts: [{ text }] },
            outputDimensionality: GEMINI_EMBEDDING_DIMENSIONS,
        };

        const maxRetries = Math.max(0, Math.min(options.maxRetries ?? MAX_RETRIES, MAX_RETRIES));
        const timeoutMs = Math.max(500, options.timeoutMs ?? 12_000);
        let lastError: unknown = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await withTimeout(
                    model.embedContent(embeddingRequest as unknown as Parameters<typeof model.embedContent>[0]),
                    timeoutMs,
                );
                const embedding = result.embedding;
                if (embedding && Array.isArray(embedding.values)) {
                    return embedding.values;
                }
                throw new Error("Invalid embedding response structure");
            } catch (error) {
                lastError = error;
                const isRateLimit = error instanceof Error && 
                    (error.message.includes("429") || error.message.toLowerCase().includes("rate limit"));
                const isTransient = error instanceof Error && 
                    (error.message.includes("503") || error.message.includes("500") || error.message.toLowerCase().includes("fetch failed") || error.message.includes("timed out"));

                if (attempt < maxRetries && (isRateLimit || isTransient)) {
                    const expDelay = Math.min(MAX_DELAY, BASE_DELAY * Math.pow(2, attempt));
                    const jitter = expDelay * 0.25 * Math.random();
                    const totalDelay = expDelay + jitter;
                    
                    console.warn(
                        `[Gemini Embedding] Attempt ${attempt + 1} failed (${isRateLimit ? "Rate Limit" : isTransient ? "Transient Server Error" : "Error"}). ` +
                        `Retrying in ${totalDelay.toFixed(0)}ms... Error:`, 
                        error instanceof Error ? error.message : error
                    );
                    
                    await new Promise((resolve) => setTimeout(resolve, totalDelay));
                } else {
                    break;
                }
            }
        }

        console.error(`[Gemini Embedding] Failed after ${maxRetries + 1} attempt(s). Last Error:`, lastError);
        return null;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
