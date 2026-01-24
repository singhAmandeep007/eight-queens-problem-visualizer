import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * ESLint Flat Config (ESLint v9+)
 *
 * Migration mode:
 * - Avoid type-aware rules (they’re very noisy when JS is freshly converted to TS).
 * - Keep core JS lint + React Hooks + React Refresh safety.
 * - Keep unused-vars + consistent type imports to help the TS conversion.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },

  js.configs.recommended,

  // Use non-type-aware TS recommendations during migration
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // Vite React Fast Refresh
      // Context objects are fine to export alongside providers; allow it to avoid noisy warnings.
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true, allowExportNames: ["ControlContext", "AlertContext"] }],

      // These rules are great once the codebase is fully typed, but very noisy during migration.
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/require-await": "off",
      "no-async-promise-executor": "off",

      // Keep TS hygiene
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      // Keep noise down for common patterns
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  }
);
