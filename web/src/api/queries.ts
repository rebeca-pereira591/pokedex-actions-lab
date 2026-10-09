import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPokemon, getPokemonPage, getTypes } from "./client";
import type { PokemonQuery } from "./types";

export function usePokemonPage(query: PokemonQuery) {
  return useQuery({
    queryKey: ["pokemon", "page", query],
    queryFn: () => getPokemonPage(query),
    // al cambiar de página o de filtro, se sigue viendo la grilla anterior mientras llega la nueva
    placeholderData: keepPreviousData,
  });
}

export function usePokemon(idOrName: string) {
  return useQuery({
    queryKey: ["pokemon", "detail", idOrName.toLowerCase()],
    queryFn: () => getPokemon(idOrName),
  });
}

export function useTypes() {
  return useQuery({ queryKey: ["types"], queryFn: getTypes, staleTime: Number.POSITIVE_INFINITY });
}
