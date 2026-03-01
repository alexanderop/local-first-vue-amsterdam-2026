<script setup lang="ts">
import { computed } from 'vue'
import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughPath from './RoughPath.vue'
import RoughArrow from './RoughArrow.vue'
import { EDGE_STROKE } from '../constants/colors'
import type { Variant } from '../constants/colors'

interface ClientLayer {
  label: string
  variant?: Variant
}

interface ClientConfig {
  title: string
  layers: ClientLayer[]
}

const {
  clients,
  serverLabel,
  connectionLabel,
  serverDbLabel,
  databaseLabel,
  caption,
  roughness = 1.2,
  seed = 42,
} = defineProps<{
  clients: [ClientConfig, ClientConfig]
  serverLabel: string
  connectionLabel: string
  serverDbLabel: string
  databaseLabel: string
  caption?: string
  roughness?: number
  seed?: number
}>()

const gen: RoughGenerator = rough.generator()

// ─── Layout constants ──────────────────────────────
const layerH = 36
const layerW = 140
const layerGap = 26
const titleSpace = 28
const clientPadX = 10
const clientPadY = 10
const clientOuterW = layerW + clientPadX * 2

const clientX = 30
const clientGap = 36
const clientAY = 20

const serverW = 120
const serverH = 80
const arrowSpace = 130
const serverX = clientX + clientOuterW + arrowSpace

const dbW = 120
const dbH = 80
const dbGap = 70
const dbX = serverX + serverW + dbGap

// ─── Derived layout ────────────────────────────────
function getClientOuterH(layerCount: number) {
  return titleSpace + layerCount * layerH + Math.max(0, layerCount - 1) * layerGap + clientPadY * 2
}

const clientAH = computed(() => getClientOuterH(clients[0].layers.length))
const clientBH = computed(() => getClientOuterH(clients[1].layers.length))
const clientBY = computed(() => clientAY + clientAH.value + clientGap)

const centerY = computed(() => {
  const top = clientAY
  const bottom = clientBY.value + clientBH.value
  return top + (bottom - top) / 2
})

const serverY = computed(() => centerY.value - serverH / 2)
const dbY = computed(() => centerY.value - dbH / 2)

const W = dbX + dbW + 30
const H = computed(() => clientBY.value + clientBH.value + (caption ? 50 : 20))

// ─── Layer positioning ─────────────────────────────
function getLayerY(clientY: number, index: number) {
  return clientY + titleSpace + clientPadY + index * (layerH + layerGap)
}

