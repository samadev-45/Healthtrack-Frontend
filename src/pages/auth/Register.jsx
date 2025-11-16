import { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { register } from "../../api/auth";

import {
  PatientSchema,
  DoctorSchema,
  CaretakerSchema,
} from "../../validation/registerSchemas";

const genderOptions = [
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
  { value: 4, label: "Prefer Not to Say" },
];

const bloodOptions = [
  { id: 1, label: "A+" },
  { id: 2, label: "A-" },
  { id: 3, label: "B+" },
  { id: 4, label: "B-" },
  { id: 5, label: "AB+" },
  { id: 6, label: "AB-" },
  { id: 7, label: "O+" },
  { id: 8, label: "O-" },
];

export default function Register() {
  const [role, setRole] = useState("Patient");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const fadeAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const getSchema = () => {
    if (role === "Patient") return PatientSchema;
    if (role === "Doctor") return DoctorSchema;
    return CaretakerSchema; // caretaker no password needed
  };

  const mapRoleToId = (role) => {
    if (role === "Patient") return 1;
    if (role === "Caretaker") return 2;
    if (role === "Doctor") return 4;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="bg-white shadow-xl rounded-xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:w-1/2 w-full bg-blue-600 flex items-center justify-center p-8"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966481.png"
            alt="care"
            className="w-40 md:w-64"
          />
        </motion.div>

        {/* RIGHT FORM */}
        <div className="md:w-1/2 w-full p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-500 mb-6">Join HealthTrack and manage your health effortlessly.</p>

          {/* ROLE TABS */}
          <div className="flex gap-3 mb-6 overflow-x-auto">
            {["Patient", "Doctor", "Caretaker"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setStep(1);
                }}
                className={`px-4 py-2 rounded-lg border whitespace-nowrap ${
                  role === r
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* FORMIK */}
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              phoneNumber: "",
              dateOfBirth: "",
              gender: "",
              bloodTypeId: "",
              address: "",
              emergencyContactName: "",
              emergencyContactPhone: "",
              specialtyId: "",
              licenseNumber: "",
            }}
            validationSchema={getSchema()}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const payload = {
                  ...values,
                  role: mapRoleToId(role),
                  gender: values.gender ? Number(values.gender) : null,
                  bloodTypeId: values.bloodTypeId ? Number(values.bloodTypeId) : null,
                  specialtyId: values.specialtyId ? Number(values.specialtyId) : null,
                };

                // REMOVE PASSWORD FOR CARETAKER BEFORE SENDING
                if (role === "Caretaker") {
                  delete payload.password;
                }

                await register(payload);
                toast.success("Registered successfully!");

                // redirect to login
                navigate("/login");
              } catch (err) {
                toast.error("Registration failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>

                {/* CARETAKER — NO STEPS */}
                {role === "Caretaker" && (
                  <motion.div
                    variants={fadeAnim}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg"
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </button>

                    {/* Sign In link */}
                    <p className="text-center mt-3">
                      Already have an account?{" "}
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* STEP 1 */}
                {step === 1 && role !== "Caretaker" && (
                  <motion.div
                    variants={fadeAnim}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg"
                    >
                      Next →
                    </button>

                    <p className="text-center mt-3">
                      Already have an account?{" "}
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && role !== "Caretaker" && (
                  <motion.div
                    variants={fadeAnim}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {/* PATIENT */}
                    {role === "Patient" && (
                      <>
                        <input
                          type="date"
                          name="dateOfBirth"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />

                        <input
                          type="text"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />

                        <select
                          name="gender"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>

                        <select
                          name="bloodTypeId"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        >
                          <option value="">Select Blood Type</option>
                          {bloodOptions.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />

                        <input
                          type="text"
                          name="emergencyContactName"
                          placeholder="Emergency Contact Name"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />

                        <input
                          type="text"
                          name="emergencyContactPhone"
                          placeholder="Emergency Contact Phone"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />
                      </>
                    )}

                    {/* DOCTOR */}
                    {role === "Doctor" && (
                      <>
                        <select
                          name="gender"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          name="specialtyId"
                          placeholder="Specialty ID"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />

                        <input
                          type="text"
                          name="licenseNumber"
                          placeholder="License Number"
                          onChange={handleChange}
                          className="w-full border p-3 rounded-lg"
                        />
                      </>
                    )}

                    {/* BUTTONS */}
                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 rounded-lg border"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg text-white ${
                          isSubmitting ? "bg-gray-400" : "bg-blue-600"
                        }`}
                      >
                        {isSubmitting ? "Registering..." : "Register"}
                      </button>
                    </div>

                    <p className="text-center mt-3">
                      Already have an account?{" "}
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </span>
                    </p>
                  </motion.div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
