import { GoogleGenerativeAI } from "@google/generative-ai";

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
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
