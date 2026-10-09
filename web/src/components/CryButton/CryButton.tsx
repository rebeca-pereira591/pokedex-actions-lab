import { useRef } from "react";
import styles from "./CryButton.module.css";

// Reproduce el grito del Pokémon (.ogg de PokeAPI). Safari no reproduce .ogg: queda anotado.
export function CryButton({ url }: { url: string | null }) {
  const audio = useRef<HTMLAudioElement | null>(null);

  if (!url) return null;

  const play = () => {
    audio.current ??= new Audio(url);
    audio.current.currentTime = 0;
    audio.current.play().catch(() => {
      // El navegador puede negarse (formato no soportado o sin interacción previa); no es grave.
    });
  };

  return (
    <button type="button" className={styles.cry} onClick={play}>
      Escuchar grito
    </button>
  );
}
