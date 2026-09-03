const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, promoteUser, demoteUser } = require('../controllers/authController');
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/users/:id/promote', authMiddleware, superAdminMiddleware, promoteUser);
router.put('/users/:id/demote', authMiddleware, superAdminMiddleware, demoteUser);

module.exports = router;
