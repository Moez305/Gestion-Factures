const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

// GET /api/clients - Get all clients (with optional search)
router.get('/', getClients);

// GET /api/clients/:id - Get single client
router.get('/:id', getClient);

// POST /api/clients - Create new client
router.post('/', createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', deleteClient);

module.exports = router; 