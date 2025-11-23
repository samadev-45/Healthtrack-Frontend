// src/pages/patient/Appointments/AppointmentDetails.jsx
import React from "react";
const statusMap = {
  1: "Pending",
  2: "Scheduled",
  3: "Completed",
  4: "Cancelled",
  5: "Rejected",
};

export default function AppointmentDetails({ open, appointment, onClose }) {
  if (!open) return null;
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Appointment Details</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="mt-4 space-y-3">
          <div><strong>Doctor:</strong> {appointment.doctorName ?? "Doctor"}</div>
          <div><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</div>
          <div><strong>Time:</strong> {appointment.appointmentTime}</div>
          <div><strong>Hospital:</strong> {appointment.hospital}</div>
          <div><strong>Location:</strong> {appointment.location}</div>
          <div><strong>Patient notes:</strong> {appointment.patientNotes ?? "-"}</div>
          <div><strong>Doctor notes:</strong> {appointment.doctorNotes ?? "-"}</div>
          <p>
  <strong>Status:</strong> {statusMap[appointment?.status] || "Unknown"}
</p>

        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
