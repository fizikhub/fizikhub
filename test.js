console.log("Hello from node");
require('dotenv').config({ path: '.env.local' });
console.log("Key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
