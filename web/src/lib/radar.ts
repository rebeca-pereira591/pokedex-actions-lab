import type { Stats } from "../api/types";

export const MAX_STAT = 255;

// Orden de los juegos: PS arriba y, en sentido horario, Ataque, Defensa, Velocidad,
// Def. Esp. y At. Esp.
export const RADAR_AXES: ReadonlyArray<{ key: keyof Stats; label: string }> = [
  { key: "hp", label: "PS" },
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defensa" },
  { key: "speed", label: "Velocidad" },
  { key: "specialDefense", label: "Def. Esp." },
  { key: "specialAttack", label: "At. Esp." },
];

export interface Point {
  x: number;
  y: number;
}

// Un vértice sobre el eje i (0 = arriba), a una fracción del radio (0 = centro, 1 = borde).
export function axisPoint(i: number, fraction: number, radius: number, center: Point): Point {
  const angle = ((-90 + 60 * i) * Math.PI) / 180;
  return {
    x: center.x + radius * fraction * Math.cos(angle),
    y: center.y + radius * fraction * Math.sin(angle),
  };
}

// Los 6 vértices del hexágono de un Pokémon. La escala es fija (0–255) para que dos Pokémon se
// puedan comparar a simple vista; un valor fuera de rango se recorta.
export function radarPoints(stats: Stats, radius: number, center: Point): Point[] {
  return RADAR_AXES.map(({ key }, i) => {
    const fraction = Math.min(Math.max(stats[key] / MAX_STAT, 0), 1);
    return axisPoint(i, fraction, radius, center);
  });
}

export function toSvgPoints(points: Point[]): string {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

export function statTotal(stats: Stats): number {
  return Object.values(stats).reduce((sum, value) => sum + value, 0);
}
