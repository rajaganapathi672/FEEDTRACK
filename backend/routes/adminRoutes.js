const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.post('/users', createUser); // Admin can create any user

module.exports = router;
