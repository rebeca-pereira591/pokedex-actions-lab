using Pokedex.Api.PokeApi;
using Pokedex.Api.Tests.Fixtures;

namespace Pokedex.Api.Tests.PokeApi;

public class PokeApiClientTests
{
    private readonly PokeApiClient _client = FixtureClient.Create();
    private readonly CancellationToken _ct = TestContext.Current.CancellationToken;

    [Fact]
    public async Task Reads_pokemon_with_stats_types_and_artwork()
    {
        var gengar = await _client.GetPokemonAsync(94, _ct);

        Assert.Equal("gengar", gengar.Name);
        Assert.Equal(["ghost", "poison"], gengar.Types.OrderBy(t => t.Slot).Select(t => t.Type.Name));
        Assert.Equal(6, gengar.Stats.Count);
        Assert.Equal(130, gengar.Stats.Single(s => s.Stat.Name == "special-attack").BaseStat);
        Assert.EndsWith("/official-artwork/94.png", gengar.Sprites.Other.OfficialArtwork.FrontDefault);
    }

    [Fact]
    public async Task Reads_species_with_color_flags_and_evolution_chain()
    {
        var mew = await _client.GetSpeciesAsync(151, _ct);

        Assert.Equal("pink", mew.Color.Name);
        Assert.True(mew.IsMythical);
        Assert.False(mew.IsLegendary);
        Assert.Equal(1, mew.Generation.Id);
        Assert.True(mew.EvolutionChain.Id > 0);
    }

    [Fact]
    public async Task Reads_evolution_details()
    {
        var gengarChain = await _client.GetEvolutionChainAsync(40, _ct);

        var haunter = Assert.Single(gengarChain.Chain.EvolvesTo);
        Assert.Equal(25, haunter.EvolutionDetails.Single().MinLevel);
        Assert.Equal("trade", Assert.Single(haunter.EvolvesTo).EvolutionDetails.Single().Trigger.Name);
    }

    [Fact]
    public async Task Reads_species_index_type_and_generation()
    {
        var index = await _client.GetSpeciesIndexAsync(_ct);
        var ghost = await _client.GetTypeAsync("ghost", _ct);
        var gen1 = await _client.GetGenerationAsync(1, _ct);

        Assert.Equal(index.Count, index.Results.Count);
        Assert.Contains(ghost.DamageRelations.NoDamageFrom, t => t.Name == "normal");
        Assert.Contains(gen1.PokemonSpecies, s => s.Id == 151);
    }

    [Fact]
    public async Task Missing_resource_throws_not_found()
    {
        await Assert.ThrowsAsync<PokeApiNotFoundException>(() => _client.GetPokemonAsync(99999, _ct));
    }
}
