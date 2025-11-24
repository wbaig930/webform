import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PurchaseOrder from "./PurchaseOrder";
import PRForm from "./PurchaseOrder"; // Import the PRForm component
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ username, onLogout }) {
  const [module, setModule] = useState("Dashboard");
  const [prList, setPrList] = useState([]);
  // 1. New state to hold the selected PR data for viewing
  const [selectedPr, setSelectedPr] = useState(null);

  // Fetch PRs only for Approval User
  useEffect(() => {
    // console.log("Logged in as:", username);

    if (username === "APP") {
      // console.log("User is Approval User → fetching PRs...");
      fetchPendingPRs();
    }
  }, [username]);

  const fetchPendingPRs = async () => {
  try {
    const res = await axios.get("https://localhost:7183/api/PRForm");

    let data = res.data; // <-- declare FIRST

    // console.log("Raw PR data:", JSON.stringify(data, null, 2));

    if (!Array.isArray(data)) data = [data];

    setPrList(data);
    // console.log("PR list stored:", data);
  } catch (err) {
    console.error("PR fetch error:", err);
    setPrList([]);
  }
};


  // 2. Handler to view PR details
  const handleViewDetails = (pr) => {
    setSelectedPr(pr); // Set the selected PR data
    setModule("PRDetails"); // Change the view module
  };

  // Handler to go back from PR details (or other sub-modules)
  const handleBackToDashboard = () => {
    setSelectedPr(null); // Clear selected PR
    setModule("Dashboard"); // Go back to main dashboard view
  };

  // Render dashboard content
  const renderModule = () => {
    // Check for the "PRDetails" case first
    if (module === "PRDetails" && selectedPr) {
      // 3. Render the PRForm for viewing/approval
      return <PRForm prData={selectedPr} onBack={handleBackToDashboard} isViewMode={true} />;
    }

    switch (module) {
      case "PurchaseOrder":
        // This is likely for *creating* a new PR, you might rename this module or component
        return <PurchaseOrder />;

      case "Dashboard":
        return (
          <div>
            <h2 className="dash-heading">Welcome to SAP Portal, {username}</h2>

            {/* Show only for Approval User */}
            {username === "APP" && (
              <div className="pr-box-container">
                <h3>Pending Purchase Requests</h3>

                {prList.map((pr, idx) => (
                  <div key={idx} className="pr-box">

                    <p>
                      <strong>DocEntry:</strong> {pr.docEntry}
                    </p>
                    <p>
                      <strong>Request Name:</strong> {pr.creator}
                    </p>
                    <p>
                      <strong>Designation:</strong> {pr.u_DESG || "N/A"}
                    </p>

                    <div className="pr-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDetails(pr)}
                      >
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

      case "Sales":
        return <h2 className="dash-heading">Sales Module Coming Soon</h2>;

      case "Reports":
        return <h2 className="dash-heading">Reports Module Coming Soon</h2>;

      default:
        return <h2 className="dash-heading">Welcome to SAP Portal, {username}</h2>;
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