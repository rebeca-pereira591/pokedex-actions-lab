import type { CSSProperties } from "react";
import type { SpeciesColor, TypeName } from "../api/types";

// Las variables CSS que usan los componentes: --t es el color (de un tipo o del brillo de un Pokémon)
// y --on el color del texto que va encima.
export type ColorVars = CSSProperties & { "--t": string; "--on": string };

const LIGHT_TEXT_TYPES = new Set<TypeName>(["fighting", "poison", "ghost", "dragon", "dark"]);
const DARK_TEXT_SPECIES = new Set<SpeciesColor>(["yellow", "white", "gray", "pink", "green"]);

const ink = (darkText: boolean) => (darkText ? "var(--ink-on-light)" : "var(--ink-on-dark)");

export function typeVars(type: TypeName): ColorVars {
  return { "--t": `var(--type-${type})`, "--on": ink(!LIGHT_TEXT_TYPES.has(type)) };
}

export function speciesVars(color: SpeciesColor): ColorVars {
  return { "--t": `var(--species-${color})`, "--on": ink(DARK_TEXT_SPECIES.has(color)) };
}

export function glowVars(css: string, darkInk: boolean): ColorVars {
  return { "--t": css, "--on": ink(darkInk) };
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
