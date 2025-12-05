import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, saveProfile } from "../../store/patientProfileSlice";
import toast from "react-hot-toast";

export default function PatientProfile() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((s) => s.profile);
  

  const [form, setForm] = useState({});

  useEffect(() => {
    console.log("Hlooo useeffect is working");
    dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    
    if (data) setForm(data);
    console.log(data);
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await dispatch(saveProfile(form)).unwrap();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="text-sm">Full Name</label>
          <input name="fullName" className="input" value={form.fullName || ""} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm">Phone</label>
          <input name="phoneNumber" className="input" value={form.phoneNumber || ""} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm">Gender</label>
          <select name="gender" className="input" value={form.gender || ""} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Date of Birth</label>
          <input type="date" name="dateOfBirth" className="input"
            value={form.dateOfBirth?.substring(0, 10) || ""}
            onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm">Blood Type</label>
          <input name="bloodTypeName" disabled className="input bg-gray-100" value={form.bloodTypeName || ""} />
        </div>

        <div className="col-span-2">
          <label className="text-sm">Address</label>
          <textarea name="address" className="input" value={form.address || ""} onChange={handleChange} />
        </div>
      </div>

      <button
        onClick={submit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
