namespace Pokedex.Api.Tests.Fixtures;

public static class FixturePaths
{
    // Sube desde la carpeta de los binarios hasta encontrar fixtures/pokeapi en la raíz del repo.
    public static string PokeApi { get; } = Find();

    private static string Find()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, "fixtures", "pokeapi");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }
        }

        throw new DirectoryNotFoundException("No se encontró fixtures/pokeapi subiendo desde " + AppContext.BaseDirectory);
    }
}
