import { describe, expect, it } from "vitest";
import type { Weakness } from "../api/types";
import { dexNumber, formatMeasure, groupWeaknesses, romanGeneration } from "./format";

describe("formatMeasure", () => {
  it("uses a decimal comma and the unit", () => {
    expect(formatMeasure(0.7, "m")).toBe("0,7 m");
    expect(formatMeasure(40.5, "kg")).toBe("40,5 kg");
    expect(formatMeasure(460, "kg")).toBe("460 kg");
  });
});

describe("dexNumber", () => {
  it("pads to four digits", () => {
    expect(dexNumber(94)).toBe("#0094");
    expect(dexNumber(1025)).toBe("#1025");
  });
});

describe("romanGeneration", () => {
  it("writes the generation in roman numerals", () => {
    expect(romanGeneration(1)).toBe("I");
    expect(romanGeneration(9)).toBe("IX");
  });
});

describe("groupWeaknesses", () => {
  const w = (name: Weakness["type"]["name"], multiplier: number): Weakness => ({
    type: { name, label: name },
    multiplier,
  });

  it("groups Gengar's multipliers in table order and skips empty groups", () => {
    const groups = groupWeaknesses([
      w("normal", 0),
      w("bug", 0.25),
      w("ground", 2),
      w("grass", 0.5),
      w("poison", 0.25),
      w("fighting", 0),
    ]);

    expect(groups.map((g) => g.symbol)).toEqual(["×2", "×½", "×¼", "×0"]);
    expect(groups[2].types.map((t) => t.name)).toEqual(["bug", "poison"]);
    expect(groups[3].label).toBe("Inmune");
  });

  it("returns nothing for no weaknesses", () => {
    expect(groupWeaknesses([])).toEqual([]);
  });
});
