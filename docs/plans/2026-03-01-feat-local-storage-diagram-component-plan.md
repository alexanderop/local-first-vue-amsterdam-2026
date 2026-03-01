---
title: "feat: Interactive LocalStorageDiagram component"
type: feat
status: active
date: 2026-03-01
---

# feat: Interactive LocalStorageDiagram component

## Overview

Replace the ASCII-art `Local Storage Options` slide (line 540 of `starter/slides.md`) with a hand-drawn Rough.js interactive diagram component, following the same patterns as `SplitDiagram.vue`, `DuplicatedArchDiagram.vue`, and other existing diagram components.

## Problem Statement / Motivation

The current slide uses a raw code block with ASCII box-drawing characters. Every other architecture/comparison slide in the deck has been converted to an interactive Rough.js diagram with progressive click-based reveals. This slide should match for visual consistency.

## Proposed Solution

Create a new `LocalStorageDiagram.vue` component in `packages/slidev-addon-utils/components/` and update `starter/slides.md` to use it.

### Diagram Structure

The diagram has 4 visual layers, revealed progressively via clicks:

```
┌─────────────────────────── Browser ──────────────────────────┐
│                                                               │
│  ┌─── IndexedDB ────────┐    ┌─── SQLite (WASM) ────────┐   │
│  │                       │    │                           │   │
│  │  ┌─ Object Store A ─┐│    │  ┌──────┬──────┬──────┐  │   │
│  │  │  { key: value }   ││    │  │  id  │ name │ age  │  │   │
│  │  └───────────────────┘│    │  ├──────┼──────┼──────┤  │   │
│  │  ┌─ Object Store B ─┐│    │  │   1  │ Alex │  30  │  │   │
│  │  │  { key: value }   ││    │  │   2  │ Sara │  25  │  │   │
│  │  └───────────────────┘│    │  └──────┴──────┴──────┘  │   │
│  │                       │    │                           │   │
│  │  API: async, callbacks│    │  API: full SQL queries    │   │
│  │  Storage: native      │    │  Storage: OPFS / memory   │   │
│  │  Since: 2015          │    │  Bundle: ~500KB WASM      │   │
│  └───────────────────────┘    └───────────────────────────┘   │
│                                                               │
│  ┌─── Libraries ──────────────────────────────────────────┐  │
│  │  Dexie     wa-sqlite     SQLite WASM     PGlite        │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Click Progression

| Click | Reveals |
|-------|---------|
| — | Browser outer container + title |
| 1 | IndexedDB panel (box + title) |
| 1 | SQLite (WASM) panel (box + title) |
| 2 | IndexedDB inner content: Object Store boxes with `{ key: value }` |
| 2 | SQLite inner content: table with columns and data rows |
| 3 | Metadata text under each panel (API, Storage, Since/Bundle) |
| 4 | Libraries bar at bottom with library names |

## Technical Approach

### Component: `LocalStorageDiagram.vue`

**Location:** `packages/slidev-addon-utils/components/LocalStorageDiagram.vue`

**Imports (following existing patterns):**
- `RoughRect` — outer Browser box, panel boxes, object store boxes, table outline, libraries bar
- `RoughLine` — table grid lines (horizontal/vertical separators)
- `useClickVisibility` — progressive reveal
- `hashId` from `useRough` — deterministic seeds
- Color constants from `constants/colors.ts`

**Props interface:**
```typescript
interface StoragePanel {
  title: string          // "IndexedDB" or "SQLite (WASM)"
  variant?: Variant
  click?: number
}

interface ObjectStore {
  label: string          // "Object Store A"
  value: string          // "{ key: value }"
  click?: number
}

interface TableData {
  headers: string[]      // ["id", "name", "age"]
  rows: string[][]       // [["1", "Alex", "30"], ["2", "Sara", "25"]]
  click?: number
}

interface MetaLine {
  text: string           // "API: async, callbacks"
}

interface MetaBlock {
  lines: MetaLine[]
  click?: number
}

interface LibraryItem {
  name: string           // "Dexie"
  variant?: Variant
}

interface LibrariesBar {
  items: LibraryItem[]
  click?: number
}

