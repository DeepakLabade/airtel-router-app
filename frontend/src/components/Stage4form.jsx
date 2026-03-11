import { useState } from "react";
import "../App.css";

const Stage4Form = () => {
  const [modelNo, setModelNo] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [gponNo, setGponNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api";

  /* ===============================
     🔎 SEARCH BY GPON NUMBER
  ================================== */
  const handleSearch = async () => {
    if (!gponNo) {
      alert("Enter GPON Number first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/stage4/${gponNo}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        setModelNo(data.data.modelNo);
        setMacAddress(data.data.macAddress);
        setMessage("Device Verified ✅");
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };


  /* ===============================
     🖨 PRINT LABEL
  ================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modelNo || !macAddress || !gponNo) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/print-stage4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelNo,
          macAddress,
          gponNo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        setMessage("Gift Box Label Printed Successfully ✅");
        setModelNo("");
        setMacAddress("");
        setGponNo("");
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-bg" style={{ maxWidth: "1600px", margin: "auto" }}>
      
      <div className="invoice-header">
        Device Entry – Stage 4
      </div>

      <div className="invoice-card">

        <h3 className="card-title">
          Stage 04 - Print Gift Box Label
        </h3>

        {/* 🔎 GPON SEARCH */}
        <div className="form-grid">
          <label>GPON Number :</label>
          <input
            type="text"
            value={gponNo}
            onChange={(e) => setGponNo(e.target.value)}
          />

          <button
            type="button"
            className="btn"
            onClick={handleSearch}
          >
            {loading ? "Searching..." : "Verify"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <label>Model Number :</label>
            <input
              type="text"
              value={modelNo}
              readOnly
            />

            <label>MAC Address :</label>
            <input
              type="text"
              value={macAddress}
              readOnly
            />

          </div>

          <div style={{ marginTop: "20px" }}>
            <button className="btn" type="submit">
              {loading ? "Printing..." : "Print Label"}
            </button>
          </div>

        </form>

        {message && (
          <p style={{ color: "lightgreen", marginTop: "15px" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default Stage4Form;
