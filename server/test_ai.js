const axios = require('axios');

async function testAI() {
    try {
        console.log('Testing Consigliere API...');
        const res = await axios.post('http://localhost:5000/api/ai/chat', {
            message: "Hello",
            history: []
        });
        console.log('Success:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('Error Status:', err.response.status);
            console.error('Error Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Error:', err.message);
        }
    }
}

testAI();
