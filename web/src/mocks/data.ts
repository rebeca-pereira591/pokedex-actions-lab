import type { PokemonCard, PokemonDetail, PokemonType } from "../api/types";
import cardsJson from "./data/cards.json";
import typesJson from "./data/types.json";

// Respuestas reales del backend en modo offline (las genera scripts/export-mocks.mjs).
// Las usan el Storybook, los tests y el modo mocks.

export const cards = cardsJson as unknown as PokemonCard[];
export const types = typesJson as unknown as PokemonType[];

const detailFiles = import.meta.glob<{ default: unknown }>("./data/detail/*.json", { eager: true });

export const details: Record<number, PokemonDetail> = Object.fromEntries(
  Object.entries(detailFiles).map(([path, mod]) => {
    const id = Number(path.match(/(\d+)\.json$/)?.[1]);
    return [id, mod.default as PokemonDetail];
  }),
);

export function detail(id: number): PokemonDetail {
  const found = details[id];
  if (!found) throw new Error(`No hay ficha de mock para el Pokémon ${id}`);
  return found;
}

export function card(id: number): PokemonCard {
  const found = cards.find((c) => c.id === id);
  if (!found) throw new Error(`No hay tarjeta de mock para el Pokémon ${id}`);
  return found;
}
