<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import rough from 'roughjs'

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

const props = withDefaults(defineProps<{
  panels: [ArchPanel, ArchPanel]
  connections: CrossConnection[]
  callout?: DuplicatedCallout
  roughness?: number
  seed?: number
  panelWidth?: number
  panelGap?: number
  itemHeight?: number
  warningBoxHeight?: number
}>(), {
  roughness: 1.5,
  seed: 42,
  panelWidth: 260,
  panelGap: 140,
  itemHeight: 28,
  warningBoxHeight: 90,
})

const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)
const gen = rough.generator()

const titleY = 16
const panelTopY = 32
const panelPadding = 16
const warningGap = 16
const calloutGap = 30
const arrowHeight = 24

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// Use the max item count so both panels have equal height
const maxPanelHeight = computed(() => {
  const maxItems = Math.max(...props.panels.map(p => p.items.length))
  return maxItems * props.itemHeight + panelPadding * 2
})

const panelData = computed(() => {
  return props.panels.map((panel, pi) => {
    const px = pi * (props.panelWidth + props.panelGap)

    const panelHeight = maxPanelHeight.value

    // Panel border (dashed rough rectangle)
    const panelRect = gen.rectangle(px, panelTopY, props.panelWidth, panelHeight, {
      roughness: props.roughness * 0.8,
      seed: props.seed + pi * 100,
      stroke: 'rgba(255, 255, 255, 0.2)',
      fill: 'rgba(255, 255, 255, 0.03)',
      fillStyle: 'solid',
      strokeWidth: 1.5,
    })

    // Item positions
    const items = panel.items.map((item, ii) => ({
      ...item,
      x: px + panelPadding,
      y: panelTopY + panelPadding + ii * props.itemHeight,
    }))

    // Warning box
    const warnY = panelTopY + panelHeight + warningGap
    const warnRect = gen.rectangle(px, warnY, props.panelWidth, props.warningBoxHeight, {
      roughness: props.roughness,
      seed: props.seed + pi * 100 + 50,
      stroke: 'rgba(248, 113, 113, 0.6)',
      fill: 'rgba(248, 113, 113, 0.08)',
      fillStyle: 'solid',
      strokeWidth: 2,
    })

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
      panelPaths: gen.toPaths(panelRect),
      items,
      warnY,
      warnPaths: gen.toPaths(warnRect),
      warnings,
    }
  })
})

// Horizontal connections between panels
const connectionData = computed(() => {
  const leftPanel = panelData.value[0]
  const rightPanel = panelData.value[1]
  if (!leftPanel || !rightPanel) return []

  const leftX = leftPanel.px + props.panelWidth
  const rightX = rightPanel.px

  return props.connections.map((conn, ci) => {
    // Distribute connections vertically within the panel area
    const totalItems = Math.max(props.panels[0].items.length, props.panels[1].items.length)
    const spacing = leftPanel.panelHeight / (props.connections.length + 1)
    const cy = panelTopY + spacing * (ci + 1)

    const lineSeed = props.seed + 500 + ci * 10
    const strokeColor = 'rgba(255, 107, 237, 0.5)'

    const lineDrawable = gen.line(leftX + 8, cy, rightX - 8, cy, {
      roughness: props.roughness * 0.5,
      seed: lineSeed,
      stroke: strokeColor,
      strokeWidth: 2,
    })

    // Arrowheads on both ends (bidirectional by default)
    const arrowLen = 10
    const paths = [...gen.toPaths(lineDrawable)]

    if (conn.bidirectional !== false) {
      // Left arrowhead (pointing left)
      const la1 = gen.line(leftX + 8, cy, leftX + 8 + arrowLen, cy - arrowLen * 0.6, {
        roughness: props.roughness * 0.3, seed: lineSeed + 1, stroke: strokeColor, strokeWidth: 2,
      })
      const la2 = gen.line(leftX + 8, cy, leftX + 8 + arrowLen, cy + arrowLen * 0.6, {
        roughness: props.roughness * 0.3, seed: lineSeed + 2, stroke: strokeColor, strokeWidth: 2,
      })
      paths.push(...gen.toPaths(la1), ...gen.toPaths(la2))
    }

    // Right arrowhead (pointing right)
    const ra1 = gen.line(rightX - 8, cy, rightX - 8 - arrowLen, cy - arrowLen * 0.6, {
      roughness: props.roughness * 0.3, seed: lineSeed + 3, stroke: strokeColor, strokeWidth: 2,
    })
    const ra2 = gen.line(rightX - 8, cy, rightX - 8 - arrowLen, cy + arrowLen * 0.6, {
      roughness: props.roughness * 0.3, seed: lineSeed + 4, stroke: strokeColor, strokeWidth: 2,
    })
    paths.push(...gen.toPaths(ra1), ...gen.toPaths(ra2))

    return {
      ...conn,
      paths,
      labelX: (leftX + rightX) / 2,
      labelY: cy - 10,
    }
  })
})

