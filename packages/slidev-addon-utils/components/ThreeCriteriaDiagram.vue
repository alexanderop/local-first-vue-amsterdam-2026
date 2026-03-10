<script setup lang="ts">
import RoughRect from './RoughRect.vue'
import RoughCircle from './RoughCircle.vue'
import RoughLine from './RoughLine.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { EDGE_STROKE } from '../constants/colors'

const { roughness = 1.2, seed = 300 } = defineProps<{
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

// Danger / success / muted stroke colors
const danger = 'rgba(248, 113, 113, 0.8)'
const success = 'rgba(52, 211, 153, 0.8)'
const muted = 'rgba(255, 255, 255, 0.3)'
const mutedFill = 'rgba(255, 255, 255, 0.05)'

// Footer Y
const footerY = 275
</script>

<template>
  <svg
    :viewBox="`-20 -8 ${svgW + 40} ${svgH + 16}`"
    :width="svgW + 40"
    :height="svgH + 16"
    class="three-criteria"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- ═══════ Column 1: Offline Reads & Writes ═══════ -->
    <g class="three-criteria__el" :class="{ '--hidden': !isVisible(1) }">
      <!-- Title -->
      <text
        :x="col1 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-criteria__title"
      >
        1. Offline Reads &amp; Writes
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
        class="three-criteria__label"
      >
        App
      </text>

      <!-- No-wifi icon: dashed circle + X -->
      <RoughCircle
        :x="col1 + colW - 20"
        :y="topY + 12"
        :diameter="26"
        variant="muted"
        :stroke-width="1.5"
        stroke-dasharray="4 3"
        :roughness="roughness * 0.6"
        :seed="seed + 10"
      />
      <RoughLine
        :x1="col1 + colW - 28"
        :y1="topY + 4"
        :x2="col1 + colW - 12"
        :y2="topY + 20"
        :stroke="danger"
        :stroke-width="2"
        :roughness="roughness * 0.4"
        :seed="seed + 11"
      />
      <RoughLine
        :x1="col1 + colW - 12"
        :y1="topY + 4"
        :x2="col1 + colW - 28"
        :y2="topY + 20"
        :stroke="danger"
        :stroke-width="2"
        :roughness="roughness * 0.4"
        :seed="seed + 12"
      />

      <!-- Bidirectional arrows -->
      <RoughArrow
        :x1="col1 + colW / 2 - 14"
        :y1="topY + rectH + 4"
        :x2="col1 + colW / 2 - 14"
        :y2="botY - 4"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 20"
        :arrow-size="8"
      />
      <RoughArrow
        :x1="col1 + colW / 2 + 14"
        :y1="botY - 4"
        :x2="col1 + colW / 2 + 14"
        :y2="topY + rectH + 4"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 21"
        :arrow-size="8"
      />

      <!-- Arrow labels -->
      <text
        :x="col1 + colW / 2 - 24"
        :y="topY + rectH + midGap / 2"
        text-anchor="end"
        dominant-baseline="central"
        class="three-criteria__edge-label"
      >
        write
      </text>
      <text
        :x="col1 + colW / 2 + 24"
        :y="topY + rectH + midGap / 2"
        text-anchor="start"
        dominant-baseline="central"
        class="three-criteria__edge-label"
      >
        read
      </text>

      <!-- Local DB rect -->
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
        class="three-criteria__label"
      >
        Local DB
      </text>

      <!-- Queue rects (pending writes) -->
      <RoughRect
        :x="col1 + colW - 32"
        :y="botY + 4"
        :width="32"
        :height="10"
        variant="muted"
        :stroke-width="1"
        :roughness="roughness * 0.5"
        :seed="seed + 40"
      />
      <RoughRect
        :x="col1 + colW - 32"
        :y="botY + 18"
        :width="32"
        :height="10"
        variant="muted"
        :stroke-width="1"
        :roughness="roughness * 0.5"
        :seed="seed + 41"
      />
      <RoughRect
        :x="col1 + colW - 32"
        :y="botY + 32"
        :width="32"
        :height="10"
        variant="muted"
        :stroke-width="1"
        :roughness="roughness * 0.5"
        :seed="seed + 42"
      />

      <!-- Description -->
      <text
        :x="col1 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        Writes while disconnected,
      </text>
      <text
        :x="col1 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        reconcile later
      </text>
    </g>

    <!-- ═══════ Column 2: Collaboration Across Devices ═══════ -->
    <g class="three-criteria__el" :class="{ '--hidden': !isVisible(2) }">
      <!-- Title -->
      <text
        :x="col2 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-criteria__title"
      >
        2. Collaboration
      </text>

      <!-- Device A rect -->
      <RoughRect
        :x="col2 + 10"
        :y="topY"
        :width="90"
        :height="56"
        variant="default"
        :roughness="roughness"
        :seed="seed + 50"
      />
      <text
        :x="col2 + 55"
        :y="topY + 14"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__label"
      >
        A
      </text>
      <!-- Doc lines inside A -->
      <RoughLine :x1="col2 + 22" :y1="topY + 28" :x2="col2 + 88" :y2="topY + 28" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 51" />
      <RoughLine :x1="col2 + 22" :y1="topY + 38" :x2="col2 + 78" :y2="topY + 38" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 52" />
      <RoughLine :x1="col2 + 22" :y1="topY + 48" :x2="col2 + 68" :y2="topY + 48" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 53" />

      <!-- Device B rect -->
      <RoughRect
        :x="col2 + colW - 100"
        :y="topY"
        :width="90"
        :height="56"
        variant="default"
        :roughness="roughness"
        :seed="seed + 60"
      />
      <text
        :x="col2 + colW - 55"
        :y="topY + 14"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__label"
      >
        B
      </text>
      <!-- Doc lines inside B -->
      <RoughLine :x1="col2 + colW - 88" :y1="topY + 28" :x2="col2 + colW - 22" :y2="topY + 28" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 61" />
      <RoughLine :x1="col2 + colW - 88" :y1="topY + 38" :x2="col2 + colW - 32" :y2="topY + 38" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 62" />
      <RoughLine :x1="col2 + colW - 88" :y1="topY + 48" :x2="col2 + colW - 42" :y2="topY + 48" :stroke="muted" :stroke-width="1" :roughness="roughness * 0.3" :seed="seed + 63" />

      <!-- Arrows converging to merge point -->
      <RoughArrow
        :x1="col2 + 55"
        :y1="topY + 60"
        :x2="col2 + colW / 2 - 10"
        :y2="topY + rectH + midGap - 10"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 70"
        :arrow-size="8"
      />
      <RoughArrow
        :x1="col2 + colW - 55"
        :y1="topY + 60"
        :x2="col2 + colW / 2 + 10"
        :y2="topY + rectH + midGap - 10"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 71"
        :arrow-size="8"
      />

      <!-- Merge circle -->
      <RoughCircle
        :x="col2 + colW / 2"
        :y="topY + rectH + midGap + 8"
        :diameter="34"
        variant="success"
        :roughness="roughness"
        :seed="seed + 80"
      />
      <text
        :x="col2 + colW / 2"
        :y="topY + rectH + midGap + 8"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__check"
      >
        ✓
      </text>

      <!-- Merged result rect -->
      <RoughRect
        :x="col2 + (colW - 100) / 2"
        :y="botY + 20"
        :width="100"
        :height="38"
        variant="success"
        :roughness="roughness"
        :seed="seed + 90"
      />
      <text
        :x="col2 + colW / 2"
        :y="botY + 39"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__label"
      >
        Merged
      </text>

      <!-- Description -->
      <text
        :x="col2 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        Concurrent edits merge
      </text>
      <text
        :x="col2 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        automatically
      </text>
    </g>

    <!-- ═══════ Column 3: Data Survives Shutdown ═══════ -->
    <g class="three-criteria__el" :class="{ '--hidden': !isVisible(3) }">
      <!-- Title -->
      <text
        :x="col3 + colW / 2"
        :y="titleY"
        text-anchor="middle"
        class="three-criteria__title"
      >
        3. Data Survives Shutdown
      </text>

      <!-- Server rect -->
      <RoughRect
        :x="col3 + (colW - rectW) / 2"
        :y="topY"
        :width="rectW"
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
        class="three-criteria__label --muted"
      >
        Server
      </text>

      <!-- Big red X over server -->
      <RoughLine
        :x1="col3 + (colW - rectW) / 2 + 8"
        :y1="topY + 6"
        :x2="col3 + (colW + rectW) / 2 - 8"
        :y2="topY + rectH - 6"
        :stroke="danger"
        :stroke-width="2.5"
        :roughness="roughness * 0.6"
        :seed="seed + 110"
      />
      <RoughLine
        :x1="col3 + (colW + rectW) / 2 - 8"
        :y1="topY + 6"
        :x2="col3 + (colW - rectW) / 2 + 8"
        :y2="topY + rectH - 6"
        :stroke="danger"
        :stroke-width="2.5"
        :roughness="roughness * 0.6"
        :seed="seed + 111"
      />

      <!-- Broken dashed arrow going down -->
      <RoughArrow
        :x1="col3 + colW / 2"
        :y1="topY + rectH + 6"
        :x2="col3 + colW / 2"
        :y2="botY - 6"
        :stroke="muted"
        :roughness="roughness"
        :seed="seed + 120"
        :arrow-size="8"
        stroke-dasharray="6 4"
      />

      <!-- Your Data rect -->
      <RoughRect
        :x="col3 + (colW - rectW) / 2"
        :y="botY"
        :width="rectW"
        :height="rectH"
        variant="success"
        :roughness="roughness"
        :seed="seed + 130"
      />
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__label"
      >
        Your Data
      </text>

      <!-- Green checkmark beside data rect -->
      <RoughLine
        :x1="col3 + (colW + rectW) / 2 + 10"
        :y1="botY + rectH / 2"
        :x2="col3 + (colW + rectW) / 2 + 18"
        :y2="botY + rectH / 2 + 10"
        :stroke="success"
        :stroke-width="2.5"
        :roughness="roughness * 0.4"
        :seed="seed + 140"
      />
      <RoughLine
        :x1="col3 + (colW + rectW) / 2 + 18"
        :y1="botY + rectH / 2 + 10"
        :x2="col3 + (colW + rectW) / 2 + 32"
        :y2="botY + rectH / 2 - 8"
        :stroke="success"
        :stroke-width="2.5"
        :roughness="roughness * 0.4"
        :seed="seed + 141"
      />

      <!-- Description -->
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH + 24"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        No vendor lock-in,
      </text>
      <text
        :x="col3 + colW / 2"
        :y="botY + rectH + 40"
        text-anchor="middle"
        dominant-baseline="central"
        class="three-criteria__desc"
      >
        data is yours forever
      </text>
    </g>

    <!-- ═══════ Footer ═══════ -->
    <g class="three-criteria__el" :class="{ '--hidden': !isVisible(4) }">
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
        class="three-criteria__footer"
      >
        Criterion 3 is the hardest — it separates
        <tspan class="three-criteria__footer --highlight">offline-first</tspan>
        from
        <tspan class="three-criteria__footer --highlight">local-first</tspan>.
      </text>
    </g>
  </svg>
</template>

<style scoped>
.three-criteria {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.three-criteria__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.three-criteria__el.--hidden {
  opacity: 0;
}

.three-criteria__title {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.three-criteria__label {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.three-criteria__label.--muted {
  fill: rgba(255, 255, 255, 0.4);
}

.three-criteria__edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}

.three-criteria__check {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 700;
  fill: rgba(52, 211, 153, 0.95);
}

.three-criteria__desc {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.35);
}

.three-criteria__footer {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.45);
}

.three-criteria__footer.--highlight {
  font-weight: 600;
  fill: rgba(255, 107, 237, 0.8);
}
</style>
