// PRForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./PurchaseOrder.css"; 

export default function PRForm({ prData, onBack, isViewMode = false }) {

  // Function to map API data (prData) to local state structure
  const getInitialHeaderState = (data) => {
    // Base structure for a new form, ensuring keys match local state
    const baseState = {
      DocEntry: "",
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
    };

    if (data) {
      // Map API response keys (lowercase/camelCase) to state keys (UPPERCASE)
      return {
        ...baseState,
        // Header Fields Mapping (using baseState as fallback for structure)
        DocEntry: data.docEntry || "", 
        CreateDate: data.createDate ? new Date(data.createDate).toISOString().split('T')[0] : '',
        UpdateDate: data.updateDate ? new Date(data.updateDate).toISOString().split('T')[0] : '',
        Creator: data.creator || "",
        Remark: data.remark || "",
        U_FRST: data.u_FRST || "",
        U_LAST: data.u_LAST || "",
        U_DESG: data.u_DESG || "",
        U_ReqName: data.u_ReqName || "",
        Location: data.location || "",
        Site: data.site || "",
        U_DocDate: data.u_DocDate ? new Date(data.u_DocDate).toISOString().split('T')[0] : '',
        U_ReqDate: data.u_ReqDate ? new Date(data.u_ReqDate).toISOString().split('T')[0] : '',
        
        // Row-level data mapping
        DocumentLines: data.documentLines && Array.isArray(data.documentLines) && data.documentLines.length > 0
          ? data.documentLines.map(line => ({
              // Map DocumentLine properties from API to state
              U_CODE: line.u_CODE,
              U_NAME: line.u_NAME,
              U_CMPS: line.u_CMPS,
              U_QNTY: line.u_QNTY, // Should be number/string, controlled by input type
              U_PRCE: line.u_PRCE,
              U_TOTL: line.u_TOTL,
              U_JUST: line.u_JUST,
              U_ABGT: line.u_ABGT,
              U_BREF: line.u_BREF,
              U_PRJT: line.u_PRJT,
              U_FRWD: line.u_FRWD,
              LineId: line.lineId, // Keep original LineId if available
            }))
          : baseState.DocumentLines, // Use default empty row if no data
      };
    }

    return baseState;
  };
  
  const [header, setHeader] = useState(getInitialHeaderState(prData));


  // --- Existing Handlers (Unchanged) ---
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader({ ...header, [name]: value });
  };

 const handleRowChange = (index, e) => {
    if (isViewMode) return; // Add guard for view mode
    const { name, value } = e.target;
    const newLines = [...header.DocumentLines];
    // This part relies on the state keys being U_CODE, U_NAME, etc.
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

// PRForm.jsx

// ... (previous functions)

const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const formatTimeOnly = (date) => date.toTimeString().slice(0, 8); 

    // Destructure to remove DocEntry (it's auto-generated on new requests)
    // and also remove properties that may be causing validation errors (like DocEntry/Request)
    const { DocEntry, request, ...headerWithoutDocEntry } = header;

    // Build the payload using the cleaned header
    const payload = {
        ...headerWithoutDocEntry, // Use the cleaned header here

        // Convert string dates to Date objects/ISO format for API
        CreateDate: header.CreateDate ? new Date(header.CreateDate) : null,
        UpdateDate: header.UpdateDate ? new Date(header.UpdateDate) : null,
        U_DocDate: header.U_DocDate ? new Date(header.U_DocDate) : null,
        U_ReqDate: header.U_ReqDate ? new Date(header.U_ReqDate) : null,
        CreateTime: formatTimeOnly(new Date()),
        UpdateTime: formatTimeOnly(new Date()),
        
        // Ensure numbers are numbers for row items
        DocumentLines: header.DocumentLines.map((row) => ({
            ...row,
            U_BREF: row.U_BREF || "N/A", 
            U_QNTY: Number(row.U_QNTY),
            U_PRCE: Number(row.U_PRCE),
            U_TOTL: Number(row.U_TOTL),
            LineId: row.LineId ? Number(row.LineId) : 1,
        })),
    };
    
    // Check if the payload contains any missing required fields from the server model
    // (We removed DocEntry, which should fix the main error)

    try {
        console.log(JSON.stringify(payload, null, 2));

        const res = await axios.post(
            "https://localhost:7183/api/PRForm",
            payload,
        );
// ... (rest of try/catch block)
      } catch (err) {
        console.error("Submission error:", err);
        alert("Failed to submit PR. Please try again.");
      }};


  return (
    <form onSubmit={handleSubmit} className="pr-form">
      <h2>Purchase Request Form {isViewMode && `(DocEntry: ${header.DocEntry})`}</h2>

      {/* Header fields - All inputs now correctly use disabled={isViewMode} */}
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
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
            disabled={isViewMode} 
          />
        </div>
        
        {/* Assuming Name field maps to U_FRST/U_LAST for display purpose */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="Name"
            value={`${header.U_FRST} ${header.U_LAST}`.trim()}
            onChange={handleHeaderChange}
            placeholder="Name"
            disabled={isViewMode} 
          />
        </div>
        
        <div className="form-group">
          <label>Designation</label>
          <input
            type="text"
            name="U_DESG"
            value={header.U_DESG}
            onChange={handleHeaderChange}
            placeholder="Designation"
            disabled={isViewMode} 
          />
        </div>
      </div>

      {/* Row-level items */}
      <h3>Items</h3>

      <div className="items-scroll">
        <div className="row-header">
          <span>Line ID</span>
          <span>Item Code</span>
          <span>Item Name</span>
          <span>Components</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Total</span>
          <span>Justification</span>
          <span>Approval Budget</span>
          <span>Budget Ref</span>
          <span>Project</span>
          <span>Forwarded To</span>
          {!isViewMode && <span>Action</span>}
        </div>
        
        {/* Row Rendering - All inputs now correctly use disabled={isViewMode} */}
        {header.DocumentLines.map((row, idx) => (
          <div key={idx} className="row-item">
            <input type="text" name="LineId" value={row.LineId || idx + 1} disabled placeholder="Line ID" />

            <input type="text" name="U_CODE" value={row.U_CODE} onChange={(e) => handleRowChange(idx, e)} placeholder="Item Code" disabled={isViewMode} />
            <input type="text" name="U_NAME" value={row.U_NAME} onChange={(e) => handleRowChange(idx, e)} placeholder="Item Name" disabled={isViewMode} />
            <input type="text" name="U_CMPS" value={row.U_CMPS} onChange={(e) => handleRowChange(idx, e)} placeholder="Components" disabled={isViewMode} />
            <input type="number" name="U_QNTY" value={row.U_QNTY} onChange={(e) => handleRowChange(idx, e)} placeholder="Quantity" disabled={isViewMode} />
            <input type="number" name="U_PRCE" value={row.U_PRCE} onChange={(e) => handleRowChange(idx, e)} placeholder="Price" disabled={isViewMode} />
            <input type="number" name="U_TOTL" value={row.U_TOTL} onChange={(e) => handleRowChange(idx, e)} placeholder="Total" disabled={isViewMode} />
            <input type="text" name="U_JUST" value={row.U_JUST} onChange={(e) => handleRowChange(idx, e)} placeholder="Justification" disabled={isViewMode} />
            <input type="text" name="U_ABGT" value={row.U_ABGT} onChange={(e) => handleRowChange(idx, e)} placeholder="Approval Budget" disabled={isViewMode} />
            <input type="text" name="U_BREF" value={row.U_BREF} onChange={(e) => handleRowChange(idx, e)} placeholder="Budget Reference" disabled={isViewMode} />
            <input type="text" name="U_PRJT" value={row.U_PRJT} onChange={(e) => handleRowChange(idx, e)} placeholder="Project" disabled={isViewMode} />
            <input type="text" name="U_FRWD" value={row.U_FRWD} onChange={(e) => handleRowChange(idx, e)} placeholder="Forwarded To" disabled={isViewMode} />
            

            {/* Conditionally hide the remove button */}
            {!isViewMode && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeRow(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Conditionally hide Add Item and Submit buttons */}
      {!isViewMode && (
        <>
          <button type="button" onClick={addRow}>
            Add Item
          </button>
          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </>
      )}
      
      {/* Add Approval Buttons for View Mode (Approval User) */}
      {isViewMode && (
        <div className="approval-actions">
          <button type="button" className="approve-btn">
            Approve PR
          </button>
          <button type="button" className="reject-btn">
            Reject PR
          </button>
        </div>
      )}

      {/* <button onClick={onBack} className="back-btn">
        ← Back
      </button> */}
      
    </form>
  );
}