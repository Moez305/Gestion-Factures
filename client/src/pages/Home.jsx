import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";

const Home = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/api/clients/${clientId}`);
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const totalClients = clients.length;
  const totalBilled = clients.reduce((sum, client) => sum + parseFloat(client.total_billed || 0), 0);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Modern Header */}
      <div className="header fade-in-up">
        <h1><i className="fas fa-chart-line"></i> Client Billing Dashboard</h1>
        <p>Manage your clients and billing information efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3">
        <div className="stats-card fade-in-up">
          <div className="stats-number">{totalClients}</div>
          <div className="stats-label">Total Clients</div>
          <i className="fas fa-users" style={{ fontSize: '2rem', color: '#667eea', marginTop: '10px' }}></i>
        </div>
        <div className="stats-card fade-in-up">
          <div className="stats-number">{totalBilled.toFixed(2)}</div>
          <div className="stats-label">Total Billed (TND)</div>
          <i className="fas fa-money-bill-wave" style={{ fontSize: '2rem', color: '#48bb78', marginTop: '10px' }}></i>
        </div>
        <div className="stats-card fade-in-up">
          <div className="stats-number">{clients.filter(c => c.total_billed > 0).length}</div>
          <div className="stats-label">Active Clients</div>
          <i className="fas fa-user-check" style={{ fontSize: '2rem', color: '#f56565', marginTop: '10px' }}></i>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav">
        <Link to="/new-client" className="nav-item">
          <i className="fas fa-user-plus"></i> Add New Client
        </Link>
        <Link to="/new-bill" className="nav-item">
          <i className="fas fa-file-invoice"></i> Create New Bill
        </Link>
        <Link to="/reports" className="nav-item">
          <i className="fas fa-chart-bar"></i> View Reports
        </Link>
      </div>

      {/* Search and Actions */}
      <div className="card fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2><i className="fas fa-users"></i> Client Management</h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{ 
                position: 'absolute', 
                left: '15px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#718096' 
              }}></i>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '12px 15px 12px 45px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  width: '300px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            <Link to="/new-client" className="btn btn-success">
              <i className="fas fa-plus"></i> Add Client
            </Link>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
            <h3>No clients found</h3>
            <p>Try adjusting your search terms or add a new client to get started.</p>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th><i className="fas fa-user"></i> Client Name</th>
                  <th><i className="fas fa-phone"></i> Phone</th>
                  <th><i className="fas fa-hashtag"></i> Code</th>
                  <th><i className="fas fa-money-bill"></i> Total Billed</th>
                  <th><i className="fas fa-cogs"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="fade-in-up">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2d3748' }}>{client.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#718096' }}>ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-phone" style={{ color: '#667eea' }}></i>
                        {client.phone}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: 'linear-gradient(135deg, #48bb78, #38a169)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {client.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#2d3748' }}>
                        {parseFloat(client.total_billed || 0).toFixed(2)} TND
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/client/${client.id}`}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                          <i className="fas fa-eye"></i> View
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteClient(client.id)}
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

      {/* Quick Actions */}
      <div className="card fade-in-up">
        <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
        <div className="grid grid-2">
          <Link to="/new-client" className="btn btn-success" style={{ justifyContent: 'center', padding: '20px' }}>
            <i className="fas fa-user-plus" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Add New Client</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Register a new client</div>
            </div>
          </Link>
          <Link to="/new-bill" className="btn btn-primary" style={{ justifyContent: 'center', padding: '20px' }}>
            <i className="fas fa-file-invoice" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Create Bill</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Generate a new invoice</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
