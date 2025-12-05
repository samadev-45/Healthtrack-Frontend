import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../store/authSlice"; // adjust path if needed

export default function PatientLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth/login");
  };

  const navItemClass = ({ isActive }) =>
    isActive ? "p-3 block font-medium bg-gray-100 rounded" : "p-3 block";

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-64 border-r p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold">HealthTrack</h2>
          <p className="text-sm text-gray-500">Patient</p>
        </div>

        <nav className="space-y-1">
          <NavLink to="/patient/dashboard" className={navItemClass}>
            Dashboard
          </NavLink>

          <NavLink to="/patient/appointments" className={navItemClass}>
            Appointments
          </NavLink>

        
          <NavLink to="/patient/consultations" className={navItemClass}>
            Consultations
          </NavLink>
          <NavLink to="/patient/healthmetrics" className={navItemClass}>Health Metric</NavLink>

          <NavLink to="/patient/profile" className={navItemClass}>
            Profile
          </NavLink>
          {/* <NavLink to="/patient/prescriptions" className={navItemClass}>Prescriptions</NavLink> */}

          <button
            onClick={handleLogout}
            className="w-full text-left mt-4 p-3 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
          <div className="text-sm text-gray-600">Welcome back</div>
        </header>

        {children ?? <Outlet />}
      </main>
    </div>
  );
}
