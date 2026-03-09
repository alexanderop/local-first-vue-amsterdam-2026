<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'

const { roughness = 1.2, seed = 800 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// --- Click-driven state ---
const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)

// Click 0: Online, counters at 0
// Click 1: Go offline
// Click 2: Peer A = 1
// Click 3: Peer B = 2
// Click 4: Sync & show results
// Click 5: Both back online, showing merged value

const offline = computed(() => clicks.value >= 1 && clicks.value < 5)
const peerA = computed(() => clicks.value >= 2 ? 1 : 0)
const peerB = computed(() => clicks.value >= 3 ? 2 : 0)
const synced = computed(() => clicks.value >= 4)
const bothOnline = computed(() => clicks.value >= 5)

// --- Computed results ---
const lwwResult = computed(() => Math.max(peerA.value, peerB.value))
const crdtResult = computed(() => peerA.value + peerB.value)
const lwwIsWrong = computed(() => lwwResult.value !== crdtResult.value)

// --- Layout constants ---
const svgW = 700
const svgH = 370

const peerW = 180
const peerH = 160
const peerAx = 30
const peerBx = svgW - peerW - 30
const peerY = 20

const mergeBoxY = peerY + peerH + 60
const mergeBoxW = 260
const mergeBoxH = 90
const mergeBoxX = (svgW - mergeBoxW) / 2
</script>

<template>
  <div class="crdt-counter-demo">
    <!-- Status bar -->
    <div class="controls">
      <div class="step-indicator">
        <span v-if="bothOnline" class="step-label">Both peers online & in sync</span>
        <span v-else-if="!offline" class="step-label">Both peers online</span>
        <span v-else-if="!synced" class="step-label">Peers working offline</span>
        <span v-else class="step-label">Reconnected & merged</span>
      </div>
      <div class="status" :class="offline ? 'status--offline' : 'status--online'">
        {{ offline ? (synced ? 'Synced!' : 'Offline') : (bothOnline ? 'Synced!' : 'Online') }}
      </div>
    </div>

    <RoughSvg :width="svgW" :height="svgH" :roughness="roughness" :seed="seed" :padding="16">
      <!-- ===== PEER A ===== -->
      <RoughRect
        :x="peerAx" :y="peerY" :width="peerW" :height="peerH"
        :variant="offline ? 'accent' : (bothOnline ? 'success' : 'default')"
        :seed="seed + 1"
      />
      <text :x="peerAx + peerW / 2" :y="peerY + 24" class="label-title" text-anchor="middle">PEER A</text>

      <!-- Counter display -->
      <text :x="peerAx + peerW / 2" :y="peerY + 85" class="counter-value" text-anchor="middle">
        {{ bothOnline ? crdtResult : peerA }}
      </text>

      <!-- +1 label when incrementing -->
      <g v-if="clicks === 2" class="fade-in">
        <text :x="peerAx + peerW / 2" :y="peerY + 145" class="inc-label" text-anchor="middle">+1</text>
      </g>

      <!-- Offline indicator -->
      <g v-if="offline" class="fade-in">
        <RoughLine
          :x1="peerAx + peerW + 4" :y1="peerY + peerH / 2 - 10"
          :x2="peerAx + peerW + 20" :y2="peerY + peerH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 10"
        />
        <RoughLine
          :x1="peerAx + peerW + 20" :y1="peerY + peerH / 2 - 10"
          :x2="peerAx + peerW + 4" :y2="peerY + peerH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 11"
        />
      </g>

      <!-- ===== PEER B ===== -->
      <RoughRect
        :x="peerBx" :y="peerY" :width="peerW" :height="peerH"
        :variant="offline ? 'accent' : (bothOnline ? 'success' : 'default')"
        :seed="seed + 2"
      />
      <text :x="peerBx + peerW / 2" :y="peerY + 24" class="label-title" text-anchor="middle">PEER B</text>

      <text :x="peerBx + peerW / 2" :y="peerY + 85" class="counter-value" text-anchor="middle">
        {{ bothOnline ? crdtResult : peerB }}
      </text>

      <!-- +2 label when incrementing -->
      <g v-if="clicks === 3" class="fade-in">
        <text :x="peerBx + peerW / 2" :y="peerY + 145" class="inc-label" text-anchor="middle">+2</text>
      </g>

      <!-- Offline indicator -->
      <g v-if="offline" class="fade-in">
        <RoughLine
          :x1="peerBx - 20" :y1="peerY + peerH / 2 - 10"
          :x2="peerBx - 4" :y2="peerY + peerH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 12"
        />
        <RoughLine
          :x1="peerBx - 4" :y1="peerY + peerH / 2 - 10"
          :x2="peerBx - 20" :y2="peerY + peerH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 13"
        />
      </g>

      <!-- ===== SYNC ARROWS + MERGE BOX ===== -->
      <g v-if="synced" class="fade-in">
        <!-- Arrows from peers to merge box -->
        <RoughArrow
          :x1="peerAx + peerW / 2" :y1="peerY + peerH"
          :x2="mergeBoxX + 40" :y2="mergeBoxY"
          stroke="rgba(255, 107, 237, 0.6)" :seed="seed + 20"
        />
        <RoughArrow
          :x1="peerBx + peerW / 2" :y1="peerY + peerH"
          :x2="mergeBoxX + mergeBoxW - 40" :y2="mergeBoxY"
          stroke="rgba(255, 107, 237, 0.6)" :seed="seed + 21"
        />

        <!-- LWW result (left) -->
        <RoughRect
          :x="mergeBoxX - 170" :y="mergeBoxY" :width="150" :height="mergeBoxH"
          variant="danger"
          :seed="seed + 30"
        />
        <text :x="mergeBoxX - 95" :y="mergeBoxY + 22" class="label-small" text-anchor="middle">Last-Write-Wins</text>
        <text :x="mergeBoxX - 95" :y="mergeBoxY + 55" class="counter-result counter-result--wrong" text-anchor="middle">
          {{ lwwResult }}
        </text>
        <text :x="mergeBoxX - 95" :y="mergeBoxY + 76" class="label-verdict label-verdict--wrong" text-anchor="middle">
          {{ lwwIsWrong ? 'WRONG' : 'Lucky guess' }}
        </text>

        <!-- CRDT result (right) -->
        <RoughRect
          :x="mergeBoxX + mergeBoxW + 20" :y="mergeBoxY" :width="150" :height="mergeBoxH"
          variant="success"
          :seed="seed + 31"
        />
        <text :x="mergeBoxX + mergeBoxW + 95" :y="mergeBoxY + 22" class="label-small" text-anchor="middle">G-Counter CRDT</text>
        <text :x="mergeBoxX + mergeBoxW + 95" :y="mergeBoxY + 55" class="counter-result counter-result--correct" text-anchor="middle">
          {{ crdtResult }}
        </text>
        <text :x="mergeBoxX + mergeBoxW + 95" :y="mergeBoxY + 76" class="label-verdict label-verdict--correct" text-anchor="middle">
          CORRECT
        </text>

        <!-- CRDT merge state (center) -->
        <RoughRect
          :x="mergeBoxX" :y="mergeBoxY" :width="mergeBoxW" :height="mergeBoxH"
          variant="accent"
          :seed="seed + 32"
        />
        <text :x="mergeBoxX + mergeBoxW / 2" :y="mergeBoxY + 22" class="label-small" text-anchor="middle">merge = max per key</text>
        <text :x="mergeBoxX + mergeBoxW / 2" :y="mergeBoxY + 50" class="label-mono-lg" text-anchor="middle">
          { A: {{ peerA }}, B: {{ peerB }} }
        </text>
        <text :x="mergeBoxX + mergeBoxW / 2" :y="mergeBoxY + 72" class="label-mono-lg" text-anchor="middle">
          sum = {{ crdtResult }}
        </text>
      </g>

      <!-- ===== BOTH ONLINE: connection line between peers ===== -->
      <g v-if="bothOnline" class="fade-in">
        <RoughLine
          :x1="peerAx + peerW + 10" :y1="peerY + peerH / 2"
          :x2="peerBx - 10" :y2="peerY + peerH / 2"
          stroke="rgba(52, 211, 153, 0.6)" :stroke-width="2" :seed="seed + 40"
        />
        <text :x="svgW / 2" :y="peerY + peerH / 2 - 12" class="label-synced" text-anchor="middle">
          both = {{ crdtResult }}
        </text>
      </g>

      <!-- ===== HINT TEXT ===== -->
      <foreignObject v-if="!offline && !bothOnline" :x="svgW / 2 - 140" :y="peerY + peerH + 20" width="280" height="40">
        <div class="hint">Press next to go offline</div>
      </foreignObject>
      <foreignObject v-else-if="!synced && peerA === 0 && peerB === 0" :x="svgW / 2 - 160" :y="peerY + peerH + 20" width="320" height="40">
        <div class="hint">Peers are offline - press next</div>
      </foreignObject>
      <foreignObject v-else-if="!synced" :x="svgW / 2 - 160" :y="peerY + peerH + 20" width="320" height="40">
        <div class="hint">Press next to continue</div>
      </foreignObject>
    </RoughSvg>
  </div>
