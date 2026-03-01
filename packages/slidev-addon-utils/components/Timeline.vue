<script setup lang="ts">
import { computed } from 'vue'
import RoughArrow from './RoughArrow.vue'
import RoughCircle from './RoughCircle.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import { getVariantColors } from '../constants/colors'

interface TimelineItem {
  id: string
  title: string
  year?: string
  description?: string
  details?: string[]
  click?: number
  variant?: 'default' | 'accent' | 'muted' | 'success'
}

const { items, roughness = 1.5, seed = 42, dotRadius = 8, gap = 200 } = defineProps<{
  items: TimelineItem[]
  roughness?: number
  seed?: number
  dotRadius?: number
  gap?: number
}>()

const { isVisible } = useClickVisibility()

const paddingX = 120
const paddingTop = 90
const textLineHeight = 18
const connectorLen = 14
const arrowLen = 12

const maxDetails = computed(() =>
  Math.max(0, ...items.map(item => item.details?.length ?? 0))
)

const lineY = computed(() => paddingTop)

const paddingBottom = computed(() => connectorLen + maxDetails.value * textLineHeight + 30)

const svgW = computed(() => paddingX * 2 + (items.length - 1) * gap + arrowLen + 20)
const svgH = computed(() => lineY.value + paddingBottom.value)

const viewBox = computed(() => `0 0 ${svgW.value} ${svgH.value}`)

// X positions for each milestone
const milestoneXs = computed(() =>
  items.map((_, i) => paddingX + i * gap)
)

// Main horizontal line endpoints
const mainLineX1 = computed(() => paddingX - 20)
const mainLineX2 = computed(() => svgW.value - paddingX + 10)

// Per-milestone data
const milestones = computed(() =>
  items.map((item, i) => {
    const x = milestoneXs.value[i]
    const y = lineY.value
    const colors = getVariantColors(item.variant)
    const itemSeed = seed + hashId(item.id)

    return {
      ...item,
      x,
      y,
      colors,
      itemSeed,
    }
  })
)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="timeline"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Main horizontal line with arrow — always visible -->
    <g class="timeline__line">
      <RoughArrow
        :x1="mainLineX1"
        :y1="lineY"
        :x2="mainLineX2"
        :y2="lineY"
        stroke="rgba(255,255,255,0.25)"
        :roughness="roughness"
        :seed="seed"
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
      <RoughCircle
        :x="m.x"
        :y="m.y"
        :diameter="dotRadius * 2"
        :stroke="m.colors.stroke"
        :fill="m.colors.stroke"
        :roughness="roughness"
        :seed="m.itemSeed"
      />

      <!-- Connector up -->
      <RoughLine
        :x1="m.x"
        :y1="m.y - dotRadius"
        :x2="m.x"
        :y2="m.y - dotRadius - connectorLen"
        stroke="rgba(255,255,255,0.15)"
        :stroke-width="1.5"
        :roughness="roughness * 0.4"
        :seed="m.itemSeed + 1"
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
      <RoughLine
        v-if="m.details?.length"
        :x1="m.x"
        :y1="m.y + dotRadius"
        :x2="m.x"
        :y2="m.y + dotRadius + connectorLen"
        stroke="rgba(255,255,255,0.15)"
        :stroke-width="1.5"
        :roughness="roughness * 0.4"
        :seed="m.itemSeed + 2"
      />

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
  display: block;
  margin: auto;
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
