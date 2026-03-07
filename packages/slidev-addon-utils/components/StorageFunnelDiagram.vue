<script setup lang="ts">
import { computed } from 'vue'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../utils/hash'
import { EDGE_STROKE } from '../constants/colors'
import type { Variant } from '../constants/colors'

interface FunnelNode {
  id: string
  label: string
  subtitles: string[]
  status: 'rejected' | 'accepted'
  click?: number
}

const {
  rejected,
  accepted,
  summary,
  summaryClick,
  roughness = 1.5,
  seed = 42,
} = defineProps<{
  rejected: FunnelNode[]
  accepted: FunnelNode[]
  summary?: string
  summaryClick?: number
  roughness?: number
  seed?: number
}>()

const { isVisible } = useClickVisibility()

// Layout constants
const rejW = 160
const rejH = 100
const rejGap = 40
const accW = 200
const accH = 100
const accGap = 30
const arrowLen = rejGap
const turnGap = 40
const padding = 24

// Rejected nodes: horizontal row
const rejPositions = computed(() =>
  rejected.map((node, i) => ({
    ...node,
    x: i * (rejW + rejGap),
    y: 0,
  }))
)

// Turn corner: right edge of last rejected + turnGap
const turnCornerX = computed(() => {
  const n = rejected.length
  return n * (rejW + rejGap) - rejGap + rejW + turnGap
})
const turnCornerY = computed(() => rejH / 2)

// Accepted nodes: vertical stack below turn corner, centered on turnCornerX
const accPositions = computed(() => {
  const startY = turnCornerY.value + turnGap
  return accepted.map((node, i) => ({
    ...node,
    x: turnCornerX.value - accW / 2,
    y: startY + i * (accH + accGap),
  }))
})

// SVG dimensions
const contentWidth = computed(() => {
  const rejRight = rejected.length * (rejW + rejGap) - rejGap + rejW
  const accRight = turnCornerX.value + accW / 2
  return Math.max(rejRight, accRight) + turnGap
})

const contentHeight = computed(() => {
  const lastAcc = accPositions.value[accPositions.value.length - 1]
  return lastAcc ? lastAcc.y + accH + 40 : rejH
})

// Rejection arrows between horizontal nodes
const rejArrows = computed(() => {
  const arrows: Array<{
    x1: number; y1: number; x2: number; y2: number
    click?: number; seed: number
  }> = []
  for (let i = 0; i < rejected.length - 1; i++) {
    const from = rejPositions.value[i]
    const to = rejPositions.value[i + 1]
    arrows.push({
      x1: from.x + rejW,
      y1: from.y + rejH / 2,
      x2: to.x,
      y2: to.y + rejH / 2,
      click: to.click,
      seed: seed + hashId(`rej-arrow-${i}`),
    })
  }
  return arrows
})

// L-turn: horizontal line from last rejected to corner, then arrow down to first accepted
const turnLine = computed(() => {
  const last = rejPositions.value[rejPositions.value.length - 1]
  if (!last || !accPositions.value.length) return null
  return {
    x1: last.x + rejW,
    y1: last.y + rejH / 2,
    x2: turnCornerX.value,
    y2: turnCornerY.value,
    seed: seed + hashId('turn-line'),
  }
})

const turnArrow = computed(() => {
  const firstAcc = accPositions.value[0]
  if (!firstAcc) return null
  return {
    x1: turnCornerX.value,
    y1: turnCornerY.value,
    x2: firstAcc.x + accW / 2,
    y2: firstAcc.y,
    seed: seed + hashId('turn-arrow'),
  }
})

// Arrows between accepted nodes
const accArrows = computed(() => {
  const arrows: Array<{
    x1: number; y1: number; x2: number; y2: number
    click?: number; seed: number
  }> = []
  for (let i = 0; i < accepted.length - 1; i++) {
    const from = accPositions.value[i]
    const to = accPositions.value[i + 1]
    arrows.push({
      x1: from.x + accW / 2,
      y1: from.y + accH,
      x2: to.x + accW / 2,
      y2: to.y,
      click: to.click,
      seed: seed + hashId(`acc-arrow-${i}`),
    })
  }
  return arrows
})

function variantFor(status: 'rejected' | 'accepted'): Variant {
  return status === 'rejected' ? 'danger' : 'success'
}

// Summary position
const summaryPos = computed(() => ({
  x: turnCornerX.value,
  y: contentHeight.value - 10,
}))
</script>

