"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const router = express_1.default.Router();
// Initialize Gemini
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
router.post('/review', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, language, problemDescription } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ msg: 'AI Service Unavailable (Missing Key)' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
        You are an expert competitive programmer and code reviewer (Mafia Consigliere).
        Review the following ${language} code for the problem: "${problemDescription}".
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide:
        1. Time and Space Complexity Analysis.
        2. Potential bugs or edge cases missed.
        3. Suggestions for optimization.
        4. A rating out of 10.
        
        Keep it concise and use a mafia-themed tone.
        `;
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        res.json({ review: text });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
router.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, history } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ msg: 'AI Service Unavailable (Missing Key)' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Construct chat history if needed, or just one-shot for now
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });
        const result = yield chat.sendMessage(message);
        const response = yield result.response;
        const text = response.text();
        res.json({ reply: text });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
