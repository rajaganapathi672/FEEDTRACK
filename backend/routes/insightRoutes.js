
const express = require('express');
const router = express.Router();
const { generateInsights } = require('../controllers/insightController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('STAFF', 'ADMIN')); // All routes in this file are Staff/Admin only

router.post('/generate', generateInsights);

module.exports = router;
