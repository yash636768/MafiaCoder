import express from 'express';
import axios from 'axios';

const router = express.Router();

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

// Language version mapping (Piston requires version, but we can default for some)
// We'll rely on Piston's "runtimes" endpoint or just pick common stable versions if needed, 
// but for simplicity in this implementation we'll let Piston pick if possible or hardcode known versions.
// Actually Piston V2 requires version. Let's look up common ones or fetch dynamically if we were robust, 
// but for speed we'll use known good versions for now.
const LANGUAGES: Record<string, { language: string, version: string }> = {
    'python': { language: 'python', version: '3.10.0' },
    'javascript': { language: 'javascript', version: '18.15.0' },
    'typescript': { language: 'typescript', version: '5.0.3' },
    'c': { language: 'c', version: '10.2.0' },
    'cpp': { language: 'c++', version: '10.2.0' },
    'java': { language: 'java', version: '15.0.2' },
};

router.post('/execute', async (req, res) => {
    const { language, code, stdin } = req.body;

    if (!language || !code) {
        res.status(400).json({ error: 'Language and code are required' });
        return;
    }

    const langConfig = LANGUAGES[language];
    if (!langConfig) {
        res.status(400).json({ error: 'Unsupported language' });
        return;
    }

    try {
        const payload = {
            language: langConfig.language,
            version: langConfig.version,
            files: [
                {
                    content: code
                }
            ],
            stdin: stdin || "",
        };

        const response = await axios.post(PISTON_API, payload);
        res.json(response.data);
    } catch (error: any) {
        console.error('Compiler Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to execute code',
            details: error.response?.data || error.message
        });
    }
});

export default router;