<template>
  <RoughSvg
    :width="contentWidth"
    :height="contentHeight"
    :padding="padding"
    :roughness="roughness"
    :seed="seed"
  >
    <!-- Rejection arrows (horizontal, between rejected nodes) -->
    <g
      v-for="(arrow, i) in rejArrows"
      :key="`rej-arrow-${i}`"
      class="funnel-diagram__el"
      :class="{ '--hidden': !isVisible(arrow.click) }"
    >
      <RoughArrow
        :x1="arrow.x1"
        :y1="arrow.y1"
        :x2="arrow.x2"
        :y2="arrow.y2"
        stroke="rgba(248, 113, 113, 0.5)"
        :roughness="roughness"
        :seed="arrow.seed"
      />
      <text
        :x="(arrow.x1 + arrow.x2) / 2"
        :y="arrow.y1 - 10"
        text-anchor="middle"
        class="funnel-diagram__x-label"
      >X</text>
    </g>

    <!-- Rejected nodes -->
    <g
      v-for="node in rejPositions"
      :key="`rej-${node.id}`"
      class="funnel-diagram__el funnel-diagram__el--rejected"
      :class="{ '--hidden': !isVisible(node.click) }"
    >
      <RoughRect
        :x="node.x"
        :y="node.y"
        :width="rejW"
        :height="rejH"
        :variant="variantFor(node.status)"
        :roughness="roughness"
        :seed="seed + hashId(node.id)"
      />
      <text
        :x="node.x + rejW / 2"
        :y="node.y + 22"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__label"
      >{{ node.label }}</text>
      <text
        v-for="(sub, si) in node.subtitles"
        :key="si"
        :x="node.x + rejW / 2"
        :y="node.y + 44 + si * 16"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__subtitle"
      >{{ sub }}</text>
      <!-- X icon -->
      <text
        :x="node.x + rejW - 14"
        :y="node.y + 14"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__status-icon funnel-diagram__status-icon--rejected"
      >✕</text>
    </g>

    <!-- L-turn: horizontal line from last rejected to corner -->
    <g
      v-if="turnLine"
      class="funnel-diagram__el"
      :class="{ '--hidden': !isVisible(accepted[0]?.click) }"
    >
      <RoughLine
        :x1="turnLine.x1"
        :y1="turnLine.y1"
        :x2="turnLine.x2"
        :y2="turnLine.y2"
        stroke="rgba(248, 113, 113, 0.5)"
        :roughness="roughness"
        :seed="turnLine.seed"
      />
      <!-- X label on the turn line -->
      <text
        :x="(turnLine.x1 + turnLine.x2) / 2"
        :y="turnLine.y1 - 10"
        text-anchor="middle"
        class="funnel-diagram__x-label"
      >X</text>
    </g>

    <!-- L-turn: vertical arrow from corner down to first accepted -->
    <g
      v-if="turnArrow"
      class="funnel-diagram__el"
      :class="{ '--hidden': !isVisible(accepted[0]?.click) }"
    >
      <RoughArrow
        :x1="turnArrow.x1"
        :y1="turnArrow.y1"
        :x2="turnArrow.x2"
        :y2="turnArrow.y2"
        stroke="rgba(52, 211, 153, 0.6)"
        :roughness="roughness"
        :seed="turnArrow.seed"
      />
    </g>

    <!-- Accepted nodes -->
    <g
      v-for="node in accPositions"
      :key="`acc-${node.id}`"
      class="funnel-diagram__el"
      :class="{ '--hidden': !isVisible(node.click) }"
    >
      <RoughRect
        :x="node.x"
        :y="node.y"
        :width="accW"
        :height="accH"
        :variant="variantFor(node.status)"
        :roughness="roughness"
        :seed="seed + hashId(node.id)"
      />
      <text
        :x="node.x + accW / 2"
        :y="node.y + 22"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__label"
      >{{ node.label }}</text>
      <text
        v-for="(sub, si) in node.subtitles"
        :key="si"
        :x="node.x + accW / 2"
        :y="node.y + 44 + si * 16"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__subtitle funnel-diagram__subtitle--accepted"
      >{{ sub }}</text>
      <!-- Check icon -->
      <text
        :x="node.x + accW - 16"
        :y="node.y + 14"
        text-anchor="middle"
        dominant-baseline="central"
        class="funnel-diagram__status-icon funnel-diagram__status-icon--accepted"
      >✓</text>
    </g>

    <!-- Arrows between accepted nodes -->
    <g
      v-for="(arrow, i) in accArrows"
      :key="`acc-arrow-${i}`"
      class="funnel-diagram__el"
      :class="{ '--hidden': !isVisible(arrow.click) }"
    >
      <RoughArrow
        :x1="arrow.x1"
        :y1="arrow.y1"
        :x2="arrow.x2"
        :y2="arrow.y2"
        stroke="rgba(52, 211, 153, 0.6)"
        :roughness="roughness"
        :seed="arrow.seed"
      />
    </g>

    <!-- Summary text -->
    <text
      v-if="summary"
      :x="summaryPos.x"
      :y="summaryPos.y"
      text-anchor="middle"
      class="funnel-diagram__el funnel-diagram__summary"
      :class="{ '--hidden': !isVisible(summaryClick) }"
    >{{ summary }}</text>
  </RoughSvg>
</template>

<style scoped>
.funnel-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.funnel-diagram__el.--hidden {
  opacity: 0;
}

.funnel-diagram__el--rejected {
  opacity: 0.55;
}

.funnel-diagram__el--rejected.--hidden {
  opacity: 0;
}

.funnel-diagram__label {
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.funnel-diagram__subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.35);
}

.funnel-diagram__subtitle--accepted {
  fill: rgba(52, 211, 153, 0.7);
}

.funnel-diagram__x-label {
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 700;
  fill: rgba(248, 113, 113, 0.8);
}

.funnel-diagram__status-icon {
  font-size: 13px;
  font-weight: 700;
}

.funnel-diagram__status-icon--rejected {
  fill: rgba(248, 113, 113, 0.8);
}

.funnel-diagram__status-icon--accepted {
  fill: rgba(52, 211, 153, 0.9);
}

.funnel-diagram__summary {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 500;
  fill: rgba(234, 237, 243, 0.7);
}
</style>
