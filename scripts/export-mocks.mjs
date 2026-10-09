// Guarda las respuestas del backend en web/src/mocks/data/, para el Storybook, los tests del front,
// el modo mocks y (más adelante) la preview pública. Así los mocks tienen exactamente la forma que
// devuelve el API.
//
// Con el API corriendo en modo offline (sólo fixtures):
//   dotnet run --project api/Pokedex.Api --launch-profile offline
//   node scripts/export-mocks.mjs

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = process.env.API_URL ?? "http://localhost:5032";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "web", "src", "mocks", "data");

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}. ¿Está corriendo el API en modo offline?`);
  return res.json();
}

async function save(relPath, data) {
  const file = join(OUT, `${relPath}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

const page = await get("/api/pokemon?pageSize=60");
if (page.total > page.items.length) throw new Error("Hay más Pokémon que el tamaño de página; subí pageSize.");

await rm(OUT, { recursive: true, force: true });
await save("cards", page.items);
await save("types", await get("/api/types"));
for (const card of page.items) {
  await save(`detail/${card.id}`, await get(`/api/pokemon/${card.id}`));
}

console.log(`Listo: ${page.items.length} tarjetas y fichas en ${OUT}`);
