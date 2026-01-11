const mongoose = require('mongoose');

const aggregateSchema = new mongoose.Schema({
    entity_type: {
        type: String,
        enum: ['staff', 'subject', 'system'],
        required: true
    },
    entity_id: {
        type: mongoose.Schema.Types.ObjectId,
        // Optional ref depending on type, or just store ID
        default: null
    },
    time_window: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    metrics: {
        count: { type: Number, default: 0 },
        avg_severity: { type: Number, default: 0 },
        sentiment_dist: {
            positive: { type: Number, default: 0 },
            neutral: { type: Number, default: 0 },
            negative: { type: Number, default: 0 }
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Aggregate', aggregateSchema);
