import { useMemo } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import StatCard from "../components/StatCard";
import InspectionCard from "../components/InspectionCard";
import InspectionForm from "../components/InspectionForm";
import { useInspections } from "../hooks/useInspections";
import { countBy, formatDate } from "../utils";

const SEVERITIES = [
  { name: "High", className: "seg-high" },
  { name: "Medium", className: "seg-medium" },
  { name: "Low", className: "seg-low" },
];

// Reads :reg from the URL (/aircraft/PH-ABC).
// key={reg} gives each aircraft a fresh page, so no old data flashes when switching.
export default function AircraftPage() {
  const { reg } = useParams();
  return <AircraftDetails key={reg} reg={reg} />;
}

function AircraftDetails({ reg }) {
  const { refreshSidebar } = useOutletContext();
  const { inspections: results, loading, error, reload, remove, upload, uploadingId } =
    useInspections(reg);

  // The API filter uses Contains, so keep only this exact aircraft
  const inspections = useMemo(
    () => results.filter((i) => i.aircraftReg.toUpperCase() === reg.toUpperCase()),
    [results, reg]
  );

  const stats = useMemo(() => {
    const bySeverity = { High: 0, Medium: 0, Low: 0 };
    inspections.forEach((i) => {
      bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
    });
    return {
      total: inspections.length,
      bySeverity,
      last: inspections[0]?.inspectedAt, // API returns newest first
      photos: inspections.filter((i) => i.photoUrl).length,
    };
  }, [inspections]);

  const parts = useMemo(() => countBy(inspections, "part").slice(0, 5), [inspections]);

  async function handleDelete(id) {
    if (await remove(id)) refreshSidebar();
  }

  function handleCreated() {
    reload();
    refreshSidebar();
  }

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>{reg}</span>
      </nav>

      <section className="hero">
        <span className="hero-icon">✈</span>
        <div>
          <h1>{reg}</h1>
          <p>Inspection history and defects for this aircraft.</p>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="stats">
        <StatCard label="Inspections" value={stats.total} sub="on this aircraft" icon="📋" tone="blue" />
        <StatCard
          label="High severity"
          value={stats.bySeverity.High}
          sub="need attention"
          icon="⚠️"
          tone="red"
        />
        <StatCard
          label="Last inspected"
          value={formatDate(stats.last)}
          sub="most recent check"
          icon="🗓️"
          tone="orange"
          small
        />
        <StatCard
          label="With photos"
          value={stats.photos}
          sub={`of ${stats.total} inspections`}
          icon="📷"
          tone="green"
        />
      </section>

      <div className="grid">
        <section className="panel">
          <div className="panel-head">
            <h2>Inspection history</h2>
            <span className="count">{stats.total}</span>
          </div>
          {loading ? (
            <p className="empty-state">Loading inspections…</p>
          ) : inspections.length === 0 ? (
            <div className="empty-panel">
              <p className="empty-state">No inspections recorded for {reg}.</p>
              <Link to="/" className="btn btn-light">
                ← Back to dashboard
              </Link>
            </div>
          ) : (
            <div className="timeline">
              {inspections.map((i) => (
                <InspectionCard
                  key={i.id}
                  inspection={i}
                  showReg={false}
                  onDelete={handleDelete}
                  onUpload={upload}
                  uploading={uploadingId === i.id}
                />
              ))}
            </div>
          )}
        </section>

        <div className="side-col">
          <section className="panel">
            <div className="panel-head">
              <h2>Severity breakdown</h2>
            </div>
            {stats.total === 0 ? (
              <p className="empty-state">No data yet.</p>
            ) : (
              <>
                <div className="sev-bar">
                  {SEVERITIES.map((s) => (
                    <span
                      key={s.name}
                      className={s.className}
                      style={{ width: `${(stats.bySeverity[s.name] / stats.total) * 100}%` }}
                    />
                  ))}
                </div>
                <ul className="legend">
                  {SEVERITIES.map((s) => (
                    <li key={s.name}>
                      <span className="legend-key">
                        <span className={`swatch ${s.className}`} />
                        {s.name}
                      </span>
                      <span className="count">{stats.bySeverity[s.name]}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Most affected parts</h2>
            </div>
            {parts.length === 0 ? (
              <p className="empty-state">No data yet.</p>
            ) : (
              <ul className="legend">
                {parts.map(([part, count]) => (
                  <li key={part}>
                    <span>{part}</span>
                    <span className="count">
                      {count} defect{count === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Add inspection</h2>
            </div>
            <InspectionForm fixedReg={reg} onCreated={handleCreated} />
          </section>
        </div>
      </div>
    </>
  );
}
