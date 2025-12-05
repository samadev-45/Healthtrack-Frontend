import React, { useEffect, useState } from "react";
import { getDoctorDashboard } from "../../api/doctorDashboard";
import toast from "react-hot-toast";

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDoctorDashboard();
      console.log(data);
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;

  if (!dashboard) return <div className="p-5">No data found</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

      {/* Today’s Appointments */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Today's Appointments</h2>
        {dashboard.todayAppointments.length === 0 ? (
          <p>No appointments today</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.todayAppointments.map((a) => (
              <li key={a.appointmentId} className="p-3 border rounded">
                <div className="font-medium">{a.patientName}</div>
                <div className="text-sm text-gray-600">
                  {new Date(a.appointmentDate).toDateString()} —
                  {a.appointmentTime}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming Appointments */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Upcoming Appointments</h2>
        {dashboard.upcomingAppointments.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.upcomingAppointments.map((a) => (
              <li key={a.appointmentId} className="p-3 border rounded">
                <div className="font-medium">{a.patientName}</div>
                <div className="text-sm text-gray-600">
                  {new Date(a.appointmentDate).toDateString()} —
                  {a.appointmentTime}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent Consultations */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Recent Consultations</h2>
        {dashboard.recentConsultations.length === 0 ? (
          <p>No consultation history</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.recentConsultations.map((c) => (
              <li key={c.consultationId} className="p-3 border rounded">
                <div className="font-medium">{c.patientName}</div>
                <div className="text-sm text-gray-600">
                  Diagnosis: {c.diagnosis}
                </div>
                <div className="text-xs">
                  {new Date(c.createdOn).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Abnormal Metrics */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Abnormal Vitals</h2>
        {dashboard.abnormalMetrics.length === 0 ? (
          <p>No abnormal vitals</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.abnormalMetrics.map((m, idx) => (
              <li key={idx} className="p-3 border rounded">
                <div className="font-medium">{m.displayName} — {m.value}{m.unit}</div>
                <div className="text-sm text-red-600">{m.status}</div>
                <div className="text-xs text-gray-600">
                  {new Date(m.measuredAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notifications */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Notifications</h2>
        {dashboard.notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.notifications.map((n) => (
              <li key={n.notificationId} className="p-3 border rounded">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-600">
                  {new Date(n.createdOn).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
