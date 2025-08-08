import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const [clientResponse, billsResponse] = await Promise.all([
        api.get(`/api/clients/${id}`),
        api.get(`/api/bills/client/${id}`),
      ]);
      setClient(clientResponse.data);
      setBills(billsResponse.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await api.delete(`/api/bills/${billId}`);
        fetchClientData();
      } catch (error) {
        console.error("Error deleting bill:", error);
      }
    }
  };

  const handleDownloadPDF = async (billId) => {
    try {
      const response = await api.get(`/api/bills/${billId}/pdf`, {
        responseType: "blob",
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture-${billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Loading client details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="card">
        <p>Client not found.</p>
      </div>
    );
  }

  const totalBilled = bills.reduce(
    (sum, bill) => sum + parseFloat(bill.total),
    0
  );

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
          <h1>👤 Client Details</h1>
          <Link to="/" className="btn btn-primary">
            ← Back to Clients
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div>
            <h3>Client Information</h3>
            <p>
              <strong>Name:</strong> {client.name}
            </p>
            <p>
              <strong>Code:</strong> {client.code}
            </p>
            <p>
              <strong>Phone:</strong> {client.phone}
            </p>
          </div>
          <div>
            <h3>Billing Summary</h3>
            <p>
              <strong>Total Bills:</strong> {bills.length}
            </p>
            <p>
              <strong>Total Amount:</strong> ${totalBilled.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>📄 Billing History</h2>
          <Link to="/new-bill" className="btn btn-success">
            Add New Bill
          </Link>
        </div>

        {bills.length === 0 ? (
          <p>No bills found for this client.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{new Date(bill.date).toLocaleDateString()}</td>
                  <td>{bill.BillItems ? bill.BillItems.length : 0} items</td>
                  <td>${parseFloat(bill.total).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleDownloadPDF(bill.id)}
                    >
                      📄 Download PDF
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteBill(bill.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
