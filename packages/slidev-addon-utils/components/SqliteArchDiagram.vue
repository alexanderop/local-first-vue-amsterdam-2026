<script setup lang="ts">
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughPath from './RoughPath.vue'
import RoughCircle from './RoughCircle.vue'
import RoughLine from './RoughLine.vue'
import ClickGroup from './ClickGroup.vue'

const { roughness = 1.2, seed = 88 } = defineProps<{
  roughness?: number
  seed?: number
}>()

const W = 660
const H = 510

const boxW = 280
const boxH = 56
const boxX = 200

const iconCx = 120

const vueY = 20
const workerY = 140
const sqliteY = 260
const opfsY = 390

const arrowGap = 6

const annoX = boxX + boxW + 25
const annoY = sqliteY + 5
const annoW = 155
const annoH = 85
</script>

<template>
  <div class="sqlite-arch-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="12">

      <!-- ═══ VUE APP ═══ -->
      <ClickGroup :click="1">
        <!-- Icon: Monitor with Vue "V" -->
        <g :transform="`translate(${iconCx}, ${vueY + boxH / 2})`">
          <!-- Screen -->
          <RoughRect :x="-22" :y="-17" :width="44" :height="30"
            stroke="rgba(255,107,237,0.55)" fill="rgba(52,63,96,0.25)"
            :roughness="roughness" :seed="seed + 100" :stroke-width="1.5" />
          <!-- Stand post -->
          <RoughLine :x1="0" :y1="13" :x2="0" :y2="19"
            stroke="rgba(255,107,237,0.45)" :roughness="roughness * 0.6" :seed="seed + 101" :stroke-width="1.5" />
          <!-- Stand base -->
          <RoughLine :x1="-10" :y1="19" :x2="10" :y2="19"
            stroke="rgba(255,107,237,0.45)" :roughness="roughness * 0.6" :seed="seed + 102" :stroke-width="1.5" />
          <!-- "V" for Vue -->
          <RoughLine :x1="-9" :y1="-10" :x2="0" :y2="5"
            stroke="rgba(52,211,153,0.65)" :roughness="roughness * 0.7" :seed="seed + 103" :stroke-width="1.8" />
          <RoughLine :x1="0" :y1="5" :x2="9" :y2="-10"
            stroke="rgba(52,211,153,0.65)" :roughness="roughness * 0.7" :seed="seed + 104" :stroke-width="1.8" />
        </g>

        <!-- Box -->
        <RoughRect :x="boxX" :y="vueY" :width="boxW" :height="boxH"
          variant="default" :roughness="roughness" :seed="seed" />
        <text :x="boxX + boxW / 2" :y="vueY + 22"
          text-anchor="middle" dominant-baseline="central" class="label-box">Vue App</text>
        <text :x="boxX + boxW / 2" :y="vueY + 42"
          text-anchor="middle" dominant-baseline="central" class="label-sub">Your Components + Composables</text>
      </ClickGroup>

      <!-- Arrow: Vue App → Web Worker -->
      <ClickGroup :click="2">
        <RoughArrow
          :x1="boxX + boxW / 2" :y1="vueY + boxH + arrowGap"
          :x2="boxX + boxW / 2" :y2="workerY - arrowGap"
          stroke="rgba(255,107,237,0.5)" :roughness="roughness" :seed="seed + 10" />
      </ClickGroup>

      <!-- ═══ WEB WORKER ═══ -->
      <ClickGroup :click="2">
        <!-- Icon: Gear / cog -->
        <g :transform="`translate(${iconCx}, ${workerY + boxH / 2})`">
          <!-- Gear body (irregular octagon) -->
          <RoughPath d="M -5,-18 L 5,-18 L 14,-10 L 18,-2 L 18,5 L 12,14 L 5,18 L -5,18 L -14,10 L -18,2 L -18,-5 L -12,-14 Z"
            stroke="rgba(255,107,237,0.55)" fill="rgba(255,107,237,0.08)"
            :roughness="roughness" :seed="seed + 110" :stroke-width="1.5" />
          <!-- Center hole -->
          <RoughCircle :x="0" :y="0" :diameter="10"
            stroke="rgba(255,107,237,0.45)" fill="rgba(255,107,237,0.15)"
            :roughness="roughness * 0.5" :seed="seed + 111" :stroke-width="1.2" />
        </g>

        <!-- Box -->
        <RoughRect :x="boxX" :y="workerY" :width="boxW" :height="boxH"
          variant="accent" :roughness="roughness" :seed="seed + 20" />
        <text :x="boxX + boxW / 2" :y="workerY + 22"
          text-anchor="middle" dominant-baseline="central" class="label-box">Web Worker</text>
        <text :x="boxX + boxW / 2" :y="workerY + 42"
          text-anchor="middle" dominant-baseline="central" class="label-sub">Runs SQLite off main thread</text>
      </ClickGroup>

      <!-- Arrow: Web Worker → SQLite WASM -->
      <ClickGroup :click="3">
        <RoughArrow
          :x1="boxX + boxW / 2" :y1="workerY + boxH + arrowGap"
          :x2="boxX + boxW / 2" :y2="sqliteY - arrowGap"
          stroke="rgba(255,107,237,0.5)" :roughness="roughness" :seed="seed + 30" />
      </ClickGroup>

      <!-- ═══ SQLITE WASM ═══ -->
      <ClickGroup :click="3">
        <!-- Icon: Database cylinder -->
        <g :transform="`translate(${iconCx}, ${sqliteY + (boxH + 20) / 2})`">
          <!-- Cylinder body (closed shape) -->
          <RoughPath d="M -16,-12 C -16,-19 16,-19 16,-12 L 16,12 C 16,19 -16,19 -16,12 Z"
            stroke="rgba(255,107,237,0.55)" fill="rgba(255,107,237,0.08)"
            :roughness="roughness * 0.8" :seed="seed + 120" :stroke-width="1.5" />
          <!-- Top cap overlay -->
          <RoughPath d="M -16,-12 C -16,-19 16,-19 16,-12 C 16,-5 -16,-5 -16,-12"
            stroke="rgba(255,107,237,0.55)" fill="rgba(255,107,237,0.12)"
            :roughness="roughness * 0.8" :seed="seed + 121" :stroke-width="1.5" />
          <!-- Middle shelf line -->
          <RoughPath d="M -16,2 C -16,7 16,7 16,2"
            stroke="rgba(255,107,237,0.3)"
            :roughness="roughness * 0.6" :seed="seed + 122" :stroke-width="1" />
        </g>

        <!-- Box (taller) -->
        <RoughRect :x="boxX" :y="sqliteY" :width="boxW" :height="boxH + 20"
          variant="accent" :roughness="roughness" :seed="seed + 40" />
        <text :x="boxX + boxW / 2" :y="sqliteY + 20"
          text-anchor="middle" dominant-baseline="central" class="label-box">SQLite WASM</text>
        <text :x="boxX + boxW / 2" :y="sqliteY + 40"
          text-anchor="middle" dominant-baseline="central" class="label-sub">Full SQL engine (~900KB)</text>
        <text :x="boxX + boxW / 2" :y="sqliteY + 58"
          text-anchor="middle" dominant-baseline="central" class="label-mono">Compiled from C via Emscripten</text>
      </ClickGroup>

      <!-- Cross-Origin Isolation annotation -->
      <ClickGroup :click="3">
        <!-- Lock icon above annotation box -->
        <g :transform="`translate(${annoX + annoW / 2}, ${annoY - 14})`">
          <!-- Lock body -->
          <RoughRect :x="-10" :y="-2" :width="20" :height="14"
            stroke="rgba(255,200,50,0.5)" fill="rgba(255,200,50,0.06)"
            :roughness="roughness * 0.7" :seed="seed + 130" :stroke-width="1.3" />
          <!-- Shackle arc -->
          <RoughPath d="M -5,-2 C -5,-12 5,-12 5,-2"
            stroke="rgba(255,200,50,0.5)"
            :roughness="roughness * 0.5" :seed="seed + 131" :stroke-width="1.3" />
        </g>

        <RoughRect :x="annoX" :y="annoY" :width="annoW" :height="annoH"
          stroke="rgba(255,200,50,0.5)" fill="rgba(255,200,50,0.05)"
          :roughness="roughness * 0.8" :seed="seed + 45" :stroke-width="1.5"
          stroke-dasharray="6 4" />
        <text :x="annoX + annoW / 2" :y="annoY + 20"
          text-anchor="middle" dominant-baseline="central" class="label-anno">Cross-Origin</text>
        <text :x="annoX + annoW / 2" :y="annoY + 38"
          text-anchor="middle" dominant-baseline="central" class="label-anno">Isolation Required</text>
        <text :x="annoX + annoW / 2" :y="annoY + 60"
          text-anchor="middle" dominant-baseline="central" class="label-mono">COOP / COEP headers</text>
      </ClickGroup>

      <!-- Arrow: SQLite WASM → OPFS -->
      <ClickGroup :click="4">
        <RoughArrow
          :x1="boxX + boxW / 2" :y1="sqliteY + boxH + 20 + arrowGap"
          :x2="boxX + boxW / 2" :y2="opfsY - arrowGap"
          stroke="rgba(255,107,237,0.5)" :roughness="roughness" :seed="seed + 50" />
      </ClickGroup>

      <!-- ═══ OPFS ═══ -->
      <ClickGroup :click="4">
        <!-- Icon: Folder -->
        <g :transform="`translate(${iconCx}, ${opfsY + (boxH + 20) / 2})`">
          <RoughPath d="M -20,-14 L -6,-14 L -2,-4 L 20,-4 L 20,16 L -20,16 Z"
            stroke="rgba(52,211,153,0.6)" fill="rgba(52,211,153,0.08)"
            :roughness="roughness" :seed="seed + 140" :stroke-width="1.5" />
        </g>

        <!-- Box (taller) -->
        <RoughRect :x="boxX" :y="opfsY" :width="boxW" :height="boxH + 20"
          variant="success" :roughness="roughness" :seed="seed + 60" />
        <text :x="boxX + boxW / 2" :y="opfsY + 20"
          text-anchor="middle" dominant-baseline="central" class="label-box">OPFS</text>
        <text :x="boxX + boxW / 2" :y="opfsY + 40"
          text-anchor="middle" dominant-baseline="central" class="label-sub">Origin Private File System</text>
        <text :x="boxX + boxW / 2" :y="opfsY + 58"
          text-anchor="middle" dominant-baseline="central" class="label-mono">Persistent, synchronous I/O</text>
      </ClickGroup>

    </RoughSvg>
  </div>
</template>

<style scoped>
.sqlite-arch-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.sqlite-arch-wrap :deep(.rough-svg) {
  width: 100%;
  max-height: 100%;
  height: auto;
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

.label-anno {
  font-family: 'Geist', sans-serif;
  font-size: 12px;
  font-weight: 600;
  fill: rgba(255, 200, 50, 0.8);
}
</style>
