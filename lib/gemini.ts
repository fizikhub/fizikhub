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
        process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
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

export async function generateEmbedding(text: string): Promise<number[] | null> {
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
        const result = await model.embedContent(embeddingRequest as unknown as Parameters<typeof model.embedContent>[0]);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
