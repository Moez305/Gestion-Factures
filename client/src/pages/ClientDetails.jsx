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
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
            <h3>Client not found</h3>
            <p>The client you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBilled = bills.reduce(
    (sum, bill) => sum + parseFloat(bill.total),
    0
  );

  return (
    <div className="container">
      {/* Modern Header */}
      <div className="header fade-in-up">
        <h1><i className="fas fa-user"></i> Client Details</h1>
        <p>Manage client information and billing history</p>
      </div>

      {/* Client Information */}
      <div className="card fade-in-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2><i className="fas fa-user-circle"></i> Client Information</h2>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-2">
          <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <h3 style={{ marginBottom: '15px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-info-circle" style={{ color: '#667eea' }}></i>
              Personal Details
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.5rem'
              }}>
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.2rem', color: '#2d3748' }}>{client.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Client ID: {client.id}</div>
              </div>
            </div>
            <p style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-phone" style={{ color: '#667eea' }}></i>
              <strong>Phone:</strong> {client.phone}
            </p>
            <p style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-hashtag" style={{ color: '#667eea' }}></i>
              <strong>Code:</strong> 
              <span style={{
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                marginLeft: '8px'
              }}>
                {client.code}
              </span>
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <h3 style={{ marginBottom: '15px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-chart-bar" style={{ color: '#667eea' }}></i>
              Billing Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096' }}>Total Bills:</span>
                <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#2d3748' }}>{bills.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096' }}>Total Amount:</span>
                <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#2d3748' }}>{totalBilled.toFixed(2)} TND</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096' }}>Status:</span>
                <span style={{
                  background: bills.length > 0 ? 'linear-gradient(135deg, #48bb78, #38a169)' : 'linear-gradient(135deg, #a0aec0, #718096)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {bills.length > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="card fade-in-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2><i className="fas fa-history"></i> Billing History</h2>
          <Link to="/new-bill" className="btn btn-success">
            <i className="fas fa-plus"></i> Add New Bill
          </Link>
        </div>

        {bills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            <i className="fas fa-file-invoice" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
            <h3>No bills found</h3>
            <p>This client doesn't have any bills yet. Create their first invoice!</p>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th><i className="fas fa-hashtag"></i> Bill #</th>
                                     <th><i className="fas fa-calendar"></i> Date</th>
                   <th><i className="fas fa-list"></i> Items</th>
                   <th><i className="fas fa-money-bill"></i> Total</th>
                   <th><i className="fas fa-credit-card"></i> Status</th>
                   <th><i className="fas fa-cogs"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="fade-in-up">
                    <td>
                      <span style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        #{bill.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-calendar-day" style={{ color: '#667eea' }}></i>
                        {new Date(bill.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-box" style={{ color: '#667eea' }}></i>
                        {bill.BillItems ? bill.BillItems.length : 0} items
                      </div>
                    </td>
                                         <td>
                       <div style={{ fontWeight: '600', color: '#2d3748' }}>
                         {parseFloat(bill.total).toFixed(2)} TND
                       </div>
                     </td>
                     <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <input
                           type="checkbox"
                           checked={bill.paid}
                           onChange={async (e) => {
                             try {
                               await api.put(`/api/bills/${bill.id}`, { paid: e.target.checked });
                               fetchClientData(); // Refresh data
                             } catch (error) {
                               console.error("Error updating payment status:", error);
                               alert("Error updating payment status. Please try again.");
                             }
                           }}
                           style={{ 
                             width: '18px', 
                             height: '18px',
                             accentColor: '#667eea'
                           }}
                         />
                         <span style={{
                           background: bill.paid ? 'linear-gradient(135deg, #48bb78, #38a169)' : 'linear-gradient(135deg, #f56565, #e53e3e)',
                           color: 'white',
                           padding: '4px 12px',
                           borderRadius: '20px',
                           fontSize: '0.85rem',
                           fontWeight: '500'
                         }}>
                           {bill.paid ? 'Paid' : 'Unpaid'}
                         </span>
                       </div>
                     </td>
                     <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDownloadPDF(bill.id)}
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                          <i className="fas fa-download"></i> PDF
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteBill(bill.id)}
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
