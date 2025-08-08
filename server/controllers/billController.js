const Bill = require("../models/Bill");
const BillItem = require("../models/BillItem");
const Client = require("../models/Client");
const PDFDocument = require("pdfkit");

// Get all bills for a client
const getBillsByClient = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      where: { client_id: req.params.clientId },
      include: [
        {
          model: BillItem,
          as: "BillItems",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single bill by ID
const getBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id, {
      include: [
        {
          model: BillItem,
          as: "BillItems",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new bill with items
const createBill = async (req, res) => {
  try {
    const { client_id, client_name, client_phone, date, items } = req.body;

    let clientId = client_id;

    // If client information is provided, create or find the client
    if (client_name && client_phone) {
      // First, try to find existing client by name and phone
      let client = await Client.findOne({
        where: {
          name: client_name,
          phone: client_phone,
        },
      });

      // If client doesn't exist, create a new one
      if (!client) {
        // Generate automatic code
        const lastClient = await Client.findOne({
          order: [["code", "DESC"]],
        });

        let nextNumber = 1;
        if (lastClient && lastClient.code) {
          const match = lastClient.code.match(/CL(\d+)/);
          if (match) {
            nextNumber = parseInt(match[1]) + 1;
          }
        }

        const clientCode = `CL${nextNumber.toString().padStart(3, "0")}`;

        client = await Client.create({
          name: client_name,
          phone: client_phone,
          code: clientCode,
        });
      }

      clientId = client.id;
    }

    if (!clientId) {
      return res
        .status(400)
        .json({ message: "Client information is required" });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Create bill
    const bill = await Bill.create({
      client_id: clientId,
      date: date || new Date(),
      total,
    });

    // Create bill items
    const billItems = await Promise.all(
      items.map((item) =>
        BillItem.create({
          bill_id: bill.id,
          name: item.name,
          price: item.price,
        })
      )
    );

    // Return bill with items and client
    const createdBill = await Bill.findByPk(bill.id, {
      include: [
        {
          model: BillItem,
          as: "BillItems",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
    });

    res.status(201).json(createdBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update bill
const updateBill = async (req, res) => {
  try {
    const { date, items } = req.body;
    const bill = await Bill.findByPk(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Calculate new total
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Update bill
    await bill.update({
      date: date || bill.date,
      total,
    });

    // Delete existing items and create new ones
    await BillItem.destroy({ where: { bill_id: bill.id } });

    await Promise.all(
      items.map((item) =>
        BillItem.create({
          bill_id: bill.id,
          name: item.name,
          price: item.price,
        })
      )
    );

    // Return updated bill
    const updatedBill = await Bill.findByPk(bill.id, {
      include: [
        {
          model: BillItem,
          as: "BillItems",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
    });

    res.json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete bill
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Delete associated items first
    await BillItem.destroy({ where: { bill_id: bill.id } });

    // Delete bill
    await bill.destroy();
    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate PDF for a bill
const generateBillPDF = async (req, res) => {
  try {
    console.log("Generating PDF for bill:", req.params.id);

    const bill = await Bill.findByPk(req.params.id, {
      include: [
        {
          model: BillItem,
          as: "BillItems",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
    });

    if (!bill) {
      console.log("Bill not found:", req.params.id);
      return res.status(404).json({ message: "Bill not found" });
    }

    console.log("Bill found:", bill.id, "Client:", bill.Client?.name);

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=facture-${bill.id}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Header Section
    doc.fontSize(24).font("Helvetica-Bold").text("ORM", 50, 50);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("réparation et maintenance", 50, 75);
    //heere imma add the logo

    // Add horizontal lines in header
    doc.moveTo(200, 60).lineTo(500, 60).stroke();
    doc.moveTo(200, 70).lineTo(500, 70).stroke();

    // Invoice Details Section (Left side)
    doc.fontSize(12).font("Helvetica-Bold").text("FACTURE N°:", 50, 120);
    doc.fontSize(12).font("Helvetica").text(bill.id.toString(), 150, 120);

    doc.fontSize(12).font("Helvetica-Bold").text("DATE:", 50, 140);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(new Date(bill.date).toLocaleDateString("fr-FR"), 150, 140);

    doc.fontSize(12).font("Helvetica-Bold").text("VALIDITE:", 50, 160);
    doc.fontSize(12).font("Helvetica").text("30 jours", 150, 160);

    // Client Information Section (Right side)
    doc.rect(350, 120, 200, 80).stroke();
    // Client Information Section (Right side)
    doc.rect(350, 120, 200, 100).stroke(); // Extended height to fit all info

    // CLIENT title
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("red")
      .text("CLIENT:", 360, 125);

    // Reset font and color for client data
    doc.fontSize(10).font("Helvetica").fillColor("black");

    // Client Name (just under "CLIENT:")
    doc.text(bill.Client.name, 360, 140);

    // Client Phone (under name)
    doc.text(bill.Client.phone, 360, 155);

    // Client Code (move this part lower)
    doc.font("Helvetica-Bold").text("CODE CLIENT:", 360, 175);
    doc.font("Helvetica").text(bill.Client.code, 440, 175);

    // Items Table
    const tableTop = 220;
    const colX = [50, 110, 360, 440];

    // Table headers
    doc.fontSize(10).font("Helvetica-Bold").text("QTE", colX[0], tableTop);
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DESIGNATION", colX[1], tableTop);
    doc.fontSize(10).font("Helvetica-Bold").text("P.U HT", colX[2], tableTop);
    doc.fontSize(10).font("Helvetica-Bold").text("P.T HT", colX[3], tableTop);

    // Draw table header line
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(520, tableTop + 15)
      .stroke();

    // Table content
    let currentY = tableTop + 25;
    bill.BillItems.forEach((item, index) => {
      doc.fontSize(10).font("Helvetica").text("1", colX[0], currentY);
      doc.fontSize(10).font("Helvetica").text(item.name, colX[1], currentY);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${parseFloat(item.price).toFixed(2)}`, colX[2], currentY);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${parseFloat(item.price).toFixed(2)}`, colX[3], currentY);
      currentY += 20;
    });

    // Draw table bottom line
    doc
      .moveTo(50, currentY + 5)
      .lineTo(520, currentY + 5)
      .stroke();

    // Totals Section (Right side)
    const totalsY = currentY + 20;
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("PRIX TOTAL HT:", 350, totalsY);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`${parseFloat(bill.total).toFixed(2)}`, 480, totalsY);

    const tva = parseFloat(bill.total) * 0.19;
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("TVA 19%:", 350, totalsY + 20);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`${tva.toFixed(2)}`, 480, totalsY + 20);

    const totalTTC = parseFloat(bill.total) + tva;
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("TOTAL TTC:", 350, totalsY + 40);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`${totalTTC.toFixed(2)}`, 480, totalsY + 40);

    // Approval Statement
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("ARRETÉE LA PRÉSENTE FACTURE A LA SOMME DE :", 50, totalsY + 80);
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`${totalTTC.toFixed(2)} dinars`, 50, totalsY + 95);

    // Footer
    doc
      .moveTo(50, totalsY + 120)
      .lineTo(520, totalsY + 120)
      .stroke();
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .fillColor("red")
      .text("MERCI POUR VOTRE CONFIANCE !", 200, totalsY + 130);

    console.log("PDF generation completed for bill:", bill.id);

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBillsByClient,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  generateBillPDF,
};
