import React, { useEffect, useState } from "react";
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

  const [repair01, setRepair01] = useState("");
  const [repair02, setRepair02] = useState("");
  const [repair03, setRepair03] = useState("");
  const [repair04, setRepair04] = useState("");
  const [repair05, setRepair05] = useState("");

  const [remark, setRemark] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [message, setMessage] = useState("");

  const [deviceDetails, setDeviceDetails] = useState(null);
  const [uidLoading, setUidLoading] = useState(false);
  const [uidError, setUidError] = useState("");

  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniFormType, setMiniFormType] = useState("");
  const [activeRepairField, setActiveRepairField] = useState(null);
  const [miniValue, setMiniValue] = useState("");

  /* ---------------- FETCH DEVICE DETAILS ---------------- */
  useEffect(() => {
    if (!UIDNumber) {
      setDeviceDetails(null);
      setUidError("");
      return;
    }

    const fetchDeviceDetails = async () => {
      try {
        setUidLoading(true);
        const res = await axios.get(
          `http://localhost:3000/device/${UIDNumber}`
        );

        if (res.data.success) {
          setDeviceDetails(res.data.data);
        }
      } catch {
        setDeviceDetails(null);
        setUidError("UID not found in database");
      } finally {
        setUidLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [UIDNumber]);

  /* ---------------- MINI FORM ---------------- */
  const openMiniForm = (type, setter = null) => {
    setMiniFormType(type);
    setActiveRepairField(() => setter);
    setMiniValue("");
    setShowMiniForm(true);
  };

  const saveMiniForm = () => {
    if (!miniValue) return;

    if (miniFormType === "defect") {
      setDefectList((p) => [...p, miniValue]);
      setDefectSymptom(miniValue);
    } else {
      setRepairList((p) => [...p, miniValue]);
      activeRepairField && activeRepairField(miniValue);
    }

    setShowMiniForm(false);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!deviceDetails) {
      setMessage("❌ Please scan a valid UID first");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/stage-02", {
        UIDNumber,
        Defect_symptom,
        repair_contents_01: repair01,
        repair_contents_02: repair02,
        repair_contents_03: repair03,
        repair_contents_04: repair04,
        repair_contents_05: repair05,
      });

      if (res.data.success) {
        setMessage("✅ Stage 2 data saved successfully");
        handleClear();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Save failed");
    }
  };

  /* ---------------- CLEAR ---------------- */
  const handleClear = () => {
    setUIDNumber("");
    setDeviceDetails(null);
    setDefectSymptom("");
    setRepair01("");
    setRepair02("");
    setRepair03("");
    setRepair04("");
    setRepair05("");
    setRemark("");
    setEngineerId("");
    setMessage("");
    setUidError("");
  };

  const renderRepairRow = (label, value, setter) => (
    <>
      <label>{label} :</label>
      <div className="inline">
        <select value={value} onChange={(e) => setter(e.target.value)}>
          <option value="">Select</option>
          {repairList.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          className="btn-small"
          onClick={() => openMiniForm("repair", setter)}
        >
          Add
        </button>
      </div>
    </>
  );

  return (
    <div className="invoice-bg">
      <div className="invoice-header">Airtel Rework – Stage 2</div>

      {/* UID */}
      <div className="invoice-card">
        <h3>Scan UID</h3>
        <input
          value={UIDNumber}
          onChange={(e) => setUIDNumber(e.target.value)}
          placeholder="Scan UID here"
        />
        {uidLoading && <p>Fetching device details...</p>}
        {uidError && <p style={{ color: "red" }}>{uidError}</p>}
      </div>

      {/* DEVICE DETAILS */}
      {deviceDetails && (
        <div className="invoice-card">
          <h3>Device Details</h3>
          <div className="form-grid">
            <label>MAC :</label>
            <input value={deviceDetails.MACAddress} disabled />
            <label>GPON :</label>
            <input value={deviceDetails.GPONSN} disabled />
            <label>Serial :</label>
            <input value={deviceDetails.SerialNumber} disabled />
            <label>Model :</label>
            <input value={deviceDetails.modelNumber} disabled />
          </div>
        </div>
      )}

      {/* REPAIR */}
      <div className="invoice-card">
        <h3>Repair Details</h3>
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
            <button onClick={() => openMiniForm("defect")}>Add</button>
          </div>

          {renderRepairRow("Repair Content 01", repair01, setRepair01)}
          {renderRepairRow("Repair Content 02", repair02, setRepair02)}
          {renderRepairRow("Repair Content 03", repair03, setRepair03)}
          {renderRepairRow("Repair Content 04", repair04, setRepair04)}
          {renderRepairRow("Repair Content 05", repair05, setRepair05)}
        </div>

        <div className="button-row">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      {/* MINI MODAL */}
      {showMiniForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New {miniFormType}</h3>
            <input
              value={miniValue}
              onChange={(e) => setMiniValue(e.target.value)}
              autoFocus
            />
            <button onClick={saveMiniForm}>Save</button>
            <button onClick={() => setShowMiniForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
}
