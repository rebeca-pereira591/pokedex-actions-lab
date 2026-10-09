import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { card } from "../../mocks/data";
import { renderWithRouter } from "../../test/render";
import { PokemonCard } from "./PokemonCard";

describe("PokemonCard", () => {
  it("links to the detail and shows number, name, types and total", () => {
    renderWithRouter(<PokemonCard pokemon={card(94)} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/94");
    expect(link).toHaveTextContent("#0094");
    expect(link).toHaveTextContent("Gengar");
    expect(link).toHaveTextContent("Fantasma");
    expect(link).toHaveTextContent("Veneno");
    expect(link).toHaveTextContent("500 total");
  });

  it("uses the species color until the artwork color is read", () => {
    renderWithRouter(<PokemonCard pokemon={card(94)} />);

    expect(screen.getByRole("link").style.getPropertyValue("--t")).toBe("var(--species-purple)");
  });

  it("marks legendary and mythical Pokémon", () => {
    renderWithRouter(
      <>
        <PokemonCard pokemon={card(150)} />
        <PokemonCard pokemon={card(151)} />
        <PokemonCard pokemon={card(25)} />
      </>,
    );

    expect(screen.getByText("Legendario")).toBeInTheDocument();
    expect(screen.getByText("Mítico")).toBeInTheDocument();
    expect(screen.getAllByRole("link")[2]).not.toHaveTextContent(/Legendario|Mítico/);
  });

  it("marks the selected card for assistive tech", () => {
    renderWithRouter(<PokemonCard pokemon={card(94)} selected />);

    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "true");
  });
});
