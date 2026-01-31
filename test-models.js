const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function list() {
  const testModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-2.5-flash-native-audio-dialog"];
  console.log("Testing API Key:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Found" : "Not Found");
  for (const m of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("test");
      console.log(`✅ ${m} is available`);
    } catch (e) {
      console.log(`❌ ${m} failed: ${e.message}`);
    }
  }
}
list();
