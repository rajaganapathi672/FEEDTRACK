const Analysis = require('../models/Analysis');
const Feedback = require('../models/Feedback');
const Aggregate = require('../models/Aggregate');
const Alert = require('../models/Alert');
const { analyzeFeedback } = require('./groqService');

// In-memory queue simulation for now
// In production, use Redis/Bull
const queue = [];

const processQueue = async () => {
    if (queue.length === 0) return;

    const job = queue.shift();
    try {
        await processFeedbackJob(job);
    } catch (error) {
        console.error(`Error processing job for feedback ${job.feedbackId}:`, error);
    }

    // Process next immediately
    processQueue();
};

const enqueueFeedbackAnalysis = (feedbackId, feedbackText) => {
    queue.push({ feedbackId, feedbackText });
    // Trigger processing if not already running (simplified)
    if (queue.length === 1) {
        processQueue();
    }
};

const processFeedbackJob = async ({ feedbackId, feedbackText }) => {
    console.log(`Processing feedback ${feedbackId}...`);

    // 1. Call Groq
    try {
        const result = await analyzeFeedback(feedbackText);

        if (!result) {
            console.error('Groq analysis failed');
            return;
        }

        // 2. Save Analysis
        await Analysis.create({
            feedback_id: feedbackId,
            emotion: result.sentiment === 'Positive' ? 'Happy' : (result.sentiment === 'Negative' ? 'Frustrated' : 'Neutral'), // Simple mapping
            sentiment: result.sentiment,
            issue: result.category,
            severity: result.sentiment === 'Negative' ? 0.8 : 0.2, // Rough heuristic
            paraphrase: result.summary,
            confidence: result.confidence, // 0-100
            model_version: 'llama-3.3-70b-versatile'
        });

        // 3. Update Feedback Status
        await Feedback.findByIdAndUpdate(feedbackId, {
            status: 'analyzed',
            category: result.category,
            sentiment: result.sentiment ? result.sentiment.toUpperCase() : 'NEUTRAL',
            summary: result.summary || '',
            confidence: result.confidence // 0-100
        });

        // 4. Update Aggregates (Simplified for now, can be complex)
        // Find or create daily aggregate for system
        // This part is intricate; keeping it simple for MVP
        // await updateAggregates(result);

        // 5. Detect Alerts (Simplified)
        if (result.sentiment === 'Negative' && result.confidence > 80) {
            await Alert.create({
                type: 'spike', // or anomaly
                target_type: 'system',
                status: 'open'
            });
        }

        console.log(`Feedback ${feedbackId} processed.`);

    } catch (err) {
        console.error("Analysis failed:", err);
    }
};



module.exports = { enqueueFeedbackAnalysis };
