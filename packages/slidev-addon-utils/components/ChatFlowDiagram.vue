<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import RoughLine from './RoughLine.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { EDGE_STROKE } from '../constants/colors'

const roughness = 1.5
const seed = 77
const nodeW = 150
const nodeH = 60
const padding = 24

const canvasW = 720
const canvasH = 340

const { isVisible } = useClickVisibility()

// Node positions
const userA = { x: 0, y: 10 }
const chatCreate = { x: 230, y: 10 }
const chatRoute = { x: 480, y: 10 }
const coValue = { x: 480, y: 200 }
const userB = { x: 0, y: 270 }

// Arrow endpoints
const arrows = computed(() => ({
  // User A → Chat.create (right side of A to left side of create)
  aToCreate: {
    x1: userA.x + nodeW, y1: userA.y + nodeH / 2,
    x2: chatCreate.x, y2: chatCreate.y + nodeH / 2,
  },
  // Chat.create → /chat/co_z... (right side of create to left side of route)
  createToRoute: {
    x1: chatCreate.x + nodeW, y1: chatCreate.y + nodeH / 2,
    x2: chatRoute.x, y2: chatRoute.y + nodeH / 2,
  },
  // /chat/co_z... → CoValue (bottom of route to top of coValue) — dashed
  routeToCoValue: {
    x1: chatRoute.x + nodeW / 2, y1: chatRoute.y + nodeH,
    x2: coValue.x + nodeW / 2, y2: coValue.y,
  },
  // User B → CoValue (right side of B to left side of coValue)
  bToCoValue: {
    x1: userB.x + nodeW, y1: userB.y + nodeH / 2,
    x2: coValue.x, y2: coValue.y + nodeH / 2,
  },
  // Bidirectional sync: User A route → CoValue (already covered by routeToCoValue)
  // Sync arrows from route box down-right and from userB right
  syncUp: {
    x1: coValue.x + nodeW / 2 + 20, y1: coValue.y,
    x2: chatRoute.x + nodeW / 2 + 20, y2: chatRoute.y + nodeH,
  },
  syncLeft: {
    x1: coValue.x, y1: coValue.y + nodeH / 2 + 10,
    x2: userB.x + nodeW, y2: userB.y + nodeH / 2 + 10,
  },
}))

