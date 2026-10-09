var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

// Expuesto para que los tests de integración puedan usar WebApplicationFactory<Program>.
public partial class Program;
