const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');
const { generateStaffInsights } = require('../services/geminiService');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Generate Staff Insights (Analytics)
// @route   POST /api/insights/generate
// @access  Private (Staff/Admin)
const generateInsights = async (req, res) => {
    try {
        if (req.user.role !== 'STAFF' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to generate insights' });
        }

        // Fetch recent feedback to analyze
        let feedbacks;
        if (!isDbConnected()) {
            feedbacks = await mockStore.getFeedbacks();
        } else {
            // Get last 50 feedbacks for analysis to avoid token limits
            feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50);
        }

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(200).json({
                commonIssues: ["No feedback data available"],
                trends: "Insufficient data to generate trends.",
                correctiveActions: [],
                suggestedResponse: "Please wait for students to submit feedback."
            });
        }

        // Generate Insights using AI Service
        const insights = await generateStaffInsights(feedbacks);

        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateInsights
};
