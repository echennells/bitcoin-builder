# Formatting & Linting Setup Summary

## What Was Added

This document summarizes the comprehensive formatting and linting architecture that was added to prevent spurious post-commit changes and ensure code consistency.

## New Dependencies

### Formatting

- **prettier** (^3.4.2): Code formatter for consistent style across the codebase
- **@trivago/prettier-plugin-sort-imports** (^4.3.0): Automatic import organization and sorting

### Linting

- **eslint-config-prettier** (^9.1.0): Disables ESLint rules that conflict with Prettier

### Git Hooks

- **husky** (^9.1.7): Git hooks manager for running checks before commits
- **lint-staged** (^15.2.11): Run linters only on staged files for faster pre-commit checks

## New Configuration Files

### Prettier Configuration

- **`.prettierrc`**: Defines code formatting rules
  - 2 space indentation
  - Semicolons required
  - Double quotes
  - 80 character line width
  - Import ordering with clear groups

- **`.prettierignore`**: Files excluded from formatting
  - node_modules
  - Build outputs
  - Generated files
  - Public assets
  - IDE settings

### Linting Configuration

- **`eslint.config.mjs`**: Enhanced to include Prettier compatibility
- **`.lintstagedrc.js`**: Defines what runs on commit
  - Type checking for TypeScript files
  - ESLint with auto-fix
  - Prettier formatting
  - Content validation

### Git Hooks

- **`.husky/pre-commit`**: Runs lint-staged before commits

### IDE Configuration

- **`.vscode/settings.json`**: VS Code workspace settings
  - Format on save enabled
  - ESLint auto-fix on save
  - Prettier as default formatter

- **`.vscode/extensions.json`**: Recommended extensions
  - Prettier extension
  - ESLint extension
  - Tailwind CSS extension

## New NPM Scripts

```json
{
  "format": "prettier --write .", // Format all files
  "format:check": "prettier --check .", // Check formatting without changes
  "lint:fix": "eslint . --fix", // Fix ESLint issues automatically
  "prepare": "husky install", // Set up git hooks
  "pre-commit": "lint-staged" // Run pre-commit checks
}
```

## New Documentation

- **`docs/FORMATTING-LINTING.md`**: Comprehensive guide covering:
  - Tool architecture overview
  - Setup instructions
  - Usage examples
  - Import ordering rules
  - Troubleshooting
  - CI/CD integration
  - Best practices

## Import Ordering

Imports are now automatically sorted in this order:

1. **React** (always first)
2. **Next.js modules** (next/\*)
3. **Third-party modules** (npm packages)
4. **Components** (@/components/\*)
5. **Lib utilities** (@/lib/\*)
6. **Other internal imports** (@/\*)
7. **Relative imports** (./ or ../)

Each group is separated by a blank line for readability.

## Pre-commit Workflow

When you commit, the following happens automatically:

1. **Type Check**: All TypeScript files are type-checked
2. **ESLint**: Runs on staged JS/TS files with auto-fix
3. **Prettier**: Formats staged JS/TS files
4. **Content Validation**: Validates content JSON files
5. **Formatting**: Applies Prettier to staged JSON, MD, CSS, etc.

If any step fails, the commit is blocked with an error message.

## Benefits

### Prevents Post-Commit Changes

- **Import reordering**: No more automatic import sorting after commits
- **Formatting consistency**: Everyone uses the same style rules
- **Early error detection**: Issues caught before commit, not after push

### Improves Developer Experience

- **Automatic formatting**: Code formats on save in VS Code
- **Consistent style**: No debates about tabs vs spaces, semicolons, etc.
- **Fast checks**: Only staged files are checked, not entire codebase

### Team Collaboration

- **Shared configuration**: Everyone uses the same tools and settings
- **Clean diffs**: Only meaningful changes in commits, no formatting noise
- **Quality assurance**: Type checking and linting before code is committed

## What Changed in Existing Files

### All Source Files

All TypeScript/TSX files were formatted with Prettier, which:

- Sorted imports according to the new rules
- Applied consistent spacing and line breaks
- Ensured semicolons and quotes match configuration

**Note**: These are one-time formatting changes. Future changes will be minimal because everyone will use the same formatter.

### package.json

- Added new devDependencies (prettier, husky, lint-staged, etc.)
- Added new scripts (format, format:check, lint:fix, prepare)
- Updated existing scripts to use pnpm consistently

### eslint.config.mjs

- Added `eslint-config-prettier` to prevent rule conflicts
- Prettier config must be last in the config array

### README.md

- Updated "Linting" section to "Code Quality"
- Added formatting commands
- Added reference to formatting guide

## Migration Guide

### For New Developers

1. Clone the repository
2. Run `pnpm install` (automatically sets up git hooks)
3. Install recommended VS Code extensions
4. Start coding - formatting happens automatically!

### For Existing Developers

1. Pull the latest changes
2. Run `pnpm install` to get new dependencies
3. Install recommended VS Code extensions
4. Restart VS Code to apply new settings
5. Your code will now format automatically on save

### For CI/CD

Add these checks to your pipeline:

```bash
pnpm format:check  # Fail if code isn't formatted
pnpm lint          # Fail on linting errors
pnpm tsc           # Fail on type errors
pnpm validate:content  # Fail on invalid content
```

## Customization

### Changing Prettier Rules

Edit `.prettierrc` and run `pnpm format` to reformat the codebase.

### Changing Import Order

Modify the `importOrder` array in `.prettierrc`:

```json
{
  "importOrder": [
    "^react$",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/(.*)$",
    "^[./]"
  ]
}
```

### Disabling Specific Rules

#### For Prettier

Add files to `.prettierignore`

#### For ESLint

Update `eslint.config.mjs` with rule overrides

#### For Pre-commit

Modify `.lintstagedrc.js` to change what runs

## Testing the Setup

### Test Formatting

```bash
# Create a poorly formatted file
echo "import {  useState  }  from 'react'  ;  " > test.ts

# Format it
pnpm format

# Check the result
cat test.ts
# Should be: import { useState } from "react";
```

### Test Pre-commit Hook

```bash
# Make a change
echo "// test" >> app/page.tsx

# Try to commit with type error
git add app/page.tsx
git commit -m "test"

# Hook should run and format/lint the file
```

## Troubleshooting

### Hook Not Running

```bash
pnpm prepare
chmod +x .husky/pre-commit
```

### Import Order Not Working

```bash
# Ensure plugin is installed
pnpm install @trivago/prettier-plugin-sort-imports

# Re-run format
pnpm format
```

### VS Code Not Formatting

1. Install "Prettier - Code formatter" extension
2. Restart VS Code
3. Check `.vscode/settings.json` is being respected
4. Try: Cmd+Shift+P → "Format Document"

## Next Steps

1. **Run `pnpm format`** on the entire codebase (already done)
2. **Commit formatting changes** separately from feature changes
3. **Train team** on new workflow
4. **Add to CI/CD** pipeline
5. **Update contribution guidelines** to mention these tools

## References

- Main Guide: `docs/FORMATTING-LINTING.md`
- Prettier Config: `.prettierrc`
- ESLint Config: `eslint.config.mjs`
- Pre-commit Config: `.lintstagedrc.js`
