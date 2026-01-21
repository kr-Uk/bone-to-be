import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1) 모든 파일 공통(가벼운 기본)
  js.configs.recommended,
  prettierConfig,

  // 2) JS 설정 파일(타입 기반 규칙 적용 X)
  {
    files: ["**/*.{js,cjs,mjs}"],
    rules: {
      // JS 파일은 TS 규칙이 필요 없으니 최소로
    },
  },

  // 3) TS/TSX만 "type-aware lint" 적용
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["**/*.{ts,tsx}"],
  })),

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // 팀 규칙
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],

      // import 정리
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // eslint 기본 unused는 ts 규칙과 충돌 가능
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // import 순서
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // 4) 무시 경로
  {
    ignores: ["dist/**", "storybook-static/**", "coverage/**"],
  },
];
