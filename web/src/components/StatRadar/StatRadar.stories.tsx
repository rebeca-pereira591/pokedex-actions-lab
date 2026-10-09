import type { Meta, StoryObj } from "@storybook/react-vite";
import { detail } from "../../mocks/data";
import { speciesVars } from "../styleVars";
import { StatRadar } from "./StatRadar";

const gengar = detail(94);

const meta = {
  title: "Componentes/StatRadar",
  component: StatRadar,
  args: { stats: gengar.stats, name: gengar.name },
  decorators: [
    (Story) => (
      <div style={{ width: 380, ...speciesVars("purple") }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatRadar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabels: Story = {};

export const Mini: Story = { args: { labels: false } };

// Escala fija 0–255: Shuckle (defensa 230) y Blissey (PS 255) se ven extremos de verdad.
export const Extremes: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[213, 242].map((id) => {
        const p = detail(id);
        return (
          <figure key={id} style={{ margin: 0, ...speciesVars(p.speciesColor) }}>
            <StatRadar stats={p.stats} name={p.name} />
            <figcaption style={{ textAlign: "center" }}>{p.name}</figcaption>
          </figure>
        );
      })}
    </div>
  ),
};
