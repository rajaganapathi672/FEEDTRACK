const express = require('express');
const router = express.Router();
const {
    getAllFeedback,
    getMyFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Staff/Admin Routes
router.get('/', protect, authorize('staff', 'admin'), getAllFeedback);

// Student Routes
router.get('/mine', protect, authorize('student', 'staff', 'admin'), getMyFeedback); // Staff might want to see their own?
router.post('/', protect, createFeedback);
router.put('/:id', protect, updateFeedback);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
