import type { PokemonDetail, PokemonPage, PokemonQuery, PokemonType } from "./types";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`);
  if (!response.ok) {
    throw new ApiError(response.status, `GET /api${path} respondió ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getPokemonPage(query: PokemonQuery): Promise<PokemonPage> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return getJson(`/pokemon${search ? `?${search}` : ""}`);
}

export function getPokemon(idOrName: string): Promise<PokemonDetail> {
  return getJson(`/pokemon/${encodeURIComponent(idOrName)}`);
}

export function getTypes(): Promise<PokemonType[]> {
  return getJson("/types");
}
