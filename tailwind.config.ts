import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

const getNumberTheme = (
  from: number,
  to: number,
  mapCallback: (num: number) => [number | string, string]
): { [key: string]: string } => {
  return Object.fromEntries(
    [...Array(to - from + 1)].map((_, i) => i + from).map(mapCallback)
  );
};

const theme = {
  borderWidth: {
    0: "0px",
    DEFAULT: "1px",
    ...getNumberTheme(2, 10, (num) => [num, `${num}px`]),
  },
  borderRadius: {
    ...getNumberTheme(0, 50, (num) => [num, `${num}px`]),
    full: "9999px",
  },
  colors: {
    black: {
      DEFAULT: "#2c2c2c",
      5: "#f5f5f5",
      10: "#eaeaea",
      20: "#d5d5d5",
      30: "#c0c0c0",
      40: "#aaaaaa",
      50: "#959595",
      60: "#808080",
      70: "#6b6b6b",
      80: "#565656",
      90: "#414141",
      100: "#2c2c2c",
    },
    white: "#ffffff",
    red: "#D40B2F",
    // ====================
    inherit: colors.inherit,
    current: colors.current,
    transparent: colors.transparent,
    "input-border-base": "#ccc",
  },
  spacing: {
    ...getNumberTheme(0, 1200, (num) => [num, `${num}px`]),
  },
  fontSize: {
    ...getNumberTheme(1, 100, (num) => [num, `${num / 16}rem`]),
  },
} satisfies Config["theme"];

const plugins = [
  // grid-cols-[repeat(auto-fill, minmax(n, 1fr))] のショートハンド
  plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "grid-columns-auto-fill": (value) => ({
          gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
        }),
      },
      { values: theme("spacing") }
    );
  }),
] satisfies Config["plugins"];

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme,
  plugins,
} satisfies Config;
