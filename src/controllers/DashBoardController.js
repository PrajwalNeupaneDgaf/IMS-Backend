const Sale = require('../models/Sales');
const Item = require('../models/Item');
const Entity = require('../models/Entity');

// Get Dashboard Overview Data
const getDashboardData = async (req, res) => {
  try {
    // Total Sales: Sum of all sales (price * amountSold)
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$amountSold'] } } } },
    ]);

    // Total Users: Count distinct buyers and suppliers
    const totalUsers = await Entity.countDocuments({ type: { $in: ['Buyer', 'Supplier'] } });

    // Total Inventory Items: Sum of all items in inventory
    const inventoryItems = await Item.aggregate([
      { $group: { _id: null, totalItems: { $sum: '$quantity' } } },
    ]);

    return res.json({
      totalSales: totalSales[0]?.total || 0,
      totalUsers,
      inventoryItems: inventoryItems[0]?.totalItems || 0,
      salesData: await Sale.find()
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = { getDashboardData };
