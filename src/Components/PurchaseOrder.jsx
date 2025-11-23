import React, { useState } from "react";
import axios from "axios";
import "./PurchaseOrder.css";

export default function PRForm({ prData, onBack, isViewMode = false }) {

  // ---------- INITIAL STATE CLEANED ----------
  const emptyRow = {
    U_CODE: "", U_NAME: "", U_CMPS: "", U_QNTY: "",
    U_PRCE: "", U_TOTL: "", U_JUST: "", U_ABGT: "",
    U_BREF: "", U_PRJT: "", U_FRWD: "", LineId: ""
  };

  const emptyHeader = {
    DocEntry: "", CreateDate: "", UpdateDate: "",
    Creator: "", Remark: "", U_FRST: "", U_LAST: "",
    U_DESG: "", U_ReqName: "", Location: "", Site: "",
    U_DocDate: "", U_ReqDate: "",U_ABGT: "",
    DocumentLines: [emptyRow]
  };

  // Map API → UI state (clean)
  const mapData = (data) => {
    if (!data) return emptyHeader;

    return {
      ...emptyHeader,
      ...{
        DocEntry: data.docEntry || "",
        CreateDate: data.createDate?.split("T")[0] || "",
        UpdateDate: data.updateDate?.split("T")[0] || "",
        Creator: data.creator || "",
        Remark: data.remark || "",
        U_FRST: data.u_FRST || "",
        U_LAST: data.u_LAST || "",
        U_DESG: data.u_DESG || "",
        U_ReqName: data.u_ReqName || "",
        U_ABGT: data.u_ABGT || "",
        Location: data.location || "",
        Site: data.site || "",
        U_DocDate: data.u_DocDate?.split("T")[0] || "",
        U_ReqDate: data.u_ReqDate?.split("T")[0] || "",
        DocumentLines:
          data.documentLines?.map((l) => ({ ...emptyRow, ...l })) ||
          [emptyRow],
      },
    };
  };

  const [header, setHeader] = useState(mapData(prData));

  // ---------- HANDLERS ----------
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader((h) => ({ ...h, [name]: value }));
  };

  const handleRowChange = (i, e) => {
    if (isViewMode) return;
    const { name, value } = e.target;

    const rows = [...header.DocumentLines];
    rows[i][name] = value;

    setHeader((h) => ({ ...h, DocumentLines: rows }));
  };

  const addRow = () => {
    setHeader((h) => ({
      ...h,
      DocumentLines: [...h.DocumentLines, { ...emptyRow }],
    }));
  };

  const removeRow = (i) => {
    const rows = header.DocumentLines.filter((_, idx) => idx !== i);
    setHeader((h) => ({ ...h, DocumentLines: rows }));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanHeader = { ...header };
    delete cleanHeader.DocEntry;

    const payload = {
      ...cleanHeader,
      CreateDate: header.CreateDate ? new Date(header.CreateDate) : null,
      UpdateDate: header.UpdateDate ? new Date(header.UpdateDate) : null,
      U_DocDate: header.U_DocDate ? new Date(header.U_DocDate) : null,
      U_ReqDate: header.U_ReqDate ? new Date(header.U_ReqDate) : null,
      CreateTime: new Date().toTimeString().slice(0, 8),
      UpdateTime: new Date().toTimeString().slice(0, 8),
      U_ABGT: header.U_ABGT || "N/A",

      DocumentLines: header.DocumentLines.map((line, idx) => ({
        ...line,
        U_BREF: line.U_BREF || "N/A",
        U_QNTY: Number(line.U_QNTY),
        U_PRCE: Number(line.U_PRCE),
        U_TOTL: Number(line.U_TOTL),
        LineId: line.LineId || idx + 1,
      })),
    };

    try {
      console.log("Submitting:", payload);
      await axios.post("https://localhost:7183/api/PRForm", payload);
      alert("PR submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit.");
    }
  };

  // ---------------- UI ----------------
  return (
    <form onSubmit={handleSubmit} className="pr-form">
      <h2>
        Purchase Request {isViewMode && ` (DocEntry: ${header.DocEntry})`}
      </h2>

      {/* Header Fields */}
      <div className="header-section">
        {Object.entries({
          DocEntry: true,
          CreateDate: false,
          UpdateDate: false,
          Creator: false,
          Remark: false,
          U_ReqName: false,
          Location: false,
          Site: false,
          U_DocDate: false,
          U_ReqDate: false,
          U_DESG: false,
          U_BREF: false,
        }).map(([field, alwaysDisabled]) => (
          <div className="form-group" key={field}>
            <label>{field}</label>
            <input
              type={field.includes("Date") ? "date" : "text"}
              name={field}
              value={header[field]}
              disabled={alwaysDisabled || isViewMode}
              onChange={handleHeaderChange}
            />
          </div>
        ))}
      </div>

      {/* Items */}
      <h3>Items</h3>

      <div className="items-scroll">
        <div className="row-header">
          {[
            "Line ID",
            "Item Code",
            "Item Name",
            "Components",
            "Qty",
            "Price",
            "Total",
            "Justification",
            "Appr Budget",
            "Budget Ref",
            "Project",
            "Forwarded To",
            !isViewMode && "Action",
          ]
            .filter(Boolean)
            .map((h, i) => (
              <span key={i}>{h}</span>
            ))}
        </div>

        {header.DocumentLines.map((row, idx) => (
          <div className="row-item" key={idx}>
            <input value={idx + 1} disabled />

            {Object.keys(emptyRow).map(
              (field) =>
                field !== "LineId" && (
                  <input
                    key={field}
                    name={field}
                    value={row[field]}
                    onChange={(e) => handleRowChange(idx, e)}
                    disabled={isViewMode}
                  />
                )
            )}

            {!isViewMode && (
              <button type="button" onClick={() => removeRow(idx)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {!isViewMode && (
        <>
          <button type="button" onClick={addRow}>
            Add Item
          </button>
          <button type="submit">Submit Request</button>
        </>
      )}

      {isViewMode && (
        <div className="approval-actions">
          <button className="approve-btn">Approve</button>
          <button className="reject-btn">Reject</button>
        </div>
      )}
    </form>
  );
}
