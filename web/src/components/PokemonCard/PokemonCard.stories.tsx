import type { Meta, StoryObj } from "@storybook/react-vite";
import { card, cards } from "../../mocks/data";
import { PokemonCard } from "./PokemonCard";

const meta = {
  title: "Componentes/PokemonCard",
  component: PokemonCard,
  args: { pokemon: card(94) },
  decorators: [
    (Story) => (
      <div style={{ width: 200, paddingTop: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PokemonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const Selected: Story = { args: { selected: true } };

export const SingleType: Story = { args: { pokemon: card(25) } };

export const Legendary: Story = { args: { pokemon: card(150) } };

export const Mythical: Story = { args: { pokemon: card(151) } };

export const Gallery: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 1000px)" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "52px 16px",
        paddingTop: 36,
      }}
    >
      {cards.map((c) => (
        <PokemonCard key={c.id} pokemon={c} />
      ))}
    </div>
  ),
};
