import { useState } from "react";
import { createInspection } from "../api";

const emptyForm = {
  aircraftReg: "",
  part: "",
  defectType: "",
  severity: "Low",
  inspector: "",
  notes: "",
};

// fixedReg: on the aircraft page the registration is filled in and locked
export default function InspectionForm({ fixedReg = "", onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  // POST /api/inspections
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createInspection({
        ...form,
        aircraftReg: (fixedReg || form.aircraftReg).trim().toUpperCase(),
      });
      setForm(emptyForm);
      onCreated?.();
    } catch {
      setError("Could not save the inspection. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert">{error}</div>}

      <div className="row">
        <label className="field">
          Aircraft reg *
          <input
            name="aircraftReg"
            value={fixedReg || form.aircraftReg}
            onChange={handleChange}
            placeholder="PH-ABC"
            disabled={Boolean(fixedReg)}
            required={!fixedReg}
          />
        </label>
        <label className="field">
          Severity
          <select name="severity" value={form.severity} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label className="field">
          Part *
          <input
            name="part"
            value={form.part}
            onChange={handleChange}
            placeholder="Left wing"
            required
          />
        </label>
        <label className="field">
          Defect type *
          <input
            name="defectType"
            value={form.defectType}
            onChange={handleChange}
            placeholder="Corrosion"
            required
          />
        </label>
      </div>

      <label className="field">
        Inspector
        <input
          name="inspector"
          value={form.inspector}
          onChange={handleChange}
          placeholder="Your name"
        />
      </label>

      <label className="field">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="What did you find?"
          rows={3}
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Add inspection"}
      </button>
    </form>
  );
}
