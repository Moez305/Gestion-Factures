import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "../components/ClientForm";
import api from "../config/api";

const NewClient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (clientData) => {
    try {
      setLoading(true);
      await api.post("/api/clients", clientData);
      alert("Client created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Error creating client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Modern Header */}
      <div className="header fade-in-up">
        <h1><i className="fas fa-user-plus"></i> Add New Client</h1>
        <p>Register a new client in your billing system</p>
      </div>

      {/* Client Form */}
      <div className="card fade-in-up">
        <ClientForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate("/")}
          className="btn btn-secondary"
          style={{ padding: '12px 24px' }}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NewClient;
