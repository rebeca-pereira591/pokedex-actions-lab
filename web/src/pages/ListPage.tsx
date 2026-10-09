import { useDeferredValue } from "react";
import { useSearchParams } from "react-router";
import { usePokemonPage, useTypes } from "../api/queries";
import type { TypeName } from "../api/types";
import { ListControls, type ListFilters } from "../components/ListControls/ListControls";
import { PokemonCard } from "../components/PokemonCard/PokemonCard";
import styles from "./ListPage.module.css";

const PAGE_SIZE = 20;

// Los filtros viven en la URL (?q=&type=&gen=&page=): se pueden compartir y el botón "atrás" funciona.
function readFilters(params: URLSearchParams): ListFilters & { page: number } {
  return {
    q: params.get("q") ?? "",
    type: (params.get("type") as TypeName | null) ?? null,
    generation: params.get("gen") ? Number(params.get("gen")) : null,
    page: Math.max(1, Number(params.get("page") ?? 1)),
  };
}

export function ListPage() {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);
  const q = useDeferredValue(filters.q);
  const types = useTypes();
  const list = usePokemonPage({
    page: filters.page,
    pageSize: PAGE_SIZE,
    type: filters.type ?? undefined,
    generation: filters.generation ?? undefined,
    q: q || undefined,
  });

  const update = (next: ListFilters & { page?: number }) => {
    const search = new URLSearchParams();
    if (next.q) search.set("q", next.q);
    if (next.type) search.set("type", next.type);
    if (next.generation) search.set("gen", String(next.generation));
    if (next.page && next.page > 1) search.set("page", String(next.page));
    setParams(search, { replace: true });
  };

  const pages = list.data ? Math.max(1, Math.ceil(list.data.total / PAGE_SIZE)) : 1;
  const clear = () => update({ q: "", type: null, generation: null });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.brand}>Pokédex</h1>
        {list.data && <p className={styles.count}>{list.data.total} Pokémon</p>}
      </header>

      <ListControls
        filters={filters}
        types={types.data ?? []}
        onChange={(next) => update({ ...next, page: 1 })}
      />

      {list.isError && (
        <div className={styles.message} role="alert">
          <p>No se pudo cargar el listado. ¿Está corriendo el backend?</p>
          <button type="button" className={styles.button} onClick={() => list.refetch()}>
            Reintentar
          </button>
        </div>
      )}

      {list.isPending && <p className={styles.message}>Cargando…</p>}

      {list.data?.items.length === 0 && (
        <div className={styles.message}>
          <p>Ningún Pokémon coincide con esos filtros.</p>
          <button type="button" className={styles.button} onClick={clear}>
            Limpiar filtros
          </button>
        </div>
      )}

      {list.data && list.data.items.length > 0 && (
        <ul className={styles.grid} aria-busy={list.isPlaceholderData}>
          {list.data.items.map((pokemon) => (
            <li key={pokemon.id}>
              <PokemonCard pokemon={pokemon} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav className={styles.pager} aria-label="Páginas">
          <button
            type="button"
            className={styles.button}
            disabled={filters.page <= 1}
            onClick={() => update({ ...filters, page: filters.page - 1 })}
          >
            Anterior
          </button>
          <span>
            Página {filters.page} de {pages}
          </span>
          <button
            type="button"
            className={styles.button}
            disabled={filters.page >= pages}
            onClick={() => update({ ...filters, page: filters.page + 1 })}
          >
            Siguiente
          </button>
        </nav>
      )}
    </main>
  );
}
