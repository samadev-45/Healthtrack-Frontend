// src/pages/patient/Appointments/RescheduleModal.jsx
import React, { useState, useEffect } from "react";
import { getDoctorAvailability } from "../../../api/doctor";
import toast from "react-hot-toast";

export default function RescheduleModal({ open, appointment, onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState([]);

  const doctorId = appointment?.doctorId;

  // Load existing appointment details
  useEffect(() => {
    if (appointment && open) {
      setDate(appointment.appointmentDate?.split("T")[0] || "");
      console.log("INIT TIME = ", appointment.appointmentTime);

      setTime(appointment.appointmentTime?.substring(0,5) || "");

      setReason("");
    }
  }, [appointment, open]);

  // Load available slots
  useEffect(() => {
    if (open && doctorId && date) {
      loadSlots();
    }
  }, [doctorId, date, open]);

  const loadSlots = async () => {
    try {
      const res = await getDoctorAvailability(doctorId, date);

      setSlots(res.slots || []);

      // If current time is no longer available → clear it
     if (time && !res.slots.includes(time)) {
  setTimeout(() => setTime(""), 0);
}
 
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available slots");
    }
  };

  if (!open) return null;

  const handleSubmit = () => {
  console.log("DEBUG:", { date, time, reason });

  if (!date) return toast.error("New appointment date is required");
  if (!time) return toast.error("New appointment time is required");
  if (!reason.trim()) return toast.error("Reason is required");

  const dto = {
    newAppointmentDate: date,
    newAppointmentTime: time.length === 5 ? time + ":00" : time, // FIXED
    reason
  };

  console.log("FINAL DTO:", dto);
  onConfirm(dto);
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>

        {/* Date Picker */}
        <label className="block text-sm font-medium">New Date</label>
        <input
  type="date"
  min={new Date().toISOString().split("T")[0]}   // <-- BLOCK YESTERDAY
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="w-full p-2 border rounded mb-4"
/>


        {/* Time Slot Dropdown */}
        {slots.length > 0 ? (
          <>
            <label className="block text-sm font-medium">Available Time Slots</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">-- Select Time Slot --</option>
              {slots.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </>
        ) : (
          date && (
            <p className="text-sm text-gray-500 mb-3">
              No available slots for this date.
            </p>
          )
        )}

        {/* Reason */}
        <label className="block text-sm font-medium">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rescheduling"
          rows={3}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Buttons */}
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