// ─── Curved arrows (client ↔ server) ───────────────
function buildCurve(clientY: number, clientH: number, curveDir: number) {
  const startX = clientX + clientOuterW
  const startY = clientY + clientH / 2
  const endX = serverX
  const endY = serverY.value + serverH / 2

  const dx = endX - startX
  const cp1x = startX + dx * 0.35
  const cp1y = startY + curveDir * 25
  const cp2x = startX + dx * 0.65
  const cp2y = endY + curveDir * 15

  const d = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`

  // Bezier midpoint at t=0.5: B(0.5) = (P0 + 3·P1 + 3·P2 + P3) / 8
  const midX = (startX + 3 * cp1x + 3 * cp2x + endX) / 8
  const midY = (startY + 3 * cp1y + 3 * cp2y + endY) / 8

  return { d, startX, startY, endX, endY, cp1x, cp1y, cp2x, cp2y, midX, midY }
}

const curveA = computed(() => buildCurve(clientAY, clientAH.value, -1))
const curveB = computed(() => buildCurve(clientBY.value, clientBH.value, 1))

// ─── Arrowheads for curved arrows ──────────────────
interface PathInfo {
  d: string
  stroke?: string
  strokeWidth?: number
  fill?: string
}

const arrowheadPaths = computed(() => {
  const headRoughness = roughness * 0.3
  const aLen = 10
  const aWidth = aLen * 0.6
  const color = EDGE_STROKE
  const result: PathInfo[] = []

  const curves = [
    { curve: curveA.value, seedOff: 100 },
    { curve: curveB.value, seedOff: 200 },
  ]

  for (const { curve, seedOff } of curves) {
    // End arrowhead (at server)
    const etx = curve.endX - curve.cp2x
    const ety = curve.endY - curve.cp2y
    const eLen = Math.sqrt(etx * etx + ety * ety)
    if (eLen > 0) {
      const ux = etx / eLen
      const uy = ety / eLen
      const px = -uy
      const py = ux
      const a1 = gen.line(
        curve.endX, curve.endY,
        curve.endX - ux * aLen + px * aWidth,
        curve.endY - uy * aLen + py * aWidth,
        { roughness: headRoughness, seed: seed + seedOff + 1, stroke: color, strokeWidth: 2 },
      )
      const a2 = gen.line(
        curve.endX, curve.endY,
        curve.endX - ux * aLen - px * aWidth,
        curve.endY - uy * aLen - py * aWidth,
        { roughness: headRoughness, seed: seed + seedOff + 2, stroke: color, strokeWidth: 2 },
      )
      result.push(...gen.toPaths(a1) as PathInfo[], ...gen.toPaths(a2) as PathInfo[])
    }

    // Start arrowhead (at client)
    const stx = curve.cp1x - curve.startX
    const sty = curve.cp1y - curve.startY
    const sLen = Math.sqrt(stx * stx + sty * sty)
    if (sLen > 0) {
      const ux = stx / sLen
      const uy = sty / sLen
      const px = -uy
      const py = ux
      const a1 = gen.line(
        curve.startX, curve.startY,
        curve.startX + ux * aLen + px * aWidth,
        curve.startY + uy * aLen + py * aWidth,
        { roughness: headRoughness, seed: seed + seedOff + 3, stroke: color, strokeWidth: 2 },
      )
      const a2 = gen.line(
        curve.startX, curve.startY,
        curve.startX + ux * aLen - px * aWidth,
        curve.startY + uy * aLen - py * aWidth,
        { roughness: headRoughness, seed: seed + seedOff + 4, stroke: color, strokeWidth: 2 },
      )
      result.push(...gen.toPaths(a1) as PathInfo[], ...gen.toPaths(a2) as PathInfo[])
    }
  }

  return result
})
</script>

<template>
  <div class="client-server-wrap">
    <RoughSvg :width="W" :height="H" :roughness="roughness" :seed="seed" :padding="12">

      <!-- ═══ Client A ═══ -->
      <RoughRect
        :x="clientX" :y="clientAY" :width="clientOuterW" :height="clientAH"
        stroke="rgba(255,255,255,0.25)" fill="rgba(255,255,255,0.03)"
        :roughness="roughness * 0.7" :seed="seed + 10"
        :stroke-width="1.5" stroke-dasharray="8 6"
      />
      <text
        :x="clientX + clientOuterW / 2" :y="clientAY + 16"
        text-anchor="middle" dominant-baseline="central"
        class="label-title"
      >{{ clients[0].title }}</text>

      <template v-for="(layer, i) in clients[0].layers" :key="'a-' + i">
        <RoughRect
          :x="clientX + clientPadX" :y="getLayerY(clientAY, i)"
          :width="layerW" :height="layerH"
          :variant="layer.variant" :seed="seed + 20 + i * 10"
        />
        <text
          :x="clientX + clientOuterW / 2" :y="getLayerY(clientAY, i) + layerH / 2"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >{{ layer.label }}</text>
      </template>

      <template v-for="i in clients[0].layers.length - 1" :key="'a-arr-' + i">
        <RoughArrow
          :x1="clientX + clientOuterW / 2" :y1="getLayerY(clientAY, i - 1) + layerH"
          :x2="clientX + clientOuterW / 2" :y2="getLayerY(clientAY, i)"
          :start-arrow="true" :end-arrow="true"
          :arrow-size="6" :stroke-width="1.5"
          :seed="seed + 50 + i"
        />
      </template>

      <!-- ═══ Client B ═══ -->
      <RoughRect
        :x="clientX" :y="clientBY" :width="clientOuterW" :height="clientBH"
        stroke="rgba(255,255,255,0.25)" fill="rgba(255,255,255,0.03)"
        :roughness="roughness * 0.7" :seed="seed + 60"
        :stroke-width="1.5" stroke-dasharray="8 6"
      />
      <text
        :x="clientX + clientOuterW / 2" :y="clientBY + 16"
        text-anchor="middle" dominant-baseline="central"
        class="label-title"
      >{{ clients[1].title }}</text>

      <template v-for="(layer, i) in clients[1].layers" :key="'b-' + i">
        <RoughRect
          :x="clientX + clientPadX" :y="getLayerY(clientBY, i)"
          :width="layerW" :height="layerH"
          :variant="layer.variant" :seed="seed + 70 + i * 10"
        />
        <text
          :x="clientX + clientOuterW / 2" :y="getLayerY(clientBY, i) + layerH / 2"
          text-anchor="middle" dominant-baseline="central"
          class="label-box"
        >{{ layer.label }}</text>
      </template>

      <template v-for="i in clients[1].layers.length - 1" :key="'b-arr-' + i">
        <RoughArrow
          :x1="clientX + clientOuterW / 2" :y1="getLayerY(clientBY, i - 1) + layerH"
          :x2="clientX + clientOuterW / 2" :y2="getLayerY(clientBY, i)"
          :start-arrow="true" :end-arrow="true"
          :arrow-size="6" :stroke-width="1.5"
          :seed="seed + 80 + i"
        />
      </template>

      <!-- ═══ Curved arrows (Client ↔ Server) ═══ -->
      <RoughPath :d="curveA.d" :seed="seed + 90" :stroke-width="2" :stroke="EDGE_STROKE" />
      <RoughPath :d="curveB.d" :seed="seed + 91" :stroke-width="2" :stroke="EDGE_STROKE" />

      <path
        v-for="(p, i) in arrowheadPaths" :key="'ah-' + i"
        :d="p.d" :stroke="p.stroke || 'none'" :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
      />

      <text
        :x="curveA.midX" :y="curveA.midY - 8"
        text-anchor="middle" dominant-baseline="central"
        class="label-edge"
      >{{ connectionLabel }}</text>
      <text
        :x="curveB.midX" :y="curveB.midY + 12"
        text-anchor="middle" dominant-baseline="central"
        class="label-edge"
      >{{ connectionLabel }}</text>

      <!-- ═══ Server ═══ -->
      <RoughRect
        :x="serverX" :y="serverY" :width="serverW" :height="serverH"
        variant="default" :seed="seed + 95"
      />
      <text
        :x="serverX + serverW / 2" :y="serverY + serverH / 2"
        text-anchor="middle" dominant-baseline="central"
        class="label-box"
      >{{ serverLabel }}</text>

      <!-- ═══ Server ↔ Database arrow ═══ -->
      <RoughArrow
        :x1="serverX + serverW" :y1="centerY"
        :x2="dbX" :y2="centerY"
        :start-arrow="true" :end-arrow="true"
        :seed="seed + 96"
      />
      <text
        :x="(serverX + serverW + dbX) / 2" :y="centerY - 10"
        text-anchor="middle" dominant-baseline="central"
        class="label-edge"
      >{{ serverDbLabel }}</text>

      <!-- ═══ Database ═══ -->
      <RoughRect
        :x="dbX" :y="dbY" :width="dbW" :height="dbH"
        variant="default" :seed="seed + 97"
      />
      <text
        :x="dbX + dbW / 2" :y="dbY + dbH / 2"
        text-anchor="middle" dominant-baseline="central"
        class="label-box"
      >{{ databaseLabel }}</text>

      <!-- ═══ Caption ═══ -->
      <text
        v-if="caption"
        :x="W / 2" :y="H - 10"
        text-anchor="middle" dominant-baseline="central"
        class="label-caption"
      >{{ caption }}</text>

    </RoughSvg>
  </div>
</template>

<style scoped>
.client-server-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.client-server-wrap :deep(.rough-svg) {
  width: 100%;
  max-height: 100%;
  height: auto;
}

.label-title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.label-box {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.label-edge {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}

.label-caption {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-style: italic;
  fill: rgba(255, 255, 255, 0.5);
}
</style>
