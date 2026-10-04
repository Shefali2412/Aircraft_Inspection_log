import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AircraftPage from "./pages/AircraftPage";

function NotFound() {
  return (
    <div className="panel empty-panel">
      <p className="empty-state">Page not found.</p>
      <Link to="/" className="btn btn-light">
        ← Back to dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout = top bar + sidebar, the page renders inside its <Outlet /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/aircraft/:reg" element={<AircraftPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
