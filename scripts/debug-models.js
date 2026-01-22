
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ NO API KEY FOUND IN .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("🔄 Fetching available models...");
        // There isn't a direct listModels method on the genAI instance in basic usage, 
        // but we can try to infer or just test a known list.
        // Wait, the Google AI Studio access usually allows listing via REST, 
        // but the Node SDK might not expose a simple 'listModels' helper on the client directly in older versions?
        // Actually, checking documentation or source, typically it's a separate ModelService or we just test generation.
        // Let's brute force test the generation since listing might require different scopes.

        // Actually, let's try to hit the REST endpoint manually if SDK doesn't support easy listing without full client.
        // But better: let's stick to the SDK and just TRY every known model string and report the specific error code.

        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-1.5-pro-latest",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite"
        ];

        for (const modelName of modelsToTest) {
            process.stdout.write(`Testing ${modelName.padEnd(25)}: `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                // Generate a single token just to check existence/auth
                await model.generateContent("Hi");
                console.log("✅ AVAILABLE (200 OK)");
            } catch (error) {
                if (error.message.includes("404") || error.message.includes("not found")) {
                    console.log("❌ NOT FOUND (404)");
                } else if (error.message.includes("429") || error.message.includes("Quota")) {
                    console.log("⚠️ QUOTA EXCEEDED (429) - but model exists!");
                } else {
                    console.log(`❌ ERROR: ${error.message.split('[')[0].trim().substring(0, 50)}...`);
                }
            }
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
