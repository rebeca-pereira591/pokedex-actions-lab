import type { Meta, StoryObj } from "@storybook/react-vite";
import { detail } from "../../mocks/data";
import { speciesVars } from "../styleVars";
import { CryButton } from "./CryButton";

const meta = {
  title: "Componentes/CryButton",
  component: CryButton,
  args: { url: detail(94).cryUrl },
  decorators: [
    (Story) => (
      <div style={{ width: 280, ...speciesVars("purple") }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

// Dentro de un especial toma el tono del metal (la clase global la pone la ficha).
export const InsideLegendary: Story = {
  decorators: [
    (Story) => (
      <div className="legendary">
        <Story />
      </div>
    ),
  ],
};

export const InsideMythical: Story = {
  decorators: [
    (Story) => (
      <div className="mythical">
        <Story />
      </div>
    ),
  ],
};
