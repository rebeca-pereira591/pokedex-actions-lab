namespace Pokedex.Api.PokeApi;

public static class Sprites
{
    // El artwork oficial se puede armar con el id, sin pedir el Pokémon entero.
    // Se usa para los miembros de una cadena evolutiva.
    public static string OfficialArtwork(int id) =>
        $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png";
}
