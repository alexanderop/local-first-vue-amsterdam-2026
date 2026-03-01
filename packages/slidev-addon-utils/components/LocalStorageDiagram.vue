<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import type { Variant } from '../constants/colors'

interface StoragePanel {
  title: string
  variant?: Variant
  click?: number
}

interface ObjectStore {
  label: string
  value: string
  click?: number
}

interface TableData {
  headers: string[]
  rows: string[][]
  click?: number
}

interface MetaLine {
  text: string
}

interface MetaBlock {
  lines: MetaLine[]
  click?: number
}

interface LibraryItem {
  name: string
  variant?: Variant
}

interface LibrariesBar {
  items: LibraryItem[]
  click?: number
}

interface PanelConfig {
  panel: StoragePanel
  stores?: ObjectStore[]
  table?: TableData
  meta: MetaBlock
}

const { panels, libraries, roughness = 1.5, seed = 42 } = defineProps<{
  panels: PanelConfig[]
  libraries: LibrariesBar
  roughness?: number
  seed?: number
}>()

const { isVisible } = useClickVisibility()

// Layout constants
const outerPadding = 24
const panelGap = 24
const panelTopY = 50
const panelWidth = 280
const storeHeight = 44
const storeGap = 10
const storePadding = 16
const metaLineHeight = 20
const metaTopGap = 14
const librariesBarHeight = 40
const librariesGap = 20
const tableRowHeight = 24
const tablePadding = 12

const panelData = computed(() => {
  return panels.map((config, pi) => {
    const px = outerPadding + pi * (panelWidth + panelGap)
    const contentStartY = panelTopY + 36

    // Object stores (IndexedDB panel)
    const storeShapes = (config.stores || []).map((store, si) => {
      const sy = contentStartY + si * (storeHeight + storeGap)
      return {
        ...store,
        x: px + storePadding,
        y: sy,
        width: panelWidth - storePadding * 2,
        height: storeHeight,
      }
    })

    // Table (SQLite panel)
    const tableShape = config.table ? (() => {
      const headers = config.table!.headers
      const rows = config.table!.rows
      const totalRows = rows.length + 1 // header + data rows
      const tableHeight = totalRows * tableRowHeight + tablePadding * 2
      const tableWidth = panelWidth - storePadding * 2
      const tx = px + storePadding
      const ty = contentStartY
      const colWidth = tableWidth / headers.length
      return {
        ...config.table!,
        x: tx,
        y: ty,
        width: tableWidth,
        height: tableHeight,
        colWidth,
      }
    })() : null

    // Meta text position
    const contentBottom = config.stores
      ? contentStartY + config.stores.length * (storeHeight + storeGap) - storeGap
      : config.table
        ? contentStartY + (config.table.rows.length + 1) * tableRowHeight + tablePadding * 2
        : contentStartY + 80

    const metaStartY = contentBottom + metaTopGap

    const panelHeight = metaStartY - panelTopY + config.meta.lines.length * metaLineHeight + 14

    return {
      panel: config.panel,
      stores: storeShapes,
      table: tableShape,
      meta: config.meta,
      px,
      panelHeight,
      metaStartY,
      panelSeed: seed + pi * 100,
    }
  })
})

const maxPanelHeight = computed(() =>
  Math.max(...panelData.value.map(p => p.panelHeight))
)

const svgW = computed(() =>
  outerPadding * 2 + panels.length * panelWidth + (panels.length - 1) * panelGap
)

const outerHeight = computed(() =>
  panelTopY + maxPanelHeight.value + librariesGap + librariesBarHeight + outerPadding
)

const svgH = computed(() => outerHeight.value + 16)

const viewBox = computed(() =>
  `0 0 ${svgW.value} ${svgH.value}`
)

