const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-2.0-flash-lite", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

    for (const modelId of models) {
        try {
            console.log(`Testing ${modelId}...`);
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("Say 'hello test'.");
            console.log(`[SUCCESS] ${modelId}: ${result.response.text()}`);
        } catch (e) {
            console.error(`[ERROR] ${modelId}: ${e.message}`);
        }
    }
}
run();
