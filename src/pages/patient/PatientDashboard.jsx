import React, { useEffect, useState } from "react";
import { getPatientDashboard } from "../../api/patient";

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // API function already returns normalized camelCase data
        const payload = await getPatientDashboard();
        setData(payload);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>No dashboard data.</div>;

  const {
    nextAppointment,
    activeMedicationCount,
    todayAbnormalMetrics,
    latestVitals,
    recentNotifications,
    healthScore
  } = data;

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <section className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow-sm">
          <h3 className="font-semibold text-lg">Health Score</h3>
          <p className="text-3xl font-bold text-green-600">{healthScore}</p>
        </div>

        <div className="p-4 border rounded shadow-sm">
          <h3 className="font-semibold">Active Medications</h3>
          <p className="text-3xl font-bold">{activeMedicationCount}</p>
        </div>

        <div className="p-4 border rounded shadow-sm">
          <h3 className="font-semibold">Abnormal Metrics Today</h3>
          <p className="text-3xl font-bold">{todayAbnormalMetrics.length}</p>
        </div>
      </section>


      {/* Next Appointment */}
      <section className="p-4 border rounded shadow-sm">
        <h3 className="font-semibold mb-2">Next Appointment</h3>

        {nextAppointment ? (
          <div>
            <p className="font-medium">
              {nextAppointment.doctorName ?? "Doctor"}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(nextAppointment.date).toLocaleString()}
            </p>
            <p>Status: {nextAppointment.status}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming appointments.</p>
        )}
      </section>


      {/* Latest Vitals */}
      <section className="p-4 border rounded shadow-sm">
        <h3 className="font-semibold mb-3">Latest Vitals</h3>

        {latestVitals?.readings?.length > 0 ? (
          <ul className="space-y-3">
            {latestVitals.readings.map((v, index) => (
              <li key={index} className="p-3 border rounded">
                <div className="font-medium">{v.displayName}</div>
                <div className="text-sm">
                  Value: <strong>{v.value}</strong> {v.unit}
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(v.measuredAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No vitals found.</p>
        )}
      </section>


      {/* Notifications */}
      <section className="p-4 border rounded shadow-sm">
        <h3 className="font-semibold mb-2">Recent Notifications</h3>

        {recentNotifications?.length > 0 ? (
          <ul className="space-y-2">
            {recentNotifications.map((n, idx) => (
              <li key={idx} className="p-2 border rounded">
                <div className="font-medium">{n.message}</div>
                <div className="text-xs text-gray-600">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No notifications.</p>
        )}
      </section>

    </div>
  );
}
