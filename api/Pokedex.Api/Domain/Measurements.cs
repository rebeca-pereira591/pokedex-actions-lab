namespace Pokedex.Api.Domain;

public static class Measurements
{
    // PokeAPI da la altura en decímetros y el peso en hectogramos.
    public static double DecimetersToMeters(int decimeters) => decimeters / 10.0;

    public static double HectogramsToKilograms(int hectograms) => hectograms / 10.0;
}
