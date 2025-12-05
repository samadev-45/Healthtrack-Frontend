import React, { useEffect, useState } from "react";
import { getDoctorAppointments } from "../../api/doctorAppointments";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createConsultation } from "../../api/consultation";


export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    status: ""
  });
  console.log("appoooo",appointments);
  
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;

      // API returns normalized { records, totalCount }
      const data = await getDoctorAppointments(params);
      setAppointments(data || { records: [], totalCount: 0 });
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) =>
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });

  const handleFilter = () => loadAppointments();
    const handleStartConsultation = async (appt) => {
  console.log("HANDLE START CALLED", appt);

  try {
    const dto = {
      chiefComplaint: appt.patientNotes || "",
      diagnosis: "",
      advice: "",
      doctorNotes: "",
      healthValues: {},
      followUpDate: null,
    };

    console.log("Sending DTO:", dto);

    // API returns normalized ConsultationResponseDto
    const cons = await createConsultation(appt.appointmentId, dto);

    console.log("CONSULTATION CREATED:", cons);

    // Use camelCase field after normalization
    navigate(`/doctor/consultation/${cons.consultationId}`);
  } catch (e) {
    console.error("START ERROR:", e);
    toast.error(
      e.response?.data?.message ||
      e.response?.data ||
      "Unable to start consultation"
    );
  }
};


  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="1">Pending</option>
            <option value="2">Approved</option>
            <option value="3">Completed</option>
            <option value="4">Cancelled</option>
            <option value="5">Rescheduled</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Filter
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-white p-4 rounded shadow">
        {!appointments.records || appointments.records.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <div className="space-y-3">
            {appointments.records.map((appt) => (
              <div
                key={appt.appointmentId}
                className="border p-3 rounded hover:bg-gray-50"
              >
                <div className="font-medium">{appt.patientName}</div>

                <div className="text-sm text-gray-600">
                  {new Date(appt.appointmentDate).toDateString()} —{" "}
                  {appt.appointmentTime}
                </div>

                <div className="text-sm mt-1">
                  Status:{" "}
                  <span className="font-semibold">
                    {appt.status === 1
                      ? "Pending"
                      : appt.status === 2
                      ? "Approved"
                      : appt.status === 3
                      ? "Completed"
                      : appt.status === 4
                      ? "Cancelled"
                      : "Rescheduled"}
                  </span>
                </div>

                {/* Button to start consultation */}
                {appt.status === 2 && (
  <button
  onClick={() => {
    console.log("CLICKED START BUTTON");
    handleStartConsultation(appt);
  }}
  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
>
  Start Consultation
</button>

)}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
