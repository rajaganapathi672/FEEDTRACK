const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        required: function () { return this.role === 'staff' || this.role === 'admin'; }
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        default: 'student',
        required: true
    },
    institution_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
