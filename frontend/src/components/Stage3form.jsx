import { useState } from "react";
import axios from "axios";
import "../App.css";

const Stage3Form = () => {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    modelNumber: "",
    serialNumber: "",
    macAddress: "",
    gponNumber: "",
    remark: "",
  });

  const API_URL = "http://localhost:3000";

  /* ---------------- SEARCH BY UID ---------------- */
  const handleSearch = async () => {
    if (!uid) {
      alert("Please enter UID");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/stage3/${uid}`);

      if (res.data.success) {
        setFormData({
          modelNumber: res.data.data.modelNumber,
          serialNumber: res.data.data.serialNumber,
          macAddress: res.data.data.macAddress,
          gponNumber: res.data.data.gponNumber,
          remark: "",
        });
        setMessage("Data fetched successfully ✅");
      }

    } catch (error) {
      alert(error.response?.data?.message || "UID not found");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- SAVE UPDATED DATA ---------------- */
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/stage3/update`, {
        uid,
        ...formData,
      });

      if (res.data.success) {
        setMessage("Stage 3 Data Saved Successfully ✅");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUid("");
    setFormData({
      modelNumber: "",
      serialNumber: "",
      macAddress: "",
      gponNumber: "",
      remark: "",
    });
    setMessage("");
  };

  return (
    <div className="invoice-bg" style={{ maxWidth: "1600px", margin: "auto" }}>

      <div className="invoice-header">
        Device Entry – Stage 3
      </div>

      <div className="invoice-card">

        <h3 className="card-title">Search by UID</h3>

        <div className="form-grid">
          <label>UID :</label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <button className="btn" onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

      </div>

      <div className="invoice-card" style={{ marginTop: 25 }}>

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

        {message && (
          <p style={{ marginTop: 15, color: "lightgreen" }}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
};

export default Stage3Form;
