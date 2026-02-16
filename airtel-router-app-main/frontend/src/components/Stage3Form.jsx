import React, { useState } from "react";
import axios from "axios";

const Stage3 = () => {

  const emptyForm = {
    SerialNumber: "",
    ChipID: "",
    UIDDishTV: "",
    Location: "",
    UserName: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // VALIDATION
  const validate = () => {
    if (!form.SerialNumber.trim()) return "Serial Number required";
    if (!form.ChipID.trim()) return "Chip ID required";
    if (!form.UserName.trim()) return "User Name required";
    return null;
  };

  // SAVE
  const handleSave = async () => {

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        entryDate: new Date().toISOString()
      };

      const res = await axios.post(
        "http://localhost:3000/stage-03",
        payload
      );

      if (res.data?.success === false) {
        alert(res.data.message || "Save failed");
        return;
      }

      // Update table
      setTableData(prev => [...prev, payload]);

      alert("Saved Successfully ✅");

      setForm(emptyForm);

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Server error while saving ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  // CLEAR
  const handleClear = () => setForm(emptyForm);

  return (
    <div className="invoice-bg">

      <div className="invoice-header">
        Airtel Rework – Stage 3 (VPOT)
      </div>

      <div className="invoice-card">
        <h3>VPOT Details</h3>

        <div className="form-grid">

          <label>Serial Number</label>
          <input name="SerialNumber" value={form.SerialNumber} onChange={handleChange} />

          <label>Chip ID</label>
          <input name="ChipID" value={form.ChipID} onChange={handleChange} />

          <label>UID Dish TV</label>
          <input name="UIDDishTV" value={form.UIDDishTV} onChange={handleChange} />

          <label>Location</label>
          <input name="Location" value={form.Location} onChange={handleChange} />

          <label>User Name</label>
          <input name="UserName" value={form.UserName} onChange={handleChange} />

        </div>

        <div className="button-row">
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            className="btn danger"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="invoice-table">
        <table>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Chip</th>
              <th>UID</th>
              <th>Location</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td>{row.SerialNumber}</td>
                <td>{row.ChipID}</td>
                <td>{row.UIDDishTV}</td>
                <td>{row.Location}</td>
                <td>{row.UserName}</td>
                <td>{new Date(row.entryDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Stage3;
