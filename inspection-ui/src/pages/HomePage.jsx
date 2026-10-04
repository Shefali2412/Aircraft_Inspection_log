import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import StatCard from "../components/StatCard";
import InspectionCard from "../components/InspectionCard";
import InspectionForm from "../components/InspectionForm";
import { useInspections } from "../hooks/useInspections";
import { aircraftPath, formatDate, summarizeFleet } from "../utils";

export default function HomePage() {
  // search + refreshSidebar come from Layout through <Outlet context>
  const { search, setSearch, refreshSidebar } = useOutletContext();
  const { inspections, loading, error, reload, remove, upload, uploadingId } =
    useInspections(search);

  const stats = useMemo(
    () => ({
      total: inspections.length,
      high: inspections.filter((i) => i.severity === "High").length,
      aircraft: new Set(inspections.map((i) => i.aircraftReg)).size,
      photos: inspections.filter((i) => i.photoUrl).length,
    }),
    [inspections]
  );

  const fleet = useMemo(() => summarizeFleet(inspections), [inspections]);

  const attention = useMemo(
    () => inspections.filter((i) => i.severity === "High").slice(0, 5),
    [inspections]
  );

  async function handleDelete(id) {
    if (await remove(id)) refreshSidebar();
  }

  function handleCreated() {
    reload();
    refreshSidebar();
  }

  return (
    <>
      <section className="page-head">
        <h1>Line Maintenance</h1>
        <p>Welcome back. Here's what's happening with your inspections.</p>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="stats">
        <StatCard
          label="Inspections"
          value={stats.total}
          sub={search ? `filtered by "${search}"` : "all records"}
          icon="📋"
          tone="blue"
        />
        <StatCard label="High severity" value={stats.high} sub="need attention" icon="⚠️" tone="red" />
        <StatCard label="Aircraft" value={stats.aircraft} sub="with inspections" icon="✈️" tone="orange" />
        <StatCard
          label="With photos"
          value={stats.photos}
          sub={`of ${stats.total} inspections`}
          icon="📷"
          tone="green"
        />
      </section>

      <div className="grid">
        <div className="main-col">
          {/* Aircraft fleet: each row opens the aircraft detail page */}
          <section className="panel">
            <div className="panel-head">
              <h2>Aircraft fleet</h2>
              {search && (
                <button className="link-btn" onClick={() => setSearch("")}>
                  Show all
                </button>
              )}
            </div>
            {loading ? (
              <p className="empty-state">Loading…</p>
            ) : fleet.length === 0 ? (
              <p className="empty-state">No aircraft yet.</p>
            ) : (
              <ul className="fleet">
                {fleet.map((a) => (
                  <li key={a.reg}>
                    <Link to={aircraftPath(a.reg)} className="fleet-row">
                      <span className="icon-box">✈</span>
                      <span className="fleet-info">
                        <span className="reg">{a.reg}</span>
                        <span className="fleet-sub">
                          {a.count} inspection{a.count === 1 ? "" : "s"} · last {formatDate(a.last)}
                        </span>
                      </span>
                      {a.high > 0 ? (
                        <span className="pill pill-red">{a.high} high</span>
                      ) : (
                        <span className="pill pill-green">no high</span>
                      )}
                      <span className="chev">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* All inspections */}
          <section className="panel">
            <div className="panel-head">
              <h2>Recent inspections</h2>
              <span className="count">{inspections.length}</span>
            </div>
            {loading ? (
              <p className="empty-state">Loading inspections…</p>
            ) : inspections.length === 0 ? (
              <p className="empty-state">
                {search
                  ? `No inspections found for "${search}".`
                  : "No inspections yet. Add one with the form."}
              </p>
            ) : (
              <div className="list">
                {inspections.map((i) => (
                  <InspectionCard
                    key={i.id}
                    inspection={i}
                    onDelete={handleDelete}
                    onUpload={upload}
                    uploading={uploadingId === i.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="side-col">
          <section className="panel">
            <div className="panel-head">
              <h2>New inspection</h2>
            </div>
            <InspectionForm onCreated={handleCreated} />
          </section>

          {/* High severity items, like "pending tasks" */}
          <section className="panel">
            <div className="panel-head">
              <h2>Needs attention</h2>
              <span className="count">{stats.high}</span>
            </div>
            {attention.length === 0 ? (
              <p className="empty-state">No high severity defects. 👍</p>
            ) : (
              <ul className="attention">
                {attention.map((i) => (
                  <li key={i.id}>
                    <Link to={aircraftPath(i.aircraftReg)}>
                      <span className="dot" />
                      <span>
                        <span className="attention-title">
                          {i.defectType} · {i.part}
                        </span>
                        <span className="attention-sub">
                          {i.aircraftReg} · {formatDate(i.inspectedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
