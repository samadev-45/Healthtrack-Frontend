import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CaretakerRequestOtp from "./pages/auth/CaretakerRequestOtp";
import CaretakerVerifyOtp from "./pages/auth/CaretakerVerifyOtp";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";

// Dummy dashboards — replace with actual components later
const PatientDashboard = () => <h1 className="p-10 text-3xl">Patient Dashboard</h1>;
const DoctorDashboard = () => <h1 className="p-10 text-3xl">Doctor Dashboard</h1>;

const CaretakerDashboard = () => <h1 className="p-10 text-3xl">Caretaker Dashboard</h1>;

export default function App() {
  return (
    <BrowserRouter>
      {/* HOT TOAST */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* AUTH PAGES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/caretaker-request" element={<CaretakerRequestOtp />} />
        <Route path="/auth/caretaker-verify" element={<CaretakerVerifyOtp />} />

        {/* DASHBOARDS (AUTH REQUIRED) */}
        <Route
          path="/patientDashboard"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctorDashboard"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/adminDashboard"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminLayout>
        <AdminUsers />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

        <Route
          path="/caretakerDashboard"
          element={
            <ProtectedRoute allowedRoles={["Caretaker"]}>
              <CaretakerDashboard />
            </ProtectedRoute>
          }
        />
        


        {/* NOT FOUND → redirect */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