const svgW = computed(() => canvasW + padding * 2)
const svgH = computed(() => canvasH + padding * 2)
const viewBox = computed(() => `${-padding} ${-padding} ${svgW.value} ${svgH.value}`)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="chat-flow"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Click 0: User A (always visible) -->
    <g class="chat-flow__el">
      <RoughRect :x="userA.x" :y="userA.y" :width="nodeW" :height="nodeH" variant="muted" :roughness="roughness" :seed="seed" />
      <text :x="userA.x + nodeW / 2" :y="userA.y + nodeH / 2" dominant-baseline="central" text-anchor="middle" class="chat-flow__label">User A</text>
    </g>

    <!-- Click 1: Chat.create box + arrow from User A -->
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(1) }">
      <RoughArrow v-bind="arrows.aToCreate" :stroke="EDGE_STROKE" :roughness="roughness" :seed="seed + 10" />
    </g>
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(1) }">
      <RoughRect :x="chatCreate.x" :y="chatCreate.y" :width="nodeW" :height="nodeH" variant="accent" :roughness="roughness" :seed="seed + 1" />
      <text :x="chatCreate.x + nodeW / 2" :y="chatCreate.y + nodeH / 2 - 6" dominant-baseline="central" text-anchor="middle" class="chat-flow__label">Chat.create([])</text>
      <text :x="chatCreate.x + nodeW / 2" :y="chatCreate.y + nodeH / 2 + 14" dominant-baseline="central" text-anchor="middle" class="chat-flow__subtitle">creates CoValue</text>
    </g>

    <!-- Click 2: /chat/co_z... box + arrow from create -->
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(2) }">
      <RoughArrow v-bind="arrows.createToRoute" :stroke="EDGE_STROKE" :roughness="roughness" :seed="seed + 20" />
    </g>
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(2) }">
      <RoughRect :x="chatRoute.x" :y="chatRoute.y" :width="nodeW" :height="nodeH" variant="default" :roughness="roughness" :seed="seed + 2" />
      <text :x="chatRoute.x + nodeW / 2" :y="chatRoute.y + nodeH / 2 - 6" dominant-baseline="central" text-anchor="middle" class="chat-flow__label">/chat/co_z...</text>
      <text :x="chatRoute.x + nodeW / 2" :y="chatRoute.y + nodeH / 2 + 14" dominant-baseline="central" text-anchor="middle" class="chat-flow__subtitle">URL = data address</text>
    </g>

    <!-- Click 3: Dashed arrow down + "shares URL" label -->
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(3) }">
      <RoughLine
        :x1="arrows.routeToCoValue.x1"
        :y1="arrows.routeToCoValue.y1"
        :x2="arrows.routeToCoValue.x2"
        :y2="arrows.routeToCoValue.y2"
        :stroke="EDGE_STROKE"
        :roughness="roughness"
        :seed="seed + 30"
        stroke-dasharray="6 4"
      />
      <text
        :x="arrows.routeToCoValue.x1 + 16"
        :y="(arrows.routeToCoValue.y1 + arrows.routeToCoValue.y2) / 2"
        text-anchor="start"
        dominant-baseline="central"
        class="chat-flow__edge-label"
      >shares URL</text>
    </g>

    <!-- Click 4: User B + CoValue box + arrows connecting them -->
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(4) }">
      <RoughRect :x="userB.x" :y="userB.y" :width="nodeW" :height="nodeH" variant="muted" :roughness="roughness" :seed="seed + 4" />
      <text :x="userB.x + nodeW / 2" :y="userB.y + nodeH / 2 - 6" dominant-baseline="central" text-anchor="middle" class="chat-flow__label">User B</text>
      <text :x="userB.x + nodeW / 2" :y="userB.y + nodeH / 2 + 14" dominant-baseline="central" text-anchor="middle" class="chat-flow__subtitle">opens /chat/co_z...</text>
    </g>
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(4) }">
      <RoughRect :x="coValue.x" :y="coValue.y" :width="nodeW" :height="nodeH" variant="success" :roughness="roughness" :seed="seed + 3" />
      <text :x="coValue.x + nodeW / 2" :y="coValue.y + nodeH / 2 - 6" dominant-baseline="central" text-anchor="middle" class="chat-flow__label">Chat CoValue</text>
      <text :x="coValue.x + nodeW / 2" :y="coValue.y + nodeH / 2 + 14" dominant-baseline="central" text-anchor="middle" class="chat-flow__subtitle">synced!</text>
    </g>
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(4) }">
      <RoughArrow v-bind="arrows.bToCoValue" :stroke="EDGE_STROKE" :roughness="roughness" :seed="seed + 40" />
    </g>

    <!-- Click 5: Bidirectional sync arrows + caption -->
    <g class="chat-flow__el" :class="{ '--hidden': !isVisible(5) }">
      <RoughArrow v-bind="arrows.syncUp" :stroke="EDGE_STROKE" :roughness="roughness" :seed="seed + 50" />
      <RoughArrow v-bind="arrows.syncLeft" :stroke="EDGE_STROKE" :roughness="roughness" :seed="seed + 51" />
      <text
        :x="canvasW / 2"
        :y="canvasH - 5"
        text-anchor="middle"
        dominant-baseline="auto"
        class="chat-flow__edge-label"
      >both write · real-time sync · no server logic</text>
    </g>
  </svg>
</template>

<style scoped>
.chat-flow {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.chat-flow__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-flow__el.--hidden {
  opacity: 0;
}

.chat-flow__label {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.chat-flow__subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.chat-flow__edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}
</style>
