import { describe, expect, it } from "vitest";
import type { Stats } from "../api/types";
import { axisPoint, RADAR_AXES, radarPoints, statTotal, toSvgPoints } from "./radar";

const center = { x: 100, y: 100 };
const gengar: Stats = {
  hp: 60,
  attack: 65,
  defense: 60,
  specialAttack: 130,
  specialDefense: 75,
  speed: 110,
};

describe("radar", () => {
  it("follows the in-game axis order", () => {
    expect(RADAR_AXES.map((a) => a.label)).toEqual([
      "PS",
      "Ataque",
      "Defensa",
      "Velocidad",
      "Def. Esp.",
      "At. Esp.",
    ]);
  });

  it("puts the first axis straight up and the fourth straight down", () => {
    const top = axisPoint(0, 1, 50, center);
    const bottom = axisPoint(3, 1, 50, center);

    expect(top.x).toBeCloseTo(100);
    expect(top.y).toBeCloseTo(50);
    expect(bottom.x).toBeCloseTo(100);
    expect(bottom.y).toBeCloseTo(150);
  });

  it("scales each stat against 255", () => {
    const max: Stats = {
      hp: 255,
      attack: 255,
      defense: 255,
      specialAttack: 255,
      specialDefense: 255,
      speed: 255,
    };
    const points = radarPoints(max, 50, center);

    for (const p of points) {
      expect(Math.hypot(p.x - center.x, p.y - center.y)).toBeCloseTo(50);
    }
  });

  it("places Gengar's speed on the bottom axis at 110/255 of the radius", () => {
    const speed = radarPoints(gengar, 255, center)[3];

    expect(speed.x).toBeCloseTo(100);
    expect(speed.y).toBeCloseTo(100 + 110);
  });

  it("clamps values outside 0–255", () => {
    const odd: Stats = { ...gengar, hp: 400 };

    expect(radarPoints(odd, 50, center)[0].y).toBeCloseTo(50);
  });

  it("formats points for an SVG polygon", () => {
    expect(
      toSvgPoints([
        { x: 1, y: 2 },
        { x: 3.25, y: 4 },
      ]),
    ).toBe("1.0,2.0 3.3,4.0");
  });

  it("adds the six stats", () => {
    expect(statTotal(gengar)).toBe(500);
  });
});
