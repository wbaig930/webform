import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PurchaseOrder from "./PurchaseOrder";
import axios from "axios";
import "./Dashboard.css";
export default function Dashboard({ username, onLogout }) {
  const [module, setModule] = useState("Dashboard");
  const [prList, setPrList] = useState([]);

  // Fetch PRs only for Approval User
  useEffect(() => {
    console.log("Logged in as:", username);

    if (username === "Approval User") {
      console.log("User is Approval User → fetching PRs...");
      fetchPendingPRs();
    }
  }, [username]);

  const fetchPendingPRs = async () => {
    try {
      const res = await axios.get("https://localhost:7183/api/PRForm");
      console.log("API Response:", res.data);

      let data = res.data;
      if (!Array.isArray(data)) data = [data];

      setPrList(data);
      console.log("PR list stored:", data);
    } catch (err) {
      console.error("PR fetch error:", err);
      setPrList([]);
    }
  };

  // Render dashboard content
  const renderModule = () => {
    switch (module) {
      case "PurchaseOrder":
        return <PurchaseOrder />;

      case "Dashboard":
        return (
          <div>
            <h2 className="dash-heading">Welcome to SAP Portal, {username}</h2>

            {/* Show only for Approval User */}
            {username === "Approval User" && (
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
                      <strong>Create Date:</strong> {pr.createDate}
                    </p>
                    <p>
                      <strong>Create Time:</strong> {pr.createTime}
                    </p>
                    <p>
                      <strong>Requestor Name:</strong> {pr.u_ReqName}
                    </p>
                    <p>
                      <strong>Designation:</strong> {pr.u_DESG || "N/A"}
                    </p>

                    {/* BUTTONS */}
                    <div className="pr-actions">
                      <button className="view-btn">View Details</button>
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
