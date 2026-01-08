const fetch = global.fetch || require('node-fetch'); // Fallback if needed, though Node 18+ has fetch

const GROK_API_URL = 'https://api.grok.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY;

/**
 * Analyzes feedback using Grok API.
 * @param {string} feedbackText - The raw feedback text.
 * @returns {Promise<Object>} - The analysis result (emotion, sentiment, etc.).
 */
const analyzeFeedback = async (feedbackText) => {
    if (!GROK_API_KEY) {
        console.warn('GROK_API_KEY is not set. Using mock analysis.');
        // Return a mock response that varies slightly based on text length to feel "real"
        const isPositive = feedbackText.toLowerCase().includes('good') || feedbackText.toLowerCase().includes('great') || feedbackText.toLowerCase().includes('love');

        return {
            emotion: isPositive ? 'happy' : 'frustrated',
            sentiment: isPositive ? 'POSITIVE' : 'NEGATIVE',
            issue_category: 'general',
            severity: isPositive ? 0.1 : 0.7,
            paraphrase: `Mock AI: "${feedbackText.substring(0, 50)}..."`,
            confidence: 0.95
        };
    }

    const prompt = `
Analyze the following feedback and return strict JSON:

{
  "emotion": "string (e.g., frustated, happy, neutral)",
  "sentiment": "string (POSITIVE, NEGATIVE, NEUTRAL)",
  "issue_category": "string (academic, facility, general)",
  "severity": "number (0-1)",
  "paraphrase": "short summary string",
  "confidence": "number (0-1)"
}

Feedback: "${feedbackText}"
`;

    try {
        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-beta', // or appropriate model version
                messages: [
                    { role: 'system', content: 'You are a helpful feedback analysis assistant. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Grok API Error: ${response.status} ${err}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON from content (handle potential markdown blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(content);

    } catch (error) {
        console.error('Error analyzing feedback with Grok:', error);
        return null;
    }
};

module.exports = { analyzeFeedback };
