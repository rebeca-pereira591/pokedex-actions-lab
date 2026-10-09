namespace Pokedex.Api.PokeApi;

public sealed class PokeApiOptions
{
    public const string Section = "PokeApi";

    public string BaseUrl { get; set; } = "https://pokeapi.co/api/v2/";

    // Si tiene valor, no se usa la red: se responde con los JSON de esa carpeta.
    // Puede ser relativa a la carpeta del proyecto.
    public string? FixturesPath { get; set; }
}
