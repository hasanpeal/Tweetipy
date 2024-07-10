/** @type {import('tailwindcss').Config} */
import keepPreset from "keep-react/preset";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [keepPreset],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "night"],
  },
  // eslint-disable-next-line no-undef
  plugins: [
    // eslint-disable-next-line no-undef
    require("@tailwindcss/typography"),
    // eslint-disable-next-line no-undef
    require("daisyui"),
  ],
};
