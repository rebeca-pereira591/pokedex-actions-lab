import type { Meta, StoryObj } from "@storybook/react-vite";
import { types } from "../../mocks/data";
import { TypeChip } from "./TypeChip";

const meta = {
  title: "Componentes/TypeChip",
  component: TypeChip,
  args: { type: types[13] },
} satisfies Meta<typeof TypeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 520 }}>
      {types.map((t) => (
        <TypeChip key={t.name} type={t} />
      ))}
    </div>
  ),
};

export const AsFilter: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 6 }}>
      <TypeChip type={types[1]} onToggle={() => {}} dimmed />
      <TypeChip type={types[13]} onToggle={() => {}} pressed />
      <TypeChip type={types[2]} onToggle={() => {}} dimmed />
    </div>
  ),
};
