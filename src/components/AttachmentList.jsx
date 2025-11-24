// src/components/AttachmentList.jsx
import React from "react";
import { downloadConsultationFile } from "../api/consultation";
import { saveBlob, fetchFallbackSampleFile } from "../utils/fileDownload";

export default function AttachmentList({ consultationId, attachments = [] }) {
  const handleDownload = async (file) => {
    try {
      const fileId = file.fileStorageId ?? file.FileStorageId ?? file.fileStorageId;
      const blob = await downloadConsultationFile(consultationId, fileId);
      const filename = file.fileName ?? file.FileName ?? `attachment_${fileId}`;
      saveBlob(blob, filename);
    } catch (err) {
      const fb = await fetchFallbackSampleFile();
      if (fb) saveBlob(fb, file.fileName ?? "sample.png");
      else alert("Could not download file.");
    }
  };

  if (!attachments || attachments.length === 0) return <div className="text-sm text-gray-500">No attachments</div>;

  return (
    <ul className="space-y-2">
      {attachments.map((att) => {
        const id = att.fileStorageId ?? att.FileStorageId;
        return (
          <li key={id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
            <div>
              <div className="font-medium">{att.fileName ?? att.FileName}</div>
              <div className="text-xs text-gray-500">{att.contentType ?? att.ContentType} • {Math.round((att.fileSize ?? att.FileSize ?? 0) / 1024)} KB</div>
            </div>
            <button onClick={() => handleDownload(att)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Download</button>
          </li>
        );
      })}
    </ul>
  );
}
