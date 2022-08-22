module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
