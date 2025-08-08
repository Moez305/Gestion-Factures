import React from 'react';
import jsPDF from 'jspdf';

const PDFExport = ({ bill, client }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Client information
    doc.setFontSize(12);
    doc.text(`Client: ${client?.name || 'N/A'}`, 20, 40);
    doc.text(`Code: ${client?.code || 'N/A'}`, 20, 50);
    doc.text(`Phone: ${client?.phone || 'N/A'}`, 20, 60);
    
    // Bill information
    doc.text(`Bill #: ${bill?.id || 'N/A'}`, 20, 80);
    doc.text(`Date: ${bill?.date ? new Date(bill.date).toLocaleDateString() : 'N/A'}`, 20, 90);
    
    // Items table
    doc.setFontSize(14);
    doc.text('Items:', 20, 110);
    
    let yPosition = 120;
    doc.setFontSize(10);
    
    // Table headers
    doc.text('Item', 20, yPosition);
    doc.text('Price', 150, yPosition);
    yPosition += 10;
    
    // Table content
    if (bill?.BillItems) {
      bill.BillItems.forEach(item => {
        doc.text(item.name, 20, yPosition);
        doc.text(`$${parseFloat(item.price).toFixed(2)}`, 150, yPosition);
        yPosition += 8;
      });
    }
    
    // Total
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Total: $${bill?.total ? parseFloat(bill.total).toFixed(2) : '0.00'}`, 150, yPosition);
    
    // Save the PDF
    doc.save(`bill-${bill?.id || 'new'}.pdf`);
  };

  return (
    <button className="btn btn-primary" onClick={generatePDF}>
      📄 Generate PDF
    </button>
  );
};

export default PDFExport; 