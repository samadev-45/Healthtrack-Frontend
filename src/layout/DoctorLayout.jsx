import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../store/authSlice";
import { logout } from "../api/auth";
import toast from "react-hot-toast";
import SidebarDoctor from "../components/SidebarDoctor";

export default function DoctorLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await logout();

    if (res?.success) {
      dispatch(logoutSuccess());
      navigate("/login");
      toast.success("Logged out successfully");
    } else {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <SidebarDoctor />

      {/* Main Section */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Doctor Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

    </div>
  );
}
