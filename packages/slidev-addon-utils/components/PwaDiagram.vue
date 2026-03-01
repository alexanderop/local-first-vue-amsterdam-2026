<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import { EDGE_STROKE } from '../constants/colors'
import type { Variant } from '../constants/colors'

interface PwaBox {
  id: string
  label: string
  subtitle?: string
  variant?: 'default' | 'accent' | 'danger' | 'success' | 'muted'
  click?: number
}

interface PwaArrow {
  from: string
  to: string
  click?: number
}

interface PwaAnnotation {
  text: string
  variant?: 'default' | 'danger' | 'success' | 'muted'
  click?: number
}

interface PwaPanel {
  title: string
  titleIcon?: string
  boxes: PwaBox[]
  arrows: PwaArrow[]
  annotations: PwaAnnotation[]
  resultText?: string
  resultIcon?: string
  resultVariant?: 'success' | 'danger' | 'muted'
  resultClick?: number
  click?: number
}

const { panels, roughness = 1.5, seed = 42, panelWidth = 300, panelHeight = 320, panelGap = 80, boxWidth = 200, boxHeight = 52, boxGap = 50, centered = true } = defineProps<{
  panels: [PwaPanel, PwaPanel]
  roughness?: number
  seed?: number
  panelWidth?: number
  panelHeight?: number
  panelGap?: number
  boxWidth?: number
  boxHeight?: number
  boxGap?: number
  centered?: boolean
}>()

const { isVisible } = useClickVisibility()
const titleHeight = 30
const panelPadding = 24

const annotationColors = {
  default: 'rgba(234, 237, 243, 0.85)',
  danger: 'rgba(248, 113, 113, 0.9)',
  success: 'rgba(52, 211, 153, 0.9)',
  muted: 'rgba(255, 255, 255, 0.4)',
}

const resultColors = {
  success: 'rgba(52, 211, 153, 0.9)',
  danger: 'rgba(248, 113, 113, 0.9)',
  muted: 'rgba(255, 255, 255, 0.4)',
}

const panelData = computed(() => {
  return panels.map((panel, pi) => {
    const px = pi * (panelWidth + panelGap)
    const contentTop = titleHeight

    // Box positions — stacked vertically, centered in panel
    const boxStartY = contentTop + panelPadding
    const boxX = px + (panelWidth - boxWidth) / 2

    const boxPositions = new Map<string, { x: number; y: number }>()
    panel.boxes.forEach((box, bi) => {
      const by = boxStartY + bi * (boxHeight + boxGap)
      boxPositions.set(box.id, { x: boxX, y: by })
    })

    // Box shapes (position data only)
    const boxShapes = panel.boxes.map((box) => {
      const pos = boxPositions.get(box.id)!
      return {
        ...box,
        x: pos.x,
        y: pos.y,
        variant: (box.variant || 'default') as Variant,
      }
    })

    // Arrow shapes (position data only)
    const arrowShapes = panel.arrows.map((arrow) => {
      const from = boxPositions.get(arrow.from)
      const to = boxPositions.get(arrow.to)
      if (!from || !to) return null

      return {
        from: arrow.from,
        to: arrow.to,
        click: arrow.click,
        x1: from.x + boxWidth / 2,
        y1: from.y + boxHeight,
        x2: to.x + boxWidth / 2,
        y2: to.y,
        seed: seed + hashId(arrow.from + arrow.to),
      }
    }).filter((e): e is NonNullable<typeof e> => e != null)

    // Annotation positions — below last box
    const lastBoxBottom = panel.boxes.length > 0
      ? boxStartY + (panel.boxes.length - 1) * (boxHeight + boxGap) + boxHeight
      : boxStartY
    const annotationStartY = lastBoxBottom + 20
    const annotations = panel.annotations.map((ann, ai) => ({
      ...ann,
      x: px + panelWidth / 2,
      y: annotationStartY + ai * 20,
    }))

    // Result text — near bottom of panel
    const resultY = contentTop + panelHeight - 20

    return {
      title: panel.title,
      titleIcon: panel.titleIcon,
      click: panel.click,
      px,
      contentTop,
      panelSeed: seed + pi * 100,
      boxShapes,
      arrowShapes,
      annotations,
      resultText: panel.resultText,
      resultIcon: panel.resultIcon,
      resultVariant: panel.resultVariant,
      resultClick: panel.resultClick,
      resultY,
    }
  })
})

