import type { Meta, StoryObj } from "@storybook/react-vite";
import { speciesVars } from "../styleVars";
import { HexBadge, HexBadges } from "./HexBadge";

const meta = {
  title: "Componentes/HexBadge",
  component: HexBadge,
  args: { label: "Altura", value: "1,5 m" },
  decorators: [
    (Story) => (
      <div style={{ width: 320, ...speciesVars("purple") }}>
        <HexBadges>
          <Story />
        </HexBadges>
      </div>
    ),
  ],
} satisfies Meta<typeof HexBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const MeasuresRow: Story = {
  render: () => (
    <>
      <HexBadge label="Altura" value="1,5 m" />
      <HexBadge label="Peso" value="40,5 kg" />
      <HexBadge label="Total" value="500" />
    </>
  ),
};
