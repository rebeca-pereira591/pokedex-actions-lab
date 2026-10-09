using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Caching.Hybrid;

namespace Pokedex.Api.PokeApi;

public static class PokeApiJson
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
    };
}

public sealed class PokeApiNotFoundException(string path) : Exception($"PokeAPI no tiene '{path}'.");

// Cliente tipado de PokeAPI. Cada respuesta se guarda en caché: PokeAPI pide no repetir consultas,
// y sus datos casi no cambian.
public sealed class PokeApiClient(HttpClient http, HybridCache cache)
{
    public Task<SpeciesIndex> GetSpeciesIndexAsync(CancellationToken ct) =>
        GetAsync<SpeciesIndex>("pokemon-species?limit=2000", ct);

    public Task<ApiPokemon> GetPokemonAsync(int id, CancellationToken ct) =>
        GetAsync<ApiPokemon>($"pokemon/{id}", ct);

    public Task<ApiSpecies> GetSpeciesAsync(int id, CancellationToken ct) =>
        GetAsync<ApiSpecies>($"pokemon-species/{id}", ct);

    public Task<ApiEvolutionChain> GetEvolutionChainAsync(int id, CancellationToken ct) =>
        GetAsync<ApiEvolutionChain>($"evolution-chain/{id}", ct);

    public Task<ApiType> GetTypeAsync(string name, CancellationToken ct) =>
        GetAsync<ApiType>($"type/{name}", ct);

    public Task<ApiGeneration> GetGenerationAsync(int id, CancellationToken ct) =>
        GetAsync<ApiGeneration>($"generation/{id}", ct);

    private async Task<T> GetAsync<T>(string path, CancellationToken ct) =>
        await cache.GetOrCreateAsync(
            $"pokeapi:{path}",
            async token => await FetchAsync<T>(path, token),
            cancellationToken: ct);

    private async Task<T> FetchAsync<T>(string path, CancellationToken ct)
    {
        using var response = await http.GetAsync(path, ct);
        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            throw new PokeApiNotFoundException(path);
        }

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<T>(PokeApiJson.Options, ct);
        return body ?? throw new InvalidOperationException($"PokeAPI devolvió un cuerpo vacío para '{path}'.");
    }
}
