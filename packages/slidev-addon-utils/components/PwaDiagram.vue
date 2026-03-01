<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import rough from 'roughjs'

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

const props = withDefaults(defineProps<{
  panels: [PwaPanel, PwaPanel]
  roughness?: number
  seed?: number
  panelWidth?: number
  panelHeight?: number
  panelGap?: number
  boxWidth?: number
  boxHeight?: number
  boxGap?: number
}>(), {
  roughness: 1.5,
  seed: 42,
  panelWidth: 300,
  panelHeight: 320,
  panelGap: 80,
  boxWidth: 200,
  boxHeight: 52,
  boxGap: 50,
})

const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)
const gen = rough.generator()
const titleHeight = 30
const panelPadding = 24

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const variantColors = {
  default: { stroke: 'rgba(255, 107, 237, 0.7)', fill: 'rgba(52, 63, 96, 0.4)' },
  accent: { stroke: 'rgba(255, 107, 237, 0.9)', fill: 'rgba(255, 107, 237, 0.15)' },
  success: { stroke: 'rgba(52, 211, 153, 0.8)', fill: 'rgba(52, 211, 153, 0.12)' },
  danger: { stroke: 'rgba(248, 113, 113, 0.8)', fill: 'rgba(248, 113, 113, 0.1)' },
  muted: { stroke: 'rgba(255, 255, 255, 0.3)', fill: 'rgba(255, 255, 255, 0.05)' },
}

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
  return props.panels.map((panel, pi) => {
    const px = pi * (props.panelWidth + props.panelGap)
    const contentTop = titleHeight

    // Panel container — dashed rough rectangle
    const panelRect = gen.rectangle(px, contentTop, props.panelWidth, props.panelHeight, {
      roughness: props.roughness * 0.8,
      seed: props.seed + pi * 100,
      stroke: 'rgba(255, 255, 255, 0.2)',
      fill: 'rgba(255, 255, 255, 0.03)',
      fillStyle: 'solid',
      strokeWidth: 1.5,
    })

    // Box positions — stacked vertically, centered in panel
    const boxStartY = contentTop + panelPadding
    const boxX = px + (props.panelWidth - props.boxWidth) / 2

    const boxPositions = new Map<string, { x: number; y: number }>()
    panel.boxes.forEach((box, bi) => {
      const by = boxStartY + bi * (props.boxHeight + props.boxGap)
      boxPositions.set(box.id, { x: boxX, y: by })
    })

    // Box shapes
    const boxShapes = panel.boxes.map((box) => {
      const pos = boxPositions.get(box.id)!
      const colors = variantColors[box.variant || 'default']
      const drawable = gen.rectangle(pos.x, pos.y, props.boxWidth, props.boxHeight, {
        roughness: props.roughness,
        seed: props.seed + hashId(box.id),
        stroke: colors.stroke,
        fill: colors.fill,
        fillStyle: 'solid',
        strokeWidth: 2,
      })
      return {
        ...box,
        x: pos.x,
        y: pos.y,
        paths: gen.toPaths(drawable),
      }
    })

    // Arrow shapes (downward between boxes)
    const arrowShapes = panel.arrows.map((arrow) => {
      const from = boxPositions.get(arrow.from)
      const to = boxPositions.get(arrow.to)
      if (!from || !to) return null

      const x1 = from.x + props.boxWidth / 2
      const y1 = from.y + props.boxHeight
      const x2 = to.x + props.boxWidth / 2
      const y2 = to.y

      const arrowSeed = props.seed + hashId(arrow.from + arrow.to)
      const strokeColor = 'rgba(255, 107, 237, 0.5)'

      const lineDrawable = gen.line(x1, y1, x2, y2, {
        roughness: props.roughness * 0.5,
        seed: arrowSeed,
        stroke: strokeColor,
        strokeWidth: 2,
      })

      // Arrowhead V pointing down
      const arrowLen = 12
      const a1x = x2 - arrowLen * 0.6
      const a1y = y2 - arrowLen
      const a2x = x2 + arrowLen * 0.6
      const a2y = y2 - arrowLen

      const ah1 = gen.line(x2, y2, a1x, a1y, {
        roughness: props.roughness * 0.3,
        seed: arrowSeed + 1,
        stroke: strokeColor,
        strokeWidth: 2,
      })
      const ah2 = gen.line(x2, y2, a2x, a2y, {
        roughness: props.roughness * 0.3,
        seed: arrowSeed + 2,
        stroke: strokeColor,
        strokeWidth: 2,
      })

      return {
        from: arrow.from,
        to: arrow.to,
        click: arrow.click,
        paths: [...gen.toPaths(lineDrawable), ...gen.toPaths(ah1), ...gen.toPaths(ah2)],
      }
    }).filter(Boolean) as {
      from: string; to: string; click?: number
      paths: { d: string; stroke?: string; strokeWidth?: number; fill?: string }[]
    }[]

    // Annotation positions — below last box
    const lastBoxBottom = panel.boxes.length > 0
      ? boxStartY + (panel.boxes.length - 1) * (props.boxHeight + props.boxGap) + props.boxHeight
      : boxStartY
    const annotationStartY = lastBoxBottom + 20
    const annotations = panel.annotations.map((ann, ai) => ({
      ...ann,
      x: px + props.panelWidth / 2,
      y: annotationStartY + ai * 20,
    }))

    // Result text — near bottom of panel
    const resultY = contentTop + props.panelHeight - 20

    return {
      title: panel.title,
      titleIcon: panel.titleIcon,
      click: panel.click,
      px,
      panelPaths: gen.toPaths(panelRect),
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
  const n = props.panels.length
  return n * props.panelWidth + Math.max(0, n - 1) * props.panelGap + 48
})

const svgH = computed(() => titleHeight + props.panelHeight + 24)

const viewBox = computed(() =>
  `${-24} ${-12} ${svgW.value} ${svgH.value}`
)

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
        <path
          v-for="(p, i) in panel.panelPaths"
          :key="`pc-${pi}-${i}`"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
        <path
          v-for="(p, i) in arrow.paths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
        />
      </g>

      <!-- Boxes -->
      <g
        v-for="box in panel.boxShapes"
        :key="`b-${box.id}`"
        class="pwa-diagram__el"
        :class="{ '--hidden': !isVisible(box.click, panel.click) }"
      >
        <path
          v-for="(p, i) in box.paths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
</template>

<style scoped>
.pwa-diagram {
  max-width: 100%;
  height: auto;
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
