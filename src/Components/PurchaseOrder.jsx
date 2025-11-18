import React, { useState } from "react";
import "./PurchaseOrder.css";
export default function RequisitionForm() {
  const [items, setItems] = useState([
    {
      description: "Laptop",
      specification: "Intel i7, 16GB RAM",
      qty: 2,
      approxCost: 1200,
      justification: "New hires",
    },
    {
      description: "Office Chair",
      specification: "Ergonomic, Black",
      qty: 5,
      approxCost: 500,
      justification: "Replacement",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        specification: "",
        qty: 1,
        approxCost: 0,
        justification: "",
      },
    ]);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "qty" || field === "approxCost" ? Number(value) : value;
    setItems(updatedItems);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">📝 Requisition Form</h2>

      {/* Section 1: Requester Info */}
      <div className="card section-card">
        <h3 className="section-title">Requester Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input type="text" placeholder="Enter Name" />
          </div>
          <div className="form-field">
            <label>Designation</label>
            <input type="text" placeholder="Enter Designation" />
          </div>
          <div className="form-field">
            <label>Location</label>
            <input type="text" placeholder="Enter Location" />
          </div>
          <div className="form-field">
            <label>Field Office Address</label>
            <input type="text" placeholder="Enter Address" />
          </div>
          <div className="form-field">
            <label>Date of Requisition</label>
            <input type="date" />
          </div>
          <div className="form-field">
            <label>Required Date</label>
            <input type="date" />
          </div>
        </div>
      </div>

      {/* Section 2: Item Table */}
      <div className="card section-card">
        <h3 className="section-title">Item Details</h3>
        <div className="table-container">
          <div className="table-header">
            <div>Description</div>
            <div>Complete Specification</div>
            <div>Quantity</div>
            <div>Approx Total Cost</div>
            <div>Justification</div>
            <div>Action</div>
          </div>
          {items.map((item, index) => (
            <div className="table-row" key={index}>
              <div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  placeholder="Description"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={item.specification}
                  onChange={(e) =>
                    handleChange(index, "specification", e.target.value)
                  }
                  placeholder="Specification"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleChange(index, "qty", e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={item.approxCost}
                  onChange={(e) =>
                    handleChange(index, "approxCost", e.target.value)
                  }
                  min="0"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={item.justification}
                  onChange={(e) =>
                    handleChange(index, "justification", e.target.value)
                  }
                  placeholder="Justification"
                />
              </div>
              <div className="action-cell">
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(index)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-btn" onClick={addItem}>
          ➕ Add New Item
        </button>
      </div>

      {/* Section 3: Approval Info */}
      <div className="card section-card">
        <h3 className="section-title">Approval Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Requested By</label>
            <input type="text" />
          </div>
          <div className="form-field">
            <label>Requested Date</label>
            <input type="date" />
          </div>
          <div className="form-field">
            <label>Verified By</label>
            <input type="text" />
          </div>
          <div className="form-field">
            <label>Verified Date</label>
            <input type="date" />
          </div>
          <div className="form-field">
            <label>Reviewed By</label>
            <input type="text" />
          </div>
          <div className="form-field">
            <label>Reviewed Date</label>
            <input type="date" />
          </div>
        </div>
      </div>
    </div>
  );
}