// Callout: upward arrows + horizontal connecting line + labels
const calloutData = computed(() => {
  if (!props.callout) return null

  const leftPanel = panelData.value[0]
  const rightPanel = panelData.value[1]
  if (!leftPanel || !rightPanel) return null

  const leftCenterX = leftPanel.px + props.panelWidth / 2
  const rightCenterX = rightPanel.px + props.panelWidth / 2
  const warnBottom = leftPanel.warnY + props.warningBoxHeight
  const calloutY = warnBottom + calloutGap + arrowHeight

  const strokeColor = props.callout.variant === 'danger'
    ? 'rgba(248, 113, 113, 0.8)'
    : props.callout.variant === 'accent'
      ? 'rgba(255, 107, 237, 0.8)'
      : 'rgba(255, 255, 255, 0.5)'

  const baseSeed = props.seed + 800

  // Upward arrows from callout line to warning boxes
  const leftArrow = gen.line(leftCenterX, calloutY, leftCenterX, warnBottom + 4, {
    roughness: props.roughness * 0.5, seed: baseSeed, stroke: strokeColor, strokeWidth: 2,
  })
  const leftAH1 = gen.line(leftCenterX, warnBottom + 4, leftCenterX - 7, warnBottom + 14, {
    roughness: props.roughness * 0.3, seed: baseSeed + 1, stroke: strokeColor, strokeWidth: 2,
  })
  const leftAH2 = gen.line(leftCenterX, warnBottom + 4, leftCenterX + 7, warnBottom + 14, {
    roughness: props.roughness * 0.3, seed: baseSeed + 2, stroke: strokeColor, strokeWidth: 2,
  })

  const rightArrow = gen.line(rightCenterX, calloutY, rightCenterX, warnBottom + 4, {
    roughness: props.roughness * 0.5, seed: baseSeed + 10, stroke: strokeColor, strokeWidth: 2,
  })
  const rightAH1 = gen.line(rightCenterX, warnBottom + 4, rightCenterX - 7, warnBottom + 14, {
    roughness: props.roughness * 0.3, seed: baseSeed + 11, stroke: strokeColor, strokeWidth: 2,
  })
  const rightAH2 = gen.line(rightCenterX, warnBottom + 4, rightCenterX + 7, warnBottom + 14, {
    roughness: props.roughness * 0.3, seed: baseSeed + 12, stroke: strokeColor, strokeWidth: 2,
  })

  // Horizontal connecting line
  const connLine = gen.line(leftCenterX, calloutY, rightCenterX, calloutY, {
    roughness: props.roughness * 0.5, seed: baseSeed + 20, stroke: strokeColor, strokeWidth: 2,
  })

  return {
    ...props.callout,
    calloutY,
    leftLabelX: leftCenterX,
    rightLabelX: rightCenterX,
    strokeColor,
    arrowPaths: [
      ...gen.toPaths(leftArrow), ...gen.toPaths(leftAH1), ...gen.toPaths(leftAH2),
      ...gen.toPaths(rightArrow), ...gen.toPaths(rightAH1), ...gen.toPaths(rightAH2),
    ],
    linePaths: gen.toPaths(connLine),
  }
})

const svgW = computed(() => props.panelWidth * 2 + props.panelGap + 48)
const svgH = computed(() => {
  const base = panelTopY + (panelData.value[0]?.panelHeight || 0) + warningGap + props.warningBoxHeight
  if (props.callout) return base + calloutGap + arrowHeight + 30
  return base + 24
})

const viewBox = computed(() => `${-24} ${-8} ${svgW.value} ${svgH.value}`)

function isVisible(click?: number, panelClick?: number): boolean {
  const effectiveClick = click ?? panelClick
  if (effectiveClick == null) return true
  return clicks.value >= effectiveClick
}
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
      <!-- Panel border + title (click 0) -->
      <g
        class="arch-diagram__el"
        :class="{ '--hidden': !isVisible(panel.click) }"
      >
        <path
          v-for="(p, i) in panel.panelPaths"
          :key="`pb-${pi}-${i}`"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
        <path
          v-for="(p, i) in panel.warnPaths"
          :key="`wb-${pi}-${i}`"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
      <path
        v-for="(p, i) in conn.paths"
        :key="`cp-${ci}-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
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
      <!-- Upward arrows -->
      <path
        v-for="(p, i) in calloutData.arrowPaths"
        :key="`ca-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
      />
      <!-- Horizontal connecting line -->
      <path
        v-for="(p, i) in calloutData.linePaths"
        :key="`cl-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
        stroke-dasharray="6 4"
      />
      <!-- Left label -->
      <text
        :x="calloutData.leftLabelX"
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
        :x="calloutData.rightLabelX"
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