const librariesY = computed(() =>
  panelTopY + maxPanelHeight.value + librariesGap
)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="storage-diagram"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Browser outer container — always visible -->
    <g class="storage-diagram__el">
      <RoughRect
        :x="4"
        :y="4"
        :width="svgW - 8"
        :height="outerHeight - 4"
        stroke="rgba(255,255,255,0.15)"
        fill="rgba(255,255,255,0.02)"
        :roughness="roughness * 0.6"
        :seed="seed"
        :stroke-width="1.5"
        stroke-dasharray="8 6"
      />
      <text
        :x="svgW / 2"
        :y="24"
        text-anchor="middle"
        dominant-baseline="central"
        class="storage-diagram__browser-title"
      >
        Browser
      </text>
    </g>

    <!-- Panels (IndexedDB / SQLite) — click 1 -->
    <g
      v-for="(data, pi) in panelData"
      :key="`panel-${pi}`"
      class="storage-diagram__el"
      :class="{ '--hidden': !isVisible(data.panel.click) }"
    >
      <!-- Panel box -->
      <RoughRect
        :x="data.px"
        :y="panelTopY"
        :width="panelWidth"
        :height="maxPanelHeight"
        stroke="rgba(255,255,255,0.2)"
        fill="rgba(255,255,255,0.03)"
        :roughness="roughness * 0.8"
        :seed="data.panelSeed"
        :stroke-width="1.5"
      />

      <!-- Panel title -->
      <text
        :x="data.px + panelWidth / 2"
        :y="panelTopY + 22"
        text-anchor="middle"
        dominant-baseline="central"
        class="storage-diagram__panel-title"
      >
        {{ data.panel.title }}
      </text>

      <!-- Object Stores (IndexedDB) — click 2 -->
      <g
        v-if="data.stores.length"
        class="storage-diagram__el"
        :class="{ '--hidden': !isVisible(data.stores[0]?.click, data.panel.click) }"
      >
        <g v-for="(store, si) in data.stores" :key="`store-${si}`">
          <RoughRect
            :x="store.x"
            :y="store.y"
            :width="store.width"
            :height="store.height"
            variant="muted"
            :roughness="roughness"
            :seed="seed + hashId(`store-${pi}-${si}`)"
            :stroke-width="1"
          />
          <text
            :x="store.x + 10"
            :y="store.y + 16"
            dominant-baseline="central"
            class="storage-diagram__store-label"
          >
            {{ store.label }}
          </text>
          <text
            :x="store.x + 10"
            :y="store.y + 32"
            dominant-baseline="central"
            class="storage-diagram__store-value"
          >
            {{ store.value }}
          </text>
        </g>
      </g>

      <!-- SQL Table (SQLite) — click 2 -->
      <g
        v-if="data.table"
        class="storage-diagram__el"
        :class="{ '--hidden': !isVisible(data.table.click, data.panel.click) }"
      >
        <!-- Table outer box -->
        <RoughRect
          :x="data.table.x"
          :y="data.table.y"
          :width="data.table.width"
          :height="data.table.height"
          variant="muted"
          :roughness="roughness"
          :seed="seed + hashId('table')"
          :stroke-width="1"
        />

        <!-- Header separator line -->
        <RoughLine
          :x1="data.table.x"
          :y1="data.table.y + tablePadding + tableRowHeight"
          :x2="data.table.x + data.table.width"
          :y2="data.table.y + tablePadding + tableRowHeight"
          stroke="rgba(255,255,255,0.2)"
          :roughness="roughness * 0.4"
          :seed="seed + hashId('table-hsep')"
          :stroke-width="1"
        />

        <!-- Column separator lines -->
        <RoughLine
          v-for="(_, ci) in data.table.headers.slice(1)"
          :key="`col-${ci}`"
          :x1="data.table.x + (ci + 1) * data.table.colWidth"
          :y1="data.table.y + tablePadding"
          :x2="data.table.x + (ci + 1) * data.table.colWidth"
          :y2="data.table.y + data.table.height - tablePadding"
          stroke="rgba(255,255,255,0.12)"
          :roughness="roughness * 0.4"
          :seed="seed + hashId(`col-sep-${ci}`)"
          :stroke-width="1"
        />

        <!-- Header text -->
        <text
          v-for="(header, hi) in data.table.headers"
          :key="`header-${hi}`"
          :x="data.table.x + hi * data.table.colWidth + data.table.colWidth / 2"
          :y="data.table.y + tablePadding + tableRowHeight / 2"
          text-anchor="middle"
          dominant-baseline="central"
          class="storage-diagram__table-header"
        >
          {{ header }}
        </text>

        <!-- Data rows -->
        <template v-for="(row, ri) in data.table.rows" :key="`row-${ri}`">
          <!-- Row separator (between data rows) -->
          <RoughLine
            v-if="ri > 0"
            :x1="data.table.x"
            :y1="data.table.y + tablePadding + (ri + 1) * tableRowHeight"
            :x2="data.table.x + data.table.width"
            :y2="data.table.y + tablePadding + (ri + 1) * tableRowHeight"
            stroke="rgba(255,255,255,0.08)"
            :roughness="roughness * 0.3"
            :seed="seed + hashId(`row-sep-${ri}`)"
            :stroke-width="0.5"
          />
          <text
            v-for="(cell, ci) in row"
            :key="`cell-${ri}-${ci}`"
            :x="data.table.x + ci * data.table.colWidth + data.table.colWidth / 2"
            :y="data.table.y + tablePadding + (ri + 1) * tableRowHeight + tableRowHeight / 2"
            text-anchor="middle"
            dominant-baseline="central"
            class="storage-diagram__table-cell"
          >
            {{ cell }}
          </text>
        </template>
      </g>

      <!-- Metadata text — click 3 -->
      <g
        class="storage-diagram__el"
        :class="{ '--hidden': !isVisible(data.meta.click, data.panel.click) }"
      >
        <text
          v-for="(line, li) in data.meta.lines"
          :key="`meta-${li}`"
          :x="data.px + storePadding"
          :y="data.metaStartY + li * metaLineHeight"
          dominant-baseline="central"
          class="storage-diagram__meta"
        >
          {{ line.text }}
        </text>
      </g>
    </g>

    <!-- Libraries bar — click 4 -->
    <g
      class="storage-diagram__el"
      :class="{ '--hidden': !isVisible(libraries.click) }"
    >
      <RoughRect
        :x="outerPadding"
        :y="librariesY"
        :width="svgW - outerPadding * 2"
        :height="librariesBarHeight"
        stroke="rgba(255,255,255,0.2)"
        fill="rgba(255,255,255,0.03)"
        :roughness="roughness * 0.8"
        :seed="seed + hashId('libraries')"
        :stroke-width="1.5"
      />
      <text
        :x="outerPadding + 14"
        :y="librariesY + librariesBarHeight / 2"
        dominant-baseline="central"
        class="storage-diagram__lib-title"
      >
        Libraries
      </text>
      <text
        v-for="(lib, li) in libraries.items"
        :key="`lib-${li}`"
        :x="outerPadding + 90 + li * ((svgW - outerPadding * 2 - 100) / libraries.items.length)"
        :y="librariesY + librariesBarHeight / 2"
        dominant-baseline="central"
        class="storage-diagram__lib-name"
      >
        {{ lib.name }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.storage-diagram {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.storage-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.storage-diagram__el.--hidden {
  opacity: 0;
}

.storage-diagram__browser-title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.storage-diagram__panel-title {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  fill: rgba(255, 107, 237, 0.9);
}

.storage-diagram__store-label {
  font-family: 'Geist', sans-serif;
  font-size: 12px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.85);
}

.storage-diagram__store-value {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.45);
}

.storage-diagram__table-header {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.85);
}

.storage-diagram__table-cell {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.55);
}

.storage-diagram__meta {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.storage-diagram__lib-title {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.storage-diagram__lib-name {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  fill: rgba(255, 107, 237, 0.7);
}
</style>
