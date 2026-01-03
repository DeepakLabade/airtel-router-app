import { useState } from "react";

export default function InvoiceEntry() {
  const [models, setModels] = useState([
    "PMG5617-R20B",
    "AOT5221Y",
    "BOHONTC12",
  ]);

  const [formData, setFormData] = useState({
    location: "",
    model: "",
    itemCode: "",
    invoiceNo: "",
    supplierName: "",
    moNo: "",
    dcDate: "",
    shipmentDate: "",
    receivedDate: "",
    lotQty: "",
    invoiceQty: "",
  });

  const [rows, setRows] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addModel = () => {
    const newModel = prompt("Enter new model name");
    if (newModel) setModels([...models, newModel]);
  };

  const handleInsert = () => {
    setRows([...rows, formData]);
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      location: "",
      model: "",
      itemCode: "",
      invoiceNo: "",
      supplierName: "",
      moNo: "",
      dcDate: "",
      shipmentDate: "",
      receivedDate: "",
      lotQty: "",
      invoiceQty: "",
    });
  };

  const handleExit = () => {
    setRows([]);
  };

  return (
    <div className="invoice-bg">

      <div className="invoice-header">
        Dish Invoice Entry Stage
      </div>

      <div className="invoice-wrapper">

        <div className="invoice-card">
          <h3 className="card-title">Invoice Entry (Master Module)</h3>

          <div className="form-grid">

            <label>Location :</label>
            <select name="location" value={formData.location} onChange={handleChange}>
              <option>- Select Location -</option>
              <option>Pune</option>
              <option>Mumbai</option>
              <option>Ahmedabad</option>
              <option>Hyderabad</option>
              <option>Delhi</option>
              <option>Indore</option>
              <option>Chennai</option>
            </select>

            <label>Model Name :</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select name="model" value={formData.model} onChange={handleChange}>
                <option>- Select Model -</option>
                {models.map((m, i) => (
                  <option key={i}>{m}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={addModel}>+</button>
            </div>

            <label>Item Code :</label>
            <input name="itemCode" value={formData.itemCode} onChange={handleChange} />

            <label>Supplier Name :</label>
            <input name="supplierName" value={formData.supplierName} onChange={handleChange} />

            <label>DC / Invoice No :</label>
            <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />

            <label>MO No :</label>
            <input name="moNo" value={formData.moNo} onChange={handleChange} />

            <label>DC Date :</label>
            <input type="date" name="dcDate" value={formData.dcDate} onChange={handleChange} />

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
            <button className="btn danger" onClick={handleExit}>Exit</button>
          </div>
        </div>

      </div>

      {rows.length > 0 && (
        <div className="invoice-table">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Location</th>
                <th>Model</th>
                <th>Item Code</th>
                <th>Supplier</th>
                <th>Invoice No</th>
                <th>MO No</th>
                <th>Lot Qty</th>
                <th>Invoice Qty</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.location}</td>
                  <td>{r.model}</td>
                  <td>{r.itemCode}</td>
                  <td>{r.supplierName}</td>
                  <td>{r.invoiceNo}</td>
                  <td>{r.moNo}</td>
                  <td>{r.lotQty}</td>
                  <td>{r.invoiceQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
