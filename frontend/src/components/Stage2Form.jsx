import React, { useState } from "react";
import axios from "axios";

export default function Stage2Form() {
  const [UIDNumber, setUIDNumber] = useState("");

  const [defectList, setDefectList] = useState([
    "No Power",
    "LED Issue",
    "Network Issue",
  ]);
  const [repairList, setRepairList] = useState([
    "Component Replacement",
    "Firmware Update",
    "Connector Fix",
  ]);

  const [Defect_symptom, setDefectSymptom] = useState("");
  const [repair_contents, setRepairContents] = useState("");

  const [remark, setRemark] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [message, setMessage] = useState("");

  // Mini form state
  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniFormType, setMiniFormType] = useState(""); // "defect" | "repair"
  const [miniValue, setMiniValue] = useState("");

  /* -------- OPEN MINI FORM -------- */
  const openMiniForm = (type) => {
    setMiniFormType(type);
    setMiniValue("");
    setShowMiniForm(true);
  };

  /* -------- SAVE MINI FORM -------- */
  const saveMiniForm = () => {
    if (!miniValue) return;

    if (miniFormType === "defect") {
      setDefectList([...defectList, miniValue]);
      setDefectSymptom(miniValue);
    } else {
      setRepairList([...repairList, miniValue]);
      setRepairContents(miniValue);
    }

    setShowMiniForm(false);
  };

  /* -------- SAVE STAGE 2 -------- */
  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:3000/stage-02", {
        UIDNumber,
        Defect_symptom,
        repair_contents,
        // remark,
        // engineerId,
      });

      if (res.data.success) {
        setMessage(`✅ ${res.data.message}`);
        handleClear();
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || " Failed to save data"
      );
    }
  };

  /* -------- CLEAR -------- */
  const handleClear = () => {
    setUIDNumber("");
    setDefectSymptom("");
    setRepairContents("");
    setRemark("");
    setEngineerId("");
    setMessage("");
  };

  return (
    <div className="invoice-bg">
      <div className="invoice-header">Airtel Rework – Stage 2</div>

      {/* UID SCAN */}
      <div className="invoice-card" style={{ marginBottom: "25px" }}>
        <h3 className="card-title">Scan UID</h3>
        <input
          type="text"
          value={UIDNumber}
          onChange={(e) => setUIDNumber(e.target.value)}
          placeholder="Scan UID here"
          style={{ width: "95%", fontSize: "18px", height: "30px" }}
        />
      </div>

      {/*  REPAIR DETAILS */}
      <div className="invoice-card">
        <h3 className="card-title">Repair Details</h3>

        <div className="form-grid">
          <label>Defect Symptom :</label>
          <div className="inline">
            <select
              value={Defect_symptom}
              onChange={(e) => setDefectSymptom(e.target.value)}
            >
              <option value="">Select</option>
              {defectList.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>
            <button
              className="btn-small"
              onClick={() => openMiniForm("defect")}
            >
              Add
            </button>
          </div>

          <label>Repair Contents :</label>
          <div className="inline">
            <select
              value={repair_contents}
              onChange={(e) => setRepairContents(e.target.value)}
            >
              <option value="">Select</option>
              {repairList.map((r, i) => (
                <option key={i}>{r}</option>
              ))}
            </select>
            <button
              className="btn-small"
              onClick={() => openMiniForm("repair")}
            >
              Add
            </button>
          </div>

          <label>Remark :</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <label>Repair Engineer ID :</label>
          <input
            type="text"
            value={engineerId}
            onChange={(e) => setEngineerId(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button className="btn primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn danger" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {/* MINI POPUP FORM */}
      {showMiniForm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: "400px" }}>
            <h3 style={{ marginBottom: "15px" }}>
              Add New {miniFormType === "defect" ? "Defect" : "Repair"}
            </h3>

            <input
              type="text"
              value={miniValue}
              onChange={(e) => setMiniValue(e.target.value)}
              placeholder={`Enter new ${miniFormType}`}
              style={{ width: "100%", fontSize: "18px" }}
              autoFocus
            />

            <div className="button-row" style={{ marginTop: "20px" }}>
              <button className="btn primary" onClick={saveMiniForm}>
                Save
              </button>
              <button
                className="btn danger"
                onClick={() => setShowMiniForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: message.includes("✅") ? "lightgreen" : "red",
            fontSize: "18px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
