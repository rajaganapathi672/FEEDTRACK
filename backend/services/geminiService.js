
const { GoogleGenerativeAI } = require("@google/genai");
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// List of models to try in order of preference
const MODELS_TO_TRY = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-exp"
];

async function callGemini(prompt, schema) {
    if (!apiKey) {
        console.warn("API Key is missing for Gemini Service");
        // Fallback handled by caller or heuristic
        throw new Error("API Key Missing");
    }

    for (const model of MODELS_TO_TRY) {
        try {
            console.log(`[Backend AI] Attempting analysis with model: ${model}`);

            // Native REST fetch to avoid SDK version issues if any, or use SDK if preferred.
            // Using direct fetch as per frontend implementation for consistency and reliability.
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: schema
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`[Backend AI] Model ${model} failed: ${response.status} - ${errorText}`);
                continue;
            }

            const data = await response.json();
            const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!jsonString) throw new Error("Empty response from AI");

            console.log(`[Backend AI] Success with model: ${model}`);
            return JSON.parse(jsonString);

        } catch (e) {
            console.warn(`[Backend AI] Error using model ${model}:`, e.message);
        }
    }

    throw new Error("All AI models failed");
}

const analyzeFeedback = async (text) => {
    const schema = {
        type: "OBJECT",
        properties: {
            category: { type: "STRING", description: "Category: Teaching, Facilities, Exams, Labs, Hostel, Others" },
            sentiment: { type: "STRING", description: "Sentiment: Positive, Neutral, Negative" },
            confidence: { type: "NUMBER", description: "Score 0-100" },
            highlights: { type: "ARRAY", items: { type: "STRING" } },
            summary: { type: "STRING" }
        },
        required: ["category", "sentiment", "confidence", "highlights", "summary"]
    };

    try {
        return await callGemini(`Analyze this feedback: "${text}"`, schema);
    } catch (error) {
        console.warn("[Backend AI] Fallback to Heuristic Analysis");
        return heuristicAnalysis(text);
    }
};

const generateStaffInsights = async (feedbacks) => {
    const context = feedbacks.map(f => `[${f.sentiment || 'NEUTRAL'}] ${f.text}`).join('\n');
    const schema = {
        type: "OBJECT",
        properties: {
            commonIssues: { type: "ARRAY", items: { type: "STRING" } },
            trends: { type: "STRING" },
            correctiveActions: { type: "ARRAY", items: { type: "STRING" } },
            suggestedResponse: { type: "STRING" }
        },
        required: ["commonIssues", "trends", "correctiveActions", "suggestedResponse"]
    };

    try {
        return await callGemini(`Analyze these feedbacks and provide insights:\n${context}`, schema);
    } catch (error) {
        console.warn("[Backend AI] Fallback to Heuristic Insights");
        return heuristicInsights(feedbacks);
    }
};

// --- Heuristic Fallbacks (Offline Mode) ---

function heuristicAnalysis(text) {
    const lowerText = text.toLowerCase();
    let sentiment = "Neutral";
    let category = "Others";

    if (lowerText.match(/good|great|excellent|love|best|improved/)) sentiment = "Positive";
    else if (lowerText.match(/bad|worst|slow|poor|fail|issue|problem/)) sentiment = "Negative";

    if (lowerText.match(/lab|computer|pc/)) category = "Labs";
    else if (lowerText.match(/class|lecture|teaching|sir|mam/)) category = "Teaching";
    else if (lowerText.match(/food|mess|canteen/)) category = "Hostel";
    else if (lowerText.match(/exam|paper|test/)) category = "Exams";
    else if (lowerText.match(/fan|light|water|clean/)) category = "Facilities";

    return {
        category,
        sentiment,
        confidence: 60,
        highlights: ["Offline Analysis", `${sentiment} feedback detected`],
        summary: `[Offline] This appears to be ${sentiment.toLowerCase()} feedback regarding ${category}.`
    };
}

function heuristicInsights(feedbacks) {
    const texts = feedbacks.map(f => f.text.toLowerCase()).join(' ');
    const positiveCount = (texts.match(/good|great|excellent|love/g) || []).length;
    const negativeCount = (texts.match(/bad|worst|poor|fail/g) || []).length;

    let trend = "Mixed Feedback";
    if (positiveCount > negativeCount + 2) trend = "Mostly Positive";
    else if (negativeCount > positiveCount + 2) trend = "Needs Attention";

    const issues = [];
    if (texts.includes("lab")) issues.push("Lab Infrastructure");
    if (texts.includes("mess") || texts.includes("food")) issues.push("Canteen Quality");

    return {
        commonIssues: issues.length ? issues : ["General Improvements needed"],
        trends: `[Offline] Detected ${negativeCount} complaints vs ${positiveCount} compliments. Trend: ${trend}`,
        correctiveActions: ["Investigate reported issues", "Conduct survey"],
        suggestedResponse: "We are reviewing all feedback."
    };
}

module.exports = { analyzeFeedback, generateStaffInsights };
