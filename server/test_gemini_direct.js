const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const models = ["gemini-pro", "gemini-1.5-flash", "gemini-1.0-pro", "gemini-1.5-pro"];

async function run() {
    for (const m of models) {
        console.log(`Testing ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello!");
            const response = await result.response;
            const text = response.text();
            console.log(`SUCCESS: ${m} responded: ${text}`);
            return;
        } catch (error) {
            console.error(`FAILED: ${m} - ${error.message}`);
        }
    }
}

run();
