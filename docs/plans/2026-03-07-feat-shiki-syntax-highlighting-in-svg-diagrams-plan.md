---
title: "feat: Add Shiki syntax highlighting to code snippets in SVG diagrams"
type: feat
status: active
date: 2026-03-07
---

# feat: Add Shiki syntax highlighting to code snippets in SVG diagrams

## Overview

Replace plain white monospace text in SVG diagram components with Shiki-powered syntax-highlighted code. Code items like `ref([])`, `app.get('/todos')`, and `loading = true` currently render as uniform `rgba(234, 237, 243, 0.85)` text inside `<text>` elements. With Shiki's `codeToTokens` API, each token gets its own color via `<tspan fill="...">` elements, producing proper syntax coloring directly in SVG.

## Problem Statement / Motivation

The `DuplicatedArchDiagram.vue` component renders code-like snippets (Vue reactivity calls, Express routes, DB operations) as plain text inside SVG. These snippets look like code but lack syntax coloring, making them visually flat and harder to parse at a glance during a conference talk. Syntax highlighting would:

- Make code snippets immediately recognizable as code (not just labels)
- Add visual richness that matches the quality of the Rough.js hand-drawn aesthetic
- Leverage Shiki, which Slidev already bundles (v3.23.0), requiring zero new dependencies

## Proposed Solution

A three-part implementation:

1. **`useShikiTokens` composable** - Takes code string + language, returns reactive colored tokens
2. **`ShikiCodeLine.vue` component** - Renders a single line of syntax-highlighted code as SVG `<text>` + `<tspan>` elements
3. **Integration** - Update `DuplicatedArchDiagram.vue` to use `ShikiCodeLine` for code items

### Architecture

```
                  +-----------------------+
                  |  DuplicatedArchDiagram |
                  |  (or any diagram)      |
                  +----------+------------+
                             |
                             | uses
                             v
                  +---------------------+
                  |  ShikiCodeLine.vue   |
                  |  (SVG text + tspan)  |
                  +----------+----------+
                             |
                             | uses
                             v
                  +---------------------+
                  |  useShikiTokens()   |
                  |  (composable)       |
                  +----------+----------+
                             |
                             | calls
                             v
                  +---------------------+
                  |  shiki codeToTokens |
                  |  (already bundled)  |
                  +---------------------+
```

## Technical Approach

### 1. `useShikiTokens` composable

**File:** `packages/slidev-addon-utils/composables/useShikiTokens.ts`

```typescript
import { shallowRef, onMounted } from 'vue'
import { codeToTokens } from 'shiki'
import type { ThemedToken } from 'shiki'

// Module-level cache to avoid re-tokenizing on slide re-navigation
const cache = new Map<string, ThemedToken[]>()

export function useShikiTokens(code: string, lang: string = 'javascript', theme: string = 'vitesse-dark') {
  const tokens = shallowRef<ThemedToken[] | null>(null)
  const cacheKey = `${code}:${lang}:${theme}`

  // Check cache first
  const cached = cache.get(cacheKey)
  if (cached) {
    tokens.value = cached
    return { tokens }
  }

  onMounted(async () => {
    try {
      const result = await codeToTokens(code, { lang, theme })
      // Single-line snippets: take first line only
      const line = result.tokens[0] ?? []
      cache.set(cacheKey, line)
      tokens.value = line
    } catch (e) {
      console.warn(`[useShikiTokens] Failed to highlight: "${code}"`, e)
      // tokens remains null -> component renders fallback
    }
  })

  return { tokens }
}
```

