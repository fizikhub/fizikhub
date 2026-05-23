import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
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
        const result = await model.embedContent({
            content: { parts: [{ text: text }] },
            outputDimensionality: 768
        });
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
