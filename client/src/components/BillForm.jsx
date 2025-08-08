import React, { useState } from "react";

const BillForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || "",
    client_phone: initialData?.client_phone || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    items: initialData?.items || [{ name: "", quantity: "1", unit_price: "", price: "" }],
    paid: initialData?.paid || false,
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
      paid: formData.paid,
    };

    onSubmit(billData);
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in-up">
      {/* Client Information */}
      <div className="card">
        <h3 style={{ marginTop: "0", marginBottom: "20px", color: "#2d3748", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-user" style={{ color: '#667eea' }}></i>
          Client Information
        </h3>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="client_name">
              <i className="fas fa-user-circle"></i> Client Name
            </label>
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
            <label htmlFor="client_phone">
              <i className="fas fa-phone"></i> Phone Number
            </label>
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
      </div>

      {/* Bill Information */}
      <div className="card">
        <h3 style={{ marginTop: "0", marginBottom: "20px", color: "#2d3748", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-file-invoice" style={{ color: '#667eea' }}></i>
          Bill Information
        </h3>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="date">
              <i className="fas fa-calendar"></i> Date
            </label>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <i className="fas fa-credit-card"></i> Payment Status
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <input
                type="checkbox"
                id="paid"
                name="paid"
                checked={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  accentColor: '#667eea'
                }}
              />
              <label htmlFor="paid" style={{ margin: 0, cursor: 'pointer', fontWeight: '500' }}>
                {formData.paid ? 'Paid' : 'Unpaid'}
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-list"></i> Items
          </label>
          
          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="number"
                placeholder="QTE"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="qte-input"
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
                className="name-input"
                required
              />
              <input
                type="number"
                placeholder="P.U HT"
                value={item.unit_price}
                onChange={(e) =>
                  handleItemChange(index, "unit_price", e.target.value)
                }
                className="price-input"
                step="0.01"
                min="0"
                required
              />
              <div className="total-display">
                P.T HT: {((parseFloat(item.quantity) || 1) * (parseFloat(item.unit_price) || 0)).toFixed(2)} TND
              </div>
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn btn-danger"
                  style={{ padding: '8px 12px', minWidth: 'auto' }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addItem}
            className="btn btn-success"
            style={{ marginTop: "15px" }}
          >
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>

        <div className="total-section">
          <strong>Total: {calculateTotal().toFixed(2)} TND</strong>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ width: "100%", padding: "16px", fontSize: "1.1rem", marginTop: "20px" }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></div>
            Creating Bill...
          </>
        ) : (
          <>
            <i className="fas fa-save"></i> Create Bill
          </>
        )}
      </button>
    </form>
  );
};

export default BillForm;
