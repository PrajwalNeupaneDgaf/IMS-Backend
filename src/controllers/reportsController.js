const express = require('express');
const { generateSalesReport, generateInventoryReport, generateSupplierReport } = require('../Services/reportServices');
const router = express.Router();

// Sales report route
router.get('/sales', async (req, res) => {
  try {
    const reportBuffer = await generateSalesReport();
    res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(reportBuffer); // Send the report as a buffer
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).send('Error generating sales report');
  }
});

// Inventory report route
router.get('/inventory', async (req, res) => {
  try {
    const reportBuffer = await generateInventoryReport();
    res.setHeader('Content-Disposition', 'attachment; filename="inventory_report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(reportBuffer);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).send('Error generating inventory report');
  }
});

// Supplier report route
router.get('/suppliers', async (req, res) => {
  try {
    const reportBuffer = await generateSupplierReport();
    res.setHeader('Content-Disposition', 'attachment; filename="supplier_report.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(reportBuffer);
  } catch (error) {
    console.error('Error generating supplier report:', error);
    res.status(500).send('Error generating supplier report');
  }
});

module.exports = router;
