import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PurchaseOrder from "./PurchaseOrder";

export default function Dashboard({ username, onLogout }) {
  const [module, setModule] = useState("Dashboard");

  const renderModule = () => {
    switch (module) {
      case "PurchaseOrder":
        return <PurchaseOrder />;
      case "Dashboard":
        return <h2>Welcome to SAP Portal, {username}</h2>;
      case "Sales":
        return <h2>Sales Module Coming Soon</h2>;
      case "Reports":
        return <h2>Reports Module Coming Soon</h2>;
      default:
        return <h2>Welcome to SAP Portal, {username}</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onSelectModule={setModule} />
      <div className="main-content">
        <header className="dashboard-header">
          <h1>{module}</h1>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </header>
        {renderModule()}
      </div>
    </div>
  );
}
