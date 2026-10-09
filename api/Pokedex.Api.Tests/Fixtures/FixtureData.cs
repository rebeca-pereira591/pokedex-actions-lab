using System.Text.Json;
using Pokedex.Api.Domain;
using Pokedex.Api.PokeApi;

namespace Pokedex.Api.Tests.Fixtures;

// Lee un fixture directamente, para los tests de reglas que no necesitan el cliente.
public static class FixtureData
{
    public static T Load<T>(string relativePath)
    {
        var json = File.ReadAllText(Path.Combine(FixturePaths.PokeApi, relativePath + ".json"));
        return JsonSerializer.Deserialize<T>(json, PokeApiJson.Options)!;
    }

    public static DefendingType Type(string name)
    {
        var relations = Load<ApiType>($"type/{name}").DamageRelations;
        return new DefendingType(
            name,
            relations.DoubleDamageFrom.Select(t => t.Name).ToHashSet(),
            relations.HalfDamageFrom.Select(t => t.Name).ToHashSet(),
            relations.NoDamageFrom.Select(t => t.Name).ToHashSet());
    }

    public static ChainLink Chain(int id) => Load<ApiEvolutionChain>($"evolution-chain/{id}").Chain;
}
