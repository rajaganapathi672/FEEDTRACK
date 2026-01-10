const Feedback = require('../models/Feedback');
const { enqueueFeedbackAnalysis } = require('../services/workerService');

// @desc    Get all feedback (Staff/Admin)
// @route   GET /api/feedback
const getAllFeedback = async (req, res) => {
    try {
        // Staff/Admin check should be middleware, assuming verified here or req.user
        const feedbacks = await Feedback.find().sort({ created_at: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get own feedback (Student)
// @route   GET /api/feedback/mine
const getMyFeedback = async (req, res) => {
    try {
        // Assume req.user is set by auth middleware
        const feedbacks = await Feedback.find({ user_id: req.user.id }).sort({ created_at: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit new feedback
// @route   POST /api/feedback
const createFeedback = async (req, res) => {
    try {
        const { raw_text, category_group, category_type, anonymous } = req.body;

        if (!raw_text) {
            return res.status(400).json({ message: 'Feedback text is required' });
        }

        if (!category_group || !category_type) {
            return res.status(400).json({ message: 'Category Group and Type are required' });
        }

        const feedbackData = {
            user_id: anonymous ? null : (req.user ? req.user.id : null),
            anonymous: anonymous || false,
            // Keep category populated for backward compat or AI overriding later
            category: category_group.toLowerCase().split(' ')[0],
            category_group,
            category_type,
            raw_text: raw_text,
            status: 'pending'
        };

        const feedback = await Feedback.create(feedbackData);

        // Enqueue Job
        enqueueFeedbackAnalysis(feedback._id, feedback.raw_text);

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Edit feedback (if pending)
// @route   PUT /api/feedback/:id
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ _id: req.params.id, user_id: req.user.id });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (feedback.status !== 'pending') {
            return res.status(403).json({ message: 'Cannot edit processed feedback' });
        }

        const { raw_text, category, anonymous } = req.body;

        feedback.raw_text = raw_text || feedback.raw_text;
        feedback.category = category || feedback.category;
        feedback.anonymous = anonymous !== undefined ? anonymous : feedback.anonymous;

        await feedback.save();

        // Re-enqueue? Maybe. Or just leave it if job hasn't run. 
        // For simplicity, we won't re-enqueue here assuming text didn't change drastically or job is fast.
        // Ideally we should cancel old job or re-enqueue.

        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete feedback (if pending)
// @route   DELETE /api/feedback/:id
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ _id: req.params.id, user_id: req.user.id });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (feedback.status !== 'pending') {
            return res.status(403).json({ message: 'Cannot delete processed feedback' });
        }

        await feedback.deleteOne();
        res.status(200).json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFeedback,
    getMyFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback
};
