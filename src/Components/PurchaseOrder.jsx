// PRForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./PurchaseOrder.css"; // your own CSS

export default function PRForm() {
  // Header state
  const [header, setHeader] = useState({
    CreateDate: "",
    UpdateDate: "",
    Creator: "",
    Remark: "",
    U_FRST: "",
    U_LAST: "",
    U_DESG: "",
    U_ReqName: "",
    Location: "",
    Site: "",
    U_DocDate: "",
    U_ReqDate: "",
    DocumentLines: [
      {
        U_CODE: "",
        U_NAME: "",
        U_CMPS: "",
        U_QNTY: "",
        U_PRCE: "",
        U_TOTL: "",
        U_JUST: "",
        U_ABGT: "",
        U_BREF: "",
        U_PRJT: "",
        U_FRWD: "",
      },
    ],
  });

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader({ ...header, [name]: value });
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const newLines = [...header.DocumentLines];
    newLines[index][name] = value;
    setHeader({ ...header, DocumentLines: newLines });
  };

  const addRow = () => {
    setHeader({
      ...header,
      DocumentLines: [
        ...header.DocumentLines,
        {
          U_CODE: "",
          U_NAME: "",
          U_CMPS: "",
          U_QNTY: "",
          U_PRCE: "",
          U_TOTL: "",
          U_JUST: "",
          U_ABGT: "",
          U_BREF: "",
          U_PRJT: "",
          U_FRWD: "",
        },
      ],
    });
  };

  const removeRow = (index) => {
    const newLines = [...header.DocumentLines];
    newLines.splice(index, 1);
    setHeader({ ...header, DocumentLines: newLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const formatTimeOnly = (date) => date.toTimeString().slice(0, 8); // "HH:mm:ss"
    // Convert string dates to Date objects
    const payload = {
      ...header,

      CreateDate: new Date(header.CreateDate),
      UpdateDate: new Date(header.UpdateDate),
      U_DocDate: new Date(header.U_DocDate),
      U_ReqDate: new Date(header.U_ReqDate),
      CreateTime: formatTimeOnly(new Date()),
      UpdateTime: formatTimeOnly(new Date()),
      DocumentLines: header.DocumentLines.map((row) => ({
        ...row,
        U_BREF: row.U_BREF || "N/A", // provide a default value if empty
        U_QNTY: Number(row.U_QNTY),
        U_PRCE: Number(row.U_PRCE),
        U_TOTL: Number(row.U_TOTL),
        LineId: row.LineId ? Number(row.LineId) : 1,
      })),
    };

    try {
      console.log(JSON.stringify(payload, null, 2));

      const res = await axios.post(
        "https://localhost:7183/api/PRForm",
        payload,
      );

      console.log(res); // log full response
      alert(`Success! DocEntry: ${res.data.DocEntry}`);
    } catch (err) {
      if (err.response) {
        // The server responded with a status outside 2xx
        console.error(
          "Server responded with error:",
          err.response.status,
          err.response.data,
        );
      } else if (err.request) {
        // Request was made but no response
        console.error("No response from server:", err.request);
      } else {
        // Something else happened
        console.error("Error setting up request:", err.message);
      }
      alert("Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pr-form">
      <h2>Purchase Request Form</h2>

      {/* Header fields */}
      <div className="header-section">
        <div className="form-group">
          <label>Doc Entry</label>
          <input
            type="text"
            name="DocEntry"
            disabled
            value={header.DocEntry || "Auto-generated"}
            onChange={handleHeaderChange}
            placeholder="Doc Entry"
          />
        </div>

        <div className="form-group">
          <label>Create Date</label>
          <input
            type="date"
            name="CreateDate"
            value={header.CreateDate}
            onChange={handleHeaderChange}
            placeholder="Create Date"
          />
        </div>

        <div className="form-group">
          <label>Update Date</label>
          <input
            type="date"
            name="UpdateDate"
            value={header.UpdateDate}
            onChange={handleHeaderChange}
            placeholder="Update Date"
          />
        </div>

        <div className="form-group">
          <label>Creator</label>
          <input
            type="text"
            name="Creator"
            value={header.Creator}
            onChange={handleHeaderChange}
            placeholder="Creator"
          />
        </div>

        <div className="form-group">
          <label>Remark</label>
          <input
            type="text"
            name="Remark"
            value={header.Remark}
            onChange={handleHeaderChange}
            placeholder="Remark"
          />
        </div>

        <div className="form-group">
          <label>Requester Name</label>
          <input
            type="text"
            name="U_ReqName"
            value={header.U_ReqName}
            onChange={handleHeaderChange}
            placeholder="Requester Name"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="Location"
            value={header.Location}
            onChange={handleHeaderChange}
            placeholder="Location"
          />
        </div>

        <div className="form-group">
          <label>Site</label>
          <input
            type="text"
            name="Site"
            value={header.Site}
            onChange={handleHeaderChange}
            placeholder="Site"
          />
        </div>

        <div className="form-group">
          <label>Document Date</label>
          <input
            type="date"
            name="U_DocDate"
            value={header.U_DocDate}
            onChange={handleHeaderChange}
            placeholder="Document Date"
          />
        </div>

        <div className="form-group">
          <label>Required Date</label>
          <input
            type="date"
            name="U_ReqDate"
            value={header.U_ReqDate}
            onChange={handleHeaderChange}
            placeholder="Required Date"
          />
        </div>
      </div>

      {/* Row-level items */}
      <h3>Items</h3>
      {header.DocumentLines.map((row, idx) => (
        <div key={idx} className="row-item">
          <input 
            type="text"
            name="LineId"
            value={row.LineId || idx + 1}
            disabled
            placeholder="Line ID"
          />
          <input
            type="text"
            name="U_CODE"
            value={row.U_CODE}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Item Code"
          />
          <input
            type="text"
            name="U_NAME"
            value={row.U_NAME}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Item Name"
          />
          <input
            type="text"
            name="U_CMPS"
            value={row.U_CMPS}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Components"
          />
          <input
            type="number"
            name="U_QNTY"
            value={row.U_QNTY}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Quantity"
          />
          <input
            type="number"
            name="U_PRCE"
            value={row.U_PRCE}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Price"
          />
          <input
            type="number"
            name="U_TOTL"
            value={row.U_TOTL}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Total"
          />
          <input
            type="text"
            name="U_JUST"
            value={row.U_JUST}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Justification"
          />
          <input
            type="text"
            name="U_ABGT "
            value={row.U_ABGT}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Approval Budget"
          />
          <input
            type="text"
            name="U_BREF"
            value={row.U_BREF}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Budget Reference"
          />
          <input
            type="text"
            name="U_PRJT"
            value={row.U_PRJT}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Project"
          />
          <input
            type="text"
            name="U_FRWD"
            value={row.U_FRWD}
            onChange={(e) => handleRowChange(idx, e)}
            placeholder="Forwarded To"
          />
          <button type="button" onClick={() => removeRow(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow}>
        Add Item
      </button>

      <button type="submit">Submit Request</button>
    </form>
  );
}
