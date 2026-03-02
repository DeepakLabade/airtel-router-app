import { useState } from "react";
import "../App.css";   // Make sure CSS is imported

const Stage3Form = () => {
  const [formData, setFormData] = useState({
    modelNumber: "",
    serialNumber: "",
    macAddress: "",
    gponNumber: "",
    remark: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log(formData);
    alert("Stage 3 Data Saved");
  };

  const handleClear = () => {
    setFormData({
      modelNumber: "",
      serialNumber: "",
      macAddress: "",
      gponNumber: "",
      remark: "",
    });
  };

  return (
    <div className="invoice-bg" style={{ maxWidth: "1600px", margin: "auto" }}>
      
      {/* HEADER */}
      <div className="invoice-header">
        Device Entry – Stage 3
      </div>

      {/* MAIN CARD */}
      <div className="invoice-card">

        <h3 className="card-title">Device Label Details</h3>

        <div className="form-grid">

          <label>Model Number :</label>
          <input
            type="text"
            name="modelNumber"
            value={formData.modelNumber}
            onChange={handleChange}
          />

          <label>Serial Number :</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
          />

          <label>MAC Address :</label>
          <input
            type="text"
            name="macAddress"
            value={formData.macAddress}
            onChange={handleChange}
          />

          <label>GPON Number :</label>
          <input
            type="text"
            name="gponNumber"
            value={formData.gponNumber}
            onChange={handleChange}
          />

          <label>Remark :</label>
          <input
            type="text"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
          />

        </div>

        <div style={{ marginTop: 25 }}>
          <button className="btn" onClick={handleSave}>
            Save
          </button>

          <button
            className="btn"
            onClick={handleClear}
            style={{ marginLeft: 15, backgroundColor: "red" }}
          >
            Clear
          </button>
        </div>

      </div>
    </div>
  );
};

export default Stage3Form;
