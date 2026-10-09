import type { PokemonType } from "../../api/types";
import { cx, typeVars } from "../styleVars";
import styles from "./TypeChip.module.css";

interface TypeChipProps {
  type: PokemonType;
  /** Si se pasa, el chip es un botón que se puede prender y apagar (filtros). */
  onToggle?: () => void;
  pressed?: boolean;
  /** En una barra de filtros, los chips no elegidos se ven apagados mientras hay uno elegido. */
  dimmed?: boolean;
}

export function TypeChip({ type, onToggle, pressed = false, dimmed = false }: TypeChipProps) {
  const className = cx(styles.chip, dimmed && styles.dimmed, pressed && styles.pressed);

  if (onToggle) {
    return (
      <button
        type="button"
        className={className}
        style={typeVars(type.name)}
        aria-pressed={pressed}
        onClick={onToggle}
      >
        {type.label}
      </button>
    );
  }

  return (
    <span className={className} style={typeVars(type.name)}>
      {type.label}
    </span>
  );
}
