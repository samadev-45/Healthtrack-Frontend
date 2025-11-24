import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CaretakerRequestOtp from "./pages/auth/CaretakerRequestOtp";
import CaretakerVerifyOtp from "./pages/auth/CaretakerVerifyOtp";
import PatientDashboard from "./pages/patient/PatientDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import PatientLayout from "./layout/PatientLayout";
import AppointmentList from "./pages/patient/Appointments/AppointmentList";
import AppointmentsList from "./pages/patient/Appointments/AppointmentList";
import ConsultationList from "./pages/patient/ConsultationList";
import ConsultationDetails from "./pages/patient/ConsultationDetails";
import HealthMetricsDashboard from "./pages/patient/HealthMetricsDashboard";


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
 
  <Route path="/" element={<Navigate to="/auth/login" replace />} />

 
  <Route path="/auth/login" element={<Login />} />
  <Route path="/auth/register" element={<Register />} />
  <Route path="/auth/caretaker-request" element={<CaretakerRequestOtp />} />
  <Route path="/auth/caretaker-verify" element={<CaretakerVerifyOtp />} />

 
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
  </Route>


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
   
       
          <Route
  path="/patient/consultations"
  element={
    <ProtectedRoute roles={['Patient']}>
      <PatientLayout>
        <ConsultationList />
      </PatientLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/patient/consultations/:consultationId"
  element={
    <ProtectedRoute roles={['Patient']}>
      <PatientLayout>
        <ConsultationDetails />
      </PatientLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/patient/healthmetrics"
  element={
    <ProtectedRoute roles={['Patient']}>
      <PatientLayout>
        <HealthMetricsDashboard />
      </PatientLayout>
    </ProtectedRoute>
  }
/>

       
      


  <Route path="*" element={<Navigate to="/auth/login" replace />} />
</Routes>

    </BrowserRouter>
  );
}
