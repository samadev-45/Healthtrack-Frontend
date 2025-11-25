// src/components/AddEditPrescriptionItem.jsx
import React, { useEffect, useState } from "react";

export default function AddEditPrescriptionItem({ open, onClose, onSave, item }) {
  const [medicine, setMedicine] = useState("");
  const [strength, setStrength] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [route, setRoute] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMedicine(item?.medicine ?? item?.Medicine ?? "");
      setStrength(item?.strength ?? item?.Strength ?? "");
      setDose(item?.dose ?? item?.Dose ?? "");
      setFrequency(item?.frequency ?? item?.Frequency ?? "");
      setDurationDays(String(item?.durationDays ?? item?.DurationDays ?? ""));
      setRoute(item?.route ?? item?.Route ?? "");
      setNotes(item?.notes ?? item?.Notes ?? "");
    }
  }, [open, item]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    const dto = {
      medicine: medicine.trim(),
      strength: strength.trim() || null,
      dose: dose.trim() || null,
      frequency: frequency.trim() || null,
      durationDays: durationDays ? Number(durationDays) : null,
      route: route.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      setSaving(true);
      await onSave(dto);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="w-full max-w-lg bg-white p-5 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{item ? "Edit Medication" : "Add Medication"}</h3>
          <button type="button" onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <label className="block text-sm text-gray-600">Medicine</label>
        <input required value={medicine} onChange={(e) => setMedicine(e.target.value)} className="w-full p-2 border rounded mb-3" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Strength</label>
            <input value={strength} onChange={(e) => setStrength(e.target.value)} className="w-full p-2 border rounded mb-3" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Dose</label>
            <input value={dose} onChange={(e) => setDose(e.target.value)} className="w-full p-2 border rounded mb-3" />
          </div>
        </div>

        <label className="block text-sm text-gray-600">Frequency</label>
        <input value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2 border rounded mb-3" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Duration (days)</label>
            <input type="number" min="0" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="w-full p-2 border rounded mb-3" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Route</label>
            <input value={route} onChange={(e) => setRoute(e.target.value)} className="w-full p-2 border rounded mb-3" />
          </div>
        </div>

        <label className="block text-sm text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded mb-3" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">
            {saving ? "Saving..." : item ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
