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

  useEffect(() => {
    if (!UIDNumber) {
      setDeviceDetails(null);
      setUidError("");
      return;
    }

    const fetchDeviceDetails = async () => {
      try {
        console.log("entered")
        setUidLoading(true);
        setUidError("");

        const res = await axios.get(
          `http://localhost:3000/device/${UIDNumber}`
        );

        console.log("response : " + res)

        if (res.data.success) {
          setDeviceDetails(res.data.data);
        }
      } catch (err) {
        setDeviceDetails(null);
        setUidError("UID not found in database");
      } finally {
        setUidLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [UIDNumber]);

  const openMiniForm = (type, fieldSetter = null) => {
    setMiniFormType(type);
    setActiveRepairField(() => fieldSetter);
    setMiniValue("");
    setShowMiniForm(true);
  };

  const saveMiniForm = () => {
    if (!miniValue) return;

    if (miniFormType === "defect") {
      setDefectList([...defectList, miniValue]);
      setDefectSymptom(miniValue);
    } else {
      setRepairList([...repairList, miniValue]);
      if (activeRepairField) activeRepairField(miniValue);
    }

    setShowMiniForm(false);
  };

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
        setMessage(`✅ ${res.data.message}`);
        handleClear();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to save data");
    }
  };

  /* ---------- CLEAR ---------- */
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

        {uidLoading && (
          <p style={{ marginTop: "10px", color: "yellow" }}>
            Fetching device details...
          </p>
        )}

        {uidError && (
          <p style={{ marginTop: "10px", color: "red" }}>{uidError}</p>
        )}
      </div>

      {/* DEVICE DETAILS */}
      {deviceDetails && (
        <div className="invoice-card">
          <h3 className="card-title">Device Details</h3>

          <div className="form-grid">
            <label>MAC Address :</label>
            <input value={deviceDetails.MACAddress} disabled />

            <label>GPON SN :</label>
            <input value={deviceDetails.GPONSN} disabled />

            <label>Serial Number :</label>
            <input value={deviceDetails.SerialNumber} disabled />

            <label>Model Number :</label>
            <input value={deviceDetails.modelNumber} disabled />
          </div>
        </div>
      )}

      {/* REPAIR DETAILS */}
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
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              className="btn-small"
              onClick={() => openMiniForm("defect")}
            >
              Add
            </button>
          </div>

          {renderRepairRow("Repair Content 01", repair01, setRepair01)}
          {renderRepairRow("Repair Content 02", repair02, setRepair02)}
          {renderRepairRow("Repair Content 03", repair03, setRepair03)}
          {renderRepairRow("Repair Content 04", repair04, setRepair04)}
          {renderRepairRow("Repair Content 05", repair05, setRepair05)}

          <label>Remark :</label>
          <input value={remark} onChange={(e) => setRemark(e.target.value)} />

          <label>Repair Engineer ID :</label>
          <input
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

      {/* MINI FORM MODAL */}
      {showMiniForm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: "400px" }}>
            <h3 style={{ marginBottom: "15px" }}>
              Add New {miniFormType === "defect" ? "Defect" : "Repair Item"}
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
