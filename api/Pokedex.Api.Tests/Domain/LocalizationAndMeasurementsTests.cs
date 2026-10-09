using Pokedex.Api.Domain;
using Pokedex.Api.PokeApi;
using Pokedex.Api.Tests.Fixtures;

namespace Pokedex.Api.Tests.Domain;

public class LocalizationAndMeasurementsTests
{
    [Fact]
    public void Picks_the_newest_spanish_flavor_text_without_line_breaks()
    {
        var gengar = FixtureData.Load<ApiSpecies>("pokemon-species/94");

        var text = Localization.PickSpanish(gengar.FlavorTextEntries.Select(e => new LocalizedText(e.Language.Name, e.FlavorText)));

        Assert.Equal("Dicen que sale de la oscuridad para robarles el alma a los que se pierden por las montañas.", text);
    }

    [Fact]
    public void Returns_null_when_there_is_no_spanish_text()
    {
        Assert.Null(Localization.PickSpanish([new LocalizedText("en", "Only English.")]));
    }

    [Fact]
    public void Joins_text_split_by_form_feeds_and_soft_hyphens()
    {
        var text = Localization.PickSpanish([new LocalizedText("es", "Una línea\fy otra\nmás, sin cor­tes.")]);

        Assert.Equal("Una línea y otra más, sin cortes.", text);
    }

    [Theory]
    [InlineData("gengar", "Gengar")]
    [InlineData("mr-mime", "Mr Mime")]
    public void Builds_a_title_from_a_slug(string slug, string expected)
    {
        Assert.Equal(expected, Localization.TitleFromSlug(slug));
    }

    [Fact]
    public void Converts_decimeters_and_hectograms()
    {
        // Gengar: height 15 (dm), weight 405 (hg)
        Assert.Equal(1.5, Measurements.DecimetersToMeters(15));
        Assert.Equal(40.5, Measurements.HectogramsToKilograms(405));
    }

    [Fact]
    public void Spanish_type_labels_match_pokeapi()
    {
        foreach (var type in PokemonTypes.All)
        {
            var names = FixtureData.Load<TypeNames>($"type/{type}").Names;
            Assert.Equal(names.Single(n => n.Language.Name == "es").Name, PokemonTypes.Label(type));
        }
    }

    private sealed record TypeNames(IReadOnlyList<LocalizedName> Names);
}
