import { QueryClient } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { AppRoutes, Providers } from "../App";
import { handlers } from "../mocks/handlers";

// MSW responde /api con los datos exportados del backend, igual que en el modo mocks.
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderApp(route: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Providers client={client}>
        <AppRoutes />
      </Providers>
    </MemoryRouter>,
  );
}

describe("ListPage", () => {
  it("shows the first page of 20 cards and the total", async () => {
    renderApp("/");

    expect(await screen.findByText("37 Pokémon")).toBeInTheDocument();
    expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(20);
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
  });

  it("filters by type from the chips", async () => {
    renderApp("/");
    await screen.findByText("37 Pokémon");

    await userEvent.click(await screen.findByRole("button", { name: "Fantasma" }));

    expect(await screen.findByText("4 Pokémon")).toBeInTheDocument();
    const names = within(screen.getByRole("list"))
      .getAllByRole("link")
      .map((l) => l.querySelector("span:nth-child(3)")?.textContent);
    expect(names).toEqual(["Gastly", "Haunter", "Gengar", "Sableye"]);
  });

  it("reads the filters from the URL", async () => {
    renderApp("/?q=gengar");

    expect(await screen.findByText("1 Pokémon")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("gengar");
  });

  it("offers to clear the filters when nothing matches", async () => {
    renderApp("/?q=missingno");

    await userEvent.click(await screen.findByRole("button", { name: "Limpiar filtros" }));

    expect(await screen.findByText("37 Pokémon")).toBeInTheDocument();
  });

  it("says when the backend is not answering", async () => {
    server.use(http.get("/api/pokemon", () => HttpResponse.error()));
    renderApp("/");

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el listado");
  });
});

describe("DetailPage", () => {
  it("shows the whole detail of Gengar", async () => {
    renderApp("/pokemon/94");

    expect(await screen.findByRole("heading", { level: 1, name: "Gengar" })).toBeInTheDocument();
    expect(screen.getByText("Pokémon Sombra")).toBeInTheDocument();
    expect(screen.getByText(/^Dicen que sale de la oscuridad/)).toBeInTheDocument();
    expect(screen.getByText("1,5 m")).toBeInTheDocument();
    expect(screen.getByText("40,5 kg")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /^Estadísticas de Gengar/ })).toBeInTheDocument();
    expect(screen.getByText("Inmune")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Haunter" })).toHaveAttribute("href", "/pokemon/93");
    expect(screen.getByRole("button", { name: "Escuchar grito" })).toBeInTheDocument();
  });

  it("finds a Pokémon by name too", async () => {
    renderApp("/pokemon/mew");

    expect(await screen.findByRole("heading", { level: 1, name: "Mew" })).toBeInTheDocument();
    expect(screen.getByText("Mítico")).toBeInTheDocument();
    expect(screen.getByText("No evoluciona.")).toBeInTheDocument();
  });

  it("says when the Pokémon does not exist", async () => {
    renderApp("/pokemon/missingno");

    expect(await screen.findByRole("alert")).toHaveTextContent("No existe ese Pokémon.");
  });
});
