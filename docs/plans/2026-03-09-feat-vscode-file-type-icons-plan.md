---
title: "feat: Add VS Code-style file type icons to editor"
type: feat
status: active
date: 2026-03-09
---

# feat: Add VS Code-style file type icons to editor

## Overview

Replace the mixed icon set (`i-logos:*`, `i-carbon:*`, `i-vscode-icons:*`) in the code editor's file tree and tab bar with consistent VS Code-style icons from `@iconify-json/vscode-icons`. Add folder open/closed states and named folder icons (src, components, pages, etc.) to match VS Code's explorer appearance.

## Problem Statement

The editor's file tree currently uses icons from 3 different icon sets with inconsistent visual weight and style. Folders always show a generic `i-carbon:folder` with no open/closed distinction. Several common file types (`.env`, `.yml`, `.graphql`, `.prisma`, `Dockerfile`) fall back to a generic document icon. Additionally, `@iconify-json/vscode-icons` and `@iconify-json/carbon` are **not installed as dependencies** — they only work via UnoCSS CDN fetching during dev mode, which will fail in offline/production builds.

## Proposed Solution

1. Install `@iconify-json/vscode-icons` as a dependency of the addon package
2. Migrate all file icon mappings to use `i-vscode-icons:file-type-*` consistently
3. Add `getFolderIcon(name, expanded)` function with named folder support and open/closed states
4. Update `EditorFileNode.vue` to use dynamic folder icons
5. Migrate the caret chevron from `i-carbon:chevron-right` to `i-ph-caret-right` (already installed)
6. Safelist all icon strings in `setup/unocss.ts`
7. Clean up unused `@iconify-json/logos` dependency

## Acceptance Criteria

- [ ] All file types show their correct VS Code icon in both the sidebar tree and tab bar
- [ ] Folders show open/closed icon states when expanded/collapsed
- [ ] Named folders (`src`, `components`, `pages`, etc.) get folder-specific icons
- [ ] Unknown file types fall back to `i-vscode-icons:default-file`
- [ ] Icons render correctly in dev mode AND production builds (not dependent on CDN)
- [ ] All dynamically-resolved icons are safelisted in UnoCSS config
- [ ] No unused icon packages remain as dependencies

## Technical Approach

### Files to modify

| File | Change |
|------|--------|
| `packages/slidev-addon-utils/package.json` | Add `@iconify-json/vscode-icons` dependency |
| `packages/slidev-addon-utils/utils/parseFileTree.ts` | Rewrite icon maps, add `getFolderIcon()`, add `getAllIconClasses()` export |
| `packages/slidev-addon-utils/components/EditorFileNode.vue` | Dynamic folder icon, migrate chevron to `i-ph-caret-right` |
| `packages/slidev-addon-utils/setup/unocss.ts` | Safelist all icon classes from parseFileTree |
| `starter/package.json` | Remove `@iconify-json/logos` if unused elsewhere |

### Step 1: Install dependency

```bash
pnpm --filter slidev-addon-utils add -D @iconify-json/vscode-icons
```

### Step 2: Verify icon names

Before writing mappings, verify the exact icon names available in the installed package:

```bash
node -e "
const d = require('@iconify-json/vscode-icons/icons.json');
const names = Object.keys(d.icons);
const fileTypes = names.filter(k => k.startsWith('file-type-')).sort();
const folders = names.filter(k => k.includes('folder')).sort();
console.log('=== File type icons ===');
fileTypes.forEach(n => console.log(n));
console.log('=== Folder icons ===');
folders.forEach(n => console.log(n));
"
```

### Step 3: Rewrite icon maps in `parseFileTree.ts`

Replace `FILE_NAME_ICONS` and `EXTENSION_ICONS` with verified `i-vscode-icons:*` names. Add new maps and function:

