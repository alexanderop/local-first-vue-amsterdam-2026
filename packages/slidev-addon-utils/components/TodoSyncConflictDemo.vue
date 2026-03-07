<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import RoughSvg from './RoughSvg.vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'

const { roughness = 1.2, seed = 900 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// --- Click-driven state ---
const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)

// Click 0: Both online, "Buy milk", sync line
// Click 1: Offline, X marks
// Click 2: Device A → "Buy oat milk"
// Click 3: Device B → "Buy almond milk"
// Click 4: Reconnect, conflict box with arrows
// Click 5: Tagline appears

const offline = computed(() => clicks.value >= 1)
const deviceAEdited = computed(() => clicks.value >= 2)
const deviceBEdited = computed(() => clicks.value >= 3)
const conflict = computed(() => clicks.value >= 4)
const tagline = computed(() => clicks.value >= 5)

const todoA = computed(() => deviceAEdited.value ? 'Buy oat milk' : 'Buy milk')
const todoB = computed(() => deviceBEdited.value ? 'Buy almond milk' : 'Buy milk')

// --- Layout constants ---
const svgW = 700
const svgH = 420

const devW = 220
const devH = 145
const devAx = 30
const devBx = svgW - devW - 30
const devY = 20

// Todo card inside device
const cardW = 190
const cardH = 60
const cardOffX = (devW - cardW) / 2
const cardY = devY + 55

// Conflict box
const conflictW = 260
const conflictH = 90
const conflictX = (svgW - conflictW) / 2
const conflictY = devY + devH + 40

// Checkbox
const cbSize = 14
const cbY = cardY + (cardH - cbSize) / 2
</script>

