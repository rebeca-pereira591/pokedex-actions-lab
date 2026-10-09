using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Pokedex.Api.Tests.Fixtures;

// Levanta el API entero en memoria, con PokeAPI reemplazado por los fixtures.
public sealed class PokedexApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder) =>
        builder.UseSetting("PokeApi:FixturesPath", FixturePaths.PokeApi);
}
