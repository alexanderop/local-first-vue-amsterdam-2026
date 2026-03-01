<script setup lang="ts">
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import ClickGroup from './ClickGroup.vue'

const { roughness = 1.5, seed = 42 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// Layout constants
const W = 760
const H = 480

// User A box
const userAX = 40
const userAY = 20
const userW = 280
const userH = 140

// User B box
const userBX = 440
const userBY = 20

// Merge box
const mergeX = 40
const mergeY = 240
const mergeW = 680
const mergeH = 220

// Arrow positions
const arrowAx = userAX + userW / 2
const arrowAy1 = userAY + userH
const arrowAy2 = mergeY

const arrowBx = userBX + userW / 2
const arrowBy1 = userBY + userH
const arrowBy2 = mergeY
</script>

<template>
  <div class="crdt-diagram-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="12">

      <!-- User A box -->
      <ClickGroup :click="1">
        <RoughRect
          :x="userAX" :y="userAY" :width="userW" :height="userH"
          variant="accent"
          :roughness="roughness"
          :seed="seed"
        />
        <text
          :x="userAX + userW / 2" :y="userAY + 24"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >USER A</text>
        <text
          :x="userAX + userW / 2" :y="userAY + 52"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >Changes TITLE</text>
        <text
          :x="userAX + userW / 2" :y="userAY + 80"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
        >"Buy milk"</text>
        <text
          :x="userAX + userW / 2" :y="userAY + 104"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono accent"
        >→ "Buy oat milk"</text>
      </ClickGroup>

      <!-- User B box -->
      <ClickGroup :click="1">
        <RoughRect
          :x="userBX" :y="userBY" :width="userW" :height="userH"
          variant="accent"
          :roughness="roughness"
          :seed="seed + 10"
        />
        <text
          :x="userBX + userW / 2" :y="userBY + 24"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >USER B</text>
        <text
          :x="userBX + userW / 2" :y="userBY + 52"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >Toggles DONE</text>
        <text
          :x="userBX + userW / 2" :y="userBY + 80"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
        >completed: true</text>
      </ClickGroup>

      <!-- Arrows + reconnect label -->
      <ClickGroup :click="2">
        <RoughArrow
          :x1="arrowAx" :y1="arrowAy1"
          :x2="arrowAx" :y2="arrowAy2"
          :roughness="roughness"
          :seed="seed + 20"
        />
        <RoughArrow
          :x1="arrowBx" :y1="arrowBy1"
          :x2="arrowBx" :y2="arrowBy2"
          :roughness="roughness"
          :seed="seed + 25"
        />
        <text
          :x="W / 2" :y="(arrowAy1 + arrowAy2) / 2"
          text-anchor="middle" dominant-baseline="central"
          class="edge-label"
        >reconnect + sync</text>
      </ClickGroup>

      <!-- Merge box + auto-merge rule -->
      <ClickGroup :click="3">
        <RoughRect
          :x="mergeX" :y="mergeY" :width="mergeW" :height="mergeH"
          variant="success"
          :roughness="roughness * 0.7"
          :seed="seed + 30"
          :stroke-width="1.5"
          stroke-dasharray="8 6"
        />
        <text
          :x="mergeX + 30" :y="mergeY + 36"
          dominant-baseline="central"
          class="rule-text rule-success"
        >&#x2713;  Different fields → AUTO-MERGE</text>
        <text
          :x="mergeX + 50" :y="mergeY + 64"
          dominant-baseline="central"
          class="label-mono"
        >title: "Buy oat milk" + completed: true</text>
      </ClickGroup>

      <!-- Last-write-wins rule -->
      <ClickGroup :click="4">
        <text
          :x="mergeX + 30" :y="mergeY + 110"
          dominant-baseline="central"
          class="rule-text rule-accent"
        >&#x26A1;  Same field → LAST-WRITE-WINS</text>
      </ClickGroup>

      <!-- Delete wins rule -->
      <ClickGroup :click="5">
        <text
          :x="mergeX + 30" :y="mergeY + 156"
          dominant-baseline="central"
          class="rule-text rule-danger"
        >&#x2717;  Delete vs update → DELETE WINS</text>
        <text
          :x="mergeX + 50" :y="mergeY + 184"
          dominant-baseline="central"
          class="label-mono"
        >Prevents "zombie" records</text>
      </ClickGroup>

    </RoughSvg>
  </div>
</template>

<style scoped>
.crdt-diagram-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.crdt-diagram-wrap :deep(.rough-svg) {
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

.rule-danger {
  fill: rgba(248, 113, 113, 0.9);
}
</style>
