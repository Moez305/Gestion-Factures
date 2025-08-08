import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import BillForm from "../components/BillForm";

const NewBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (billData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/bills", billData);
      alert("Bill created successfully!");

      // Navigate to the client details page
      if (response.data.Client) {
        navigate(`/client/${response.data.Client.id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Error creating bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>📄 Create New Bill</h1>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <BillForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default NewBill;
