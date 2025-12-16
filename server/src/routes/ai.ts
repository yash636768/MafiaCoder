import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/review', async (req, res) => {
    try {
        const { code, language, problemDescription } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ msg: 'AI Service Unavailable (Missing Key)' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ review: text });

    } catch (err: any) { // Type as any to access properties easily
        console.error("Gemini API Error:", err.message);
        console.error("Full Error:", JSON.stringify(err, null, 2));
        res.status(500).send('Server error: ' + err.message);
    }
});

router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ msg: 'AI Service Unavailable (Missing Key)' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct chat history if needed, or just one-shot for now
        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err: any) {
        console.error("Gemini Chat Error:", err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

export default router;
