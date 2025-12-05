import React, { useEffect, useState } from "react";
import {
  getPatientAppointments,
  rescheduleAppointment,
  cancelAppointment,
  createAppointment,
} from "../../../api/appointments";

import AppointmentCard from "./AppointmentCard";
import RescheduleModal from "./RescheduleModal";
import AppointmentDetails from "./AppointmentDetails";
import CreateAppointmentModal from "./CreateAppointmentModal";

import toast from "react-hot-toast";

/* Reference image used by you earlier */
const referenceImage = "/mnt/data/acfad8a6-6c1c-4627-b435-0a6f3f9e9a9f.png";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [filterDate, setFilterDate] = useState(""); // <-- NEW (Calendar Filter)

  const [showCreate, setShowCreate] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // ------------------------------------------------------
  // Load Appointments
  // ------------------------------------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // API returns normalized { records, totalCount } directly
      const data = await getPatientAppointments({ page, pageSize });

      setAppointments(data?.records ?? []);
      setTotal(data?.totalCount ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ------------------------------------------------------
  // Filtering by Date (Calendar)
  // ------------------------------------------------------
  const filteredAppointments =
    filterDate.trim() === ""
      ? appointments
      : appointments.filter(
          (a) => a.appointmentDate?.split("T")[0] === filterDate
        );

  // ------------------------------------------------------
  // View Details
  // ------------------------------------------------------
  const handleView = (appt) => {
    setSelectedAppt(appt);
    setShowDetails(true);
  };

  // ------------------------------------------------------
  // Create Appointment
  // ------------------------------------------------------
  const handleCreate = async (payload) => {
    try {
      await createAppointment(payload);
      toast.success("Appointment created");
      setShowCreate(false);
      fetchAppointments();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create appointment"
      );
    }
  };

  // ------------------------------------------------------
  // Reschedule Appointment
  // ------------------------------------------------------
  const handleReschedule = (appt) => {
    setSelectedAppt(appt);
    setShowReschedule(true);
  };

  const handleConfirmReschedule = async (dto) => {
    try {
      console.log("DTO RECEIVED FROM MODAL:", dto);

      const payload = {
        newAppointmentDate: dto.newAppointmentDate,
        newAppointmentTime: dto.newAppointmentTime,
        reason: dto.reason,
      };

      console.log("FINAL PAYLOAD TO API:", payload);

      await rescheduleAppointment(selectedAppt.appointmentId, payload);

      toast.success("Appointment rescheduled");
      setShowReschedule(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reschedule failed");
    }
  };

  // ------------------------------------------------------
  // Cancel Appointment
  // ------------------------------------------------------
  const handleCancel = async (appt) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return toast.error("Cancellation reason is required");

    try {
      await cancelAppointment(appt.appointmentId, { reason });
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  // ------------------------------------------------------
  // UI Render
  // ------------------------------------------------------
  return (
    <div className="min-h-[70vh]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-sm text-gray-500">Manage your medical appointments</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open(referenceImage, "_blank")}
            className="px-4 py-2 bg-white border rounded shadow-sm"
          >
            Reference
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Column */}
        <div className="col-span-4 bg-white border rounded-lg p-6">
          <div className="text-sm font-medium mb-4">Calendar</div>

          <input
            type="date"
            className="w-full p-3 border rounded"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <div className="mt-4 text-xs text-gray-500">
            Select date to filter appointments
          </div>
        </div>

        {/* Appointments Column */}
        <div className="col-span-8 space-y-4">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <div className="text-sm text-gray-500">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1 ? "s" : ""}
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-500">Loading...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No appointments found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((a) => (
                  <AppointmentCard
                    key={a.appointmentId}
                    appt={a}
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RescheduleModal
        open={showReschedule}
        appointment={selectedAppt}
        onClose={() => setShowReschedule(false)}
        onConfirm={handleConfirmReschedule}
      />

      <AppointmentDetails
        open={showDetails}
        appointment={selectedAppt}
        onClose={() => setShowDetails(false)}
      />

      <CreateAppointmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onConfirm={handleCreate}
      />
    </div>
  );
}
