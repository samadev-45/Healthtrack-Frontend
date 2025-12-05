// src/pages/doctor/ConsultationList.jsx
import React, { useEffect, useState } from "react";
import { getConsultationsByDoctor } from "../../api/consultation";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ConsultationList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "",
    fromDate: "",
    toDate: "",
  });

  const [data, setData] = useState({
    records: [],
    totalCount: 0,
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadConsultations = async () => {
    try {
      const res = await getConsultationsByDoctor({
        status: filters.status || null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        page,
        pageSize,
      });

      setData({
        records: res.items ?? res.Items ?? [],
        totalCount: res.totalCount ?? res.TotalCount ?? 0,
      });
    } catch (err) {
      toast.error("Failed to load consultations");
    }
  };

  useEffect(() => {
    loadConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilter = () => {
    setPage(1);
    loadConsultations();
  };

  const statusMap = {
    0: "Draft",
    1: "Finalized",
  };

  const statusColor = {
    0: "text-yellow-700 bg-yellow-100",
    1: "text-green-700 bg-green-100",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Consultations</h1>

      {/* Filters */}
      <div className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="font-medium block mb-1">Status</label>
          <select
            className="border rounded p-2 w-full"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="0">Draft</option>
            <option value="1">Finalized</option>
          </select>
        </div>

        <div>
          <label className="font-medium block mb-1">From Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={filters.fromDate}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
          />
        </div>

        <div>
          <label className="font-medium block mb-1">To Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={filters.toDate}
            onChange={(e) =>
              setFilters({ ...filters, toDate: e.target.value })
            }
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={applyFilter}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Filter
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.records.length === 0 && (
          <div className="text-center text-gray-500">
            No consultations found
          </div>
        )}

        {data.records.map((c) => (
          <div
            key={c.consultationId}
            className="bg-white shadow p-4 rounded border cursor-pointer hover:bg-gray-50"
            onClick={() =>
              navigate(`/doctor/consultation/${c.consultationId}`)
            }
          >
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">
                {c.patientName || "Unknown Patient"}
              </h2>

              <span
                className={
                  "px-3 py-1 text-sm rounded " + statusColor[c.status]
                }
              >
                {statusMap[c.status]}
              </span>
            </div>

            <p className="text-gray-600 mt-1">
              {c.createdOn
                ? new Date(c.createdOn).toLocaleString()
                : "—"}
            </p>

            <p className="mt-2 text-gray-700 line-clamp-2">
              <b>Diagnosis:</b> {c.diagnosis || "N/A"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalCount={data.totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
