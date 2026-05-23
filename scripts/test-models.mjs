import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;

if (!geminiKey) {
    console.error("Missing API key");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiKey);

async function test() {
    try {
        console.log("Listing models...");
        // In @google/generative-ai, listModels is a method on the client
        // Wait, listModels might not be directly exported or might require a different client,
        // let's try calling it or making a direct fetch to the Google API!
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${geminiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

test();
