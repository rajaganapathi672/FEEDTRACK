const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId, // Could connect to a Subject model if it existed, or just keep ID
        default: null
    },
    category: {
        type: String,
        default: 'general'
    },
    category_group: {
        type: String,
        required: true
    },
    category_type: {
        type: String,
        required: true
    },
    raw_text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'analyzed', 'reviewed'],
        default: 'pending'
    },
    summary: {
        type: String,
        default: ''
    },
    confidence: {
        type: Number,
        default: 0
    },
    sentiment: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
