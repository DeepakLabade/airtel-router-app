import React, { useState } from "react";
import axios from "axios";

export default function Stage1Form() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    location: "",
    invoiceNumber: "",
    modelNumber: "",
    MACAddress: "",
    GPONSN: "",
    SerialNumber: "",
  });

  const [scanInput, setScanInput] = useState("");
  const [UIDNumber, setUIDNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const locations = ["Pune", "Mumbai", "Ahmedabad", "Hyderabad"];
  const models = ["PMG5617-R20B", "AOT5221Y", "BOHONTC12"];

  /* ---------------- HANDLE SCAN ---------------- */
  const handleScanSubmit = async (e) => {
    if (e.key !== "Enter") return;

    if (step === 1) {
      setFormData((p) => ({ ...p, MACAddress: scanInput }));
      setStep(2);
      setScanInput("");
      return;
    }

    if (step === 2) {
      setFormData((p) => ({ ...p, GPONSN: scanInput }));
      setStep(3);
      setScanInput("");
      return;
    }

    if (step === 3) {
      const updatedData = {
        ...formData,
        SerialNumber: scanInput,
      };

      setFormData(updatedData);
      setStep(4);
      setScanInput("");

  
      await generateUID(updatedData);
    }
  };

  /* calling backend */
  const generateUID = async (payload) => {
    try {
      setLoading(true);

      console.log(" Sending Stage-01:", payload);

      const res = await axios.post(
        "http://localhost:3000/stage-01",
        payload
      );

      console.log(" Stage-01 response:", res.data);

      if (res.data.success) {
        setUIDNumber(res.data.UIDNumber);
        setMessage(" UID generated successfully");
      }
    } catch (err) {
      console.error(" UID error:", err);
      setMessage(
        err.response?.data?.message || " Failed to generate UID"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      location: "",
      invoiceNumber: "",
      modelNumber: "",
      MACAddress: "",
      GPONSN: "",
      SerialNumber: "",
    });
    setScanInput("");
    setUIDNumber("");
    setMessage("");
    setStep(1);
  };

  return (
    <div
      className="invoice-bg"
      style={{ maxWidth: "1600px", margin: "auto", fontSize: "18px" }}
    >
      <div className="invoice-header">Device Entry – Stage 1</div>

      {/* TOP BOX */}
      <div className="invoice-card" style={{ position: "relative" }}>
        <button
          className="btn"
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          Test Print
        </button>

        <h3 className="card-title">Master Details</h3>

        <div className="form-grid">
          <label>Location :</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          >
            <option value="">Select</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <label>Invoice No :</label>
          <input
            onChange={(e) =>
              setFormData({ ...formData, invoiceNumber: e.target.value })
            }
          />

          <label>Model :</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, modelNumber: e.target.value })
            }
          >
            <option value="">Select</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MIDDLE BOX */}
      <div className="invoice-card" style={{ marginTop: 25 }}>
        <h3 className="card-title">
          {step === 1 && "Scan MAC Address"}
          {step === 2 && "Scan GPON SN"}
          {step === 3 && "Scan Serial Number"}
          {step === 4 && "UID Generated"}
        </h3>

        {step !== 4 ? (
          <input
            autoFocus
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={handleScanSubmit}
            placeholder="Scan here..."
            style={{ width: "95%", fontSize: 18 }}
          />
        ) : (
          <h2 style={{ color: "lightgreen" }}>
            UID : {UIDNumber}
          </h2>
        )}

        {loading && <p style={{ color: "yellow" }}>Generating UID...</p>}
      </div>

      {/* BOTTOM BOX */}
      <div className="invoice-card" style={{ marginTop: 25 }}>
        <h3 className="card-title">Scanned Details</h3>

        <div className="form-grid">
          <label>MAC Address :</label>
          <input value={formData.MACAddress} readOnly />

          <label>GPON SN :</label>
          <input value={formData.GPONSN} readOnly />

          <label>Serial Number :</label>
          <input value={formData.SerialNumber} readOnly />

          <label>UID :</label>
          <input value={UIDNumber} readOnly />
        </div>
      </div>

      {message && (
        <p style={{ textAlign: "center", color: "lightgreen" }}>
          {message}
        </p>
      )}
    </div>
  );
}
