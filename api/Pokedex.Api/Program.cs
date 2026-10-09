using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;
using Pokedex.Api.PokeApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddOptions<PokeApiOptions>().BindConfiguration(PokeApiOptions.Section);

builder.Services.AddHybridCache(options =>
{
    // Los datos de PokeAPI casi no cambian: medio día en memoria alcanza
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromHours(12),
        LocalCacheExpiration = TimeSpan.FromHours(12),
    };
});

builder.Services
    .AddHttpClient<PokeApiClient>((sp, client) =>
    {
        var options = sp.GetRequiredService<IOptions<PokeApiOptions>>().Value;
        client.BaseAddress = new Uri(options.BaseUrl);
    })
    .ConfigurePrimaryHttpMessageHandler(sp =>
    {
        var options = sp.GetRequiredService<IOptions<PokeApiOptions>>().Value;
        if (string.IsNullOrWhiteSpace(options.FixturesPath))
        {
            return new SocketsHttpHandler();
        }

        var root = Path.GetFullPath(options.FixturesPath, sp.GetRequiredService<IHostEnvironment>().ContentRootPath);
        return new FixtureMessageHandler(root);
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

// Expuesto para que los tests de integración puedan usar WebApplicationFactory<Program>.
public partial class Program;