**Key decisions:**
- Uses Shiki's **shorthand functions** (`codeToTokens` from `'shiki'`) which manage a singleton highlighter internally - no need to manually create/manage an instance
- **Module-level `Map` cache** keyed by `code:lang:theme` so re-mounting the component (slide navigation) is instant
- Returns `null` while loading, allowing the component to show fallback text
- Catches errors gracefully - if Shiki fails, plain text is shown
- `shallowRef` since the token array is replaced, not mutated
- Defaults to `'javascript'` lang and `'vitesse-dark'` theme (Slidev's dark default)

### 2. `ShikiCodeLine.vue` component

**File:** `packages/slidev-addon-utils/components/ShikiCodeLine.vue`

```vue
<script setup lang="ts">
import type { ThemedToken } from 'shiki'

defineProps<{
  tokens: ThemedToken[] | null
  fallbackText: string
  x: number
  y: number
  opacity?: number
}>()
</script>

<template>
  <!-- Fallback: plain text while tokens load or on error -->
  <text
    v-if="!tokens"
    :x="x"
    :y="y"
    dominant-baseline="central"
    class="arch-diagram__code"
  >
    {{ fallbackText }}
  </text>

  <!-- Highlighted: tspan per token with fill color -->
  <text
    v-else
    :x="x"
    :y="y"
    dominant-baseline="central"
    class="arch-diagram__code"
  >
    <tspan
      v-for="(token, i) in tokens"
      :key="i"
      :fill="token.color"
      :style="{ opacity: opacity ?? 0.85 }"
      :font-style="token.fontStyle === 1 ? 'italic' : undefined"
      :font-weight="token.fontStyle === 2 ? 'bold' : undefined"
    >{{ token.content }}</tspan>
  </text>
</template>
```

**Key decisions:**
- **Opacity on each `<tspan>`** (default `0.85`) to match the muted aesthetic of existing diagram text, preventing overly saturated Shiki colors from clashing with the hand-drawn Rough.js style
- `font-style` and `font-weight` mapped from Shiki's `fontStyle` bitmask (1=italic, 2=bold)
- Inherits `font-family` and `font-size` from parent `.arch-diagram__code` class
- SVG `<tspan>` elements flow sequentially inside `<text>` - no explicit `dx` offsets needed for monospace single-line code
- `v-if`/`v-else` ensures clean swap between fallback and highlighted states

### 3. Integration with `DuplicatedArchDiagram.vue`

**File:** `packages/slidev-addon-utils/components/DuplicatedArchDiagram.vue`

Changes:

**a) Extend `CodeItem` interface:**

```typescript
interface CodeItem {
  id: string
  label: string
  lang?: string    // NEW: language for syntax highlighting (default: 'javascript')
  click?: number
}
```

**b) Add token resolution for all items:**

```typescript
import ShikiCodeLine from './ShikiCodeLine.vue'
import { useShikiTokens } from '../composables/useShikiTokens'

// Resolve tokens for all code items across both panels
const tokenMap = computed(() => {
  const map = new Map<string, ReturnType<typeof useShikiTokens>>()
  for (const panel of panels) {
    for (const item of panel.items) {
      map.set(item.id, useShikiTokens(item.label, item.lang ?? 'javascript'))
    }
  }
  return map
})
```

> **Note:** Since `useShikiTokens` uses `onMounted` internally, the composable calls must happen at setup time. An alternative is to call `useShikiTokens` in a flat loop at setup time (not inside `computed`) and store results in a reactive map. The exact pattern will be finalized during implementation - the key constraint is that Vue composables must be called synchronously during setup.

**c) Replace template text rendering:**

Before:
```html
<text
  :x="item.x"
  :y="item.y + itemHeight / 2"
  dominant-baseline="central"
  class="arch-diagram__code"
>
  {{ item.label }}
</text>
```

After:
```html
<ShikiCodeLine
  :tokens="tokenMap.get(item.id)?.tokens.value ?? null"
  :fallback-text="item.label"
  :x="item.x"
  :y="item.y + itemHeight / 2"
/>
```

The parent `<g>` wrapper still handles click visibility transitions via `isVisible()`, so the opacity fade-in/out continues to work exactly as before.

## Acceptance Criteria

- [ ] Code items in `DuplicatedArchDiagram` render with syntax-colored tokens (keywords, strings, function names get distinct colors)
- [ ] Plain text fallback is shown while Shiki initializes (no blank/broken state)
- [ ] Click-based visibility transitions (`isVisible`) continue to work without visual glitches
- [ ] Navigating away from the slide and back shows highlighted code instantly (cache hit)
- [ ] `pnpm dev` works with hot-reload
- [ ] `pnpm build` completes without errors
- [ ] No new dependencies added to any `package.json` (Shiki is already available via Slidev)
- [ ] Token colors have reduced opacity (~0.85) to match the muted diagram aesthetic
- [ ] The `useShikiTokens` composable and `ShikiCodeLine` component are reusable by other diagram components

## Edge Cases

