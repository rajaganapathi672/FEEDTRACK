const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    feedback_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
        required: true
    },
    emotion: { type: String },
    sentiment: { type: String },
    issue: { type: String },
    severity: { type: Number }, // 0–1
    paraphrase: { type: String },
    confidence: { type: Number },
    model_version: { type: String, default: 'llama-3.3-70b-versatile' },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);
