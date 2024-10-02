/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  singleQuote: true,
  jsxSingleQuote: false,
  arrowParens: "always",
  printWidth: 100,
  semi: true,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
};

export default config;
