import type { PokemonType, TypeName } from "../../api/types";
import { romanGeneration } from "../../lib/format";
import { TypeChip } from "../TypeChip/TypeChip";
import styles from "./ListControls.module.css";

export interface ListFilters {
  q: string;
  generation: number | null;
  type: TypeName | null;
}

interface ListControlsProps {
  filters: ListFilters;
  types: PokemonType[];
  onChange: (filters: ListFilters) => void;
}

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function ListControls({ filters, types, onChange }: ListControlsProps) {
  const set = (patch: Partial<ListFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <label className={styles.search}>
          <span className="visually-hidden">Buscar</span>
          <input
            type="search"
            placeholder="Buscar por nombre o número"
            autoComplete="off"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </label>
        <label>
          <span className="visually-hidden">Generación</span>
          <select
            value={filters.generation ?? ""}
            onChange={(e) => set({ generation: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Todas las generaciones</option>
            {GENERATIONS.map((g) => (
              <option key={g} value={g}>
                Generación {romanGeneration(g)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className={styles.types}>
        <legend className="visually-hidden">Filtrar por tipo</legend>
        {types.map((t) => (
          <TypeChip
            key={t.name}
            type={t}
            pressed={filters.type === t.name}
            dimmed={filters.type !== null && filters.type !== t.name}
            onToggle={() => set({ type: filters.type === t.name ? null : t.name })}
          />
        ))}
      </fieldset>
    </div>
  );
}
