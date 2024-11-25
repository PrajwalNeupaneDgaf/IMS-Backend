const Entity = require('../models/Entity');
const Item = require('../models/Item');

// CREATE: Add a new item
const addItem = async (req, res) => {
  const { name, sku, category, quantity, price, supplier, description } = req.body;

  try {
    // Check if item with the same SKU already exists
    const existingItem = await Item.findOne({ sku });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with this SKU already exists.' });
    }

    const newItem = new Item({
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      description,
    });

    await newItem.save();
    res.status(201).json({ message: `Item "${name}" has been added successfully.`, item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// READ: Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('supplier', '_id email name type contact '); // Populate supplier data
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve items' });
  }
};

// READ: Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('supplier', '_id email name type contact');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving item' });
  }
};

// UPDATE: Update an item by ID
const updateItem = async (req, res) => {
  const { name, sku, category, quantity, price, supplier, description } = req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = name || item.name;
    item.sku = sku || item.sku;
    item.category = category || item.category;
    item.quantity = quantity || item.quantity;
    item.price = price || item.price;
    item.supplier = supplier || item.supplier;
    item.description = description || item.description;

    await item.save();
    const updatedItem = await Item.findById(req.params.id).populate('supplier', 'name type contact');
    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating item' });
  }
};

// DELETE: Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting item' });
  }
};

module.exports = { addItem, getItems, getItemById, updateItem, deleteItem };
