import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { types } from "../../mocks/data";
import { ListControls, type ListFilters } from "./ListControls";

const empty: ListFilters = { q: "", generation: null, type: null };

describe("ListControls", () => {
  it("reports the search text", async () => {
    const onChange = vi.fn();
    render(<ListControls filters={empty} types={types} onChange={onChange} />);

    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar" }), "g");

    expect(onChange).toHaveBeenLastCalledWith({ ...empty, q: "g" });
  });

  it("reports the generation and clears it", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<ListControls filters={empty} types={types} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Generación" }), "4");
    expect(onChange).toHaveBeenLastCalledWith({ ...empty, generation: 4 });

    rerender(
      <ListControls filters={{ ...empty, generation: 4 }} types={types} onChange={onChange} />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Generación" }), "");
    expect(onChange).toHaveBeenLastCalledWith(empty);
  });

  it("toggles a type filter on and off", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<ListControls filters={empty} types={types} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Fantasma" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...empty, type: "ghost" });

    rerender(
      <ListControls filters={{ ...empty, type: "ghost" }} types={types} onChange={onChange} />,
    );
    expect(screen.getByRole("button", { name: "Fantasma", pressed: true })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Fantasma" }));
    expect(onChange).toHaveBeenLastCalledWith(empty);
  });
});
