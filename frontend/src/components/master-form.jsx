import React, { useState } from "react";
import axios from "axios";

export default function MasterForm() {
  const [formData, setFormData] = useState({
    location: "",
    modelName: "",
    itemCode: "",
    invoiceNumber: "",
    MONumber: "",
    invoiceDate: "",
    shipmentDate: "",
    receivedDate: "",
    lotQty: "",
    invoiceQty: "",
  });

  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");

  const locations = ["Pune", "Mumbai", "Ahmedabad", "Hyderabad", "Delhi", "Indore", "Ahainai"];
  const models = ["PMG5617-R20B", "AOT5221Y"];

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Model-based item code logic
  if (name === "modelName") {
    if (value === "PMG5617-R20B") {
      setFormData({
        ...formData,
        modelName: value,
        itemCode: "CPE000451", // auto set
      });
      return;
    }

    if (value === "AOT5221Y") {
      setFormData({
        ...formData,
        modelName: value,
        itemCode: "", // user must select
      });
      return;
    }
  }

  setFormData({ ...formData, [name]: value });
};


  const handleInsert = async () => {
    try {
      // Send POST request to backend
      const res = await axios.post(
      "http://localhost:3000/admin/master-form",
      formData
    );

      if (res.data.success) {
        setMessage("✅ Data stored successfully!");
        setEntries([...entries, formData]);
        setFormData({
          location: "",
          modelName: "",
          itemCode: "",
          invoiceNumber: "",
          MONumber: "",
          invoiceDate: "",
          shipmentDate: "",
          receivedDate: "",
          lotQty: "",
          invoiceQty: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to store data!");
    }
  };

  const handleClear = () => {
    setFormData({
      location: "",
      modelName: "",
      itemCode: "",
      invoiceNumber: "",
      MONumber: "",
      invoiceDate: "",
      shipmentDate: "",
      receivedDate: "",
      lotQty: "",
      invoiceQty: "",
    });
    setMessage("");
  };

  return (
    <div className="invoice-bg">
      <div className="invoice-header">Dish Invoice Entry Stage</div>

      <div className="invoice-card">
        <h3 className="card-title">Invoice Entry (Master Module)</h3>

        <div className="form-grid">
          <label>Location :</label>
          <select name="location" value={formData.location} onChange={handleChange}>
            <option value="">- Select Location -</option>
            {locations.map((loc) => <option key={loc}>{loc}</option>)}
          </select>

          <label>Model Name :</label>
          <select name="modelName" value={formData.modelName} onChange={handleChange}>
            <option value="">- Select Model -</option>
            {models.map((mod) => <option key={mod}>{mod}</option>)}
          </select>

         <label>Item Code :</label> {/* PMG5617-R20B → Auto-filled */}
         {formData.modelName === "PMG5617-R20B" && (
          <input type="text" name="itemCode" value={formData.itemCode} readOnly />  )}
          {/* AOT5221Y → Dropdown */}
          {formData.modelName === "AOT5221Y" && (
            <select
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange} >
              <option value="">- Select Item Code -</option>
              <option value="BOHONTCI2">BOHONTCI2</option>
              <option value="BOHONTVD8">BOHONTVD8</option>
            </select>
          )}

          {/* No model selected */}
          {!formData.modelName && (
            <input
              type="text"
              disabled
              placeholder="Select model first"
            />
          )}


          <label>DC / Invoice No :</label>
          <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />

          <label>MO No :</label>
          <input type="text" name="MONumber" value={formData.MONumber} onChange={handleChange} />

          <label>DC Date :</label>
          <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} />

          <label>Shipment Date :</label>
          <input type="date" name="shipmentDate" value={formData.shipmentDate} onChange={handleChange} />

          <label>Received Date :</label>
          <input type="date" name="receivedDate" value={formData.receivedDate} onChange={handleChange} />

          <label>Lot Quantity :</label>
          <input type="number" name="lotQty" value={formData.lotQty} onChange={handleChange} />

          <label>DC / Invoice Quantity :</label>
          <input type="number" name="invoiceQty" value={formData.invoiceQty} onChange={handleChange} />
        </div>

        <div className="button-row">
          <button className="btn primary" onClick={handleInsert}>Insert</button>
          <button className="btn" onClick={handleClear}>Clear</button>
        </div>

        {message && <p style={{ color: message.includes("✅") ? "lightgreen" : "red", textAlign: "center" }}>{message}</p>}    
      </div>

      {/* Excel-like overview table */}
      {entries.length > 0 && (
        <div className="invoice-table">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Model Name</th>
                <th>Item Code</th>
                <th>Invoice Number</th>
                <th>MO Number</th>
                <th>DC Date</th>
                <th>Shipment Date</th>
                <th>Received Date</th>
                <th>Lot Qty</th>
                <th>Invoice Qty</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.location}</td>
                  <td>{e.modelName}</td>
                  <td>{e.itemCode}</td>
                  <td>{e.invoiceNumber}</td>
                  <td>{e.MONumber}</td>
                  <td>{e.invoiceDate}</td>
                  <td>{e.shipmentDate}</td>
                  <td>{e.receivedDate}</td>
                  <td>{e.lotQty}</td>
                  <td>{e.invoiceQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
