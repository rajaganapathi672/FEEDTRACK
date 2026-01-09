const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    alert_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
        required: true
    },
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    suggested_action: { type: String },
    staff_response: { type: String },
    status: {
        type: String,
        enum: ['planned', 'in_progress', 'done'],
        default: 'planned'
    }
});

module.exports = mongoose.model('Action', actionSchema);
