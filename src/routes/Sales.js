const express = require('express');
const router = express.Router();
const Sale = require('../models/Sales');
const Item = require('../models/Item'); // Use the correct model name
const { protect } = require('../middleware/authMiddleware');

// Helper function to adjust inventory
const adjustInventory = async (itemId, adjustment) => {
  const item = await Item.findById(itemId);
  if (!item) throw new Error('Item not found in inventory');

  // Ensure stock doesn't go negative
  if (item.quantity + adjustment < 0) {
    throw new Error(`Insufficient stock for ${item.name}. Available: ${item.quantity}`);
  }

  item.quantity += adjustment;
  await item.save();
};

// Create a new sale
router.post('/', protect, async (req, res) => {
  try {
    const { itemName, soldTo, supplier, category, soldOn, price, amountSold } = req.body;

    if (!itemName || !soldTo || !supplier || !soldOn || !price || !amountSold || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check stock availability
    const item = await Item.findById(itemName);
    if (!item || item.quantity < amountSold) {
      return res.status(400).json({ error: `Insufficient stock for ${item?.name || 'item'}` });
    }

    // Deduct from inventory
    await adjustInventory(itemName, -amountSold);

    // Create sale record
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

// Update a sale
router.put('/:id', protect, async (req, res) => {
  try {
    const { itemName, soldTo, supplier, category, soldOn, price, amountSold } = req.body;

    const existingSale = await Sale.findById(req.params.id);
    if (!existingSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const previousAmountSold = existingSale.amountSold;

    // Adjust inventory based on the change in sold quantity
    const adjustment = previousAmountSold - amountSold;
    await adjustInventory(itemName, adjustment);

    // Update the sale record
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

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sale (optional: adjust inventory if sale is deleted)
router.delete('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Revert inventory adjustment
    await adjustInventory(sale.itemName, sale.amountSold);

    await Sale.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('itemName', '_id name category')
      .populate('soldTo', '_id name email contact')
      .populate('supplier', '_id name email contact');

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sale by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('itemName', '_id name category')
      .populate('soldTo', '_id name email contact address')
      .populate('supplier', '_id name email contact address');

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
