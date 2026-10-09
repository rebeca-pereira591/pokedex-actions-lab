// Baja de PokeAPI un set fijo de datos y lo guarda en fixtures/pokeapi/.
// Se corre a mano, sólo cuando se quiere actualizar: node scripts/record-fixtures.mjs
// Los tests y los mocks usan estos archivos; ninguno llama a PokeAPI de verdad.
//
// Se guarda sólo lo que la app usa (por ejemplo, se descartan los movimientos), para que los
// archivos sean chicos y se puedan leer en un diff.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://pokeapi.co/api/v2";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "pokeapi");

// Elegidos para cubrir casos: doble tipo, inmunidades, x4, x¼, legendario, mítico,
// evolución con ramas (Eevee) y estadísticas extremas.
const POKEMON = [
  1, // Bulbasaur: Planta/Veneno, x¼ de Planta
  6, // Charizard: x4 de Roca
  25, // Pikachu: un solo tipo
  94, // Gengar: dos inmunidades
  130, // Gyarados: x4 de Eléctrico, inmune a Tierra
  133, // Eevee: 8 evoluciones
  143, // Snorlax
  150, // Mewtwo: legendario
  151, // Mew: mítico
  213, // Shuckle: defensa 230
  242, // Blissey: PS 255
  302, // Sableye: Siniestro/Fantasma
  445, // Garchomp: x4 de Hielo
  448, // Lucario: Lucha/Acero
  700, // Sylveon
];

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const LANGS = new Set(["es", "en"]);

const idFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)[1]);

async function get(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

async function save(relPath, data) {
  const file = join(OUT, `${relPath}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`  ${relPath}.json`);
}

const byLang = (list) => list.filter((e) => LANGS.has(e.language.name));

function trimPokemon(p) {
  return {
    id: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    types: p.types,
    stats: p.stats.map((s) => ({ base_stat: s.base_stat, stat: { name: s.stat.name } })),
    species: p.species,
    sprites: { other: { "official-artwork": p.sprites.other["official-artwork"] } },
    cries: p.cries,
  };
}

function trimSpecies(s) {
  return {
    id: s.id,
    name: s.name,
    color: s.color,
    generation: s.generation,
    is_legendary: s.is_legendary,
    is_mythical: s.is_mythical,
    genera: byLang(s.genera),
    names: byLang(s.names),
    flavor_text_entries: byLang(s.flavor_text_entries),
    evolution_chain: s.evolution_chain,
  };
}

function trimType(t) {
  const names = (list) => list.map((x) => ({ name: x.name }));
  const r = t.damage_relations;
  return {
    id: t.id,
    name: t.name,
    names: byLang(t.names),
    damage_relations: {
      double_damage_from: names(r.double_damage_from),
      half_damage_from: names(r.half_damage_from),
      no_damage_from: names(r.no_damage_from),
    },
    pokemon: t.pokemon.map((x) => ({ pokemon: x.pokemon })),
  };
}

function speciesInChain(link, acc = []) {
  acc.push(idFromUrl(link.species.url));
  for (const next of link.evolves_to) speciesInChain(next, acc);
  return acc;
}

console.log("Tipos");
for (const t of TYPES) await save(`type/${t}`, trimType(await get(`type/${t}`)));

console.log("Generaciones");
for (const g of GENERATIONS) {
  const gen = await get(`generation/${g}`);
  await save(`generation/${g}`, { id: gen.id, name: gen.name, pokemon_species: gen.pokemon_species });
}

console.log("Pokémon, especies y cadenas evolutivas");
const pending = [...POKEMON];
const done = new Set();
const chains = new Set();
while (pending.length) {
  const id = pending.shift();
  if (done.has(id)) continue;
  done.add(id);
  await save(`pokemon/${id}`, trimPokemon(await get(`pokemon/${id}`)));
  const species = await get(`pokemon-species/${id}`);
  await save(`pokemon-species/${id}`, trimSpecies(species));
  const chainId = idFromUrl(species.evolution_chain.url);
  if (!chains.has(chainId)) {
    chains.add(chainId);
    const chain = await get(`evolution-chain/${chainId}`);
    await save(`evolution-chain/${chainId}`, chain);
    // También se graban los demás miembros de la cadena, para poder navegar a ellos en modo mocks
    pending.push(...speciesInChain(chain.chain));
  }
}

// El índice lista sólo las especies grabadas: así, en modo offline, el listado nunca pide
// un Pokémon que no está en los fixtures.
console.log("Índice de especies");
const index = await get("pokemon-species?limit=2000");
const results = index.results.filter((r) => done.has(idFromUrl(r.url)));
await save("pokemon-species/index", { count: results.length, results });

console.log(`Listo: ${done.size} Pokémon, ${chains.size} cadenas.`);
