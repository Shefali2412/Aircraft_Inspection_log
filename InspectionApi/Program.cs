using InspectionApi.Data;                    // NEW
using Microsoft.EntityFrameworkCore;         // NEW

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// NEW: register the database
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite("Data Source=inspections.db"));

// NEW: allow the React app (port 5173) to call this API
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();   // NEW: commented out for local development

app.UseCors("frontend");        // NEW
app.UseStaticFiles();           // NEW: serves uploaded photos from wwwroot

app.UseAuthorization();

app.MapControllers();

app.Run();