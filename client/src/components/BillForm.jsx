import React, { useState } from "react";

const BillForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || "",
    client_phone: initialData?.client_phone || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    items: initialData?.items || [{ name: "", quantity: "1", unit_price: "", price: "" }],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: "1", unit_price: "", price: "" }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems,
      });
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 1;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate client information
    if (!formData.client_name.trim()) {
      alert("Please enter client name");
      return;
    }

    if (!formData.client_phone.trim()) {
      alert("Please enter client phone number");
      return;
    }

    // Validate items
    const validItems = formData.items.filter(
      (item) => item.name.trim() && item.unit_price
    );
    if (validItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const billData = {
      client_name: formData.client_name.trim(),
      client_phone: formData.client_phone.trim(),
      date: formData.date,
      items: validItems.map((item) => ({
        name: item.name.trim(),
        quantity: parseInt(item.quantity) || 1,
        unit_price: parseFloat(item.unit_price),
      })),
    };

    onSubmit(billData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Client Information */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "15px", color: "#333" }}>
          👤 Client Information
        </h3>

        <div className="form-group">
          <label htmlFor="client_name">Client Name:</label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder="Enter client name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="client_phone">Phone Number:</label>
          <input
            type="tel"
            id="client_phone"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      {/* Bill Information */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "15px", color: "#333" }}>
          📄 Bill Information
        </h3>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Items:</label>
          {formData.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="number"
                placeholder="QTE"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                style={{ flex: 0.5 }}
                min="1"
                required
              />
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                style={{ flex: 2 }}
                required
              />
                             <input
                 type="number"
                 placeholder="P.U HT"
                 value={item.unit_price}
                 onChange={(e) =>
                   handleItemChange(index, "unit_price", e.target.value)
                 }
                 style={{ flex: 1 }}
                 step="0.01"
                 min="0"
                 required
               />
               <div
                 style={{
                   flex: 1,
                   backgroundColor: "#f8f9fa",
                   padding: "8px 12px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   textAlign: "center",
                   color: "#666"
                 }}
               >
                 P.T HT: {((parseFloat(item.quantity) || 1) * (parseFloat(item.unit_price) || 0)).toFixed(2)} TND
               </div>
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            + Add Item
          </button>
        </div>

        <div
          style={{
            background: "#e9ecef",
            padding: "15px",
            borderRadius: "4px",
            marginTop: "15px",
            textAlign: "right",
          }}
        >
          <strong>Total: {calculateTotal().toFixed(2)} TND</strong>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ width: "100%", padding: "12px" }}
      >
        {loading ? "Creating Bill..." : "Create Bill"}
      </button>
    </form>
  );
};

export default BillForm;
