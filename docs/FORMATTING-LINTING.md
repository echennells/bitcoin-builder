# Code Formatting & Linting Guide

This project uses a comprehensive formatting and linting setup to ensure code consistency and prevent spurious diffs in commits.

## Architecture Overview

### Tools Used

- **Prettier**: Code formatter for consistent style
- **ESLint**: Static code analysis and error detection
- **Husky**: Git hooks manager
- **lint-staged**: Run linters on staged files only
- **@trivago/prettier-plugin-sort-imports**: Automatic import organization

## Setup

### Initial Installation

```bash
pnpm install
pnpm prepare  # Sets up git hooks
```

### IDE Setup (VS Code)

The project includes VS Code settings that automatically:

- Format on save using Prettier
- Fix ESLint issues on save
- Use the workspace TypeScript version

**Recommended Extensions** (see `.vscode/extensions.json`):

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

## Usage

### Manual Commands

```bash
# Format all files
pnpm format

# Check formatting without making changes
pnpm format:check

# Run ESLint
pnpm lint

# Fix ESLint issues automatically
pnpm lint:fix

# Type check
pnpm tsc

# Validate content files
pnpm validate:content

# Run all checks (content validation + type checking)
pnpm content:check
```

### Automatic Formatting

The project is configured to automatically format code in two ways:

#### 1. On Save (VS Code)

If you're using VS Code with the Prettier extension, code will automatically format when you save.

#### 2. Pre-commit Hook

When you commit, the following happens automatically:

1. **TypeScript files**: Type-checked, linted with ESLint, formatted with Prettier
2. **Other files** (JSON, Markdown, CSS): Formatted with Prettier
3. **Content files**: Validated against schemas

If any step fails, the commit is blocked.

## Prettier Configuration

Located in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Import Ordering

Imports are automatically sorted in this order:

1. React
2. Next.js modules
3. Third-party modules
4. `@/components/*`
5. `@/lib/*`
6. Other `@/*` imports
7. Relative imports

**Example:**

```typescript
import React from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { z } from "zod";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";

import { loadEvent } from "@/lib/content";
import { urls } from "@/lib/utils/urls";

import type { Event } from "./types";
```

## ESLint Configuration

Located in `eslint.config.mjs`:

- Uses Next.js recommended rules
- Includes TypeScript support
- Disables rules that conflict with Prettier

## Troubleshooting

### Pre-commit Hook Not Running

```bash
# Reinstall git hooks
pnpm prepare
```

### Formatting Conflicts

If ESLint and Prettier seem to conflict:

```bash
# Ensure dependencies are up to date
pnpm install

# Run format before lint
pnpm format
pnpm lint
```

### Import Ordering Issues

If imports are being reordered unexpectedly:

1. Check `.prettierrc` for `importOrder` configuration
2. Ensure the Prettier plugin is installed: `@trivago/prettier-plugin-sort-imports`
3. Re-run: `pnpm format`

### Bypassing Pre-commit Hooks (Not Recommended)

In rare cases, you may need to bypass hooks:

```bash
git commit --no-verify -m "message"
```

**Warning**: This bypasses all quality checks. Only use when absolutely necessary (e.g., fixing CI).

## CI/CD Integration

For continuous integration, add these checks to your pipeline:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: pnpm install

- name: Check formatting
  run: pnpm format:check

- name: Lint
  run: pnpm lint

- name: Type check
  run: pnpm tsc

- name: Validate content
  run: pnpm validate:content
```

## Best Practices

### For Developers

1. **Install recommended extensions** in VS Code
2. **Let pre-commit hooks run** - don't bypass them
3. **Run `pnpm format`** before pushing if you bypassed hooks
4. **Keep dependencies updated** to get bug fixes

### For Teams

1. **Everyone uses the same IDE settings** (committed to `.vscode/`)
2. **Never commit with `--no-verify`** unless approved
3. **Update this guide** when making configuration changes
4. **Run `pnpm format` on the entire codebase** after major config changes

## Configuration Files

- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to exclude from formatting
- `eslint.config.mjs` - ESLint configuration
- `.lintstagedrc.js` - Pre-commit hook configuration
- `.husky/pre-commit` - Git pre-commit hook
- `.vscode/settings.json` - VS Code workspace settings

## Migration Notes

### Reformatting Existing Code

After setting up this system:

```bash
# Format all files at once
pnpm format

# Review changes
git diff

# Commit formatting changes separately
git add .
git commit -m "chore: apply prettier formatting"
```

### Gradual Adoption

If you prefer gradual adoption:

1. Start with new files only (modify `.lintstagedrc.js`)
2. Format modules incrementally
3. Eventually run on entire codebase

## Additional Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
