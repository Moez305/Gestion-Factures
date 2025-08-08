import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ClientDetails from "./pages/ClientDetails";
import NewBill from "./pages/NewBill";
import NewClient from "./pages/NewClient";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <Link to="/">🏠 Home</Link>
            <Link to="/new-client">👤 New Client</Link>
            <Link to="/new-bill">📄 New Bill</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/new-client" element={<NewClient />} />
            <Route path="/new-bill" element={<NewBill />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
