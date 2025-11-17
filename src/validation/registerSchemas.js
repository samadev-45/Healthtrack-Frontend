// src/validation/registerSchemas.js
import * as Yup from "yup";

export const PatientSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),

  phoneNumber: Yup.string().required("Phone is required"),
  dateOfBirth: Yup.string().required("Date of birth required"),
  gender: Yup.string().required("Gender required"),
  bloodTypeId: Yup.string().required("Blood type required"),

  address: Yup.string().required("Address required"),
  emergencyContactName: Yup.string().required("Emergency name required"),
  emergencyContactPhone: Yup.string().required("Emergency phone required"),
});

export const DoctorSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),

  gender: Yup.string().required("Gender required"),
  specialtyId: Yup.string().required("Specialty ID required"),
  licenseNumber: Yup.string().required("License number required"),
});
