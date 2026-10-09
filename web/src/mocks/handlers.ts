import { HttpResponse, http } from "msw";
import { cards, details, types } from "./data";

// Simula el backend con las respuestas exportadas. Los filtros imitan los del API para que el modo
// mocks se pueda usar de verdad; las reglas de negocio (debilidades, evolución) no se repiten: ya
// vienen calculadas en los datos exportados.
export const handlers = [
  http.get("/api/types", () => HttpResponse.json(types)),

  http.get("/api/pokemon", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("pageSize") ?? 20);
    const type = params.get("type");
    const generation = params.get("generation");
    const term = (params.get("q") ?? "").trim().replace(/^#/, "").toLowerCase();
    const number = /^\d+$/.test(term) ? Number(term) : null;

    const matching = cards.filter(
      (c) =>
        (!type || c.types.some((t) => t.name === type)) &&
        (!generation || details[c.id]?.generation === Number(generation)) &&
        (!term || (number !== null ? c.id === number : c.name.toLowerCase().includes(term))),
    );

    return HttpResponse.json({
      items: matching.slice((page - 1) * pageSize, page * pageSize),
      total: matching.length,
      page,
      pageSize,
    });
  }),

  http.get("/api/pokemon/:idOrName", ({ params }) => {
    const key = String(params.idOrName).toLowerCase();
    const found =
      details[Number(key)] ?? Object.values(details).find((d) => d.name.toLowerCase() === key);
    return found
      ? HttpResponse.json(found)
      : HttpResponse.json({ title: "No existe ese Pokémon." }, { status: 404 });
  }),
];
