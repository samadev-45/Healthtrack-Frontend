import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarDoctor() {

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md mb-1 
    ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <div className="w-60 bg-white shadow h-full p-4">
      <h2 className="text-xl font-bold mb-4">Doctor Menu</h2>

      <nav className="space-y-1">
        <NavLink to="/doctor/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/doctor/appointments" className={linkClass}>
          My Appointments
        </NavLink>

        <NavLink to="/doctor/patients" className={linkClass}>
          My Patients
        </NavLink>

        <NavLink to="/doctor/consultations" className={linkClass}>
          Consultations
        </NavLink>

        <NavLink to="/doctor/prescriptions" className={linkClass}>
          Prescriptions
        </NavLink>
      </nav>
    </div>
  );
}