</template>

<style scoped>
.crdt-counter-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ---- Controls bar ---- */
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-label {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(234, 237, 243, 0.7);
}

.status {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
}

.status--online {
  color: rgba(52, 211, 153, 0.9);
  background: rgba(52, 211, 153, 0.1);
}

.status--offline {
  color: rgba(248, 113, 113, 0.9);
  background: rgba(248, 113, 113, 0.1);
}

/* ---- SVG text ---- */
.label-title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.label-small {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  fill: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.05em;
}

.label-mono-lg {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.9);
}

.counter-value {
  font-family: 'Geist Mono', monospace;
  font-size: 42px;
  font-weight: 700;
  fill: rgba(255, 107, 237, 0.95);
}

.counter-result {
  font-family: 'Geist Mono', monospace;
  font-size: 28px;
  font-weight: 700;
}

.counter-result--wrong {
  fill: rgba(248, 113, 113, 0.95);
}

.counter-result--correct {
  fill: rgba(52, 211, 153, 0.95);
}

.label-verdict {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.label-verdict--wrong {
  fill: rgba(248, 113, 113, 0.7);
}

.label-verdict--correct {
  fill: rgba(52, 211, 153, 0.7);
}

/* ---- Synced label ---- */
.label-synced {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  fill: rgba(52, 211, 153, 0.9);
  letter-spacing: 0.05em;
}

/* ---- Increment label ---- */
.inc-label {
  font-family: 'Geist Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  fill: rgba(255, 107, 237, 0.8);
}

/* ---- Hint ---- */
.hint {
  text-align: center;
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
}

/* ---- Animations ---- */
.fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
