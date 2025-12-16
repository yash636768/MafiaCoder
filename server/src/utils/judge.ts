import axios from 'axios';

const PISTON_API = 'https://emkc.org/api/v2/piston';

export const executeCode = async (language: string, sourceCode: string, input: string) => {
    try {
        // Map language names to Piston versions/names
        let lang = language.toLowerCase();
        let version = '*';
        if (lang === 'python') lang = 'python';
        if (lang === 'javascript' || lang === 'js') lang = 'javascript';
        if (lang === 'cpp' || lang === 'c++') lang = 'c++';
        if (lang === 'java') lang = 'java';

        const response = await axios.post(`${PISTON_API}/execute`, {
            language: lang,
            version: version,
            files: [
                {
                    content: sourceCode
                }
            ],
            stdin: input
        });

        return response.data;
    } catch (error) {
        console.error("Piston Execution Error:", error);
        throw new Error('Execution failed');
    }
};
