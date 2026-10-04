export default function StatCard({ label, value, sub, icon, tone, small = false }) {
  return (
    <div className="stat">
      <div>
        <p className="stat-label">{label}</p>
        <p className={small ? "stat-value small" : "stat-value"}>{value}</p>
        <p className="stat-sub">{sub}</p>
      </div>
      <span className={`stat-icon tone-${tone}`}>{icon}</span>
    </div>
  );
}
