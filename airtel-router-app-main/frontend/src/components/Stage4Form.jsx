import React, { useState } from "react";

const Stage4 = () => {
  const [form, setForm] = useState({
    serialNumber: "",
    boxNumber: "",
    entryDate: "",
    userName: ""
  });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setData([...data, form]);
    alert("Stage 4 Saved");
  };

  const handleClear = () => {
    setForm({
      serialNumber: "",
      boxNumber: "",
      entryDate: "",
      userName: ""
    });
  };

  return (
    <div className="invoice-bg">
      <div className="invoice-card">
        <h2 className="card-title">Stage 4 – Packing / Box</h2>

        <div className="form-grid">
          <label>Serial Number</label>
          <input name="serialNumber" value={form.serialNumber} onChange={handleChange} />

          <label>Box Number</label>
          <input name="boxNumber" value={form.boxNumber} onChange={handleChange} />

          <label>Entry Date</label>
          <input type="date" name="entryDate" value={form.entryDate} onChange={handleChange} />

          <label>User Name</label>
          <input name="userName" value={form.userName} onChange={handleChange} />
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
              <th>Box Number</th>
              <th>Entry Date</th>
              <th>User Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.serialNumber}</td>
                <td>{d.boxNumber}</td>
                <td>{d.entryDate}</td>
                <td>{d.userName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stage4;
