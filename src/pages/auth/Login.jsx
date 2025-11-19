import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  login,
  caretakerRequestOtp,
  caretakerVerifyOtp,
  forgotPasswordRequestOtp,
  forgotPasswordVerifyOtp,
} from "../../api/auth";

import { loginSuccess } from "../../store/authSlice";

const ROLES = ["Patient", "Doctor", "Admin", "Caretaker"];

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string(),
});

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [step, setStep] = useState(1); // caretaker login step
  const [fpStep, setFpStep] = useState(0);
  const [fpEmail, setFpEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDashboard = (role) => {
    switch (role) {
      case "Patient":
        return "/patientDashboard";
      case "Doctor":
        return "/doctorDashboard";
      case "Admin":
        return "/adminDashboard";
      case "Caretaker":
        return "/caretakerDashboard";
      default:
        return "/";
    }
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

          {/* ===================== FORGOT PASSWORD ===================== */}
          {fpStep > 0 && (
            <Formik
              initialValues={{
                email: "",
                otp: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string().email().required(),
              })}
              onSubmit={async (values) => {
                try {
                  if (fpStep === 1) {
                    await forgotPasswordRequestOtp({ email: values.email });
                    setFpEmail(values.email);
                    setFpStep(2);
                    toast.success("OTP sent to email");
                    return;
                  }

                  if (fpStep === 2) {
                    await forgotPasswordVerifyOtp({
                      email: fpEmail,
                      otp: values.otp,
                      newPassword: values.newPassword,
                      confirmPassword: values.confirmPassword,
                    });
                    toast.success("Password reset successfully!");
                    setFpStep(0);
                    return;
                  }
                } catch {
                  toast.error("Failed to reset password");
                }
              }}
            >
              {({ handleChange, handleSubmit }) => (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {fpStep === 1 && (
                    <>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                      />

                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg"
                      >
                        Send OTP
                      </button>
                    </>
                  )}

                  {fpStep === 2 && (
                    <>
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                      />

                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                      />

                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                      />

                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg"
                      >
                        Reset Password
                      </button>
                    </>
                  )}

                  <p
                    className="text-center text-sm cursor-pointer text-gray-600 mt-4"
                    onClick={() => setFpStep(0)}
                  >
                    Back to Login
                  </p>
                </form>
              )}
            </Formik>
          )}

          {/* ===================== LOGIN FORM ===================== */}
          {fpStep === 0 && (
            <Formik
              initialValues={{ email: "", password: "", otp: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => {
                try {
                  /** NORMAL LOGIN */
                  if (selectedRole !== "Caretaker") {
                    if (!values.password) {
                      toast.error("Password required");
                      return;
                    }

                    const res = await login({
                      email: values.email,
                      password: values.password,
                    });

                    const data = res.data;

                    dispatch(
                      loginSuccess({
                        fullName: data.fullName,
                        email: data.email,
                        role: data.role,
                      })
                    );

                    toast.success("Login successful!");
                    navigate(getDashboard(data.role), { replace: true });
                    return;
                  }

                  /** CARETAKER FLOW — STEP 1 */
                  if (selectedRole === "Caretaker" && step === 1) {
                    await caretakerRequestOtp({
                      email: values.email,
                      fullName: "Caretaker User",
                    });
                    toast.success("OTP sent to email!");
                    setStep(2);
                    return;
                  }

                  /** CARETAKER FLOW — STEP 2 */
                  if (selectedRole === "Caretaker" && step === 2) {
                    const res = await caretakerVerifyOtp({
                      email: values.email,
                      otp: values.otp,
                    });

                    if (res.status !== "Approved") {
                      toast.error("Waiting for admin approval");
                      return;
                    }

                    dispatch(
                      loginSuccess({
                        fullName: "Caretaker",
                        email: values.email,
                        role: "Caretaker",
                      })
                    );

                    toast.success("Login successful!");
                    navigate("/caretakerDashboard", { replace: true });
                  }
                } catch (err) {
                  toast.error(err.message);
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
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mb-3">{errors.email}</p>
                  )}

                  {/* PASSWORD (Not for caretaker) */}
                  {selectedRole !== "Caretaker" && (
                    <>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 mb-4 bg-gray-100 rounded-lg"
                        value={values.password}
                        onChange={handleChange}
                      />

                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
                      >
                        Login
                      </button>
                    </>
                  )}

                  {/* CARETAKER OTP */}
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
                            onChange={handleChange}
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

                  {/* FORGOT PASSWORD */}
                  <p
                    className="text-sm mt-3 text-blue-600 cursor-pointer"
                    onClick={() => setFpStep(1)}
                  >
                    Forgot Password?
                  </p>

                  {/* REGISTER */}
                  <p className="mt-6 text-sm text-center text-gray-600">
                    Don’t have an account?{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer"
                      onClick={() => navigate("/auth/register")}
                    >
                      Register
                    </span>
                  </p>
                </form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
