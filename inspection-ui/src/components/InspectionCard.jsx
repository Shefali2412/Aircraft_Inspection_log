import { Link } from "react-router-dom";
import { photoSrc } from "../api";
import { aircraftPath, formatDate, severityClass } from "../utils";

// One inspection. showReg = false on the aircraft page (the reg is already the title).
export default function InspectionCard({ inspection: i, onDelete, onUpload, uploading, showReg = true }) {
  return (
    <article className="card">
      {i.photoUrl ? (
        <a className="thumb-link" href={photoSrc(i.photoUrl)} target="_blank" rel="noreferrer">
          <img className="thumb" src={photoSrc(i.photoUrl)} alt={`${i.defectType} on ${i.part}`} />
        </a>
      ) : (
        <div className="thumb empty">No photo</div>
      )}

      <div className="card-body">
        <div className="card-top">
          <span className={severityClass(i.severity)}>{i.severity}</span>
          {showReg && (
            <Link to={aircraftPath(i.aircraftReg)} className="reg reg-link">
              {i.aircraftReg}
            </Link>
          )}
        </div>
        <h3>
          {i.defectType} · {i.part}
        </h3>
        {i.notes && <p className="notes">{i.notes}</p>}
        <p className="meta">
          {formatDate(i.inspectedAt)}
          {i.inspector && ` · ${i.inspector}`}
        </p>

        <div className="actions">
          <label className="btn btn-light">
            {uploading ? "Uploading…" : i.photoUrl ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading}
              onChange={(e) => {
                onUpload(i.id, e.target.files[0]);
                e.target.value = ""; // lets you pick the same file again
              }}
            />
          </label>
          <button className="btn btn-danger" onClick={() => onDelete(i.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
