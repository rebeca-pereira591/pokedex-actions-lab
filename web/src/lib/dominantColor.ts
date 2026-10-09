export interface GlowColor {
  /** Color listo para CSS, por ejemplo "hsl(26 100% 58%)". */
  css: string;
  /** true si encima del color se lee mejor texto oscuro. */
  darkInk: boolean;
}

export function rgbToHsl(r: number, g: number, b: number): [h: number, s: number, l: number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [h / 6, s, l];
}

const HUE_BINS = 24;

// El color del brillo de un Pokémon, sacado de los píxeles de su artwork (RGBA, como los da un canvas).
// Agrupa los píxeles visibles por tono, pesando más los saturados, y se queda con el grupo más grande.
// Ignora lo transparente y lo casi negro o casi blanco (contornos y reflejos). Después lo aclara y
// satura lo justo para que brille sobre fondo negro.
export function dominantColor(pixels: ArrayLike<number>): GlowColor | null {
  const bins = Array.from({ length: HUE_BINS }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));

  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
    if (a < 200) continue;
    const [h, s, l] = rgbToHsl(r, g, b);
    if (l < 0.1 || l > 0.94) continue;

    const weight = 0.15 + s;
    const bin = bins[Math.floor(h * HUE_BINS) % HUE_BINS];
    bin.weight += weight;
    bin.r += r * weight;
    bin.g += g * weight;
    bin.b += b * weight;
  }

  const best = bins.reduce((a, b) => (b.weight > a.weight ? b : a));
  if (best.weight === 0) return null;

  const [h, s, l] = rgbToHsl(best.r / best.weight, best.g / best.weight, best.b / best.weight);
  const saturation = Math.min(1, s * 1.3 + 0.12);
  const lightness = Math.min(0.7, Math.max(0.56, l));
  const hue = Math.round(h * 360);

  return {
    css: `hsl(${hue} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)`,
    // amarillos y verdes claros, o colores muy claros, llevan texto oscuro
    darkInk: (hue > 40 && hue < 170) || lightness > 0.66,
  };
}
