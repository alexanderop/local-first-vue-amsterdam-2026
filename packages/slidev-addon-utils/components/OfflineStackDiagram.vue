<script setup lang="ts">
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'
import ClickGroup from './ClickGroup.vue'

const { roughness = 1.2, seed = 77 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// Layout constants
const W = 520
const H = 460

// Outer "YOUR APP" container
const appX = 40
const appY = 40
const appW = 440
const appH = 280

// Inner boxes
const boxW = 340
const boxH = 52
const boxX = appX + (appW - boxW) / 2

// Vue / Nuxt Components
const vueY = 90

// Data Layer
const dataY = 200

// Service Worker box (below app container)
const swX = appX
const swY = appY + appH + 20
const swW = appW
const swH = 100
</script>

<template>
  <div class="offline-stack-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="12">

      <!-- YOUR APP outer container (dashed) -->
      <ClickGroup :click="1">
        <RoughRect
          :x="appX" :y="appY" :width="appW" :height="appH"
          stroke="rgba(255,255,255,0.25)"
          fill="rgba(255,255,255,0.03)"
          :roughness="roughness * 0.7"
          :seed="seed"
          :stroke-width="1.5"
          stroke-dasharray="8 6"
        />
        <text
          :x="appX + appW / 2" :y="appY + 24"
          text-anchor="middle" dominant-baseline="central"
          class="label-title"
        >YOUR APP</text>
      </ClickGroup>

      <!-- Vue / Nuxt Components box -->
      <ClickGroup :click="2">
        <RoughRect
          :x="boxX" :y="vueY" :width="boxW" :height="boxH"
          variant="default"
          :roughness="roughness"
          :seed="seed + 10"
        />
        <text
          :x="boxX + boxW / 2" :y="vueY + boxH / 2"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >Vue / Nuxt Components</text>
      </ClickGroup>

      <!-- Arrow: Vue → Data Layer -->
      <ClickGroup :click="3">
        <RoughArrow
          :x1="boxX + boxW / 2" :y1="vueY + boxH"
          :x2="boxX + boxW / 2" :y2="dataY"
          stroke="rgba(255, 107, 237, 0.5)"
          :roughness="roughness"
          :seed="seed + 20"
        />
      </ClickGroup>

      <!-- Data Layer box -->
      <ClickGroup :click="3">
        <RoughRect
          :x="boxX" :y="dataY" :width="boxW" :height="boxH + 20"
          variant="accent"
          :roughness="roughness"
          :seed="seed + 30"
        />
        <text
          :x="boxX + boxW / 2" :y="dataY + 18"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >Data Layer</text>
        <text
          :x="boxX + boxW / 2" :y="dataY + 38"
          text-anchor="middle" dominant-baseline="central"
          class="label-sub"
        >IndexedDB / SQLite (WASM)</text>
        <text
          :x="boxX + boxW / 2" :y="dataY + 56"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
        >Dexie, wa-sqlite, ...</text>
      </ClickGroup>

      <!-- Divider line between app and service worker -->
      <ClickGroup :click="4">
        <RoughLine
          :x1="appX" :y1="swY - 10"
          :x2="appX + appW" :y2="swY - 10"
          stroke="rgba(255,255,255,0.15)"
          :stroke-width="1"
          stroke-dasharray="4 4"
          :roughness="roughness * 0.5"
          :seed="seed + 40"
        />
      </ClickGroup>

      <!-- SERVICE WORKER (PWA) box -->
      <ClickGroup :click="4">
        <RoughRect
          :x="swX" :y="swY" :width="swW" :height="swH"
          variant="success"
          :roughness="roughness"
          :seed="seed + 50"
        />
        <text
          :x="swX + swW / 2" :y="swY + 20"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >SERVICE WORKER (PWA)</text>
        <text
          :x="swX + swW / 2" :y="swY + 42"
          text-anchor="middle" dominant-baseline="central"
          class="label-sub"
        >Caches app shell for offline loading</text>
        <text
          :x="swX + swW / 2" :y="swY + 60"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
        >vite-plugin-pwa / @vite-pwa/nuxt</text>
        <text
          :x="swX + swW / 2" :y="swY + 78"
          text-anchor="middle" dominant-baseline="central"
          class="label-mono"
        >Precaches HTML, JS, CSS, WASM</text>
      </ClickGroup>

    </RoughSvg>
  </div>
</template>

<style scoped>
.offline-stack-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.offline-stack-wrap :deep(.rough-svg) {
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

.label-sub {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.6);
}

.label-mono {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}
</style>