const svgW = computed(() => {
  const n = panels.length
  return n * panelWidth + Math.max(0, n - 1) * panelGap + 48
})

const svgH = computed(() => titleHeight + panelHeight + 24)

const viewBox = computed(() =>
  `${-24} ${-12} ${svgW.value} ${svgH.value}`
)
</script>

<template>
  <div class="pwa-diagram-wrap" :class="{ '--centered': centered }">
  <svg
    :viewBox="viewBox"
    class="pwa-diagram"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      v-for="(panel, pi) in panelData"
      :key="`panel-${pi}`"
    >
      <!-- Panel container + title -->
      <g
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(panel.click) }"
      >
        <RoughRect
          :x="panel.px"
          :y="panel.contentTop"
          :width="panelWidth"
          :height="panelHeight"
          stroke="rgba(255,255,255,0.2)"
          fill="rgba(255,255,255,0.03)"
          :roughness="roughness * 0.8"
          :seed="panel.panelSeed"
          :stroke-width="1.5"
          stroke-dasharray="8 6"
        />
        <text
          :x="panel.px + panelWidth / 2"
          :y="12"
          text-anchor="middle"
          dominant-baseline="central"
          class="pwa-diagram__title"
        >
          {{ panel.titleIcon }} {{ panel.title }}
        </text>
      </g>

      <!-- Arrows (under boxes) -->
      <g
        v-for="arrow in panel.arrowShapes"
        :key="`a-${arrow.from}-${arrow.to}`"
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(arrow.click, panel.click) }"
      >
        <RoughArrow
          :x1="arrow.x1"
          :y1="arrow.y1"
          :x2="arrow.x2"
          :y2="arrow.y2"
          :stroke="EDGE_STROKE"
          :roughness="roughness"
          :seed="arrow.seed"
        />
      </g>

      <!-- Boxes -->
      <g
        v-for="box in panel.boxShapes"
        :key="`b-${box.id}`"
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(box.click, panel.click) }"
      >
        <RoughRect
          :x="box.x"
          :y="box.y"
          :width="boxWidth"
          :height="boxHeight"
          :variant="box.variant"
          :roughness="roughness"
          :seed="seed + hashId(box.id)"
        />
        <text
          :x="box.x + boxWidth / 2"
          :y="box.y + boxHeight / 2"
          :dy="box.subtitle ? -6 : 0"
          dominant-baseline="central"
          text-anchor="middle"
          class="pwa-diagram__label"
        >
          {{ box.label }}
        </text>
        <text
          v-if="box.subtitle"
          :x="box.x + boxWidth / 2"
          :y="box.y + boxHeight / 2"
          dy="14"
          dominant-baseline="central"
          text-anchor="middle"
          class="pwa-diagram__subtitle"
        >
          {{ box.subtitle }}
        </text>
      </g>

      <!-- Annotations -->
      <g
        v-for="(ann, ai) in panel.annotations"
        :key="`ann-${pi}-${ai}`"
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(ann.click, panel.click) }"
      >
        <text
          :x="ann.x"
          :y="ann.y"
          text-anchor="middle"
          dominant-baseline="central"
          class="pwa-diagram__annotation"
          :style="{ fill: annotationColors[ann.variant || 'muted'] }"
        >
          {{ ann.text }}
        </text>
      </g>

      <!-- Result text -->
      <g
        v-if="panel.resultText"
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(panel.resultClick, panel.click) }"
      >
        <text
          :x="panel.px + panelWidth / 2"
          :y="panel.resultY"
          text-anchor="middle"
          dominant-baseline="central"
          class="pwa-diagram__result"
          :style="{ fill: resultColors[panel.resultVariant || 'muted'] }"
        >
          {{ panel.resultIcon }} {{ panel.resultText }}
        </text>
      </g>
    </g>
  </svg>
  </div>
</template>

<style scoped>
.pwa-diagram-wrap.--centered {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.pwa-diagram-wrap.--centered .pwa-diagram {
  width: 100%;
  height: auto;
  max-height: 100%;
}

.pwa-diagram {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.pwa-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.pwa-diagram__el.--hidden {
  opacity: 0;
}

.pwa-diagram__title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pwa-diagram__label {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.pwa-diagram__subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.pwa-diagram__annotation {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
}

.pwa-diagram__result {
  font-family: 'Geist', sans-serif;
  font-size: 18px;
  font-weight: 700;
}
</style>
