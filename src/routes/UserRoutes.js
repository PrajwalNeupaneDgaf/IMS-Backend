const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, changeUserRole } = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');
// Route to get all users
router.get('/users',protect, getAllUsers);

// Route to delete a user by ID
router.delete('/users/:id',protect, deleteUser);

// Route to change a user's role
router.put('/users/:id/role',protect, changeUserRole);

module.exports = router;
