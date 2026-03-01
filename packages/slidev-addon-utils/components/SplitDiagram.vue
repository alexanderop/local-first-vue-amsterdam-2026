<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import rough from 'roughjs'

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

const props = withDefaults(defineProps<{
  panels: SplitPanel[]
  roughness?: number
  seed?: number
  panelWidth?: number
  panelHeight?: number
  nodeWidth?: number
  nodeHeight?: number
  nodeGap?: number
  panelGap?: number
}>(), {
  roughness: 1.5,
  seed: 42,
  panelWidth: 280,
  panelHeight: 260,
  nodeWidth: 150,
  nodeHeight: 60,
  nodeGap: 50,
  panelGap: 60,
})

const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)
const gen = rough.generator()
const titleHeight = 30
const panelPadding = 20

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const variantColors = {
  default: { stroke: 'rgba(255, 107, 237, 0.7)', fill: 'rgba(52, 63, 96, 0.4)' },
  accent: { stroke: 'rgba(255, 107, 237, 0.9)', fill: 'rgba(255, 107, 237, 0.15)' },
  success: { stroke: 'rgba(52, 211, 153, 0.8)', fill: 'rgba(52, 211, 153, 0.12)' },
  muted: { stroke: 'rgba(255, 255, 255, 0.3)', fill: 'rgba(255, 255, 255, 0.05)' },
}

const badgeColors = {
  danger: 'rgba(248, 113, 113, 0.9)',
  success: 'rgba(52, 211, 153, 0.9)',
  muted: 'rgba(255, 255, 255, 0.4)',
}

const panelData = computed(() => {
  return props.panels.map((panel, pi) => {
    const px = pi * (props.panelWidth + props.panelGap)
    const contentTop = titleHeight

    // Panel container rectangle
    const panelRect = gen.rectangle(px, contentTop, props.panelWidth, props.panelHeight, {
      roughness: props.roughness * 0.8,
      seed: props.seed + pi * 100,
      stroke: 'rgba(255, 255, 255, 0.15)',
      fill: 'rgba(255, 255, 255, 0.03)',
      fillStyle: 'solid',
      strokeWidth: 1.5,
    })

    // Node positions — stacked vertically, centered in panel
    const nodeStartY = contentTop + panelPadding
    const nodeX = px + (props.panelWidth - props.nodeWidth) / 2

    const nodePositions = new Map<string, { x: number; y: number }>()
    panel.nodes.forEach((node, ni) => {
      const ny = nodeStartY + ni * (props.nodeHeight + props.nodeGap)
      nodePositions.set(node.id, { x: nodeX, y: ny })
    })

    // Node shapes
    const nodeShapes = panel.nodes.map((node) => {
      const pos = nodePositions.get(node.id)!
      const colors = variantColors[node.variant || 'default']
      const drawable = gen.rectangle(pos.x, pos.y, props.nodeWidth, props.nodeHeight, {
        roughness: props.roughness,
        seed: props.seed + hashId(node.id),
        stroke: colors.stroke,
        fill: colors.fill,
        fillStyle: 'solid',
        strokeWidth: 2,
      })
      return {
        ...node,
        x: pos.x,
        y: pos.y,
        paths: gen.toPaths(drawable),
      }
    })

    // Edge shapes
    const edgeShapes = panel.edges.map((edge) => {
      const from = nodePositions.get(edge.from)
      const to = nodePositions.get(edge.to)
      if (!from || !to) return null

      const x1 = from.x + props.nodeWidth / 2
      const y1 = from.y + props.nodeHeight
      const x2 = to.x + props.nodeWidth / 2
      const y2 = to.y

      const edgeSeed = props.seed + hashId(edge.from + edge.to)
      const strokeColor = 'rgba(255, 107, 237, 0.5)'

      const lineDrawable = gen.line(x1, y1, x2, y2, {
        roughness: props.roughness * 0.5,
        seed: edgeSeed,
        stroke: strokeColor,
        strokeWidth: 2,
      })

      // Arrowhead V pointing down
      const arrowLen = 12
      const a1x = x2 - arrowLen * 0.6
      const a1y = y2 - arrowLen
      const a2x = x2 + arrowLen * 0.6
      const a2y = y2 - arrowLen

      const arrow1 = gen.line(x2, y2, a1x, a1y, {
        roughness: props.roughness * 0.3,
        seed: edgeSeed + 1,
        stroke: strokeColor,
        strokeWidth: 2,
      })
      const arrow2 = gen.line(x2, y2, a2x, a2y, {
        roughness: props.roughness * 0.3,
        seed: edgeSeed + 2,
        stroke: strokeColor,
        strokeWidth: 2,
      })

      return {
        from: edge.from,
        to: edge.to,
        label: edge.label,
        click: edge.click,
        paths: [...gen.toPaths(lineDrawable), ...gen.toPaths(arrow1), ...gen.toPaths(arrow2)],
        labelX: (x1 + x2) / 2 + 14,
        labelY: (y1 + y2) / 2,
      }
    }).filter(Boolean) as {
      from: string; to: string; label?: string; click?: number
      paths: { d: string; stroke?: string; strokeWidth?: number; fill?: string }[]
      labelX: number; labelY: number
    }[]

    // Badge positions
    const badges = (panel.badges || []).map((badge) => {
      let bx: number, by: number
      if (badge.position === 'bottom') {
        bx = px + props.panelWidth / 2
        by = contentTop + props.panelHeight + 24
      } else {
        // inline — position near the last edge's label area
        const lastEdge = edgeShapes[edgeShapes.length - 1]
        if (lastEdge) {
          bx = lastEdge.labelX
          by = lastEdge.labelY + 16
        } else {
          bx = px + props.panelWidth / 2
          by = contentTop + props.panelHeight - 20
        }
      }
      return { ...badge, x: bx, y: by }
    })

    return {
      title: panel.title,
      click: panel.click,
      px,
      panelPaths: gen.toPaths(panelRect),
      nodeShapes,
      edgeShapes,
      badges,
    }
  })
})

const svgW = computed(() => {
  const n = props.panels.length
  return n * props.panelWidth + Math.max(0, n - 1) * props.panelGap + 48
})

const svgH = computed(() => {
  // Account for title, panel, and possible bottom badges
  const hasBottomBadge = props.panels.some(p =>
    p.badges?.some(b => b.position === 'bottom')
  )
  return titleHeight + props.panelHeight + (hasBottomBadge ? 40 : 0) + 24
})

const viewBox = computed(() =>
  `${-24} ${-12} ${svgW.value} ${svgH.value}`
)

function isVisible(click?: number, panelClick?: number): boolean {
  const effectiveClick = click ?? panelClick
  if (effectiveClick == null) return true
  return clicks.value >= effectiveClick
}
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
      <path
        v-for="(p, i) in panel.panelPaths"
        :key="`pc-${i}`"
        :d="p.d"
        :stroke="p.stroke || 'none'"
        :stroke-width="p.strokeWidth"
        :fill="p.fill || 'none'"
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
        <path
          v-for="(p, i) in edge.paths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
        <path
          v-for="(p, i) in node.paths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke || 'none'"
          :stroke-width="p.strokeWidth"
          :fill="p.fill || 'none'"
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
