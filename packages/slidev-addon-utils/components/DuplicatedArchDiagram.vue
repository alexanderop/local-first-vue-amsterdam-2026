<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import { EDGE_STROKE } from '../constants/colors'

interface CodeItem {
  id: string
  label: string
  click?: number
}

interface CrossConnection {
  label: string
  bidirectional?: boolean
  click?: number
}

interface WarningItem {
  text: string
  click?: number
}

interface ArchPanel {
  title: string
  items: CodeItem[]
  warnings: WarningItem[]
  warningClick?: number
  click?: number
}

interface DuplicatedCallout {
  label: string
  click?: number
  variant?: 'danger' | 'accent' | 'muted'
}

const { panels, connections, callout, roughness = 1.5, seed = 42, panelWidth = 260, panelGap = 140, itemHeight = 28, warningBoxHeight = 90 } = defineProps<{
  panels: [ArchPanel, ArchPanel]
  connections: CrossConnection[]
  callout?: DuplicatedCallout
  roughness?: number
  seed?: number
  panelWidth?: number
  panelGap?: number
  itemHeight?: number
  warningBoxHeight?: number
}>()

const { isVisible } = useClickVisibility()

const titleY = 16
const panelTopY = 32
const panelPadding = 16
const warningGap = 16
const calloutGap = 30
const arrowHeight = 24

// Use the max item count so both panels have equal height
const maxPanelHeight = computed(() => {
  const maxItems = Math.max(...panels.map(p => p.items.length))
  return maxItems * itemHeight + panelPadding * 2
})

const panelData = computed(() => {
  return panels.map((panel, pi) => {
    const px = pi * (panelWidth + panelGap)
    const panelHeight = maxPanelHeight.value

    // Item positions
    const items = panel.items.map((item, ii) => ({
      ...item,
      x: px + panelPadding,
      y: panelTopY + panelPadding + ii * itemHeight,
    }))

    // Warning box position
    const warnY = panelTopY + panelHeight + warningGap
    const warnings = panel.warnings.map((w, wi) => ({
      ...w,
      x: px + panelPadding,
      y: warnY + 20 + wi * 22,
    }))

    return {
      title: panel.title,
      click: panel.click,
      warningClick: panel.warningClick,
      px,
      panelHeight,
      panelSeed: seed + pi * 100,
      warnSeed: seed + pi * 100 + 50,
      items,
      warnY,
      warnings,
    }
  })
})

// Horizontal connections between panels
const connectionData = computed(() => {
  const leftPanel = panelData.value[0]
  const rightPanel = panelData.value[1]
  if (!leftPanel || !rightPanel) return []

  const leftX = leftPanel.px + panelWidth
  const rightX = rightPanel.px

  return connections.map((conn, ci) => {
    const spacing = leftPanel.panelHeight / (connections.length + 1)
    const cy = panelTopY + spacing * (ci + 1)

    return {
      ...conn,
      x1: leftX + 8,
      y1: cy,
      x2: rightX - 8,
      y2: cy,
      seed: seed + 500 + ci * 10,
      labelX: (leftX + rightX) / 2,
      labelY: cy - 10,
    }
  })
})

// Callout: upward arrows + horizontal connecting line + labels
const calloutData = computed(() => {
  if (!callout) return null

  const leftPanel = panelData.value[0]
  const rightPanel = panelData.value[1]
  if (!leftPanel || !rightPanel) return null

  const leftCenterX = leftPanel.px + panelWidth / 2
  const rightCenterX = rightPanel.px + panelWidth / 2
  const warnBottom = leftPanel.warnY + warningBoxHeight
  const calloutY = warnBottom + calloutGap + arrowHeight

  const strokeColor = callout.variant === 'danger'
    ? 'rgba(248, 113, 113, 0.8)'
    : callout.variant === 'accent'
      ? 'rgba(255, 107, 237, 0.8)'
      : 'rgba(255, 255, 255, 0.5)'

  return {
    ...callout,
    calloutY,
    leftCenterX,
    rightCenterX,
    warnBottom,
    strokeColor,
    baseSeed: seed + 800,
  }
})

const svgW = computed(() => panelWidth * 2 + panelGap + 48)
const svgH = computed(() => {
  const base = panelTopY + (panelData.value[0]?.panelHeight || 0) + warningGap + warningBoxHeight
  if (callout) return base + calloutGap + arrowHeight + 30
  return base + 24
})

