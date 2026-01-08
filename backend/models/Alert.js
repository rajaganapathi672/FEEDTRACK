const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['spike', 'anomaly', 'trend'],
        required: true
    },
    target_type: {
        type: String,
        enum: ['staff', 'system'],
        required: true
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        // Optional ref
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'acknowledged', 'resolved'],
        default: 'open'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);
