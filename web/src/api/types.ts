// Lo que devuelve el backend (api/Pokedex.Api/Contracts). Si cambia allá, cambia acá.

export type TypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type SpeciesColor =
  | "black"
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "white"
  | "yellow";

export interface PokemonType {
  name: TypeName;
  label: string;
}

export interface PokemonCard {
  id: number;
  name: string;
  types: PokemonType[];
  artworkUrl: string | null;
  speciesColor: SpeciesColor;
  total: number;
  isLegendary: boolean;
  isMythical: boolean;
}

export interface PokemonPage {
  items: PokemonCard[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Weakness {
  type: PokemonType;
  multiplier: number;
}

export interface EvolutionStep {
  id: number;
  name: string;
  artworkUrl: string;
  trigger: string | null;
}

export interface PokemonDetail extends PokemonCard {
  generation: number;
  category: string | null;
  flavorText: string | null;
  heightMeters: number;
  weightKg: number;
  stats: Stats;
  weaknesses: Weakness[];
  evolution: EvolutionStep[][];
  cryUrl: string | null;
}

export interface PokemonQuery {
  page?: number;
  pageSize?: number;
  type?: TypeName;
  generation?: number;
  q?: string;
}
