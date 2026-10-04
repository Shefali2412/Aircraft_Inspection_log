import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getInspections } from "../api";
import { aircraftPath, countBy } from "../utils";

export default function Layout() {
  const [search, setSearch] = useState("");
  const [aircraft, setAircraft] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Loads all aircraft for the sidebar. Pages call this after adding or deleting.
  const refreshSidebar = useCallback(async () => {
    try {
      const all = await getInspections();
      setAircraft(countBy(all, "aircraftReg").sort((a, b) => a[0].localeCompare(b[0])));
    } catch {
      setAircraft([]);
    }
  }, []);

  useEffect(() => {
    refreshSidebar();
  }, [refreshSidebar]);

  // Start at the top when switching pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Searching always shows results on the dashboard
  function handleSearch(value) {
    setSearch(value);
    if (location.pathname !== "/") navigate("/");
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="logo">✈</span>
          InspectLog
        </Link>
        <div className="search">
          <input
            type="text"
            placeholder="Filter by aircraft registration, e.g. PH-ABC"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button className="clear" onClick={() => setSearch("")} aria-label="Clear filter">
              ×
            </button>
          )}
        </div>
      </header>

      <div className="layout">
        {/* Sidebar: becomes a horizontal menu on small screens */}
        <aside className="sidebar">
          <div className="sidebar-inner">
            <p className="side-label">Main</p>
            <nav className="side-nav">
              <NavLink to="/" end>
                Dashboard
              </NavLink>
            </nav>

            <p className="side-label">Aircraft</p>
            <nav className="side-nav">
              {aircraft.length === 0 ? (
                <span className="side-empty">No aircraft yet</span>
              ) : (
                aircraft.map(([reg, count]) => (
                  <NavLink key={reg} to={aircraftPath(reg)}>
                    <span>{reg}</span>
                    <span className="side-count">{count}</span>
                  </NavLink>
                ))
              )}
            </nav>
          </div>
        </aside>

        <main className="content">
          {/* Shared values every page can read with useOutletContext() */}
          <Outlet context={{ search, setSearch, refreshSidebar }} />
        </main>
      </div>
    </div>
  );
}
