import { useState } from "react";

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
    <div className="stage-container">
      
      {/* Header */}
      <div className="stage-header">
        Airtel Rework – Stage 3
      </div>

      {/* Main Card */}
      <div className="stage-card">

        <h3>Device Label Details</h3>

        <div className="form-group">
          <label>Model Number :</label>
          <input
            type="text"
            name="modelNumber"
            placeholder="Enter Model Number"
            value={formData.modelNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Serial Number :</label>
          <input
            type="text"
            name="serialNumber"
            placeholder="Enter Serial Number"
            value={formData.serialNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>MAC Address :</label>
          <input
            type="text"
            name="macAddress"
            placeholder="Enter MAC Address"
            value={formData.macAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>GPON Number :</label>
          <input
            type="text"
            name="gponNumber"
            placeholder="Enter GPON Number"
            value={formData.gponNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Remark :</label>
          <input
            type="text"
            name="remark"
            placeholder="Enter Remark"
            value={formData.remark}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
          
        </div>

      </div>
    </div>
  );
};

export default Stage3Form;