import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent({
            content: "Hello World",
            outputDimensionality: 768
        });
        console.log("gemini-embedding-001 with outputDimensionality 768:", result.embedding.values.length);
        
        try {
            const model2 = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result2 = await model2.embedContent("Hello World");
            console.log("text-embedding-004 dimensions:", result2.embedding.values.length);
        } catch(e) {
            console.log("text-embedding-004 failed:", e.message);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
