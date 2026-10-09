import type { Meta, StoryObj } from "@storybook/react-vite";
import { detail } from "../../mocks/data";
import { WeaknessTable } from "./WeaknessTable";

const meta = {
  title: "Componentes/WeaknessTable",
  component: WeaknessTable,
  args: { weaknesses: detail(94).weaknesses },
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeaknessTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Gengar: dos inmunidades y dos ×¼. */
export const WithImmunities: Story = {};

/** Gyarados: ×4 de Eléctrico. */
export const WithDoubleWeakness: Story = { args: { weaknesses: detail(130).weaknesses } };

/** Bulbasaur: ×¼ de Planta. */
export const WithQuarterResistance: Story = { args: { weaknesses: detail(1).weaknesses } };
