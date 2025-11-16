import { useState } from "react";
import { Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { login, caretakerRequestOtp, caretakerVerifyOtp } from "../../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const ROLES = ["Patient", "Doctor", "Admin", "Caretaker"];

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string(),
});

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDashboard = (role) => {
    console.log("➡ Redirecting dashboard for role:", role);
    if (role === "Patient") return "/patientDashboard";
    if (role === "Doctor") return "/doctorDashboard";
    if (role === "Admin") return "/adminDashboard";
    if (role === "Caretaker") return "/caretakerDashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white p-10">
        <h1 className="text-4xl font-bold mb-6">HealthTrack</h1>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
          alt="login"
          className="w-80 opacity-90"
        />
        <p className="mt-6 text-lg font-light text-center">
          Manage your health records easily
        </p>
      </div>

      {/* RIGHT FORM */}
      <div className="flex justify-center items-center w-full lg:w-1/2 p-8">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          {/* ROLE TABS */}
          <div className="flex justify-between mb-8">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  console.log("🔄 Switching role:", role);
                  setSelectedRole(role);
                  setStep(1);
                }}
                className={`text-sm font-semibold pb-2 border-b-2 ${
                  selectedRole === role
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Login to continue to HealthTrack
          </p>

          {/* FORMIK */}
          <Formik
            initialValues={{ email: "", password: "", otp: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              console.log("➡ Form Submitted:", values);
              console.log("➡ Selected Role:", selectedRole);
              try {
                /** ================================
                 * NORMAL LOGIN (PATIENT/DOCTOR/ADMIN)
                 * ================================ */
                if (selectedRole !== "Caretaker") {
                  if (!values.password) {
                    toast.error("Password required");
                    return;
                  }

                  const res = await login({
                    email: values.email,
                    password: values.password,
                  });

                  console.log("📥 Login response:", res);

                  // Login failed OR user email not found
                  if (!res?.success) {
                    toast.error(res?.message || "Invalid credentials");
                    return;
                  }

                  // STATUS HANDLING
                  const status = res?.data?.status || "";

                  if (status === "Pending") {
                    toast.error("Your account is pending admin approval.");
                    return;
                  }

                  if (status === "Rejected") {
                    toast.error("Your registration was rejected.");
                    return;
                  }

                  const user = res.data;
                  dispatch(loginSuccess(user));

                  toast.success("Login successful!");

                  navigate(getDashboard(user.role));
                  return;
                }

                /** ========================
                 * CARETAKER — SEND OTP
                 * ======================== */
                if (selectedRole === "Caretaker" && step === 1) {
                  console.log("🟦 CARETAKER → Step 1: Send OTP");

                  const res = await caretakerRequestOtp({
                    email: values.email,
                  });

                  console.log("📥 OTP request response:", res);

                  toast.success("OTP sent to your email!");
                  setStep(2);
                  return;
                }

                /** ============================
                 * CARETAKER — VERIFY OTP
                 * ============================ */
                if (selectedRole === "Caretaker" && step === 2) {
                  console.log("🟦 CARETAKER → Step 2: Verify OTP");

                  const res = await caretakerVerifyOtp({
                    email: values.email,
                    otp: values.otp,
                  });

                  console.log("📥 OTP verify response:", res);

                  if (res.status !== "Approved") {
                    console.log("🟡 Caretaker pending approval");
                    toast.success(
                      "Login successful, waiting for admin approval."
                    );
                    return;
                  }

                  dispatch(
                    loginSuccess({
                      fullName: "Caretaker",
                      email: values.email,
                      role: "Caretaker",
                    })
                  );

                  toast.success("Caretaker login successful!");
                  navigate("/caretakerDashboard");
                }
              } catch (err) {
                console.log("🔥 LOGIN ERROR:", err);
                toast.error("Invalid credentials");
              }
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 mb-2 bg-gray-100 rounded-lg"
                  value={values.email}
                  onChange={(e) => {
                    console.log("✏️ Email changed:", e.target.value);
                    handleChange(e);
                  }}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mb-3">{errors.email}</p>
                )}

                {/* PASSWORD (Hidden for caretaker) */}
                {selectedRole !== "Caretaker" && (
                  <>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 mb-2 bg-gray-100 rounded-lg"
                      value={values.password}
                      onChange={(e) => {
                        console.log("✏️ Password changed");
                        handleChange(e);
                      }}
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
                    >
                      Login
                    </button>
                  </>
                )}

                {/* CARETAKER OTP FLOW */}
                {selectedRole === "Caretaker" && (
                  <>
                    {step === 1 && (
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
                      >
                        Send OTP
                      </button>
                    )}

                    {step === 2 && (
                      <>
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          className="w-full px-4 py-3 mb-4 bg-gray-100 rounded-lg"
                          value={values.otp}
                          onChange={(e) => {
                            console.log("✏️ OTP changed:", e.target.value);
                            handleChange(e);
                          }}
                        />

                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
                        >
                          Verify OTP
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* REGISTER LINK */}
                <p className="mt-6 text-sm text-center text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    className="text-blue-600 font-bold cursor-pointer"
                    onClick={() => {
                      console.log("➡ Redirect to Register");
                      navigate("/auth/register");
                    }}
                  >
                    Register
                  </span>
                </p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
