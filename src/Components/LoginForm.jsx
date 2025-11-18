import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7183/api/SapUser/login", {
        username,
        password
      });

      if (response.data.success) {
        onLogin(username); // call parent callback
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check username/password or server connection.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">SAP Portal Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

