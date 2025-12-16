import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

export const aiService = {
    chat: async (message: string, history: any[] = []) => {
        try {
            const response = await axios.post(`${API_URL}/chat`, { message, history });
            return response.data.reply;
        } catch (error) {
            console.error('Error contacting Consigliere:', error);
            throw error;
        }
    },

    review: async (code: string, language: string, problemDescription: string) => {
        try {
            const response = await axios.post(`${API_URL}/review`, { code, language, problemDescription });
            return response.data.review;
        } catch (error) {
            console.error('Error getting code review:', error);
            throw error;
        }
    }
};
