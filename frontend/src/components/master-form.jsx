import { useState } from "react";
import InputField from "./input-field.jsx";

function MasterForm() {
  const locationModels = {
    Hyderabad: [
      { name: "Model A", qty: 3 },
      { name: "Model B", qty: 5 },
    ],
    Mumbai: [
      { name: "Model C", qty: 2 },
      { name: "Model D", qty: 4 },
    ],
    Pune: [
      { name: "Model E", qty: 1 },
      { name: "Model F", qty: 6 },
    ],
  };

  const [location, setLocation] = useState("");
  const [model, setModel] = useState("");
  const [quantity, setQuantity] = useState("");

  // When model changes, auto-fill quantity
  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);

      
    const modelData = locationModels[location]?.find(
      (m) => m.name === selectedModel
    );

    setQuantity(modelData ? modelData.qty : "");
  };

  return (
    <div className="invoice-card">
      {/* Location & Model */}
      <div className="form-row">
        <div className="form-group">
          <label>Select Location</label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setModel("");
              setQuantity("");
            }}
          >
            <option value="">Select Location</option>
            {Object.keys(locationModels).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Model</label>
          <select
            value={model}
            onChange={handleModelChange}
            disabled={!location}
          >
            <option value="">Select Model</option>
            {location &&
              locationModels[location].map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <InputField label="Invoice Date" type="date" />
      <InputField label="Supplier Name" placeholder="Enter supplier name" />
      <InputField label="Invoice Number" placeholder="Enter invoice number" />
      <InputField label="MO Number" placeholder="Enter MO number" />
      <InputField label="Lot Number" placeholder="Enter lot number" />

      {/* Auto-filled Quantity */}
      <div className="form-group">
        <label>Invoice Quantity</label>
        <input type="number" value={quantity} readOnly />
      </div>

      <div className="button-group">
        <button className="btn primary">Insert</button>
        <button
          className="btn secondary"
          onClick={() => {
            setLocation("");
            setModel("");
            setQuantity("");
          }}
        >
          Clear
        </button>
        <button className="btn danger">Exit</button>
      </div>
    </div>
  );
}

export default MasterForm;
