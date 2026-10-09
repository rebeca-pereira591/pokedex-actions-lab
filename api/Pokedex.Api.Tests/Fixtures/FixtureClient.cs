using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;
using Pokedex.Api.PokeApi;

namespace Pokedex.Api.Tests.Fixtures;

// Un PokeApiClient real que lee de los fixtures en lugar de la red.
public static class FixtureClient
{
    public static PokeApiClient Create()
    {
        var http = new HttpClient(new FixtureMessageHandler(FixturePaths.PokeApi))
        {
            BaseAddress = new Uri("https://pokeapi.co/api/v2/"),
        };
        var cache = new ServiceCollection().AddHybridCache().Services.BuildServiceProvider().GetRequiredService<HybridCache>();
        return new PokeApiClient(http, cache);
    }
}
