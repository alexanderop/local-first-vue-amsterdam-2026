<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import { EDGE_STROKE } from '../constants/colors'
import type { Variant } from '../constants/colors'

interface SplitNode {
  id: string
  label: string
  subtitle?: string
  variant?: 'default' | 'accent' | 'muted' | 'success'
  click?: number
  leftLabel?: string
  rightLabel?: string
}

interface SplitEdge {
  from: string
  to: string
  label?: string
  click?: number
}

interface SplitBadge {
  text: string
  position: 'inline' | 'bottom'
  variant?: 'danger' | 'success' | 'muted'
  click?: number
}

interface SplitPanel {
  title: string
  nodes: SplitNode[]
  edges: SplitEdge[]
  badges?: SplitBadge[]
  click?: number
}

const { panels, roughness = 1.5, seed = 42, panelWidth = 280, panelHeight = 260, nodeWidth = 150, nodeHeight = 60, nodeGap = 50, panelGap = 60 } = defineProps<{
  panels: SplitPanel[]
  roughness?: number
  seed?: number
  panelWidth?: number
  panelHeight?: number
  nodeWidth?: number
  nodeHeight?: number
  nodeGap?: number
  panelGap?: number
}>()

const { isVisible } = useClickVisibility()
const titleHeight = 30
const panelPadding = 20

const badgeColors = {
  danger: 'rgba(248, 113, 113, 0.9)',
  success: 'rgba(52, 211, 153, 0.9)',
  muted: 'rgba(255, 255, 255, 0.4)',
}

const panelData = computed(() => {
  return panels.map((panel, pi) => {
    const px = pi * (panelWidth + panelGap)
    const contentTop = titleHeight

    // Node positions — stacked vertically, centered in panel
    const nodeStartY = contentTop + panelPadding
    const nodeX = px + (panelWidth - nodeWidth) / 2

    const nodePositions = new Map<string, { x: number; y: number }>()
    panel.nodes.forEach((node, ni) => {
      const ny = nodeStartY + ni * (nodeHeight + nodeGap)
      nodePositions.set(node.id, { x: nodeX, y: ny })
    })

    // Node shapes (position data only)
    const nodeShapes = panel.nodes.map((node) => {
      const pos = nodePositions.get(node.id)!
      return {
        ...node,
        x: pos.x,
        y: pos.y,
        variant: (node.variant || 'default') as Variant,
      }
    })

    // Edge shapes (position data only)
    const edgeShapes = panel.edges.map((edge) => {
      const from = nodePositions.get(edge.from)
      const to = nodePositions.get(edge.to)
      if (!from || !to) return null

      const x1 = from.x + nodeWidth / 2
      const y1 = from.y + nodeHeight
      const x2 = to.x + nodeWidth / 2
      const y2 = to.y

      return {
        from: edge.from,
        to: edge.to,
        label: edge.label,
        click: edge.click,
        x1, y1, x2, y2,
        seed: seed + hashId(edge.from + edge.to),
        labelX: (x1 + x2) / 2 + 14,
        labelY: (y1 + y2) / 2,
      }
    }).filter((e): e is NonNullable<typeof e> => e != null)

    // Badge positions
    const badges = (panel.badges || []).map((badge) => {
      let bx: number, by: number
      if (badge.position === 'bottom') {
        bx = px + panelWidth / 2
        by = contentTop + panelHeight + 24
      } else {
        // inline — position near the last edge's label area
        const lastEdge = edgeShapes[edgeShapes.length - 1]
        if (lastEdge) {
          bx = lastEdge.labelX
          by = lastEdge.labelY + 16
        } else {
          bx = px + panelWidth / 2
          by = contentTop + panelHeight - 20
        }
      }
      return { ...badge, x: bx, y: by }
    })

    return {
      title: panel.title,
      click: panel.click,
      px,
      contentTop,
      panelSeed: seed + pi * 100,
      nodeShapes,
      edgeShapes,
      badges,
    }
  })
})

const svgW = computed(() => {
  const n = panels.length
  return n * panelWidth + Math.max(0, n - 1) * panelGap + 48
})

const svgH = computed(() => {
  const hasBottomBadge = panels.some(p =>
    p.badges?.some(b => b.position === 'bottom')
  )
  return titleHeight + panelHeight + (hasBottomBadge ? 40 : 0) + 24
})

