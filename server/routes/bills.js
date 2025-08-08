const express = require('express');
const router = express.Router();
const {
  getBillsByClient,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  generateBillPDF
} = require('../controllers/billController');

// GET /api/bills/client/:clientId - Get all bills for a client
router.get('/client/:clientId', getBillsByClient);

// GET /api/bills/:id - Get single bill
router.get('/:id', getBill);

// POST /api/bills - Create new bill
router.post('/', createBill);

// PUT /api/bills/:id - Update bill
router.put('/:id', updateBill);

// DELETE /api/bills/:id - Delete bill
router.delete('/:id', deleteBill);

// GET /api/bills/:id/pdf - Generate PDF for a bill
router.get('/:id/pdf', generateBillPDF);

module.exports = router; 