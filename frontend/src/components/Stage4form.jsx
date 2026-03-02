import { useState } from "react";

const Stage4Form = () => {
  const [formData, setFormData] = useState({
    modelNo: "",
    macAddress: "",
    gponNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { modelNo, macAddress, gponNo } = formData;

    if (!modelNo || !macAddress || !gponNo) {
      setError("All fields are required");
      return false;
    }

    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (!macRegex.test(macAddress)) {
      setError("Invalid MAC Address format (AA:BB:CC:DD:EE:FF)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/stage4/print`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Printing failed");
      }

      setMessage(data.message);

      // Clear form after success
      setFormData({
        modelNo: "",
        macAddress: "",
        gponNo: "",
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Stage 04 - Print Gift Box Label</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          name="modelNo"
          placeholder="Model Number"
          value={formData.modelNo}
          onChange={handleChange}
        />

        <input
          type="text"
          name="macAddress"
          placeholder="MAC Address (AA:BB:CC:DD:EE:FF)"
          value={formData.macAddress}
          onChange={handleChange}
        />

        <input
          type="text"
          name="gponNo"
          placeholder="GPON Number"
          value={formData.gponNo}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Printing..." : "Print Label"}
        </button>

      </form>

      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
};

export default Stage4Form;