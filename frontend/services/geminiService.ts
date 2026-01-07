
import { Feedback, FeedbackAnalysis, StaffInsight } from "../types";

const API_KEY = process.env.API_KEY;

// List of models to try in order of preference
const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash-exp"
];

async function callGemini(prompt: string, schema: any): Promise<any> {
  if (!API_KEY) throw new Error("API Key is missing");

  let lastError: any;

  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`Attempting AI Analysis with model: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

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
        // If it's a 404 (Model Not Found), continue to next model.
        // If it's 429 (Quota), we might also want to try next model as different models have different quotas.
        // But generally 429 on one might imply 429 on others if shared resource, but strictly speaking 1.5-flash has separate quota.
        console.warn(`Model ${model} failed: ${response.status} - ${errorText}`);
        lastError = new Error(`Model ${model} failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonString) {
        throw new Error("Empty response from AI");
      }

      console.log(`Success with model: ${model}`);
      return JSON.parse(jsonString);

    } catch (e) {
      console.warn(`Error using model ${model}:`, e);
      lastError = e;
    }
  }

  // Final Fallback: Mock Data (to ensure app usability during API outages/quotas)
  console.warn("All AI models failed. Using local mock data for demonstration.");
  // Final Fallback: Simulated Local AI
  console.warn("All AI models failed. Using local heuristic analysis.");

  const lowerText = prompt.toLowerCase();

  // Check if this is an "Insights" request (batch analysis)
  if (prompt.includes("Analyze these feedbacks")) {
    const positiveCount = (lowerText.match(/good|great|excellent|love|best|improved/g) || []).length;
    const negativeCount = (lowerText.match(/bad|worst|slow|poor|fail|issue|problem/g) || []).length;

    let trend = "Mixed Feedback";
    if (positiveCount > negativeCount + 2) trend = "Mostly Positive";
    else if (negativeCount > positiveCount + 2) trend = "Needs Attention";

    const issues = [];
    if (lowerText.includes("lab") || lowerText.includes("computer")) issues.push("Lab Infrastructure");
    if (lowerText.includes("food") || lowerText.includes("mess")) issues.push("Canteen Quality");
    if (lowerText.includes("clean") || lowerText.includes("water")) issues.push("Facility Maintenance");
    if (issues.length === 0) issues.push("General Improvements needed");

    return {
      commonIssues: issues,
      trends: `[Offline Analysis] Overall sentiment appears ${trend}. Detected ${negativeCount} complaints vs ${positiveCount} compliments.`,
      correctiveActions: ["Investigate reported facility issues", "Conduct student survey"],
      suggestedResponse: "We have analyzed your feedback and are taking immediate steps to address the reported concerns."
    };
  }

  // Default: Single Feedback Analysis
  let sentiment = "Neutral";
  let category = "Others";

  // Simple heuristic for Sentiment
  if (lowerText.includes("good") || lowerText.includes("great") || lowerText.includes("excellent") || lowerText.includes("love") || lowerText.includes("best") || lowerText.includes("improved")) {
    sentiment = "Positive";
  } else if (lowerText.includes("bad") || lowerText.includes("worst") || lowerText.includes("slow") || lowerText.includes("worst") || lowerText.includes("poor") || lowerText.includes("fail") || lowerText.includes("issue")) {
    sentiment = "Negative";
  }

  // Simple heuristic for Category
  if (lowerText.includes("lab") || lowerText.includes("computer") || lowerText.includes("pc")) category = "Labs";
  else if (lowerText.includes("class") || lowerText.includes("lecture") || lowerText.includes("teaching") || lowerText.includes("sir") || lowerText.includes("mam")) category = "Teaching";
  else if (lowerText.includes("food") || lowerText.includes("mess") || lowerText.includes("canteen")) category = "Hostel";
  else if (lowerText.includes("exam") || lowerText.includes("paper") || lowerText.includes("test")) category = "Exams";
  else if (lowerText.includes("fan") || lowerText.includes("light") || lowerText.includes("water") || lowerText.includes("clean")) category = "Facilities";

  return {
    category,
    sentiment,
    confidence: 70,
    highlights: ["Simulated analysis (Offline Mode)", sentiment + " feedback detected"],
    summary: `[Offline Mode] This appears to be ${sentiment.toLowerCase()} feedback regarding ${category}.`,
    commonIssues: [], // Not used for single but required by Type if strict (but explicit return above handles batch)
    trends: "",
    correctiveActions: [],
    suggestedResponse: ""
  };
}

export const analyzeFeedback = async (text: string): Promise<FeedbackAnalysis> => {
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

  return callGemini(`Analyze this feedback: "${text}"`, schema);
};

export const generateStaffInsights = async (feedbacks: Feedback[]): Promise<StaffInsight> => {
  const context = feedbacks.map(f => `[${f.analysis?.sentiment}] ${f.text}`).join('\n');
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

  return callGemini(`Analyze these feedbacks and provide insights:\n${context}`, schema);
};
