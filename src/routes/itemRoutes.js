// routes/itemRoutes.js
const express = require('express');
const { addItem, getItems, getItemById, updateItem, deleteItem } = require('../controllers/itemControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Add new item
router.post('/add', protect, addItem);

// Get all items
router.get('/get', protect, getItems);

// Get item by ID
router.get('/:id', protect, getItemById);

// Update item by ID
router.put('/:id', protect, updateItem);

// Delete item by ID
router.delete('/:id', protect, deleteItem);

module.exports = router;
