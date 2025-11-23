import React, { useState, useEffect } from "react";
import {
  getDoctors,
  getDoctorAvailability,
} from "../../../api/doctor";
import toast from "react-hot-toast";
export default function CreateAppointmentModal({ open, onClose, onConfirm }) {
  const [doctors, setDoctors] = useState([]);

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [hospital, setHospital] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (open) {
      resetForm();
      loadDoctors();
    }
  }, [open]);

  const resetForm = () => {
    setDoctorId("");
    setDate("");
    setTimeSlot("");
    setHospital("");
    setLocation("");
    setNotes("");
    setSlots([]);
  };

  const loadDoctors = async () => {
    try {
      const list = await getDoctors();
      setDoctors(list);
    } catch (err) {
      console.error(err);
      alert("Failed to load doctors");
    }
  };

  // Load available slots when doctor + date change
  useEffect(() => {
    if (doctorId && date) loadDoctorSlots();
  }, [doctorId, date]);

  const loadDoctorSlots = async () => {
    try {
      const data = await getDoctorAvailability(doctorId, date);

      setHospital(data.hospital ?? "");
      setLocation(data.location ?? "");
      setSlots(data.slots ?? []);
    } catch (err) {
      console.error(err);
      alert("Failed to load availability");
    }
  };

 const handleSubmit = () => {
  const errors = [];

  if (!doctorId) errors.push("Doctor field is required.");
  if (!date) errors.push("Appointment date is required.");
  if (!timeSlot) errors.push("Appointment time is required.");

  if (errors.length > 0) {
    toast.error(errors.join("\n"));   // Or use toast.error()
    return;
  }

  const payload = {
    DoctorId: Number(doctorId),
    AppointmentDate: date,
    AppointmentTime: timeSlot.length === 5 ? timeSlot + ":00" : timeSlot,
    PatientNotes: notes,
    Hospital: hospital,
    Location: location,
  };

  console.log("Sending Payload:", payload);

  onConfirm(payload);
};




  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Schedule New Appointment</h3>

        {/* Doctor Select */}
        <label className="block text-sm mb-1 font-medium">Select Doctor</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            setSlots([]);
          }}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fullName} {d.isVerified ? "(✔ Verified)" : "(Unverified)"}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
  type="date"
  className="w-full p-2 border rounded mb-3"
  min={new Date().toISOString().split("T")[0]}   // <-- BLOCK YESTERDAY
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>


        {/* Time Slot */}
        {slots.length > 0 && (
          <>
            <label className="block text-sm mb-1 font-medium">
              Available Time Slots
            </label>
            <select
              className="w-full p-2 border rounded mb-3"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">-- Select Time Slot --</option>
              {slots.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Hospital */}
        <label className="block text-sm mb-1 font-medium">Hospital</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={hospital}
          disabled
        />

        {/* Location */}
        <label className="block text-sm mb-1 font-medium">Location</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          value={location}
          disabled
        />

        {/* Notes */}
        <label className="block text-sm mb-1 font-medium">Notes</label>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
