import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TypeChip } from "./TypeChip";

const ghost = { name: "ghost", label: "Fantasma" } as const;

describe("TypeChip", () => {
  it("shows the Spanish label with the type color", () => {
    render(<TypeChip type={ghost} />);

    const chip = screen.getByText("Fantasma");
    expect(chip.style.getPropertyValue("--t")).toBe("var(--type-ghost)");
    expect(chip.style.getPropertyValue("--on")).toBe("var(--ink-on-dark)");
  });

  it("uses dark text on light type colors", () => {
    render(<TypeChip type={{ name: "electric", label: "Eléctrico" }} />);

    expect(screen.getByText("Eléctrico").style.getPropertyValue("--on")).toBe(
      "var(--ink-on-light)",
    );
  });

  it("is a toggle button when used as a filter", async () => {
    const onToggle = vi.fn();
    render(<TypeChip type={ghost} onToggle={onToggle} pressed />);

    const button = screen.getByRole("button", { name: "Fantasma", pressed: true });
    await userEvent.click(button);
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
