import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConsultationDetails, clearDetails } from "../../store/consultationsSlice";
import { useParams, Link } from "react-router-dom";
import HealthValuesTable from "../../components/HealthValuesTable.jsx"
import AttachmentList from "../../components/AttachmentList";
import PrescriptionPanel from "../../components/PrescriptionPanel";

export default function ConsultationDetails() {
  const { consultationId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector((s) => s.consultations.details.data);
  const loading = useSelector((s) => s.consultations.details.loading);

  useEffect(() => {
    dispatch(fetchConsultationDetails(Number(consultationId)));
    return () => dispatch(clearDetails());
  }, [dispatch, consultationId]);

  if (loading || !details) return <div className="p-4">Loading...</div>;

  const id = details.consultationId ?? details.ConsultationId;

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Consultation #{id}</h1>
          <div className="text-sm text-gray-600">
            Doctor: {details.doctorName ?? details.DoctorName}
          </div>
        </div>
        <Link to="/patient/consultations" className="text-sm text-blue-600">
          Back
        </Link>
      </div>

      {/* Diagnosis + Health Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium mb-2">Diagnosis</h3>
          <div className="mb-3">{details.diagnosis ?? details.Diagnosis ?? "—"}</div>

          <h3 className="font-medium mb-2">Advice</h3>
          <div className="mb-3">{details.advice ?? details.Advice ?? "—"}</div>

          <h3 className="font-medium mb-2">Doctor Notes</h3>
          <div className="mb-3">{details.doctorNotes ?? details.DoctorNotes ?? "—"}</div>

          <h3 className="font-medium mb-2">Follow-up</h3>
          <div>
            {details.followUpDate
              ? new Date(details.followUpDate).toLocaleDateString()
              : "No follow-up"}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-medium mb-2">Health Values</h3>
          <HealthValuesTable values={details.healthValues ?? details.HealthValues ?? {}} />

          <h3 className="font-medium mt-4 mb-2">Trend Summary</h3>
          <div className="text-sm text-gray-700">
            {details.trendSummary ?? details.TrendSummary ?? "No trend data."}
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="mt-6 bg-white p-4 rounded shadow-sm">
        <h3 className="font-medium mb-3">Attachments</h3>
        <AttachmentList
          consultationId={id}
          attachments={details.attachments ?? details.Attachments}
        />
      </div>

      {/* Prescription Panel (Doctor editable) */}
      <div className="mt-6">
        <PrescriptionPanel consultationId={Number(id)} />
      </div>
    </div>
  );
}
