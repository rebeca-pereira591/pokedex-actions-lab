import type { Meta, StoryObj } from "@storybook/react-vite";
import { detail } from "../../mocks/data";
import { speciesVars } from "../styleVars";
import { StatBars } from "./StatBars";

const meta = {
  title: "Componentes/StatBars",
  component: StatBars,
  args: { stats: detail(94).stats },
  decorators: [
    (Story) => (
      <div style={{ width: 360, ...speciesVars("purple") }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatBars>;

export default meta;

export const Gengar: StoryObj<typeof meta> = {};
