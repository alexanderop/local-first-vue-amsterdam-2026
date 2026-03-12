<script setup lang="ts">
import RoughRect from './RoughRect.vue'
import RoughLine from './RoughLine.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { EDGE_STROKE } from '../constants/colors'

const { roughness = 1.2, seed = 400 } = defineProps<{
  roughness?: number
  seed?: number
}>()

const { isVisible } = useClickVisibility()

// Layout constants
const colW = 230
const colGap = 35
const col1 = 0
const col2 = col1 + colW + colGap
const col3 = col2 + colW + colGap

const svgW = col3 + colW
const svgH = 320

// Shared Y positions
const titleY = 12
const topY = 42
const rectH = 46
const midGap = 62
const botY = topY + rectH + midGap
const rectW = 120

// Colors
const success = 'rgba(52, 211, 153, 0.8)'
const muted = 'rgba(255, 255, 255, 0.3)'

// Footer Y
const footerY = 275
</script>

<template>
  <svg
    :viewBox="`-20 -8 ${svgW + 40} ${svgH + 16}`"
    :width="svgW + 40"
    :height="svgH + 16"
    class="three-steps"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- ═══════ Column 1: Pick Your Sync Engine ═══════ -->
    <g class="three-steps__el" :class="{ '--hidden': !isVisible(1) }">
      <!-- Title -->
      <text
        :x="col1 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-steps__title"
      >
        1. Pick Your Sync Engine
      </text>

      <!-- App rect -->
      <RoughRect
        :x="col1 + (colW - rectW) / 2"
        :y="topY"
        :width="rectW"
        :height="rectH"
        variant="default"
        :roughness="roughness"
        :seed="seed"
      />
      <text
        :x="col1 + colW / 2"
        :y="topY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        App
      </text>

      <!-- Arrow down -->
      <RoughArrow
        :x1="col1 + colW / 2"
        :y1="topY + rectH + 4"
        :x2="col1 + colW / 2"
        :y2="botY - 4"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 20"
        :arrow-size="8"
      />

      <!-- Arrow label -->
      <text
        :x="col1 + colW / 2 + 20"
        :y="topY + rectH + midGap / 2"
        text-anchor="start"
        dominant-baseline="central"
        class="three-steps__edge-label"
      >
        integrates
      </text>

      <!-- Jazz rect -->
      <RoughRect
        :x="col1 + (colW - rectW) / 2"
        :y="botY"
        :width="rectW"
        :height="rectH"
        variant="accent"
        :roughness="roughness"
        :seed="seed + 30"
      />
      <text
        :x="col1 + colW / 2"
        :y="botY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        Jazz
      </text>

      <!-- Description -->
      <text
        :x="col1 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        Batteries-included,
      </text>
      <text
        :x="col1 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        Vue support out of the box
      </text>
    </g>

    <!-- ═══════ Column 2: Let Users Export Data ═══════ -->
    <g class="three-steps__el" :class="{ '--hidden': !isVisible(2) }">
      <!-- Title -->
      <text
        :x="col2 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-steps__title"
      >
        2. Let Users Export Data
      </text>

      <!-- Data rect -->
      <RoughRect
        :x="col2 + (colW - rectW) / 2"
        :y="topY"
        :width="rectW"
        :height="rectH"
        variant="default"
        :roughness="roughness"
        :seed="seed + 50"
      />
      <text
        :x="col2 + colW / 2"
        :y="topY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        Data
      </text>

      <!-- Diverging arrow to JSON -->
      <RoughArrow
        :x1="col2 + colW / 2 - 15"
        :y1="topY + rectH + 4"
        :x2="col2 + colW / 2 - 55"
        :y2="botY - 4"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 60"
        :arrow-size="8"
      />

      <!-- Diverging arrow to CSV -->
      <RoughArrow
        :x1="col2 + colW / 2 + 15"
        :y1="topY + rectH + 4"
        :x2="col2 + colW / 2 + 55"
        :y2="botY - 4"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 61"
        :arrow-size="8"
      />

      <!-- JSON rect -->
      <RoughRect
        :x="col2 + colW / 2 - 100"
        :y="botY"
        :width="90"
        :height="rectH"
        variant="accent"
        :roughness="roughness"
        :seed="seed + 70"
      />
      <text
        :x="col2 + colW / 2 - 55"
        :y="botY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        JSON
      </text>

      <!-- CSV rect -->
      <RoughRect
        :x="col2 + colW / 2 + 10"
        :y="botY"
        :width="90"
        :height="rectH"
        variant="accent"
        :roughness="roughness"
        :seed="seed + 80"
      />
      <text
        :x="col2 + colW / 2 + 55"
        :y="botY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        CSV
      </text>

      <!-- Description -->
      <text
        :x="col2 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        Give them a
      </text>
      <text
        :x="col2 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        download button
      </text>
    </g>

    <!-- ═══════ Column 3: Watch This Space ═══════ -->
    <g class="three-steps__el" :class="{ '--hidden': !isVisible(3) }">
      <!-- Title -->
      <text
        :x="col3 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-steps__title"
      >
        3. Watch This Space
      </text>

      <!-- Offline-first rect (wider) -->
      <RoughRect
        :x="col3 + (colW - 140) / 2"
        :y="topY"
        :width="140"
        :height="rectH"
        variant="muted"
        :roughness="roughness"
        :seed="seed + 100"
      />
      <text
        :x="col3 + colW / 2"
        :y="topY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label --muted"
      >
        Offline-first
      </text>

      <!-- Dashed arrow down -->
      <RoughArrow
        :x1="col3 + colW / 2"
        :y1="topY + rectH + 6"
        :x2="col3 + colW / 2"
        :y2="botY - 6"
        :stroke="muted"
        :roughness="roughness"
        :seed="seed + 110"
        :arrow-size="8"
        stroke-dasharray="6 4"
      />

      <!-- Arrow label -->
      <text
        :x="col3 + colW / 2 + 20"
        :y="topY + rectH + midGap / 2"
        text-anchor="start"
        dominant-baseline="central"
        class="three-steps__edge-label"
      >
        config change
      </text>

      <!-- Local-first rect (wider) -->
      <RoughRect
        :x="col3 + (colW - 140) / 2"
        :y="botY"
        :width="140"
        :height="rectH"
        variant="success"
        :roughness="roughness"
        :seed="seed + 120"
      />
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__label"
      >
        Local-first
      </text>

      <!-- Green checkmark beside Local-first rect -->
      <RoughLine
        :x1="col3 + (colW + 140) / 2 + 10"
        :y1="botY + rectH / 2"
        :x2="col3 + (colW + 140) / 2 + 18"
        :y2="botY + rectH / 2 + 10"
        :stroke="success"
        :stroke-width="2.5"
        :roughness="roughness * 0.4"
        :seed="seed + 130"
      />
      <RoughLine
        :x1="col3 + (colW + 140) / 2 + 18"
        :y1="botY + rectH / 2 + 10"
        :x2="col3 + (colW + 140) / 2 + 32"
        :y2="botY + rectH / 2 - 8"
        :stroke="success"
        :stroke-width="2.5"
        :roughness="roughness * 0.4"
        :seed="seed + 131"
      />

      <!-- Description -->
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        Config change,
      </text>
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__desc"
      >
        not a rewrite
      </text>
    </g>

    <!-- ═══════ Footer ═══════ -->
    <g class="three-steps__el" :class="{ '--hidden': !isVisible(4) }">
      <!-- Dashed divider -->
      <RoughLine
        :x1="20"
        :y1="footerY"
        :x2="svgW - 20"
        :y2="footerY"
        :stroke="muted"
        :stroke-width="1"
        stroke-dasharray="6 4"
        :roughness="roughness * 0.3"
        :seed="seed + 200"
      />

      <!-- Footer text -->
      <text
        :x="svgW / 2"
        :y="footerY + 28"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-steps__footer"
      >
        We're in the pragmatist phase — the tools aren't perfect, but you can
        <tspan class="three-steps__footer --highlight">start today</tspan>.
      </text>
    </g>
  </svg>
</template>

<style scoped>
.three-steps {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.three-steps__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.three-steps__el.--hidden {
  opacity: 0;
}

.three-steps__title {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.three-steps__label {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.three-steps__label.--muted {
  fill: rgba(255, 255, 255, 0.4);
}

.three-steps__edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}

.three-steps__desc {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.35);
}

.three-steps__footer {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.45);
}

.three-steps__footer.--highlight {
  font-weight: 600;
  fill: rgba(255, 107, 237, 0.8);
}
</style>
