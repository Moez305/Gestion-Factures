import React, { useState } from "react";

const ClientForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    code: initialData?.code || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter client name");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (!formData.code.trim()) {
      alert("Please enter client code");
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      code: formData.code.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in-up">
      <div className="card">
        <h3 style={{ marginTop: "0", marginBottom: "20px", color: "#2d3748", display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-user-plus" style={{ color: '#667eea' }}></i>
          Client Information
        </h3>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="name">
              <i className="fas fa-user"></i> Client Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="fas fa-phone"></i> Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="code">
            <i className="fas fa-hashtag"></i> Client Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter client code"
            required
          />
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
              Creating Client...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Create Client
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
