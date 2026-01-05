
const express = require('express');
const router = express.Router();
const { getMetrics, getSentimentAnalytics, getCategoryAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('staff', 'admin')); // Analytics are strictly for Staff

router.get('/metrics', getMetrics);
router.get('/sentiment', getSentimentAnalytics);
router.get('/category', getCategoryAnalytics);

module.exports = router;
