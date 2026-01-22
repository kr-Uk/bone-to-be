module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // scope로 frontend/backend 구분 가능
    "scope-enum": [
      2,
      "always",
      ["frontend", "backend", "root", "deps", "config"],
    ],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "revert",
        "init",
      ],
    ],
    "subject-case": [0],
    "subject-max-length": [2, "always", 100],
  },
};
