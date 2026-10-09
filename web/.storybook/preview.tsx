import type { Preview } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import "../src/styles/fonts";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: { layout: "padded" },
  // Las tarjetas y la cadena evolutiva son links: necesitan un router alrededor.
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
