export function formatDate(value) {
  if (!value) return "–";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function severityClass(severity) {
  return `badge sev-${(severity || "low").toLowerCase()}`;
}

export function aircraftPath(reg) {
  return `/aircraft/${encodeURIComponent(reg)}`;
}

// Turns a list of inspections into [["PH-ABC", 3], ["PH-XYZ", 1], ...]
export function countBy(inspections, key) {
  const counts = {};
  inspections.forEach((i) => {
    counts[i[key]] = (counts[i[key]] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// One summary row per aircraft: how many inspections, how many High, last date
export function summarizeFleet(inspections) {
  const fleet = {};
  inspections.forEach((i) => {
    const row = fleet[i.aircraftReg] || { reg: i.aircraftReg, count: 0, high: 0, last: null };
    row.count += 1;
    if (i.severity === "High") row.high += 1;
    if (!row.last || new Date(i.inspectedAt) > new Date(row.last)) row.last = i.inspectedAt;
    fleet[i.aircraftReg] = row;
  });
  return Object.values(fleet).sort((a, b) => new Date(b.last) - new Date(a.last));
}
