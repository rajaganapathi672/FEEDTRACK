
const apiKey = process.env.GROQ_API_KEY;

// List of models to try in order of preference
const MODELS_TO_TRY = [
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768"
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(messages, model = "llama-3.3-70b-versatile") {
    if (!apiKey) {
        console.warn("API Key is missing for Groq Service");
        throw new Error("API Key Missing");
    }

    try {
        console.log(`[Backend AI] Attempting analysis with model: ${model}`);

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                response_format: { type: "json_object" } // Groq supports JSON mode
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`[Backend AI] Model ${model} failed: ${response.status} - ${errorText}`);
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const jsonString = data.choices?.[0]?.message?.content;

        if (!jsonString) throw new Error("Empty response from AI");

        console.log(`[Backend AI] Success with model: ${model}`);
        return JSON.parse(jsonString);

    } catch (e) {
        console.warn(`[Backend AI] Error using model ${model}:`, e.message);
        throw e;
    }
}

const analyzeFeedback = async (text) => {
    const prompt = `
    Analyze the following student feedback and provide a structured JSON response.
    
    Feedback: "${text}"
    
    Required JSON Structure:
    {
        "category": "String (one of: Academic, Facility, General, Labs, Hostel, Other)",
        "sentiment": "String (Positive, Neutral, Negative)",
        "confidence": "Number (0-100 indicating confidence score)",
        "highlights": ["String", "String"],
        "summary": "String (Brief summary of the feedback)"
    }
    `;

    const messages = [
        { role: "system", content: "You are a helpful assistant that analyzes student feedback. You always output valid JSON." },
        { role: "user", content: prompt }
    ];

    try {
        return await callGroq(messages);
    } catch (error) {
        console.warn("[Backend AI] Fallback to Heuristic Analysis due to error");
        // We could import the heuristic fallback from geminiService or duplicate it here.
        // For now, let's just return a basic failure object or re-throw.
        // To keep it simple, we re-throw so the worker handles it.
        throw error;
    }
};

const generateStaffInsights = async (feedbacks) => {
    // Similar implementation for batch insights if needed
    // For now, strictly implementing single feedback analysis as requested
    return null;
};

module.exports = { analyzeFeedback, generateStaffInsights };
