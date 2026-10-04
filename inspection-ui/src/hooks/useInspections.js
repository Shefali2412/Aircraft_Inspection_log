import { useCallback, useEffect, useState } from "react";
import { API_ERROR, deleteInspection, getInspections, uploadPhoto } from "../api";

// Custom hook: loads inspections (optionally filtered by registration)
// and gives the page functions to reload, delete and upload photos.
export function useInspections(reg = "") {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingId, setUploadingId] = useState(null);

  const reload = useCallback(async () => {
    try {
      setError("");
      setInspections(await getInspections(reg));
    } catch {
      setError(API_ERROR);
    } finally {
      setLoading(false);
    }
  }, [reg]);

  // Refetch when the filter changes (waits 300 ms after typing stops)
  useEffect(() => {
    const timer = setTimeout(reload, 300);
    return () => clearTimeout(timer);
  }, [reload]);

  // Returns true when the inspection was deleted
  const remove = useCallback(async (id) => {
    if (!window.confirm("Delete this inspection?")) return false;
    try {
      await deleteInspection(id);
      setInspections((list) => list.filter((i) => i.id !== id));
      return true;
    } catch {
      setError("Could not delete the inspection.");
      return false;
    }
  }, []);

  const upload = useCallback(async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const updated = await uploadPhoto(id, file);
      setInspections((list) => list.map((i) => (i.id === id ? updated : i)));
    } catch {
      setError("Photo upload failed. Try a smaller JPG or PNG.");
    } finally {
      setUploadingId(null);
    }
  }, []);

  return { inspections, loading, error, reload, remove, upload, uploadingId };
}
