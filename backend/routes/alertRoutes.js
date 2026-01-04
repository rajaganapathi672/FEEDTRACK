const express = require('express');
const router = express.Router();
const { getAlerts, createAction } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('staff', 'admin'), getAlerts);
router.post('/:id/actions', protect, authorize('staff', 'admin'), createAction);

module.exports = router;
