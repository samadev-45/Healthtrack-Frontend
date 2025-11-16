import * as Yup from "yup";

export const PatientSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email().required("Email required"),
  password: Yup.string().min(6).required("Password required"),

  phoneNumber: Yup.string().required("Phone is required"),
  dateOfBirth: Yup.date().required("DOB required"),
  gender: Yup.number().required("Gender required"),
  bloodTypeId: Yup.string().required("Blood type required"),

  address: Yup.string().required("Address required"),
  emergencyContactName: Yup.string().required("Emergency name required"),
  emergencyContactPhone: Yup.string().required("Emergency phone required"),
});

export const DoctorSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email().required("Email required"),
  password: Yup.string().min(6).required("Password required"),

  gender: Yup.number().required("Gender required"),
  specialtyId: Yup.number()
    .typeError("Specialty ID must be a number")
    .required("Specialty ID required"),
  licenseNumber: Yup.string().required("License number required"),
});

export const CaretakerSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email().required("Email required"),
  password: Yup.string().min(6).required("Password required"),
});
