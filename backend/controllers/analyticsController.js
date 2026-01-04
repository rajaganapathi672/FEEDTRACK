
const Feedback = require('../models/Feedback');

// @desc    Get Overall Metrics
// @route   GET /api/analytics/metrics
// @access  Private (Staff/Admin)
const getMetrics = async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();

        // Count critical issues
        const criticalIssues = await Feedback.countDocuments({ isCritical: true });

        // Unique students
        const distinctStudents = await Feedback.distinct('studentId');
        const uniqueStudents = distinctStudents.length;

        // Positive Score Calculation
        const positiveCount = await Feedback.countDocuments({ sentiment: 'POSITIVE' });
        const positiveScore = totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : 0;

        res.status(200).json({
            totalFeedback,
            uniqueStudents,
            criticalIssues,
            positiveScore
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Sentiment Distribution
// @route   GET /api/analytics/sentiment
// @access  Private (Staff/Admin)
const getSentimentAnalytics = async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$sentiment',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format for frontend chart (e.g. [{ name: 'POSITIVE', value: 10 }])
        const formattedStats = stats.map(item => ({
            name: item._id || 'Unknown',
            value: item.count
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Category Distribution
// @route   GET /api/analytics/category
// @access  Private (Staff/Admin)
const getCategoryAnalytics = async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const formattedStats = stats.map(item => ({
            name: item._id || 'Uncategorized',
            value: item.count
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMetrics,
    getSentimentAnalytics,
    getCategoryAnalytics
};
