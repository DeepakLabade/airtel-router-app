import React, { useState } from "react";

const Stage5 = () => {
  const [form, setForm] = useState({
    serialNumber: "",
    chipId: "",
    uidDishTv: "",
    entryDate: "",
    finalStatus: ""
  });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setData([...data, form]);
    alert("Stage 5 Saved");
  };

  const handleClear = () => {
    setForm({
      serialNumber: "",
      chipId: "",
      uidDishTv: "",
      entryDate: "",
      finalStatus: ""
    });
  };

  return (
    <div className="invoice-bg">
      <div className="invoice-card">
        <h2 className="card-title">Stage 5 – Multipack / BSR</h2>

        <div className="form-grid">
          <label>Serial Number</label>
          <input name="serialNumber" value={form.serialNumber} onChange={handleChange} />

          <label>Chip ID</label>
          <input name="chipId" value={form.chipId} onChange={handleChange} />

          <label>UID Dish TV</label>
          <input name="uidDishTv" value={form.uidDishTv} onChange={handleChange} />

          <label>Entry Date</label>
          <input type="date" name="entryDate" value={form.entryDate} onChange={handleChange} />

          <label>Final Status</label>
          <select name="finalStatus" value={form.finalStatus} onChange={handleChange}>
            <option value="">Select</option>
            <option>Pass</option>
            <option>Fail</option>
          </select>
        </div>

        <div className="button-row">
          <button className="btn primary" onClick={handleSave}>Save</button>
          <button className="btn danger" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="invoice-table">
        <table>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Chip ID</th>
              <th>UID Dish TV</th>
              <th>Entry Date</th>
              <th>Final Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.serialNumber}</td>
                <td>{d.chipId}</td>
                <td>{d.uidDishTv}</td>
                <td>{d.entryDate}</td>
                <td>{d.finalStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stage5;
