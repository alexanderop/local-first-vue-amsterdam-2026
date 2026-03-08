<script setup lang="ts">
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'

const { roughness = 1.2, seed = 900 } = defineProps<{
  roughness?: number
  seed?: number
}>()

const { isVisible } = useClickVisibility()

// Layout constants
const W = 760
const H = 480

// Header
const headerX = 20
const headerY = 0
const headerW = 720
const headerH = 55

// History columns
const colY = 75
const colH = 195
const colW = 215
const colGap = 18
const col1X = 20
const col2X = col1X + colW + colGap
const col3X = col2X + colW + colGap

// Merge box
const mergeY = 310
const mergeX = 20
const mergeW = 720
const mergeH = 120

// Arrow positions
const arrow1X = col1X + colW / 2
const arrow2X = col2X + colW / 2
const arrow3X = col3X + colW / 2
const arrowY1 = colY + colH
const arrowY2 = mergeY
</script>

<template>
  <div class="comap-diagram-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="12">

      <!-- Header — always visible -->
      <g class="click-el">
        <RoughRect
          :x="headerX" :y="headerY" :width="headerW" :height="headerH"
          variant="accent"
          :roughness="roughness"
          :seed="seed"
        />
        <text
          :x="headerX + headerW / 2" :y="headerY + 22"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
          style="font-size: 13px; fill: rgba(255, 107, 237, 0.95); font-weight: 600;"
        >CoMap co_z3YG8oTv5VWNMQT</text>
        <text
          :x="headerX + headerW / 2" :y="headerY + 42"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
          style="font-size: 11px;"
        >type: "todo" · owner: alice · created: 8:00 AM</text>
      </g>

      <!-- Column 1: alice / device 1 — click 1 -->
      <g class="click-el" :class="{ '--hidden': !isVisible(1) }">
        <RoughRect
          :x="col1X" :y="colY" :width="colW" :height="colH"
          variant="default"
          :roughness="roughness"
          :seed="seed + 10"
        />
        <text
          :x="col1X + colW / 2" :y="colY + 22"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >ALICE / DEVICE 1</text>

        <!-- title field -->
        <text
          :x="col1X + 14" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono"
        >title:</text>
        <text
          :x="col1X + 65" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono accent"
        >"Buy milk"</text>
        <text
          :x="col1X + colW - 14" :y="colY + 58"
          text-anchor="end" dominant-baseline="central"
          class="label-mono"
          style="font-size: 10px;"
        >8:01</text>

        <!-- done field -->
        <text
          :x="col1X + 14" :y="colY + 88"
          dominant-baseline="central"
          class="label-mono"
        >done:</text>
        <text
          :x="col1X + 62" :y="colY + 88"
          dominant-baseline="central"
          class="label-mono accent"
        >false</text>
        <text
          :x="col1X + colW - 14" :y="colY + 88"
          text-anchor="end" dominant-baseline="central"
          class="label-mono"
          style="font-size: 10px;"
        >8:01</text>

        <text
          :x="col1X + colW / 2" :y="colY + colH - 28"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
          style="font-size: 11px;"
        >creates todo</text>
      </g>

      <!-- Column 2: bob / device 1 — click 2 -->
      <g class="click-el" :class="{ '--hidden': !isVisible(2) }">
        <RoughRect
          :x="col2X" :y="colY" :width="colW" :height="colH"
          variant="default"
          :roughness="roughness"
          :seed="seed + 20"
        />
        <text
          :x="col2X + colW / 2" :y="colY + 22"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >BOB / DEVICE 1</text>

        <!-- title field -->
        <text
          :x="col2X + 14" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono"
        >title:</text>
        <text
          :x="col2X + 65" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono accent"
        >"Buy oat milk"</text>
        <text
          :x="col2X + colW - 14" :y="colY + 58"
          text-anchor="end" dominant-baseline="central"
          class="label-mono"
          style="font-size: 10px;"
        >8:03</text>

        <text
          :x="col2X + colW / 2" :y="colY + colH - 28"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
          style="font-size: 11px;"
        >edits title offline</text>
      </g>

      <!-- Column 3: bob / device 2 — click 2 -->
      <g class="click-el" :class="{ '--hidden': !isVisible(2) }">
        <RoughRect
          :x="col3X" :y="colY" :width="colW" :height="colH"
          variant="default"
          :roughness="roughness"
          :seed="seed + 30"
        />
        <text
          :x="col3X + colW / 2" :y="colY + 22"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >BOB / DEVICE 2</text>

        <!-- done field -->
        <text
          :x="col3X + 14" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono"
        >done:</text>
        <text
          :x="col3X + 62" :y="colY + 58"
          dominant-baseline="central"
          class="label-mono accent"
        >true</text>
        <text
          :x="col3X + colW - 14" :y="colY + 58"
          text-anchor="end" dominant-baseline="central"
          class="label-mono"
          style="font-size: 10px;"
        >8:02</text>

        <text
          :x="col3X + colW / 2" :y="colY + colH - 28"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
          style="font-size: 11px;"
        >marks done offline</text>
      </g>

      <!-- Arrows + merge label — click 3 -->
      <g class="click-el" :class="{ '--hidden': !isVisible(3) }">
        <RoughArrow
          :x1="arrow1X" :y1="arrowY1"
          :x2="arrow1X" :y2="arrowY2"
          :roughness="roughness"
          :seed="seed + 40"
        />
        <RoughArrow
          :x1="arrow2X" :y1="arrowY1"
          :x2="arrow2X" :y2="arrowY2"
          :roughness="roughness"
          :seed="seed + 45"
        />
        <RoughArrow
          :x1="arrow3X" :y1="arrowY1"
          :x2="arrow3X" :y2="arrowY2"
          :roughness="roughness"
          :seed="seed + 50"
        />
        <text
          :x="W / 2" :y="(arrowY1 + arrowY2) / 2"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
        >LWW merge ▼</text>

        <RoughRect
          :x="mergeX" :y="mergeY" :width="mergeW" :height="mergeH"
          variant="success"
          :roughness="roughness * 0.7"
          :seed="seed + 55"
          :stroke-width="1.5"
          stroke-dasharray="8 6"
        />
        <text
          :x="mergeX + mergeW / 2" :y="mergeY + 30"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
          style="fill: rgba(52, 211, 153, 0.9);"
        >MERGED STATE</text>
        <text
          :x="mergeX + mergeW / 2" :y="mergeY + 62"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
          style="font-size: 14px;"
        >{ title: "Buy oat milk", done: true }</text>
        <text
          :x="mergeX + mergeW / 2" :y="mergeY + 90"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
          style="font-size: 11px;"
        >title → 8:03 wins over 8:01 · done → no conflict</text>
      </g>


    </RoughSvg>
  </div>
</template>

<style scoped>
.comap-diagram-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.comap-diagram-wrap :deep(.rough-svg) {
  width: 100%;
  max-height: 100%;
  height: auto;
}

.label-title {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.label-box {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.label-mono {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.label-mono.accent {
  fill: rgba(255, 107, 237, 0.85);
}

.edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
}

.rule-text {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 600;
}

.rule-success {
  fill: rgba(52, 211, 153, 0.9);
}

.rule-accent {
  fill: rgba(255, 107, 237, 0.85);
}

.click-el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.click-el.--hidden {
  opacity: 0;
}
</style>