<template>
  <div class="todo-sync-demo">
    <!-- Status bar -->
    <div class="controls">
      <div class="step-indicator">
        <span v-if="!offline" class="step-label">Both devices in sync</span>
        <span v-else-if="!conflict" class="step-label">Devices working offline</span>
        <span v-else class="step-label">Reconnected</span>
      </div>
      <div
        class="status"
        :class="conflict ? 'status--conflict' : offline ? 'status--offline' : 'status--online'"
      >
        {{ conflict ? 'Conflict!' : offline ? 'Offline' : 'Online' }}
      </div>
    </div>

    <RoughSvg :width="svgW" :height="svgH" :roughness="roughness" :seed="seed" :padding="16">
      <!-- ===== DEVICE A ===== -->
      <RoughRect
        :x="devAx" :y="devY" :width="devW" :height="devH"
        :variant="offline ? 'accent' : 'default'"
        :seed="seed + 1"
      />
      <text :x="devAx + devW / 2" :y="devY + 24" class="label-title" text-anchor="middle">DEVICE A</text>

      <!-- Todo card A -->
      <RoughRect
        :x="devAx + cardOffX" :y="cardY" :width="cardW" :height="cardH"
        variant="muted"
        :seed="seed + 3"
      />
      <!-- Checkbox -->
      <RoughRect
        :x="devAx + cardOffX + 12" :y="cbY" :width="cbSize" :height="cbSize"
        variant="muted"
        :seed="seed + 5"
      />
      <!-- Todo text -->
      <text :x="devAx + cardOffX + 36" :y="cbY + 11" class="todo-text">
        {{ todoA }}
      </text>

      <!-- "edited!" flash -->
      <g v-if="clicks === 2" class="fade-in">
        <text :x="devAx + devW / 2" :y="devY + devH - 14" class="edit-label" text-anchor="middle">edited!</text>
      </g>

      <!-- Offline X marks -->
      <g v-if="offline && !conflict" class="fade-in">
        <RoughLine
          :x1="devAx + devW + 4" :y1="devY + devH / 2 - 10"
          :x2="devAx + devW + 20" :y2="devY + devH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 10"
        />
        <RoughLine
          :x1="devAx + devW + 20" :y1="devY + devH / 2 - 10"
          :x2="devAx + devW + 4" :y2="devY + devH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 11"
        />
      </g>

      <!-- ===== DEVICE B ===== -->
      <RoughRect
        :x="devBx" :y="devY" :width="devW" :height="devH"
        :variant="offline ? 'accent' : 'default'"
        :seed="seed + 2"
      />
      <text :x="devBx + devW / 2" :y="devY + 24" class="label-title" text-anchor="middle">DEVICE B</text>

      <!-- Todo card B -->
      <RoughRect
        :x="devBx + cardOffX" :y="cardY" :width="cardW" :height="cardH"
        variant="muted"
        :seed="seed + 4"
      />
      <!-- Checkbox -->
      <RoughRect
        :x="devBx + cardOffX + 12" :y="cbY" :width="cbSize" :height="cbSize"
        variant="muted"
        :seed="seed + 6"
      />
      <!-- Todo text -->
      <text :x="devBx + cardOffX + 36" :y="cbY + 11" class="todo-text">
        {{ todoB }}
      </text>

      <!-- "edited!" flash -->
      <g v-if="clicks === 3" class="fade-in">
        <text :x="devBx + devW / 2" :y="devY + devH - 14" class="edit-label" text-anchor="middle">edited!</text>
      </g>

      <!-- Offline X marks -->
      <g v-if="offline && !conflict" class="fade-in">
        <RoughLine
          :x1="devBx - 20" :y1="devY + devH / 2 - 10"
          :x2="devBx - 4" :y2="devY + devH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 12"
        />
        <RoughLine
          :x1="devBx - 4" :y1="devY + devH / 2 - 10"
          :x2="devBx - 20" :y2="devY + devH / 2 + 10"
          stroke="rgba(248, 113, 113, 0.7)" :stroke-width="2" :seed="seed + 13"
        />
      </g>

      <!-- ===== SYNC LINE (online) ===== -->
      <g v-if="!offline" class="fade-in">
        <RoughLine
          :x1="devAx + devW + 8" :y1="devY + devH / 2"
          :x2="devBx - 8" :y2="devY + devH / 2"
          stroke="rgba(52, 211, 153, 0.5)" :stroke-width="2"
          stroke-dasharray="6 4"
          :seed="seed + 20"
        />
        <text :x="svgW / 2" :y="devY + devH / 2 - 10" class="label-small" text-anchor="middle">synced</text>
      </g>

      <!-- ===== CONFLICT BOX + ARROWS ===== -->
      <g v-if="conflict" class="fade-in">
        <!-- Arrows from devices to conflict box -->
        <RoughArrow
          :x1="devAx + devW / 2" :y1="devY + devH"
          :x2="conflictX + 40" :y2="conflictY"
          stroke="rgba(255, 107, 237, 0.6)" :seed="seed + 30"
        />
        <RoughArrow
          :x1="devBx + devW / 2" :y1="devY + devH"
          :x2="conflictX + conflictW - 40" :y2="conflictY"
          stroke="rgba(255, 107, 237, 0.6)" :seed="seed + 31"
        />

        <!-- Conflict box -->
        <RoughRect
          :x="conflictX" :y="conflictY" :width="conflictW" :height="conflictH"
          variant="danger"
          :seed="seed + 32"
        />
        <text :x="conflictX + conflictW / 2" :y="conflictY + 28" class="conflict-question" text-anchor="middle">???</text>
        <text :x="conflictX + conflictW / 2" :y="conflictY + 52" class="label-conflict-item" text-anchor="middle">
          "Buy oat milk"
        </text>
        <text :x="conflictX + conflictW / 2" :y="conflictY + 72" class="label-conflict-item" text-anchor="middle">
          "Buy almond milk"
        </text>
      </g>

      <!-- ===== TAGLINE ===== -->
      <foreignObject v-if="tagline" :x="svgW / 2 - 220" :y="conflictY + conflictH + 12" width="440" height="50">
        <div class="tagline fade-in">
          This is a <strong>distributed systems</strong> problem. It needs a <strong>sync engine</strong>.
        </div>
      </foreignObject>

      <!-- ===== HINT TEXT ===== -->
      <foreignObject v-if="!offline" :x="svgW / 2 - 140" :y="devY + devH + 20" width="280" height="40">
        <div class="hint">Press next to go offline</div>
      </foreignObject>
      <foreignObject v-else-if="!conflict" :x="svgW / 2 - 160" :y="devY + devH + 20" width="320" height="40">
        <div class="hint">Press next to continue</div>
      </foreignObject>
    </RoughSvg>
  </div>
</template>

<style scoped>
.todo-sync-demo {
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

.status--conflict {
  color: rgba(248, 113, 113, 0.95);
  background: rgba(248, 113, 113, 0.15);
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
  fill: rgba(52, 211, 153, 0.6);
  letter-spacing: 0.05em;
}

.todo-text {
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  fill: rgba(234, 237, 243, 0.9);
}

.edit-label {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  fill: rgba(255, 107, 237, 0.8);
}

.conflict-question {
  font-family: 'Geist Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  fill: rgba(248, 113, 113, 0.95);
}

.label-conflict-item {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  fill: rgba(234, 237, 243, 0.7);
}

/* ---- Tagline ---- */
.tagline {
  text-align: center;
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  color: rgba(234, 237, 243, 0.8);
  line-height: 1.5;
}

.tagline strong {
  color: rgba(255, 107, 237, 0.95);
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
