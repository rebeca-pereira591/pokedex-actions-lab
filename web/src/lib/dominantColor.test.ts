import { describe, expect, it } from "vitest";
import { dominantColor, rgbToHsl } from "./dominantColor";

// Arma una "imagen" de píxeles RGBA a partir de [color, cantidad].
function image(...parts: Array<[rgba: [number, number, number, number], count: number]>): number[] {
  return parts.flatMap(([rgba, count]) => Array.from({ length: count }, () => rgba).flat());
}

const hueOf = (css: string) => Number(css.match(/^hsl\((\d+)/)?.[1]);

describe("rgbToHsl", () => {
  it("converts primary colors", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 1, 0.5]);
    expect(rgbToHsl(0, 255, 0)[0]).toBeCloseTo(1 / 3);
    expect(rgbToHsl(0, 0, 255)[0]).toBeCloseTo(2 / 3);
  });

  it("gives zero saturation for grays", () => {
    expect(rgbToHsl(128, 128, 128)[1]).toBe(0);
  });
});

describe("dominantColor", () => {
  it("picks the hue that covers the most area", () => {
    const orangeLizard = image([[240, 128, 48, 255], 80], [[60, 110, 200, 255], 20]);

    expect(hueOf(dominantColor(orangeLizard)?.css ?? "")).toBeGreaterThan(15);
    expect(hueOf(dominantColor(orangeLizard)?.css ?? "")).toBeLessThan(35);
  });

  it("ignores transparent pixels, outlines and highlights", () => {
    const purpleGhost = image(
      [[0, 0, 0, 0], 500], // fondo transparente
      [[10, 10, 10, 255], 200], // contorno casi negro
      [[250, 250, 250, 255], 100], // brillo casi blanco
      [[112, 88, 152, 255], 50], // el cuerpo
    );

    const hue = hueOf(dominantColor(purpleGhost)?.css ?? "");
    expect(hue).toBeGreaterThan(250);
    expect(hue).toBeLessThan(275);
  });

  it("brightens dark colors so they glow on black", () => {
    const darkBlue = image([[20, 40, 90, 255], 10]);

    expect(dominantColor(darkBlue)?.css).toMatch(/ 56%\)$/);
  });

  it("asks for dark text on yellow and light text on purple", () => {
    expect(dominantColor(image([[250, 210, 40, 255], 10]))?.darkInk).toBe(true);
    expect(dominantColor(image([[112, 88, 152, 255], 10]))?.darkInk).toBe(false);
  });

  it("returns null when nothing is visible", () => {
    expect(dominantColor(image([[0, 0, 0, 0], 10]))).toBeNull();
    expect(dominantColor([])).toBeNull();
  });
});
