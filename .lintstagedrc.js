module.exports = {
  // Run type-check on changes to TypeScript files
  "**/*.ts?(x)": () => "pnpm tsc --noEmit",
  // Run ESLint on changes to JavaScript/TypeScript files
  "**/*.(ts|tsx|js|jsx)": (filenames) => [
    `pnpm eslint --fix ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],
  // Run Prettier on changes to other files
  "**/*.(json|md|mdx|css|html|yml|yaml)": (filenames) =>
    `pnpm prettier --write ${filenames.join(" ")}`,
  // Validate content files when they change
  "**/content/*.json": () => "pnpm validate:content",
};
