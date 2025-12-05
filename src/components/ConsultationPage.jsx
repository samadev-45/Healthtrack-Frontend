import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getConsultationDetails,
  updateConsultation,
  finalizeConsultation,
} from "../api/consultation";
import toast from "react-hot-toast";

export default function ConsultationPage() {
  const { consultationId } = useParams();

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState({
    chiefComplaint: "",
    diagnosis: "",
    advice: "",
    doctorNotes: "",
    followUpDate: "",
  });

  useEffect(() => {
    console.log("Fetching consultation", consultationId);
    loadConsultation();
  }, [consultationId]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const res = await getConsultationDetails(consultationId);
      console.log("CONSULTATION LOADED:", res);
      setConsultation(res);
      setForm({
        chiefComplaint: res.chiefComplaint ?? "",
        diagnosis: res.diagnosis ?? "",
        advice: res.advice ?? "",
        doctorNotes: res.doctorNotes ?? "",
        followUpDate: res.followUpDate?.split("T")[0] ?? "",
      });
    } catch (e) {
      toast.error("Unable to load consultation");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await updateConsultation(consultationId, form);
      toast.success("Saved successfully");
      loadConsultation();
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeConsultation(consultationId);
      toast.success("Consultation Finalized");
      loadConsultation();
    } catch (e) {
      toast.error(e.response?.data?.message || "Finalize failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
if (!consultation) return <div className="p-6">Loading details...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Consultation #{consultationId}
      </h1>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Chief Complaint</label>
          <textarea
            name="chiefComplaint"
            value={form.chiefComplaint}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Advice</label>
          <textarea
            name="advice"
            value={form.advice}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Doctor Notes</label>
          <textarea
            name="doctorNotes"
            value={form.doctorNotes}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

           {consultation && !consultation.isPrescriptionGenerated && (
    <button
      onClick={handleFinalize}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Finalize & Generate Prescription
    </button>
          )}
        </div>
      </div>
    </div>
  );
}
