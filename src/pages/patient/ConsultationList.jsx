
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientConsultations } from "../../store/consultationsSlice";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

export default function ConsultationList() {
  const dispatch = useDispatch();
  const { items, totalCount, loading } = useSelector((s) => s.consultations.list);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchPatientConsultations({ page, pageSize }));
  }, [dispatch, page]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Consultations</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((it) => {
              const id = it.consultationId;
              return (
                <div key={id} className="p-3 bg-white rounded shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-medium">{it.patientName ?? "Consultation"}</div>
                    <div className="text-sm text-gray-600">{it.diagnosis ?? ""}</div>
                    <div className="text-xs text-gray-500">{new Date(it.createdOn).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm px-2 py-1 bg-gray-100 rounded">{it.status}</div>
                    <Link to={`/patient/consultations/${id}`} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">View</Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Pagination current={page} total={totalCount} pageSize={pageSize} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
