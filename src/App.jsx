import React, { useState } from "react";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./Components/Dashboard";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // clear user and return to login
  };

  return (
    <div className="app">
      {!user ? (
        <LoginForm onLogin={setUser} />
      ) : (
        <Dashboard username={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
