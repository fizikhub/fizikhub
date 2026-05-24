import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactCompiler from "eslint-plugin-react-compiler";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      // Existing debt is tracked as warnings so lint can become a useful CI
      // gate again. Promote these back to errors as each category is paid down.
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off", // Disabled as Turkish language heavily uses apostrophes
      "react-compiler/react-compiler": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  {
    files: ["*.js"],
    rules: {
      // Root-level maintenance scripts are executed directly by Node and still
      // use CommonJS because the app package is not marked as ESM.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "public/**",
    "node_modules/**",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
