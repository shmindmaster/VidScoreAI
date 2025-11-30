const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function initUpload(filename: string, mimeType: string, size: number) {
  const res = await fetch(`${API_URL}/videos/init-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, mimeType, size }),
  });
  if (!res.ok) throw new Error('Failed to init upload');
  return res.json();
}

export async function uploadFileToBlob(url: string, file: File) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream', 'x-ms-blob-type': 'BlockBlob' },
    body: file,
  });
  if (!res.ok) throw new Error('Failed to upload file to blob');
}

export async function confirmUpload(id: string) {
  const res = await fetch(`${API_URL}/videos/${id}/confirm`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to confirm upload');
  return res.json();
}

export async function getVideoStatus(id: string) {
  const res = await fetch(`${API_URL}/videos/${id}`);
  if (!res.ok) throw new Error('Failed to get video status');
  return res.json();
}