```ts
// packages/slidev-addon-utils/utils/parseFileTree.ts

// --- File icons (exact filename match) ---
const FILE_NAME_ICONS: Record<string, string> = {
  'package.json':    'i-vscode-icons:file-type-node',
  'tsconfig.json':   'i-vscode-icons:file-type-tsconfig',
  'vite.config.ts':  'i-vscode-icons:file-type-vite',
  'vite.config.js':  'i-vscode-icons:file-type-vite',
  '.gitignore':      'i-vscode-icons:file-type-git',
  '.env':            'i-vscode-icons:file-type-dotenv',
  '.env.local':      'i-vscode-icons:file-type-dotenv',
  '.eslintrc':       'i-vscode-icons:file-type-eslint',
  '.eslintrc.js':    'i-vscode-icons:file-type-eslint',
  '.eslintrc.json':  'i-vscode-icons:file-type-eslint',
  '.prettierrc':     'i-vscode-icons:file-type-prettier',
  'Dockerfile':      'i-vscode-icons:file-type-docker2',
  'docker-compose.yml': 'i-vscode-icons:file-type-docker2',
  'README.md':       'i-vscode-icons:file-type-markdown',
  'LICENSE':         'i-vscode-icons:file-type-license',
  'yarn.lock':       'i-vscode-icons:file-type-yarn',
  'pnpm-lock.yaml':  'i-vscode-icons:file-type-pnpm',
  'tailwind.config.ts': 'i-vscode-icons:file-type-tailwind',
  'tailwind.config.js': 'i-vscode-icons:file-type-tailwind',
  'nuxt.config.ts':  'i-vscode-icons:file-type-nuxt',
}

// --- File icons (extension match) ---
const EXTENSION_ICONS: Record<string, string> = {
  vue:     'i-vscode-icons:file-type-vue',
  ts:      'i-vscode-icons:file-type-typescript',
  tsx:     'i-vscode-icons:file-type-typescriptdef', // verify name
  js:      'i-vscode-icons:file-type-js',
  jsx:     'i-vscode-icons:file-type-reactjs',
  json:    'i-vscode-icons:file-type-json',
  css:     'i-vscode-icons:file-type-css',
  scss:    'i-vscode-icons:file-type-scss',
  sass:    'i-vscode-icons:file-type-sass',
  html:    'i-vscode-icons:file-type-html',
  md:      'i-vscode-icons:file-type-markdown',
  yaml:    'i-vscode-icons:file-type-yaml',
  yml:     'i-vscode-icons:file-type-yaml',
  graphql: 'i-vscode-icons:file-type-graphql',
  prisma:  'i-vscode-icons:file-type-prisma',
  svg:     'i-vscode-icons:file-type-svg',
  png:     'i-vscode-icons:file-type-image',
  jpg:     'i-vscode-icons:file-type-image',
  jpeg:    'i-vscode-icons:file-type-image',
  gif:     'i-vscode-icons:file-type-image',
  ico:     'i-vscode-icons:file-type-favicon',
  py:      'i-vscode-icons:file-type-python',
  rb:      'i-vscode-icons:file-type-ruby',
  go:      'i-vscode-icons:file-type-go',
  rs:      'i-vscode-icons:file-type-rust',
  sql:     'i-vscode-icons:file-type-sql',
  sh:      'i-vscode-icons:file-type-shell',
  toml:    'i-vscode-icons:file-type-toml',
}

const DEFAULT_FILE_ICON = 'i-vscode-icons:default-file'

// --- Folder icons (name-specific, open/closed) ---
const FOLDER_NAME_ICONS: Record<string, { closed: string; open: string }> = {
  src:        { closed: 'i-vscode-icons:folder-type-src',        open: 'i-vscode-icons:folder-type-src-opened' },
  components: { closed: 'i-vscode-icons:folder-type-component',  open: 'i-vscode-icons:folder-type-component-opened' },
  pages:      { closed: 'i-vscode-icons:folder-type-view',       open: 'i-vscode-icons:folder-type-view-opened' },
  views:      { closed: 'i-vscode-icons:folder-type-view',       open: 'i-vscode-icons:folder-type-view-opened' },
  layouts:    { closed: 'i-vscode-icons:folder-type-layout',     open: 'i-vscode-icons:folder-type-layout-opened' },
  assets:     { closed: 'i-vscode-icons:folder-type-images',     open: 'i-vscode-icons:folder-type-images-opened' },
  public:     { closed: 'i-vscode-icons:folder-type-public',     open: 'i-vscode-icons:folder-type-public-opened' },
  styles:     { closed: 'i-vscode-icons:folder-type-css',        open: 'i-vscode-icons:folder-type-css-opened' },
  utils:      { closed: 'i-vscode-icons:folder-type-helper',     open: 'i-vscode-icons:folder-type-helper-opened' },
  lib:        { closed: 'i-vscode-icons:folder-type-lib',        open: 'i-vscode-icons:folder-type-lib-opened' },
  tests:      { closed: 'i-vscode-icons:folder-type-test',       open: 'i-vscode-icons:folder-type-test-opened' },
  test:       { closed: 'i-vscode-icons:folder-type-test',       open: 'i-vscode-icons:folder-type-test-opened' },
  config:     { closed: 'i-vscode-icons:folder-type-config',     open: 'i-vscode-icons:folder-type-config-opened' },
  api:        { closed: 'i-vscode-icons:folder-type-api',        open: 'i-vscode-icons:folder-type-api-opened' },
  composables:{ closed: 'i-vscode-icons:folder-type-hook',       open: 'i-vscode-icons:folder-type-hook-opened' },
  hooks:      { closed: 'i-vscode-icons:folder-type-hook',       open: 'i-vscode-icons:folder-type-hook-opened' },
  stores:     { closed: 'i-vscode-icons:folder-type-store',      open: 'i-vscode-icons:folder-type-store-opened' },
  types:      { closed: 'i-vscode-icons:folder-type-typings',    open: 'i-vscode-icons:folder-type-typings-opened' },
  docs:       { closed: 'i-vscode-icons:folder-type-docs',       open: 'i-vscode-icons:folder-type-docs-opened' },
  dist:       { closed: 'i-vscode-icons:folder-type-dist',       open: 'i-vscode-icons:folder-type-dist-opened' },
}

const DEFAULT_FOLDER_ICON = {
  closed: 'i-vscode-icons:default-folder',
  open:   'i-vscode-icons:default-folder-opened',
}
```

