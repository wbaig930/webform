import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PurchaseOrder from "./PurchaseOrder";
import PRForm from "./PurchaseOrder"; 
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ username, onLogout }) {
  const [module, setModule] = useState("Dashboard");
  const [prList, setPrList] = useState([]);
  const [selectedPr, setSelectedPr] = useState(null);

  // Fetch PRs for Approval User
  useEffect(() => {
    if (username === "Approval User") fetchPendingPRs();
  }, [username]);

  const fetchPendingPRs = async () => {
    try {
      const res = await axios.get("https://localhost:7183/api/PRForm");

      // Always store data inside an array
      setPrList(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("PR fetch error:", err);
      setPrList([]);
    }
  };

  // View PR Details
  const handleViewDetails = (pr) => {
    setSelectedPr(pr);
    setModule("PRDetails");
  };

  // Back button from PRForm
  const handleBack = () => {
    setSelectedPr(null);
    setModule("Dashboard");
  };

  // Which screen to display?
  const renderScreen = () => {
    // View mode screen first
    if (module === "PRDetails" && selectedPr) {
      return <PRForm prData={selectedPr} onBack={handleBack} isViewMode={true} />;
    }

    // Main Dashboard
    if (module === "Dashboard") {
      return (
        <div>
          <h2 className="dash-heading">Welcome, {username}</h2>

          {username === "Approval User" && (
            <div className="pr-box-container">
              <h3>Pending Purchase Requests</h3>

              {prList.map((pr, idx) => (
                <div key={idx} className="pr-box">
                  <p><strong>DocEntry:</strong> {pr.docEntry}</p>
                  <p><strong>Request Name:</strong> {pr.creator}</p>
                  <p><strong>Designation:</strong> {pr.u_DESG || "N/A"}</p>

                  <div className="pr-actions">
                    <button className="view-btn" onClick={() => handleViewDetails(pr)}>
                      View Details
                    </button>
                    <button className="approve-btn">Approve</button>
                    <button className="reject-btn">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (module === "PurchaseOrder") return <PurchaseOrder />;
    if (module === "Sales") return <h2>Sales Module Coming Soon</h2>;
    if (module === "Reports") return <h2>Reports Module Coming Soon</h2>;

    return <h2>Welcome</h2>;
  };

  return (
    <div className="dashboard-container">
      <Sidebar onSelectModule={setModule} />

      <div className="main-content">
        <header className="dashboard-header">
          <h1>{module}</h1>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </header>

        {renderScreen()}
      </div>
    </div>
  );
}
