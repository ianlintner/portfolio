export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.venv/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/coverage/**",
      "**/package-lock.json",
      "**/pnpm-lock.yaml",
      "**/yarn.lock",
      "**/public/docs/**",
      "**/site/**",
      "**/.astro/**",
      "**/*.ts",
      "**/*.tsx",
      "**/*.astro",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-constant-condition": "off",
    },
  },
];
