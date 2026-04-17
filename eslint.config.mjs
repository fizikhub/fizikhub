import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
let reactCompiler = null;

try {
  ({ default: reactCompiler } = await import("eslint-plugin-react-compiler"));
} catch {
  reactCompiler = null;
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: reactCompiler
      ? {
          "react-compiler": reactCompiler,
        }
      : {},
    rules: reactCompiler
      ? {
          "react-compiler/react-compiler": "error",
        }
      : {},
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
