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
    const total = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(item.unit_price || item.price);
      return sum + quantity * unitPrice;
    }, 0);

    // Create bill
    const bill = await Bill.create({
      client_id: clientId,
      date: date || new Date(),
      total,
    });

    // Create bill items
    const billItems = await Promise.all(
      items.map((item) => {
        const quantity = item.quantity || 1;
        const unitPrice = parseFloat(item.unit_price || item.price);
        const totalPrice = quantity * unitPrice;

        return BillItem.create({
          bill_id: bill.id,
          name: item.name,
          quantity: quantity,
          unit_price: unitPrice,
          price: totalPrice,
        });
      })
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
    const total = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(item.unit_price || item.price);
      return sum + quantity * unitPrice;
    }, 0);

    // Update bill
    await bill.update({
      date: date || bill.date,
      total,
    });

    // Delete existing items and create new ones
    await BillItem.destroy({ where: { bill_id: bill.id } });

    await Promise.all(
      items.map((item) => {
        const quantity = item.quantity || 1;
        const unitPrice = parseFloat(item.unit_price || item.price);
        const totalPrice = quantity * unitPrice;

        return BillItem.create({
          bill_id: bill.id,
          name: item.name,
          quantity: quantity,
          unit_price: unitPrice,
          price: totalPrice,
        });
      })
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

    // Header Section with Logo
    const logoX = 50;
    const logoY = 50;

    // Try to load logo image if it exists
    try {
      const logoPath = "./assets/logo.png";
      if (require("fs").existsSync(logoPath)) {
        doc.image(logoPath, logoX, logoY, { width: 150, height: 70 }); // Bigger logo
      } else {
        // Fallback: Draw gear icon (simplified version)
        const gearRadius = 25; // Bigger gear icon

        // Draw gear outline
        doc.circle(logoX + gearRadius, logoY + gearRadius, gearRadius).stroke();

        // Draw gear teeth (simplified)
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x1 = logoX + gearRadius + Math.cos(angle) * gearRadius;
          const y1 = logoY + gearRadius + Math.sin(angle) * gearRadius;
          const x2 = logoX + gearRadius + Math.cos(angle) * (gearRadius + 5);
          const y2 = logoY + gearRadius + Math.sin(angle) * (gearRadius + 5);
          doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
        }

        // Draw red drop in center
        doc.fillColor("red");
        doc.circle(logoX + gearRadius, logoY + gearRadius, 5).fill();
        doc.fillColor("black");
      }
    } catch (error) {
      console.log("Logo not found, using fallback");
    }

    // No company text, just logo

    // Add horizontal line in header
    doc
      .moveTo(logoX + 150, logoY + 10)
      .lineTo(500, logoY + 10)
      .stroke();

    // Invoice Details Section (Left side)
    const detailsY = 120;
    doc.fontSize(12).font("Helvetica-Bold").text("FACTURE N°:", 50, detailsY);
    doc.fontSize(12).font("Helvetica").text(bill.id.toString(), 150, detailsY);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("DATE:", 50, detailsY + 20);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        new Date(bill.date).toLocaleDateString("fr-FR"),
        150,
        detailsY + 20
      );

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("VALIDITE:", 50, detailsY + 40);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("30 jours", 150, detailsY + 40);

    // Client Information Section (Right side)
    const clientBoxX = 350;
    const clientBoxY = detailsY;
    doc.rect(clientBoxX, clientBoxY, 200, 100).stroke();

    // CLIENT title
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("red")
      .text("CLIENT:", clientBoxX + 10, clientBoxY + 5);

    // Reset font and color for client data
    doc.fontSize(10).font("Helvetica").fillColor("black");

    // Client Name (just under "CLIENT:")
    doc.text(bill.Client.name, clientBoxX + 10, clientBoxY + 20);

    // Client Phone (under name)
    doc.text(bill.Client.phone, clientBoxX + 10, clientBoxY + 35);

    // Fiscal Matricule
    doc.font("Helvetica-Bold").text("M.F :", clientBoxX + 10, clientBoxY + 55);
    doc.font("Helvetica").text("", clientBoxX + 40, clientBoxY + 55);

    // Client Code
    doc
      .font("Helvetica-Bold")
      .text("CODE CLIENT:", clientBoxX + 10, clientBoxY + 75);
    doc
      .font("Helvetica")
      .text(bill.Client.code, clientBoxX + 90, clientBoxY + 75);

    // Items Table with proper borders - exactly like template
    const tableTop = detailsY + 120;
    const tableLeft = 50;
    const tableRight = 520;
    const tableHeight = 200;
    const colX = [50, 110, 360, 440];

    // Draw main table border
    doc
      .rect(tableLeft, tableTop - 10, tableRight - tableLeft, tableHeight)
      .stroke();

    // Table headers
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("QTE", colX[0] + 5, tableTop);
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DESIGNATION", colX[1] + 5, tableTop);
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("P.U HT", colX[2] + 5, tableTop);
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("P.T HT", colX[3] + 5, tableTop);

    // Draw vertical lines for columns
    doc
      .moveTo(colX[1], tableTop - 10)
      .lineTo(colX[1], tableTop + tableHeight - 10)
      .stroke();
    doc
      .moveTo(colX[2], tableTop - 10)
      .lineTo(colX[2], tableTop + tableHeight - 10)
      .stroke();
    doc
      .moveTo(colX[3], tableTop - 10)
      .lineTo(colX[3], tableTop + tableHeight - 10)
      .stroke();

    // Draw table header line
    doc
      .moveTo(tableLeft, tableTop + 15)
      .lineTo(tableRight, tableTop + 15)
      .stroke();

    // Table content with proper spacing
    let currentY = tableTop + 25;
    bill.BillItems.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(item.unit_price || item.price);
      const totalPrice = parseFloat(item.price);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(quantity.toString(), colX[0] + 5, currentY);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(item.name, colX[1] + 5, currentY);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${unitPrice.toFixed(2)}`, colX[2] + 5, currentY);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${totalPrice.toFixed(2)}`, colX[3] + 5, currentY);
      currentY += 20;
    });

    // Draw table bottom line
    doc
      .moveTo(tableLeft, tableTop + tableHeight - 10)
      .lineTo(tableRight, tableTop + tableHeight - 10)
      .stroke();

    // Totals Section - Separate small table under main table
    const totalsTableTop = tableTop + tableHeight + 20;
    const totalsTableLeft = 350;
    const totalsTableRight = 520;
    const totalsTableHeight = 80;

    // Draw totals table border
    doc
      .rect(
        totalsTableLeft,
        totalsTableTop,
        totalsTableRight - totalsTableLeft,
        totalsTableHeight
      )
      .stroke();

    // Draw vertical line for totals table
    doc
      .moveTo(totalsTableLeft + 120, totalsTableTop)
      .lineTo(totalsTableLeft + 120, totalsTableTop + totalsTableHeight)
      .stroke();

    const tva = parseFloat(bill.total) * 0.19;
    const totalTTC = parseFloat(bill.total) + tva;

    // PRIX TOTAL HT
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("PRIX TOTAL HT:", totalsTableLeft + 10, totalsTableTop + 15);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `${parseFloat(bill.total).toFixed(2)}`,
        totalsTableLeft + 130,
        totalsTableTop + 15
      );

    // TVA 19%
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("TVA 19%:", totalsTableLeft + 10, totalsTableTop + 35);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`${tva.toFixed(2)}`, totalsTableLeft + 130, totalsTableTop + 35);

    // TOTAL TTC
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("TOTAL TTC:", totalsTableLeft + 10, totalsTableTop + 55);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `${totalTTC.toFixed(2)}`,
        totalsTableLeft + 130,
        totalsTableTop + 55
      );

    // Approval Statement
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        "ARRETÉE LA PRÉSENTE FACTURE A LA SOMME DE :",
        50,
        totalsTableTop + 100
      );
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`${totalTTC.toFixed(2)} TND`, 50, totalsTableTop + 115);

    // Footer
    doc
      .moveTo(50, totalsTableTop + 140)
      .lineTo(520, totalsTableTop + 140)
      .stroke();
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .fillColor("red")
      .text("MERCI POUR VOTRE CONFIANCE !", 200, totalsTableTop + 150);

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
