// connection to the database, Every time your code reads or saves inspections, it goes through this class

using Microsoft.EntityFrameworkCore;
using InspectionApi.Models;

namespace InspectionApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Inspection> Inspections => Set<Inspection>();
}