const viewBox = computed(() =>
  `${-24} ${-12} ${svgW.value} ${svgH.value}`
)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="split-diagram"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      v-for="(panel, pi) in panelData"
      :key="`panel-${pi}`"
      class="split-diagram__el"
      :class="{ '--hidden': !isVisible(panel.click) }"
    >
      <!-- Panel container -->
      <RoughRect
        :x="panel.px"
        :y="panel.contentTop"
        :width="panelWidth"
        :height="panelHeight"
        stroke="rgba(255,255,255,0.15)"
        fill="rgba(255,255,255,0.03)"
        :roughness="roughness * 0.8"
        :seed="panel.panelSeed"
        :stroke-width="1.5"
      />

      <!-- Panel title -->
      <text
        :x="panel.px + panelWidth / 2"
        :y="12"
        text-anchor="middle"
        dominant-baseline="central"
        class="split-diagram__title"
      >
        {{ panel.title }}
      </text>

      <!-- Edges (under nodes) -->
      <g
        v-for="edge in panel.edgeShapes"
        :key="`e-${edge.from}-${edge.to}`"
        class="split-diagram__el"
        :class="{ '--hidden': !isVisible(edge.click, panel.click) }"
      >
        <RoughArrow
          :x1="edge.x1"
          :y1="edge.y1"
          :x2="edge.x2"
          :y2="edge.y2"
          :stroke="EDGE_STROKE"
          :roughness="roughness"
          :seed="edge.seed"
        />
        <text
          v-if="edge.label"
          :x="edge.labelX"
          :y="edge.labelY"
          text-anchor="start"
          dominant-baseline="central"
          class="split-diagram__edge-label"
        >
          {{ edge.label }}
        </text>
      </g>

      <!-- Nodes -->
      <g
        v-for="node in panel.nodeShapes"
        :key="`n-${node.id}`"
        class="split-diagram__el"
        :class="{ '--hidden': !isVisible(node.click, panel.click) }"
      >
        <RoughRect
          :x="node.x"
          :y="node.y"
          :width="nodeWidth"
          :height="nodeHeight"
          :variant="node.variant"
          :roughness="roughness"
          :seed="seed + hashId(node.id)"
        />
        <text
          :x="node.x + nodeWidth / 2"
          :y="node.y + nodeHeight / 2"
          :dy="node.subtitle ? -6 : 0"
          dominant-baseline="central"
          text-anchor="middle"
          class="split-diagram__label"
        >
          {{ node.label }}
        </text>
        <text
          v-if="node.subtitle"
          :x="node.x + nodeWidth / 2"
          :y="node.y + nodeHeight / 2"
          dy="14"
          dominant-baseline="central"
          text-anchor="middle"
          class="split-diagram__subtitle"
        >
          {{ node.subtitle }}
        </text>
        <!-- Left label -->
        <text
          v-if="node.leftLabel"
          :x="node.x - 8"
          :y="node.y + nodeHeight / 2 - 8"
          text-anchor="end"
          dominant-baseline="central"
          class="split-diagram__side-label"
        >
          {{ node.leftLabel }}
        </text>
        <!-- Right label -->
        <text
          v-if="node.rightLabel"
          :x="node.x + nodeWidth + 8"
          :y="node.y + nodeHeight / 2 + 8"
          text-anchor="start"
          dominant-baseline="central"
          class="split-diagram__side-label"
        >
          {{ node.rightLabel }}
        </text>
      </g>

      <!-- Badges -->
      <g
        v-for="(badge, bi) in panel.badges"
        :key="`b-${bi}`"
        class="split-diagram__el"
        :class="{ '--hidden': !isVisible(badge.click, panel.click) }"
      >
        <text
          :x="badge.x"
          :y="badge.y"
          :text-anchor="badge.position === 'bottom' ? 'middle' : 'start'"
          dominant-baseline="central"
          class="split-diagram__badge"
          :style="{ fill: badgeColors[badge.variant || 'muted'] }"
        >
          {{ badge.text }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.split-diagram {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.split-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.split-diagram__el.--hidden {
  opacity: 0;
}

.split-diagram__title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.split-diagram__label {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.split-diagram__subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.split-diagram__edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}

.split-diagram__side-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.35);
}

.split-diagram__badge {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 600;
}
</style>
