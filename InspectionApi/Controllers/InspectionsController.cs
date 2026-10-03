using InspectionApi.Data; 
using InspectionApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//namespace: a label that groups related classes, so names don't clash and code stays organized.
namespace InspectionApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InspectionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public InspectionsController(AppDbContext db) => _db = db;   // dependency injection

    [HttpGet]  // GET /api/inspections?reg=PH-ABC
    public async Task<ActionResult<List<Inspection>>> GetAll(string? reg)
    {
        var query = _db.Inspections.AsQueryable();
        if (!string.IsNullOrWhiteSpace(reg))
            query = query.Where(i => i.AircraftReg.Contains(reg));
        return await query.OrderByDescending(i => i.InspectedAt).ToListAsync();
    }

[HttpGet("{id}")]  // GET /api/inspections/1
public async Task<ActionResult<Inspection>> Get(int id)
    {
        var item = await _db.Inspections.FindAsync(id);
        if (item is null) return NotFound();
        return item;
    }

    [HttpPost]  // POST /api/inspections
    public async Task<ActionResult<Inspection>> Create(Inspection input)
    {
        _db.Inspections.Add(input);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
    }

    [HttpDelete("{id}")] // Delete /api/inspections
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Inspections.FindAsync(id);
        if (item is null) return NotFound();
        _db.Inspections.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        var item = await _db.Inspections.FindAsync(id);
        if (item is null) return NotFound();

        var folder = Path.Combine("wwwroot", "uploads");
        Directory.CreateDirectory(folder);
        var name = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        await using var stream = System.IO.File.Create(Path.Combine(folder, name));
        await file.CopyToAsync(stream);

        item.PhotoUrl = $"/uploads/{name}";
        await _db.SaveChangesAsync();
        return Ok(item);
    }
}
