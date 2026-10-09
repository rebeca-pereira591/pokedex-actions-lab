import type { Meta, StoryObj } from "@storybook/react-vite";
import { detail } from "../../mocks/data";
import { speciesVars } from "../styleVars";
import { EvolutionChain } from "./EvolutionChain";

const meta = {
  title: "Componentes/EvolutionChain",
  component: EvolutionChain,
  args: { stages: detail(94).evolution, currentId: 94 },
  decorators: [
    (Story) => (
      <div style={{ width: 440, ...speciesVars("purple") }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EvolutionChain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linear: Story = {};

export const Branching: Story = { args: { stages: detail(133).evolution, currentId: 700 } };

export const NoEvolution: Story = { args: { stages: detail(151).evolution, currentId: 151 } };
