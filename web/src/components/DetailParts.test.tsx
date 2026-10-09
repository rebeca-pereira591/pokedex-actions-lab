import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { detail } from "../mocks/data";
import { renderWithRouter } from "../test/render";
import { EvolutionChain } from "./EvolutionChain/EvolutionChain";
import { StatBars } from "./StatBars/StatBars";
import { StatRadar } from "./StatRadar/StatRadar";
import { WeaknessTable } from "./WeaknessTable/WeaknessTable";

const gengar = detail(94);

describe("StatRadar", () => {
  it("describes the six stats for screen readers", () => {
    render(<StatRadar stats={gengar.stats} name="Gengar" />);

    expect(
      screen.getByRole("img", {
        name: "Estadísticas de Gengar: PS 60, Ataque 65, Defensa 60, Velocidad 110, Def. Esp. 75, At. Esp. 130",
      }),
    ).toBeInTheDocument();
  });

  it("hides the labels in the mini version", () => {
    const { container } = render(<StatRadar stats={gengar.stats} name="Gengar" labels={false} />);

    expect(container.querySelectorAll("text")).toHaveLength(0);
  });
});

describe("StatBars", () => {
  it("lists the six stats and the total", () => {
    render(<StatBars stats={gengar.stats} />);

    expect(screen.getByText("At. Esp.").nextSibling).toHaveTextContent("130");
    expect(screen.getByText("Total").nextSibling).toHaveTextContent("500");
  });
});

describe("WeaknessTable", () => {
  it("groups Gengar's weaknesses with immunities last", () => {
    render(<WeaknessTable weaknesses={gengar.weaknesses} />);

    const terms = screen.getAllByRole("term").map((t) => t.textContent);
    expect(terms).toEqual(["×2Débil", "×½Resiste", "×¼Resiste mucho", "×0Inmune"]);

    const immune = screen.getAllByRole("definition")[3];
    expect(within(immune).getByText("Normal")).toBeInTheDocument();
    expect(within(immune).getByText("Lucha")).toBeInTheDocument();
  });
});

describe("EvolutionChain", () => {
  it("shows a linear chain with how each step evolves", () => {
    renderWithRouter(<EvolutionChain stages={gengar.evolution} currentId={94} />);

    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Gastly",
      "Haunter",
      "Gengar",
    ]);
    expect(screen.getByText("Nv. 25")).toBeInTheDocument();
    expect(screen.getByText("Intercambio")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gengar" })).toHaveAttribute("aria-current", "page");
  });

  it("shows every branch of Eevee with its own trigger", () => {
    renderWithRouter(<EvolutionChain stages={detail(133).evolution} currentId={133} />);

    expect(screen.getByText("8 caminos")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(9);
    expect(screen.getByRole("link", { name: /Leafeon/ })).toHaveTextContent("Piedra Hoja");
  });

  it("says so when the Pokémon does not evolve", () => {
    renderWithRouter(<EvolutionChain stages={detail(151).evolution} currentId={151} />);

    expect(screen.getByText("No evoluciona.")).toBeInTheDocument();
  });
});
