using System.Net;
using System.Text;

namespace Pokedex.Api.PokeApi;

// Reemplaza la red: responde cada pedido a PokeAPI con el JSON grabado en fixtures/pokeapi/.
// Lo usan los tests y el modo offline (PokeApi:FixturesPath). Si el archivo no existe, devuelve 404,
// igual que PokeAPI con un recurso inexistente.
public sealed class FixtureMessageHandler(string root) : HttpMessageHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var file = Path.Combine(root, ToRelativePath(request.RequestUri!) + ".json");
        if (!File.Exists(file))
        {
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        var json = await File.ReadAllTextAsync(file, cancellationToken);
        return new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json"),
        };
    }

    // "/api/v2/pokemon/94" -> "pokemon/94"; el índice "/api/v2/pokemon-species?limit=2000" -> "pokemon-species/index"
    private static string ToRelativePath(Uri uri)
    {
        var path = uri.AbsolutePath.Trim('/');
        const string prefix = "api/v2/";
        if (path.StartsWith(prefix, StringComparison.Ordinal))
        {
            path = path[prefix.Length..];
        }

        return path == "pokemon-species" ? "pokemon-species/index" : path;
    }
}