// Component props
{
  panels: [
    { panel: StoragePanel, stores?: ObjectStore[], table?: TableData, meta: MetaBlock },
    { panel: StoragePanel, stores?: ObjectStore[], table?: TableData, meta: MetaBlock },
  ]
  libraries: LibrariesBar
  roughness?: number     // default: 1.5
  seed?: number          // default: 42
}
```

**Layout calculations (computed):**
- Outer Browser box: full width, with dashed stroke `rgba(255,255,255,0.15)`
- Two panels side-by-side inside Browser (like SplitDiagram's panel layout)
- IndexedDB panel: stacked RoughRect boxes for each object store with text labels
- SQLite panel: RoughRect for table outline + RoughLine for grid + text for cells
- Meta text below data area, inside each panel
- Libraries bar: full-width RoughRect at bottom inside Browser, with evenly-spaced text labels

**SVG structure (nested `<g>` groups):**
```
<svg>
  <g class="browser">          <!-- always visible -->
    <RoughRect />              <!-- Browser outer box, dashed -->
    <text>Browser</text>
  </g>
  <g class="panel" v-for>     <!-- click: 1 -->
    <RoughRect />              <!-- panel box -->
    <text>{{ panel.title }}</text>
    <g class="stores">         <!-- click: 2 -->
      <!-- IndexedDB: RoughRect per store -->
      <!-- SQLite: RoughRect + RoughLines for table grid -->
    </g>
    <g class="meta">           <!-- click: 3 -->
      <text v-for>{{ line }}</text>
    </g>
  </g>
  <g class="libraries">       <!-- click: 4 -->
    <RoughRect />
    <text>Libraries</text>
    <text v-for>{{ lib.name }}</text>
  </g>
</svg>
```

**Styling (following existing conventions):**
- CSS class prefix: `storage-diagram__`
- Font: Geist Mono for labels/code, Geist Sans for titles
- Colors: same variant system (default pink, accent, muted, success)
- Transitions: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)` on `__el` class
- Hidden state: `opacity: 0` via `--hidden` modifier class

### Slide Update: `starter/slides.md`

Replace lines 540-566 (the current ASCII code block) with:

```markdown
---
clicks: 4
---

# Local Storage Options

<LocalStorageDiagram
  :panels="[
    {
      panel: { title: 'IndexedDB', click: 1 },
      stores: [
        { label: 'Object Store A', value: '{ key: value }', click: 2 },
        { label: 'Object Store B', value: '{ key: value }', click: 2 },
      ],
      meta: {
        lines: [
          { text: 'API: async, callbacks' },
          { text: 'Storage: native' },
          { text: 'Since: 2015, everywhere' },
        ],
        click: 3,
      },
    },
    {
      panel: { title: 'SQLite (WASM)', click: 1 },
      table: {
        headers: ['id', 'name', 'age'],
        rows: [['1', 'Alex', '30'], ['2', 'Sara', '25']],
        click: 2,
      },
      meta: {
        lines: [
          { text: 'API: full SQL queries' },
          { text: 'Storage: OPFS / memory' },
          { text: 'Bundle: ~500KB WASM' },
        ],
        click: 3,
      },
    },
  ]"
  :libraries="{ items: [
    { name: 'Dexie' },
    { name: 'wa-sqlite' },
    { name: 'SQLite WASM' },
    { name: 'PGlite' },
  ], click: 4 }"
/>
```

## Acceptance Criteria

- [ ] `LocalStorageDiagram.vue` created in `packages/slidev-addon-utils/components/`
- [ ] Uses RoughRect, RoughLine, useClickVisibility, hashId — same as sibling diagrams
- [ ] Browser outer container with dashed border always visible
- [ ] Two panels (IndexedDB, SQLite) appear on click 1
- [ ] Inner data representations (object stores / SQL table) appear on click 2
- [ ] Metadata text appears on click 3
- [ ] Libraries bar appears on click 4
- [ ] `starter/slides.md` updated to use the new component
- [ ] Frontmatter updated with `clicks: 4`
- [ ] Speaker notes preserved unchanged
- [ ] Visual result matches the intent of the original ASCII diagram
- [ ] Dark theme styling consistent with existing diagrams (Geist fonts, pink accent, muted borders)

## Files to Create/Modify

| File | Action |
|------|--------|
| `packages/slidev-addon-utils/components/LocalStorageDiagram.vue` | **Create** — new diagram component |
| `starter/slides.md` | **Edit** — replace ASCII block with component usage (lines ~538-566) |

## References

- Closest existing pattern: `SplitDiagram.vue` (two side-by-side panels with nested elements)
- Color system: `packages/slidev-addon-utils/constants/colors.ts`
- Click visibility: `packages/slidev-addon-utils/composables/useClickVisibility.ts`
- Seed hashing: `packages/slidev-addon-utils/composables/useRough.ts`
