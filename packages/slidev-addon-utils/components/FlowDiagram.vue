<script setup lang="ts">
import { computed } from 'vue'
import RoughRect from './RoughRect.vue'
import RoughArrow from './RoughArrow.vue'
import { useClickVisibility } from '../composables/useClickVisibility'
import { hashId } from '../composables/useRough'
import { EDGE_STROKE } from '../constants/colors'
import type { Variant } from '../constants/colors'

interface FlowNode {
  id: string
  label: string
  subtitle?: string
  click?: number
  variant?: 'default' | 'accent' | 'muted' | 'success'
}

interface FlowEdge {
  from: string
  to: string
  label?: string
  click?: number
}

const { nodes, edges, direction = 'horizontal', layout = 'linear', roughness = 1.5, seed = 42, nodeWidth = 180, nodeHeight = 80, gap = 100 } = defineProps<{
  nodes: FlowNode[]
  edges: FlowEdge[]
  direction?: 'horizontal' | 'vertical'
  layout?: 'linear' | 'fan-right'
  roughness?: number
  seed?: number
  nodeWidth?: number
  nodeHeight?: number
  gap?: number
}>()

const { isVisible } = useClickVisibility()
const padding = 24
const verticalGap = 16

const isHorizontal = computed(() => direction === 'horizontal')
const isFanRight = computed(() => layout === 'fan-right')
const horizontalEdges = computed(() => isHorizontal.value || isFanRight.value)

const positions = computed(() => {
  if (isFanRight.value) {
    const rightCount = nodes.length - 1
    const rightStackHeight = rightCount * nodeHeight + Math.max(0, rightCount - 1) * verticalGap
    const node0Y = (rightStackHeight - nodeHeight) / 2

    return nodes.map((node, i) => {
      if (i === 0) {
        return { ...node, x: 0, y: Math.max(0, node0Y) }
      }
      const rightIndex = i - 1
      return {
        ...node,
        x: nodeWidth + gap,
        y: rightIndex * (nodeHeight + verticalGap),
      }
    })
  }

  return nodes.map((node, i) => ({
    ...node,
    x: isHorizontal.value ? i * (nodeWidth + gap) : 0,
    y: isHorizontal.value ? 0 : i * (nodeHeight + gap),
  }))
})

const contentWidth = computed(() => {
  if (isFanRight.value) {
    return 2 * nodeWidth + gap
  }
  const n = nodes.length
  return isHorizontal.value
    ? n * nodeWidth + Math.max(0, n - 1) * gap
    : nodeWidth
})

const contentHeight = computed(() => {
  if (isFanRight.value) {
    const rightCount = nodes.length - 1
    return rightCount * nodeHeight + Math.max(0, rightCount - 1) * verticalGap
  }
  const n = nodes.length
  return isHorizontal.value
    ? nodeHeight
    : n * nodeHeight + Math.max(0, n - 1) * gap
})

const svgW = computed(() => contentWidth.value + padding * 2)
const svgH = computed(() => contentHeight.value + padding * 2)

const viewBox = computed(() =>
  `${-padding} ${-padding} ${svgW.value} ${svgH.value}`
)

const nodeShapes = computed(() => {
  return positions.value.map((node) => ({
    id: node.id,
    label: node.label,
    subtitle: node.subtitle,
    click: node.click,
    x: node.x,
    y: node.y,
    variant: (node.variant || 'default') as Variant,
  }))
})

const edgeShapes = computed(() => {
  const posMap = new Map(positions.value.map(n => [n.id, n]))

  return edges.map((edge) => {
    const from = posMap.get(edge.from)
    const to = posMap.get(edge.to)
    if (!from || !to) return null

    let x1: number, y1: number, x2: number, y2: number
    if (horizontalEdges.value) {
      x1 = from.x + nodeWidth
      y1 = from.y + nodeHeight / 2
      x2 = to.x
      y2 = to.y + nodeHeight / 2
    } else {
      x1 = from.x + nodeWidth / 2
      y1 = from.y + nodeHeight
      x2 = to.x + nodeWidth / 2
      y2 = to.y
    }

    return {
      from: edge.from,
      to: edge.to,
      label: edge.label,
      click: edge.click,
      x1, y1, x2, y2,
      seed: seed + hashId(edge.from + edge.to),
      labelX: (x1 + x2) / 2,
      labelY: (y1 + y2) / 2,
    }
  }).filter((e): e is NonNullable<typeof e> => e != null)
})
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="flow-diagram"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Edges (rendered first so nodes paint on top) -->
    <g
      v-for="edge in edgeShapes"
      :key="`e-${edge.from}-${edge.to}`"
      class="flow-diagram__el"
      :class="{ '--hidden': !isVisible(edge.click) }"
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
        :dy="horizontalEdges ? -10 : 0"
        :dx="horizontalEdges ? 0 : 14"
        text-anchor="middle"
        dominant-baseline="auto"
        class="flow-diagram__edge-label"
      >
        {{ edge.label }}
      </text>
    </g>

    <!-- Nodes -->
    <g
      v-for="node in nodeShapes"
      :key="`n-${node.id}`"
      class="flow-diagram__el"
      :class="{ '--hidden': !isVisible(node.click) }"
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
        class="flow-diagram__label"
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
        class="flow-diagram__subtitle"
      >
        {{ node.subtitle }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.flow-diagram {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.flow-diagram__el {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.flow-diagram__el.--hidden {
  opacity: 0;
}

.flow-diagram__label {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.flow-diagram__subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.flow-diagram__edge-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 107, 237, 0.7);
}
</style>
