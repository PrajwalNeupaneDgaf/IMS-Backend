const express = require('express');
const Entity = require('../models/Entity');
const { protect } = require('../middleware/authMiddleware');// Assuming this is your authentication middleware
const router = express.Router();

// Get all entities
router.get('/', protect, async (req, res) => {
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single entity by ID
router.get('/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await Entity.findById(id);

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    res.json(entity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new entity
router.post('/', protect, async (req, res) => {
  const { type, name, email, business, contact, address } = req.body;

  try {
    const newEntity = new Entity({
      type,
      name,
      email,
      business,
      contact,
      address,
    });

    await newEntity.save();

    res.status(201).json(newEntity);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating entity' });
  }
});

// Update an entity by ID
router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { type, name, email, business, contact, address } = req.body;

  try {
    const updatedEntity = await Entity.findByIdAndUpdate(
      id,
      { type, name, email, business, contact, address },
      { new: true }
    );

    if (!updatedEntity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    res.json(updatedEntity);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating entity' });
  }
});

// Delete an entity by ID
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntity = await Entity.findByIdAndDelete(id);

    if (!deletedEntity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    res.json({ message: 'Entity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error deleting entity' });
  }
});

module.exports = router;
