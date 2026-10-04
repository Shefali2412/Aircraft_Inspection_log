// All calls to the ASP.NET Core API live in this one file.
// Change 5169 if your API runs on a different port.
export const API_BASE = "http://localhost:5169";
const API = `${API_BASE}/api/inspections`;

export const API_ERROR =
  "Could not reach the API. Is the backend running (dotnet run) on port 5169?";

async function handleResponse(res) {
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.status === 204 ? null : res.json(); // 204 No Content has no body
}

// GET /api/inspections  or  GET /api/inspections?reg=PH-ABC
export async function getInspections(reg = "") {
  const query = reg.trim();
  const url = query ? `${API}?reg=${encodeURIComponent(query)}` : API;
  return handleResponse(await fetch(url));
}

// POST /api/inspections
export async function createInspection(inspection) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inspection),
  });
  return handleResponse(res);
}

// DELETE /api/inspections/{id}
export async function deleteInspection(id) {
  return handleResponse(await fetch(`${API}/${id}`, { method: "DELETE" }));
}

// POST /api/inspections/{id}/photo
export async function uploadPhoto(id, file) {
  const data = new FormData();
  data.append("file", file); // must match "IFormFile file" in the controller
  return handleResponse(await fetch(`${API}/${id}/photo`, { method: "POST", body: data }));
}

export function photoSrc(photoUrl) {
  return `${API_BASE}${photoUrl}`;
}
