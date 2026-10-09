# Fase 0 — Así trabaja mucha gente

## Qué hay

La app funcionando, con tests escritos:

| Parte | Tests | Cómo se corren |
|---|---|---|
| Backend .NET | 49: reglas del dominio (debilidades, evolución, textos) y endpoints | `dotnet test --solution api/Pokedex.slnx` |
| Frontend | 44: funciones puras, componentes y páginas | `pnpm --dir web test` |
| Type check y build | — | `pnpm --dir web build` |
| Lint | — | `pnpm --dir web lint` |

## Qué no hay

- Ni `.github/`, ni workflows, ni hooks, ni plantillas.
- Ninguna regla sobre `main`: cualquiera puede pushear directo o mergear cualquier PR.
- Nada que corra los tests por vos. Existen, pero si nadie se acuerda de correrlos, es como si no
  existieran.

## El dolor que muestra

Dos ramas rompen algo a propósito. En esta fase **se mergean**, porque nada lo impide.

| Rama | Qué rompe | Qué pasa |
|---|---|---|
| `fail/00-broken-build` | Un error de tipos en la tarjeta | Se mergea y `main` deja de compilar. Nadie se entera hasta que alguien clona y corre el build |
| `fail/00-broken-test` | Las debilidades de doble tipo se **suman** en vez de multiplicarse | Se mergea y `main` queda con 8 tests en rojo (7 de reglas y 1 del endpoint de la ficha) que nadie ve. La app lo muestra igual: Gengar aparece como débil a Normal (×2) cuando en realidad es inmune |

Links a los PRs: *por completar cuando se abran.*

## Lo que pasó mientras se construía (y es justamente el punto)

Armando esta fase aparecieron, sin buscarlos, los mismos problemas que las fases siguientes van a
atrapar solas:

- **Los tests pasaban y el build no.** Vitest no chequea tipos: con 44 tests en verde, `pnpm build`
  encontró 3 errores de TypeScript (una sintaxis que TypeScript 6 no permite y una opción de MSW que
  cambió de nombre en la versión 3). Si sólo se hubieran corrido los tests, se habrían mergeado. →
  **Fase 2**: el check de PR corre tests *y* build.
- **Un error que sólo se veía en el navegador.** En el celular la página se ensanchaba más que la
  pantalla: un `<fieldset>` mide por defecto lo que su contenido, y los chips de tipo en una sola fila
  lo estiraban. Ningún test lo detectaba. → **Fase 8** (preview por PR) y **fase 12** (regresión visual).
- **Una dependencia con una vulnerabilidad conocida.** NuGet avisa que `Microsoft.OpenApi 2.0.0`, que
  viene con la plantilla de .NET, tiene una vulnerabilidad de severidad alta. Es un aviso que aparece
  en la consola y nadie lee. → **Fase 5**: Dependabot la va a encontrar sola.
- **Una configuración global que se cuela.** El npm de la máquina apuntaba a un registro privado viejo.
  El proyecto fija el registro público en `web/.npmrc`, y pnpm 12 igual lo ignoraba para descargarse a
  sí mismo. En CI no va a pasar: la máquina es nueva en cada corrida. Esa es una de las razones de
  tener CI.

## Decisiones de la fase

- **Tests de .NET con xUnit v3 sobre Microsoft.Testing.Platform**, el motor nuevo de .NET 10. Se activa
  en `global.json`, y por eso el comando es `dotnet test --solution …`.
- **Los mocks del front se exportan del backend real** (`scripts/export-mocks.mjs`): el Storybook, los
  tests y el modo sin backend usan exactamente la forma que devuelve el API.
- **El filtro de legendarios no entra.** PokeAPI no permite listar legendarios: habría que consultar
  más de mil especies una por una. Queda para una fase con un workflow programado que arme ese índice
  de noche.
- **pnpm sólo deja correr scripts de instalación a `esbuild`** (`web/pnpm-workspace.yaml`). Desde pnpm 10
  vienen bloqueados por defecto, como protección contra paquetes maliciosos.
