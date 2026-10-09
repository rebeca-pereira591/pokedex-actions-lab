import { useEffect, useState } from "react";
import type { SpeciesColor } from "../api/types";
import { dominantColor, type GlowColor } from "../lib/dominantColor";
import { type ColorVars, glowVars, speciesVars } from "./styleVars";

const SAMPLE_SIZE = 40;
const cache = new Map<string, Promise<GlowColor | null>>();

// La única parte que toca el navegador: dibuja el artwork chiquito en un canvas y le pasa los
// píxeles a dominantColor. El servidor de sprites responde con Access-Control-Allow-Origin: *,
// así que el canvas se puede leer.
function readGlow(url: string): Promise<GlowColor | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        resolve(dominantColor(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// El color del brillo de un Pokémon. Mientras se calcula, o si no se puede leer la imagen,
// se usa el color de la especie.
export function useGlow(artworkUrl: string | null, speciesColor: SpeciesColor): ColorVars {
  const [glow, setGlow] = useState<GlowColor | null>(null);

  useEffect(() => {
    setGlow(null);
    if (!artworkUrl) return;
    let current = true;
    let pending = cache.get(artworkUrl);
    if (!pending) {
      pending = readGlow(artworkUrl);
      cache.set(artworkUrl, pending);
    }
    pending.then((result) => {
      if (current) setGlow(result);
    });
    return () => {
      current = false;
    };
  }, [artworkUrl]);

  return glow ? glowVars(glow.css, glow.darkInk) : speciesVars(speciesColor);
}
