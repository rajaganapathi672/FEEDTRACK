const Feedback = require('../models/Feedback');
const Analysis = require('../models/Analysis');

// @desc    Get Staff Dashboard Stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();

        // Sentiment Mix
        const positive = await Feedback.countDocuments({ sentiment: 'POSITIVE' });
        const negative = await Feedback.countDocuments({ sentiment: 'NEGATIVE' });
        const neutral = await Feedback.countDocuments({ sentiment: 'NEUTRAL' });

        // Issue Breakdown (Category)
        const categories = await Feedback.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Recent Critical Issues (High Severity)
        // Join with Analysis for severity > 0.7
        const criticalFeedback = await Analysis.find({ severity: { $gt: 0.7 } })
            .populate('feedback_id')
            .sort({ created_at: -1 })
            .limit(5);

        res.status(200).json({
            metrics: {
                total: totalFeedback,
                sentiment: { positive, negative, neutral },
            },
            issues: categories,
            critical: criticalFeedback
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