const viewBox = computed(() => `${-24} ${-8} ${svgW.value} ${svgH.value}`)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="arch-diagram"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Panels -->
    <g
      v-for="(panel, pi) in panelData"
      :key="`panel-${pi}`"
    >
      <!-- Panel border + title -->
      <g
        class="arch-diagram__el"
        :class="{ '--hidden': !isVisible(panel.click) }"
      >
        <RoughRect
          :x="panel.px"
          :y="panelTopY"
          :width="panelWidth"
          :height="panel.panelHeight"
          stroke="rgba(255,255,255,0.2)"
          fill="rgba(255,255,255,0.03)"
          :roughness="roughness * 0.8"
          :seed="panel.panelSeed"
          :stroke-width="1.5"
          stroke-dasharray="8 6"
        />
        <text
          :x="panel.px + panelWidth / 2"
          :y="titleY"
          text-anchor="middle"
          dominant-baseline="central"
          class="arch-diagram__title"
        >
          {{ panel.title }}
        </text>
      </g>

      <!-- Code items -->
      <g
        v-for="item in panel.items"
        :key="`item-${item.id}`"
        class="arch-diagram__el"
        :class="{ '--hidden': !isVisible(item.click, panel.click) }"
      >
        <text
          :x="item.x"
          :y="item.y + itemHeight / 2"
          dominant-baseline="central"
          class="arch-diagram__code"
        >
          {{ item.label }}
        </text>
      </g>

      <!-- Warning box -->
      <g
        class="arch-diagram__el"
        :class="{ '--hidden': !isVisible(panel.warningClick, panel.click) }"
      >
        <RoughRect
          :x="panel.px"
          :y="panel.warnY"
          :width="panelWidth"
          :height="warningBoxHeight"
          stroke="rgba(248,113,113,0.6)"
          fill="rgba(248,113,113,0.08)"
          :roughness="roughness"
          :seed="panel.warnSeed"
        />
        <text
          v-for="(w, wi) in panel.warnings"
          :key="`w-${pi}-${wi}`"
          :x="w.x"
          :y="w.y"
          dominant-baseline="central"
          class="arch-diagram__warning-text"
        >
          {{ w.text }}
        </text>
      </g>
    </g>

    <!-- Cross connections -->
    <g
      v-for="(conn, ci) in connectionData"
      :key="`conn-${ci}`"
      class="arch-diagram__el"
      :class="{ '--hidden': !isVisible(conn.click) }"
    >
      <RoughArrow
        :x1="conn.x1"
        :y1="conn.y1"
        :x2="conn.x2"
        :y2="conn.y2"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="conn.seed"
        :arrow-size="10"
        :start-arrow="conn.bidirectional !== false"
        :end-arrow="true"
      />
      <text
        :x="conn.labelX"
        :y="conn.labelY"
        text-anchor="middle"
        dominant-baseline="auto"
        class="arch-diagram__conn-label"
      >
        {{ conn.label }}
      </text>
    </g>

    <!-- Callout: arrows + line + labels -->
    <g
      v-if="calloutData"
      class="arch-diagram__el"
      :class="{ '--hidden': !isVisible(calloutData.click) }"
    >
      <!-- Left upward arrow -->
      <RoughArrow
        :x1="calloutData.leftCenterX"
        :y1="calloutData.calloutY"
        :x2="calloutData.leftCenterX"
        :y2="calloutData.warnBottom + 4"
        :stroke="calloutData.strokeColor"
        :roughness="roughness"
        :seed="calloutData.baseSeed"
        :arrow-size="10"
      />
      <!-- Right upward arrow -->
      <RoughArrow
        :x1="calloutData.rightCenterX"
        :y1="calloutData.calloutY"
        :x2="calloutData.rightCenterX"
        :y2="calloutData.warnBottom + 4"
        :stroke="calloutData.strokeColor"
        :roughness="roughness"
        :seed="calloutData.baseSeed + 10"
        :arrow-size="10"
      />
      <!-- Horizontal connecting line (dashed) -->
      <RoughLine
        :x1="calloutData.leftCenterX"
        :y1="calloutData.calloutY"
        :x2="calloutData.rightCenterX"
        :y2="calloutData.calloutY"
        :stroke="calloutData.strokeColor"
        :roughness="roughness * 0.5"
        :seed="calloutData.baseSeed + 20"
        stroke-dasharray="6 4"
      />
      <!-- Left label -->
      <text
        :x="calloutData.leftCenterX"
        :y="calloutData.calloutY + 18"
        text-anchor="middle"
        dominant-baseline="central"
        class="arch-diagram__callout-label"
        :style="{ fill: calloutData.strokeColor }"
      >
        {{ calloutData.label }}
      </text>
      <!-- Right label -->
      <text
        :x="calloutData.rightCenterX"
        :y="calloutData.calloutY + 18"
        text-anchor="middle"
        dominant-baseline="central"
        class="arch-diagram__callout-label"
        :style="{ fill: calloutData.strokeColor }"
      >
        {{ calloutData.label }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.arch-diagram {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.arch-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.arch-diagram__el.--hidden {
  opacity: 0;
}

.arch-diagram__title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.arch-diagram__code {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 400;
  fill: rgba(234, 237, 243, 0.85);
}

.arch-diagram__warning-text {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  fill: rgba(248, 113, 113, 0.9);
}

.arch-diagram__conn-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}

.arch-diagram__callout-label {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
