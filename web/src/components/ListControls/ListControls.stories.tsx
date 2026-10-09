import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { types } from "../../mocks/data";
import { ListControls, type ListFilters } from "./ListControls";

const meta = {
  title: "Componentes/ListControls",
  component: ListControls,
  args: { filters: { q: "", generation: null, type: null }, types, onChange: () => {} },
} satisfies Meta<typeof ListControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithActiveFilters: Story = {
  args: { filters: { q: "gen", generation: 1, type: "ghost" } },
};

export const Interactive: Story = {
  render: (args) => {
    const [filters, setFilters] = useState<ListFilters>(args.filters);
    return <ListControls {...args} filters={filters} onChange={setFilters} />;
  },
};

export const OnPhone: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
