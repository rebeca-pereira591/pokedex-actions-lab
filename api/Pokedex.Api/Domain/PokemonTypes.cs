namespace Pokedex.Api.Domain;

public static class PokemonTypes
{
    // Los 18 tipos, en el orden de los juegos, con su nombre oficial en español (el de PokeAPI).
    private static readonly (string Name, string Label)[] Types =
    [
        ("normal", "Normal"), ("fire", "Fuego"), ("water", "Agua"), ("electric", "Eléctrico"),
        ("grass", "Planta"), ("ice", "Hielo"), ("fighting", "Lucha"), ("poison", "Veneno"),
        ("ground", "Tierra"), ("flying", "Volador"), ("psychic", "Psíquico"), ("bug", "Bicho"),
        ("rock", "Roca"), ("ghost", "Fantasma"), ("dragon", "Dragón"), ("dark", "Siniestro"),
        ("steel", "Acero"), ("fairy", "Hada"),
    ];

    private static readonly Dictionary<string, string> Labels = Types.ToDictionary(t => t.Name, t => t.Label);

    public static IReadOnlyList<string> All { get; } = Types.Select(t => t.Name).ToArray();

    public static bool IsKnown(string name) => Labels.ContainsKey(name);

    public static string Label(string name) => Labels.TryGetValue(name, out var label) ? label : name;
}