| Case | Behavior |
|---|---|
| Empty code string `""` | Returns empty token array, renders nothing |
| Shiki fails to load (e.g. WASM error) | Catches error, shows plain text fallback permanently |
| Unsupported language string | Shiki falls back to plaintext grammar, tokens render with default fg color |
| Special XML chars in code (`<`, `>`, `&`) | Vue's `{{ token.content }}` template interpolation auto-escapes |
| Component re-mounts (slide navigation) | Module-level cache returns instant results |
| PDF export via Playwright | Shiki resolves fast (<50ms); Slidev's export waits for render stabilization |

## Files to Create

| File | Purpose |
|---|---|
| `packages/slidev-addon-utils/composables/useShikiTokens.ts` | Composable: tokenizes code via Shiki, caches results |
| `packages/slidev-addon-utils/components/ShikiCodeLine.vue` | Component: renders tokens as SVG `<text>` + `<tspan>` |

## Files to Modify

| File | Change |
|---|---|
| `packages/slidev-addon-utils/components/DuplicatedArchDiagram.vue` | Import ShikiCodeLine, extend CodeItem with `lang?`, replace `<text>{{ item.label }}</text>` with `<ShikiCodeLine>` |
| `packages/slidev-addon-utils/composables/index.ts` | Export `useShikiTokens` |

## Technical Considerations

### Token Color Opacity

Raw Shiki `vitesse-dark` colors (e.g. `#4FC1FF`, `#C98A7D`, `#80A665`) are vivid. The existing diagram text uses `rgba(234, 237, 243, 0.85)` - a muted off-white. Applying `opacity: 0.85` on each `<tspan>` softens the Shiki colors to blend with the hand-drawn aesthetic. This value can be tuned via the `opacity` prop on `ShikiCodeLine`.

### Shiki Singleton & Performance

The shorthand `codeToTokens` from `'shiki'` manages an internal singleton highlighter. The first call loads the grammar/theme (~100-200ms), subsequent calls are <1ms per snippet. With 10 code items in DuplicatedArchDiagram, the total cost after init is negligible. The module-level cache makes slide re-navigation free.

### No New Dependencies

`shiki` v3.23.0 is already in the dependency tree via `@slidev/cli`. The import `from 'shiki'` resolves through pnpm's hoisting. Since this addon is always used with Slidev, no explicit dependency declaration is needed. If desired, `shiki` can be added as an **optional peer dependency** in the addon's `package.json`.

### SSR / Build Compatibility

Shiki runs in both Node.js and browser. The `onMounted` hook ensures tokenization only runs client-side. During SSR builds, the fallback text renders. During Playwright PDF export, the browser resolves tokens before capture.

### Composable Call Pattern

Vue composables must be called synchronously during `setup()`. Since the code items come from props (known at setup time), `useShikiTokens` can be called in a flat loop during setup. If props change dynamically, a `watchEffect` variant would be needed, but for this presentation the props are static.

## Future Considerations

- **Other diagram components:** `LocalStorageDiagram.vue` has store value text (`{ key: value }`) that could benefit from JSON syntax highlighting
- **Multi-line support:** Current implementation handles single-line snippets only. If a diagram needs multi-line code blocks, `ShikiCodeLine` could be extended to accept `lineIndex` and render multiple `<text>` elements with `dy` offsets
- **Theme sync:** Currently defaults to `'vitesse-dark'`. Could read from Slidev's resolved theme config via `@slidev/client/setup/shiki` internal import for automatic theme matching

## References

### Internal References
- `packages/slidev-addon-utils/components/DuplicatedArchDiagram.vue` - primary target, lines 252-267 render code items
- `packages/slidev-addon-utils/composables/useClickVisibility.ts` - click visibility system (must not break)
- `packages/slidev-addon-utils/constants/colors.ts` - color palette reference
- `starter/slides.md:126-170` - actual DuplicatedArchDiagram usage with 10 code snippets

### External References
- [Shiki codeToTokens API](https://shiki.style/guide/install) - token-level highlighting
- [Shiki ThemedToken type](https://shiki.style/guide/theme-colors) - token color/fontStyle fields
- [SVG tspan element](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/tspan) - inline text styling in SVG
- [Slidev Configure Highlighter](https://sli.dev/custom/config-highlighter) - Slidev's Shiki defaults
