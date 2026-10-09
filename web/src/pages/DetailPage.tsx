import { Link, useParams } from "react-router";
import { ApiError } from "../api/client";
import { usePokemon } from "../api/queries";
import type { PokemonDetail } from "../api/types";
import { CryButton } from "../components/CryButton/CryButton";
import { EvolutionChain } from "../components/EvolutionChain/EvolutionChain";
import { HexBadge, HexBadges } from "../components/HexBadge/HexBadge";
import { specialClass } from "../components/PokemonCard/PokemonCard";
import { StatBars } from "../components/StatBars/StatBars";
import { StatRadar } from "../components/StatRadar/StatRadar";
import { cx } from "../components/styleVars";
import { TypeChip } from "../components/TypeChip/TypeChip";
import { useGlow } from "../components/useGlow";
import { WeaknessTable } from "../components/WeaknessTable/WeaknessTable";
import { dexNumber, formatMeasure, romanGeneration } from "../lib/format";
import styles from "./DetailPage.module.css";

export function DetailPage() {
  const { idOrName = "" } = useParams();
  const pokemon = usePokemon(idOrName);

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Volver al listado
      </Link>
      {pokemon.isPending && <p className={styles.message}>Cargando…</p>}
      {pokemon.isError && (
        <p className={styles.message} role="alert">
          {pokemon.error instanceof ApiError && pokemon.error.status === 404
            ? "No existe ese Pokémon."
            : "No se pudo cargar la ficha. ¿Está corriendo el backend?"}
        </p>
      )}
      {pokemon.data && <Detail pokemon={pokemon.data} />}
    </main>
  );
}

function Detail({ pokemon }: { pokemon: PokemonDetail }) {
  const glow = useGlow(pokemon.artworkUrl, pokemon.speciesColor);
  const special = specialClass(pokemon);

  return (
    <article className={styles.detail} style={glow}>
      <div className={styles.column}>
        {/* la clase global (legendary/mythical) la usa CryButton para tomar el tono del metal */}
        <section className={cx(styles.hero, special && styles[special], special)}>
          <span className={styles.watermark} aria-hidden="true">
            {String(pokemon.id).padStart(4, "0")}
          </span>
          <div className={styles.heroInner}>
            {pokemon.artworkUrl && (
              <img
                className={styles.art}
                src={pokemon.artworkUrl}
                alt={`Artwork oficial de ${pokemon.name}`}
                width={280}
                height={280}
              />
            )}
            <p className={styles.meta}>
              <span>{dexNumber(pokemon.id)}</span>
              <span aria-hidden="true">·</span>
              <span>Generación {romanGeneration(pokemon.generation)}</span>
              {special && (
                <span className={styles.badge}>
                  {pokemon.isLegendary ? "Legendario" : "Mítico"}
                </span>
              )}
            </p>
            <div>
              <h1 className={styles.name}>{pokemon.name}</h1>
              {pokemon.category && <p className={styles.category}>{pokemon.category}</p>}
            </div>
            <div className={styles.chips}>
              {pokemon.types.map((t) => (
                <TypeChip key={t.name} type={t} />
              ))}
            </div>
            <p className={styles.flavor}>{pokemon.flavorText ?? "Sin descripción en español."}</p>
            <HexBadges>
              <HexBadge label="Altura" value={formatMeasure(pokemon.heightMeters, "m")} />
              <HexBadge label="Peso" value={formatMeasure(pokemon.weightKg, "kg")} />
              <HexBadge label="Total" value={String(pokemon.total)} />
            </HexBadges>
            <CryButton url={pokemon.cryUrl} />
          </div>
        </section>

        <section className={cx(styles.panel, styles.evolution)} aria-labelledby="evo-title">
          <h2 id="evo-title" className={styles.panelTitle}>
            Cadena evolutiva
          </h2>
          <EvolutionChain stages={pokemon.evolution} currentId={pokemon.id} />
        </section>
      </div>

      <div className={styles.column}>
        <section className={styles.panel} aria-labelledby="stats-title">
          <h2 id="stats-title" className={styles.panelTitle}>
            Estadísticas base
          </h2>
          <StatRadar stats={pokemon.stats} name={pokemon.name} />
          <StatBars stats={pokemon.stats} />
        </section>

        <section className={styles.panel} aria-labelledby="weak-title">
          <h2 id="weak-title" className={styles.panelTitle}>
            Debilidades y resistencias
          </h2>
          <WeaknessTable weaknesses={pokemon.weaknesses} />
        </section>
      </div>
    </article>
  );
}
