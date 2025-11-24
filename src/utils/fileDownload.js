// src/utils/fileDownload.js
export function saveBlob(blob, filename = "file") {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Local fallback to the uploaded sample file for dev
export async function fetchFallbackSampleFile() {
  const localPath = "/mnt/data/616f093f-8a34-44f2-b35b-61cdfcc9fb2a.png";
  try {
    const res = await fetch(localPath);
    if (!res.ok) throw new Error("fallback file not available");
    const blob = await res.blob();
    return blob;
  } catch {
    return null;
  }
}
