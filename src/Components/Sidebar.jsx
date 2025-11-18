import React from "react";

export default function Sidebar({ onSelectModule }) {
  return (
    <div className="sidebar">
      <h2>SAP Portal</h2>
      <ul>
        <li onClick={() => onSelectModule("Dashboard")}>Dashboard</li>
        <li onClick={() => onSelectModule("PurchaseOrder")}>Purchase Order</li>
        <li onClick={() => onSelectModule("Sales")}>Sales</li>
        <li onClick={() => onSelectModule("Reports")}>Reports</li>
      </ul>
    </div>
  );
}
