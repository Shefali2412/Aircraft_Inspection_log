namespace InspectionApi.Models;

public class Inspection
{
    public int Id { get; set; }
    public string AircraftReg { get; set; } = "";   // e.g. PH-ABC
    public string Part { get; set; } = "";          // e.g. Left wing
    public string DefectType { get; set; } = "";    // e.g. Corrosion
    public string Severity { get; set; } = "Low";   // Low, Medium, High
    public string Notes { get; set; } = "";
    public string Inspector { get; set; } = "";
    public DateTime InspectedAt { get; set; } = DateTime.UtcNow;
    public string? PhotoUrl { get; set; }
}