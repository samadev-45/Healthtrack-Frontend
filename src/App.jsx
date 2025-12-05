import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CaretakerRequestOtp from "./pages/auth/CaretakerRequestOtp";
import CaretakerVerifyOtp from "./pages/auth/CaretakerVerifyOtp";

import ProtectedRoute from "./components/ProtectedRoute";

import PatientLayout from "./layout/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ConsultationList from "./pages/patient/ConsultationList";
import ConsultationDetails from "./pages/patient/ConsultationDetails";
import HealthMetricsDashboard from "./pages/patient/HealthMetricsDashboard";
// import PrescriptionsList from "./pages/patient/PrescriptionsList";
// import PrescriptionDetails from "./pages/patient/PrescriptionDetails";
import AppointmentsList from "./pages/patient/Appointments/AppointmentList";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import PatientProfile from "./pages/patient/PatientProfile";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorLayout from "./layout/DoctorLayout";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import ConsultationPage from "./components/ConsultationPage";


const CaretakerDashboard = () => <h1 className="p-10 text-3xl">Caretaker Dashboard</h1>;

export default function App() {
  return (
    <BrowserRouter>
    
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { background: "#333", color: "#fff" } }}
      />

      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* AUTH ROUTES */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/caretaker-request" element={<CaretakerRequestOtp />} />
        <Route path="/auth/caretaker-verify" element={<CaretakerVerifyOtp />} />

        {/* PATIENT ROUTES */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<AppointmentsList />} />
          <Route path="consultations" element={<ConsultationList />} />
          <Route path="consultations/:consultationId" element={<ConsultationDetails />} />
          <Route path="healthmetrics" element={<HealthMetricsDashboard />} />
          {/* <Route path="prescriptions" element={<PrescriptionsList />} /> */}
          {/* <Route path="prescriptions/consultation/:consultationId" element={<PrescriptionDetails />} /> */}
        </Route>

        

    
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
  path="/doctor/dashboard"
  element={
    <ProtectedRoute allowedRoles={["Doctor"]}>
      <DoctorLayout>
        <DoctorDashboard />
      </DoctorLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/appointments"
  element={
    <ProtectedRoute allowedRoles={["Doctor"]}>
      <DoctorLayout>
        <DoctorAppointments />
      </DoctorLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/consultations"
  element={
    <ProtectedRoute allowedRoles={["Doctor"]}>
      <DoctorLayout>
        <ConsultationList /> {/* doctor version */}
      </DoctorLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor/consultation/:consultationId"
  element={
    <ProtectedRoute allowedRoles={["Doctor"]}>
      <DoctorLayout>
        <ConsultationPage />
      </DoctorLayout>
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
        {/* <Route path="profile" element={<PatientProfile />} /> */}
        <Route
  path="/patient/profile"
  element={
    <ProtectedRoute allowedRoles={["Patient"]}>
      <PatientLayout>
        <PatientProfile />
      </PatientLayout>
    </ProtectedRoute>
  }
/>


    
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}