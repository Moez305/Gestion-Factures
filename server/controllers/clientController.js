const Client = require("../models/Client");
const { Op } = require("sequelize");

// Generate automatic client code
const generateClientCode = async () => {
  try {
    // Get the last client to determine the next code
    const lastClient = await Client.findOne({
      order: [["code", "DESC"]],
    });

    let nextNumber = 1;
    if (lastClient && lastClient.code) {
      // Extract number from existing code (assuming format like CL001, CL002, etc.)
      const match = lastClient.code.match(/CL(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Format: CL001, CL002, etc.
    return `CL${nextNumber.toString().padStart(3, "0")}`;
  } catch (error) {
    // Fallback code if something goes wrong
    return `CL${Date.now().toString().slice(-3)}`;
  }
};

// Get all clients with optional search
const getClients = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const clients = await Client.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: require("../models/Bill"),
          as: "Bills",
          attributes: ["total", "paid"],
        },
      ],
    });

    // Calculate total billed and payment status for each client
    const clientsWithStats = clients.map(client => {
      const totalBilled = client.Bills.reduce((sum, bill) => sum + parseFloat(bill.total), 0);
      const totalPaid = client.Bills.filter(bill => bill.paid).reduce((sum, bill) => sum + parseFloat(bill.total), 0);
      const hasUnpaidBills = client.Bills.some(bill => !bill.paid);
      
      return {
        ...client.toJSON(),
        total_billed: totalBilled,
        total_paid: totalPaid,
        has_unpaid_bills: hasUnpaidBills,
        payment_status: hasUnpaidBills ? 'Unpaid' : 'Paid'
      };
    });

    res.json(clientsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single client by ID
const getClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new client
const createClient = async (req, res) => {
  try {
    const { name, code, phone } = req.body;

    let clientCode = code;

    // If no code provided, generate one automatically
    if (!clientCode) {
      clientCode = await generateClientCode();
    } else {
      // Check if client with same code already exists
      const existingClient = await Client.findOne({
        where: { code: clientCode },
      });
      if (existingClient) {
        return res
          .status(400)
          .json({ message: "Client with this code already exists" });
      }
    }

    const client = await Client.create({ name, code: clientCode, phone });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    const { name, code, phone } = req.body;
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check if code is being changed and if it already exists
    if (code && code !== client.code) {
      const existingClient = await Client.findOne({ where: { code } });
      if (existingClient) {
        return res
          .status(400)
          .json({ message: "Client with this code already exists" });
      }
    }

    await client.update({ name, code, phone });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.destroy();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  generateClientCode,
};
