const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashBoardController');

// Route to fetch dashboard data
router.get('/overview', dashboardController.getDashboardData);

module.exports = router;
