const express = require('express');
const router = express.Router();
const Sale = require('../models/Sales');
const { protect } = require('../middleware/authMiddleware');

// Create a new sale
router.post('/', protect, async (req, res) => {
  try {
    const { itemName, soldTo, supplier, category, soldOn, price, amountSold } = req.body;

    // Ensure all required fields are present
    if (!itemName || !soldTo || !supplier || !soldOn || !price || !amountSold || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const sale = new Sale({
      itemName,
      soldTo,
      supplier,
      category,
      soldOn,
      price,
      amountSold,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('itemName', '_id name category') // Fetch only the `name` and `category` of the Item
      .populate('soldTo', '_id name email contact') // Fetch buyer details
      .populate('supplier', '_id name email contact'); // Fetch supplier details

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sale by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('itemName', '_id name category') // Fetch only the `name` and `category` of the Item
      .populate('soldTo', '_id name email contact address') // Fetch buyer details
      .populate('supplier', '_id name email contact address'); // Fetch supplier details

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a sale
router.put('/:id', protect, async (req, res) => {
  try {
    const { itemName, soldTo, supplier, category, soldOn, price, amountSold } = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        itemName,
        soldTo,
        supplier,
        category,
        soldOn,
        price,
        amountSold,
      },
      { new: true }
    )
      .populate('itemName', '_id name category')
      .populate('soldTo', '_id name email contact address')
      .populate('supplier', '_id name email contact address');

    if (!updatedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sale
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
