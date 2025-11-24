// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ current = 1, total = 0, pageSize = 10, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  const maxPagesToShow = 7;
  let start = Math.max(1, current - Math.floor(maxPagesToShow / 2));
  let end = Math.min(totalPages, start + maxPagesToShow - 1);
  if (end - start + 1 < maxPagesToShow) start = Math.max(1, end - maxPagesToShow + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onPageChange(Math.max(1, current - 1))} className="px-3 py-1 rounded bg-gray-100">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded ${p === current ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, current + 1))} className="px-3 py-1 rounded bg-gray-100">Next</button>
    </div>
  );
}
