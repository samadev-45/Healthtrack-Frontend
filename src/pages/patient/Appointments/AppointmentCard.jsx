
import React from "react";

const statusMap = {
  1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  2: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  3: { label: "Completed", color: "bg-green-100 text-green-800" },
  4: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  5: { label: "Rejected", color: "bg-gray-200 text-gray-700" },
};


export default function AppointmentCard({ appt, onReschedule, onCancel, onView }) {
  // const status = statusMap[appt.status] ?? { label: appt.status ?? "Unknown", color: "bg-gray-100 text-gray-800" };
  const status = statusMap[appt.status] ?? {
    label: "Unknown",
    color: "bg-gray-100 text-gray-800",
  };
  const date = appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : "-";
  const time = appt.appointmentTime ?? "-";

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold">{appt.doctorName || "Doctor"}</div>
          <div className="text-sm text-gray-500">{appt.hospital ?? ""}</div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</div>
      </div>

      <div className="mt-3 text-sm text-gray-600 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="1.5" d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"/></svg>
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="1.5" d="M12 8v4l3 3"/></svg>
          <span>{time}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="1.5" d="M12 2l2 4 4 .5-3 3 .7 4L12 13l-3.7 1.5.7-4L5 6.5 9 6z"/></svg>
          <span>{appt.location ?? "—"}</span>
        </div>
      </div>

      {appt.patientNotes && (
        <div className="mt-3 text-sm text-gray-700">{appt.patientNotes}</div>
      )}

      <div className="mt-4 flex gap-3 items-center">
        {(appt.status === 0 || appt.status === 1) ? (
  <button
    onClick={() => onReschedule(appt)}
    className="flex-1 py-2 border rounded bg-white hover:bg-gray-50 text-sm"
  >
    Reschedule
  </button>
) : (
  <button
    disabled
    className="flex-1 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed text-sm"
  >
    Reschedule
  </button>
)}


        <button
          onClick={() => onCancel(appt)}
          className="py-2 px-3 border rounded text-red-600 text-sm bg-white hover:bg-red-50"
        >
          Cancel
        </button>

        <button
          onClick={() => onView(appt)}
          className="py-2 px-3 bg-blue-600 text-white rounded text-sm"
        >
          View
        </button>
      </div>
    </div>
  );
}
