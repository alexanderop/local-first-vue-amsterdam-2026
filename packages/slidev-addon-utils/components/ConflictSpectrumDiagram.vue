<script setup lang="ts">
import { computed } from 'vue'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../utils/hash'
import type { Variant } from '../constants/colors'

interface SpectrumItem {
  id: string
  label: string
  subtitle: string
  pro: string
  con: string
  variant: Variant
  click?: number
  weight?: number
}

const { items, roughness = 1.2, seed = 777 } = defineProps<{
  items: SpectrumItem[]
  roughness?: number
  seed?: number
}>()

const { isVisible } = useClickVisibility()

// Layout constants
const baseW = 100
const weightMul = 14
const cardH = 58
const gapSize = 18

// Compute card positions
const cards = computed(() => {
  let x = 0
  return items.map((item, i) => {
    const w = baseW + (item.weight ?? (i + 1)) * weightMul
    const card = { ...item, x, y: 0, w, h: cardH }
    x += w + gapSize
    return card
  })
})

const W = computed(() => {
  const c = cards.value
  if (!c.length) return 0
  const last = c[c.length - 1]
  return last.x + last.w
})

// Vertical positions
const proY = cardH + 14
const conY = cardH + 30
const axisY = cardH + 54
const axisLabelY = axisY + 16
const H = axisLabelY + 6
</script>

<template>
  <div class="spectrum-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="16">
      <template v-for="(card, i) in cards" :key="card.id">
        <g class="click-el" :class="{ '--hidden': !isVisible(card.click) }">
          <!-- Arrow from previous card -->
          <RoughArrow
            v-if="i > 0"
            :x1="cards[i - 1].x + cards[i - 1].w + 2"
            :y1="cardH / 2"
            :x2="card.x - 2"
            :y2="cardH / 2"
            :roughness="roughness"
            :seed="seed + hashId(card.id + '-arrow')"
            :stroke-width="1.5"
            :arrow-size="7"
          />

          <!-- Card rectangle -->
          <RoughRect
            :x="card.x"
            :y="card.y"
            :width="card.w"
            :height="card.h"
            :variant="card.variant"
            :roughness="roughness"
            :seed="seed + hashId(card.id)"
          />

          <!-- Label -->
          <text
            :x="card.x + card.w / 2"
            :y="cardH / 2 - 7"
            text-anchor="middle"
            dominant-baseline="central"
            class="card-label"
          >{{ card.label }}</text>

          <!-- Subtitle -->
          <text
            :x="card.x + card.w / 2"
            :y="cardH / 2 + 12"
            text-anchor="middle"
            dominant-baseline="central"
            class="card-subtitle"
          >{{ card.subtitle }}</text>

          <!-- Pro -->
          <text
            :x="card.x + card.w / 2"
            :y="proY"
            text-anchor="middle"
            dominant-baseline="central"
            class="pro-text"
          >&#x2713; {{ card.pro }}</text>

          <!-- Con -->
          <text
            :x="card.x + card.w / 2"
            :y="conY"
            text-anchor="middle"
            dominant-baseline="central"
            class="con-text"
          >&#x2717; {{ card.con }}</text>
        </g>
      </template>

      <!-- Axis line (always visible) -->
      <RoughLine
        :x1="0"
        :y1="axisY"
        :x2="W"
        :y2="axisY"
        stroke="rgba(255, 255, 255, 0.15)"
        :stroke-width="1"
        stroke-dasharray="6 4"
        :roughness="roughness * 0.3"
        :seed="seed + 999"
      />

      <!-- Axis labels -->
      <text
        x="0"
        :y="axisLabelY"
        dominant-baseline="central"
        class="axis-label axis-left"
      >Simple</text>
      <text
        :x="W"
        :y="axisLabelY"
        text-anchor="end"
        dominant-baseline="central"
        class="axis-label axis-right"
      >Complex</text>
    </RoughSvg>
  </div>
</template>

<style scoped>
.spectrum-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.spectrum-wrap :deep(.rough-svg) {
  width: 100%;
  max-height: 100%;
  height: auto;
}

.card-label {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.card-subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.pro-text {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(52, 211, 153, 0.8);
}

.con-text {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(248, 113, 113, 0.8);
}

.axis-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
}

.axis-left {
  fill: rgba(255, 255, 255, 0.3);
}

.axis-right {
  fill: rgba(255, 107, 237, 0.7);
}

.click-el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.click-el.--hidden {
  opacity: 0;
}
</style>
