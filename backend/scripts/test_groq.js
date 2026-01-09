
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { analyzeFeedback } = require('../services/groqService');

const testGroq = async () => {
    try {
        console.log('Testing Groq Analysis...');
        const text = "The library is great but the internet is too slow.";
        console.log(`Input: "${text}"`);

        const result = await analyzeFeedback(text);
        console.log('\n--- Analysis Result ---');
        console.log(JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('Test Failed:', err);
    }
};

testGroq();