Add new exported functions:

```ts
/** Resolve a folder icon class. Uses named folder icons when available. */
export function getFolderIcon(folderName: string, expanded: boolean): string {
  const entry = FOLDER_NAME_ICONS[folderName.toLowerCase()] ?? DEFAULT_FOLDER_ICON
  return expanded ? entry.open : entry.closed
}

/** Collect all icon class strings for UnoCSS safelisting. */
export function getAllIconClasses(): string[] {
  const icons = new Set<string>()

  // File icons
  Object.values(FILE_NAME_ICONS).forEach(v => icons.add(v))
  Object.values(EXTENSION_ICONS).forEach(v => icons.add(v))
  icons.add(DEFAULT_FILE_ICON)

  // Folder icons (both states)
  Object.values(FOLDER_NAME_ICONS).forEach(v => {
    icons.add(v.closed)
    icons.add(v.open)
  })
  icons.add(DEFAULT_FOLDER_ICON.closed)
  icons.add(DEFAULT_FOLDER_ICON.open)

  // Caret
  icons.add('i-ph-caret-right')

  return [...icons]
}
```

### Step 4: Update `EditorFileNode.vue`

```vue
<!-- packages/slidev-addon-utils/components/EditorFileNode.vue -->

<!-- Folder: replace hardcoded icon -->
<div class="editor-node__caret" :class="{ 'editor-node__caret--open': expanded }" aria-hidden="true">
  <div class="i-ph-caret-right" />  <!-- was i-carbon:chevron-right -->
</div>
<div class="editor-node__icon" aria-hidden="true">
  <div :class="folderIcon" />  <!-- was hardcoded i-carbon:folder -->
</div>

<!-- Script: add folderIcon computed -->
<script setup lang="ts">
import { getFileIcon, getFolderIcon } from '../utils/parseFileTree'

const folderIcon = computed(() => getFolderIcon(props.node.name, expanded.value))
const fileIcon = computed(() => getFileIcon(props.node.name))
</script>
```

### Step 5: Update UnoCSS safelist

```ts
// packages/slidev-addon-utils/setup/unocss.ts
import { getAllIconClasses } from '../utils/parseFileTree'

export default defineUnoConfig({
  presets: [presetIcons()],
  safelist: [
    ...getAllIconClasses(),
    // existing IDEALS icons...
  ],
})
```

### Step 6: Clean up unused dependencies

After migration, audit for remaining `i-logos:*` and `i-carbon:*` references:

```bash
# Check if any slides or components still reference i-logos: or i-carbon:
grep -r "i-logos:" starter/ packages/
grep -r "i-carbon:" starter/ packages/
```

If no references remain:
- Remove `@iconify-json/logos` from `starter/package.json`
- Do NOT add `@iconify-json/carbon` (it was never declared)

## Important Notes

- **Icon name verification is critical.** The exact names in `@iconify-json/vscode-icons` must be verified after installation. Names like `file-type-typescriptdef` vs `file-type-typescript-official` vary. Run the verification script in Step 2 before writing final mappings.
- **Folder icon variants.** Not all named folders may have `-opened` variants in vscode-icons. If a named folder icon doesn't have an opened variant, fall back to `default-folder-opened`.
- **Icon colors.** VS Code icons are multi-colored SVGs. This matches the VS Code look the user wants. No monochrome override needed.
- **Icon sizing.** Current 14x14 px sizing in `.editor-node__icon` works with vscode-icons since UnoCSS sets width/height on the generated element.
- **Tab bar.** `code-editor.vue` line 23 calls `getFileIcon(tab)` — the function signature is unchanged, so no tab bar code changes needed.

## References

- `packages/slidev-addon-utils/utils/parseFileTree.ts:176-208` — Current icon maps
- `packages/slidev-addon-utils/components/EditorFileNode.vue:13-17` — Hardcoded folder/caret icons
- `packages/slidev-addon-utils/layouts/code-editor.vue:22-24` — Tab bar icon usage
- `packages/slidev-addon-utils/setup/unocss.ts` — UnoCSS safelist config
- [Iconify vscode-icons set](https://icon-sets.iconify.design/vscode-icons/) — Icon name reference
