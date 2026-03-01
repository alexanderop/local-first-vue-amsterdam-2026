<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import rough from 'roughjs'

interface TimelineItem {
  id: string
  title: string
  year?: string
  description?: string
  details?: string[]
  click?: number
  variant?: 'default' | 'accent' | 'muted' | 'success'
}

const props = withDefaults(defineProps<{
  items: TimelineItem[]
  roughness?: number
  seed?: number
  dotRadius?: number
  gap?: number
}>(), {
  roughness: 1.5,
  seed: 42,
  dotRadius: 8,
  gap: 200,
})

const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)
const gen = rough.generator()

const paddingX = 120
const paddingTop = 90
const textLineHeight = 18
const connectorLen = 14
const arrowLen = 12

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
  muted: { stroke: 'rgba(255, 255, 255, 0.3)', fill: 'rgba(255, 255, 255, 0.05)' },
}

const maxDetails = computed(() =>
  Math.max(0, ...props.items.map(item => item.details?.length ?? 0))
)

const lineY = computed(() => paddingTop)

const paddingBottom = computed(() => connectorLen + maxDetails.value * textLineHeight + 30)

const svgW = computed(() => paddingX * 2 + (props.items.length - 1) * props.gap + arrowLen + 20)
const svgH = computed(() => lineY.value + paddingBottom.value)

const viewBox = computed(() => `0 0 ${svgW.value} ${svgH.value}`)

// X positions for each milestone
const milestoneXs = computed(() =>
  props.items.map((_, i) => paddingX + i * props.gap)
)

// Main horizontal line — always visible
const mainLine = computed(() => {
  const x1 = paddingX - 20
  const x2 = svgW.value - paddingX + 10
  const y = lineY.value

  const lineDrawable = gen.line(x1, y, x2, y, {
    roughness: props.roughness * 0.6,
    seed: props.seed,
    stroke: 'rgba(255, 255, 255, 0.25)',
    strokeWidth: 2,
  })

  // Arrowhead
  const arrow1 = gen.line(x2, y, x2 - arrowLen, y - arrowLen * 0.5, {
    roughness: props.roughness * 0.3,
    seed: props.seed + 1,
    stroke: 'rgba(255, 255, 255, 0.25)',
    strokeWidth: 2,
  })
  const arrow2 = gen.line(x2, y, x2 - arrowLen, y + arrowLen * 0.5, {
    roughness: props.roughness * 0.3,
    seed: props.seed + 2,
    stroke: 'rgba(255, 255, 255, 0.25)',
    strokeWidth: 2,
  })

  return [
    ...gen.toPaths(lineDrawable),
    ...gen.toPaths(arrow1),
    ...gen.toPaths(arrow2),
  ]
})

// Per-milestone shapes
const milestones = computed(() =>
  props.items.map((item, i) => {
    const x = milestoneXs.value[i]
    const y = lineY.value
    const colors = variantColors[item.variant || 'default']
    const itemSeed = props.seed + hashId(item.id)

    // Dot
    const dot = gen.circle(x, y, props.dotRadius * 2, {
      roughness: props.roughness,
      seed: itemSeed,
      stroke: colors.stroke,
      fill: colors.stroke,
      fillStyle: 'solid',
      strokeWidth: 2,
    })

    // Vertical connector above (to title area)
    const connectorUp = gen.line(x, y - props.dotRadius, x, y - props.dotRadius - connectorLen, {
      roughness: props.roughness * 0.4,
      seed: itemSeed + 1,
      stroke: 'rgba(255, 255, 255, 0.15)',
      strokeWidth: 1.5,
    })

    // Vertical connector below (to details area)
    const connectorDown = gen.line(x, y + props.dotRadius, x, y + props.dotRadius + connectorLen, {
      roughness: props.roughness * 0.4,
      seed: itemSeed + 2,
      stroke: 'rgba(255, 255, 255, 0.15)',
      strokeWidth: 1.5,
    })

    return {
      ...item,
      x,
      y,
      colors,
      dotPaths: gen.toPaths(dot),
      connectorUpPaths: gen.toPaths(connectorUp),
      connectorDownPaths: gen.toPaths(connectorDown),
    }
  })
)

function isVisible(click?: number): boolean {
  if (click == null) return true
  return clicks.value >= click
}
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="timeline"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Main horizontal line — always visible -->
    <g class="timeline__line">
      <path
        v-for="(p, i) in mainLine"
        :key="`line-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
      />
    </g>

    <!-- Milestones -->
    <g
      v-for="m in milestones"
      :key="m.id"
      class="timeline__el"
      :class="{ '--hidden': !isVisible(m.click) }"
    >
      <!-- Dot -->
      <path
        v-for="(p, i) in m.dotPaths"
        :key="`dot-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
      />

      <!-- Connector up -->
      <path
        v-for="(p, i) in m.connectorUpPaths"
        :key="`cup-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
      />

      <!-- Title above -->
      <text
        :x="m.x"
        :y="m.y - dotRadius - connectorLen - 8"
        text-anchor="middle"
        dominant-baseline="auto"
        class="timeline__title"
        :fill="m.colors.stroke"
      >
        {{ m.title }}
      </text>

      <!-- Year -->
      <text
        v-if="m.year"
        :x="m.x"
        :y="m.y - dotRadius - connectorLen - 26"
        text-anchor="middle"
        dominant-baseline="auto"
        class="timeline__year"
      >
        {{ m.year }}
      </text>

      <!-- Description -->
      <text
        v-if="m.description"
        :x="m.x"
        :y="m.y - dotRadius - connectorLen - 44"
        text-anchor="middle"
        dominant-baseline="auto"
        class="timeline__description"
      >
        {{ m.description }}
      </text>

      <!-- Connector down (only if details exist) -->
      <template v-if="m.details?.length">
        <path
          v-for="(p, i) in m.connectorDownPaths"
          :key="`cdn-${i}`"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
        />
      </template>

      <!-- Details below -->
      <text
        v-for="(detail, di) in m.details"
        :key="`detail-${di}`"
        :x="m.x"
        :y="m.y + dotRadius + connectorLen + 8 + di * textLineHeight"
        text-anchor="middle"
        dominant-baseline="hanging"
        class="timeline__detail"
      >
        {{ detail }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.timeline {
  max-width: 100%;
  height: auto;
}

.timeline__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline__el.--hidden {
  opacity: 0;
}

.timeline__title {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.timeline__year {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.timeline__description {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 400;
  fill: rgba(234, 237, 243, 0.7);
}

.timeline__detail {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.5);
}
</style>
