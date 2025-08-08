import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import ClientForm from "../components/ClientForm";

const Home = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, [searchTerm]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/clients${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/api/clients/${id}`);
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAddClient = async (clientData) => {
    try {
      await api.post("/api/clients", clientData);
      setShowForm(false);
      fetchClients();
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Error adding client. Please try again.");
    }
  };

  return (
    <div>
      <div className="card">
        <h1>👥 Client Management</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Search clients by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px", width: "300px", marginRight: "10px" }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Client"}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3>Add New Client</h3>
            <ClientForm onSubmit={handleAddClient} />
          </div>
        )}

        {loading ? (
          <p>Loading clients...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.code}</td>
                  <td>{client.phone}</td>
                  <td>
                    <Link
                      to={`/client/${client.id}`}
                      className="btn btn-primary"
                      style={{ marginRight: "5px" }}
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && clients.length === 0 && (
          <p>
            No clients found.{" "}
            {searchTerm
              ? "Try a different search term."
              : "Add your first client!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
