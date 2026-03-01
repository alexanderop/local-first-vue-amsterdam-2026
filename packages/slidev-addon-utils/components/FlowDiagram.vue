<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import rough from 'roughjs'

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

const props = withDefaults(defineProps<{
  nodes: FlowNode[]
  edges: FlowEdge[]
  direction?: 'horizontal' | 'vertical'
  layout?: 'linear' | 'fan-right'
  roughness?: number
  seed?: number
  nodeWidth?: number
  nodeHeight?: number
  gap?: number
}>(), {
  direction: 'horizontal',
  layout: 'linear',
  roughness: 1.5,
  seed: 42,
  nodeWidth: 180,
  nodeHeight: 80,
  gap: 100,
})

const { $clicksContext } = useSlideContext()
const clicks = computed(() => $clicksContext.current)
const gen = rough.generator()
const padding = 24
const verticalGap = 16

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

const isHorizontal = computed(() => props.direction === 'horizontal')
const isFanRight = computed(() => props.layout === 'fan-right')
const horizontalEdges = computed(() => isHorizontal.value || isFanRight.value)

const positions = computed(() => {
  if (isFanRight.value) {
    const rightCount = props.nodes.length - 1
    const rightStackHeight = rightCount * props.nodeHeight + Math.max(0, rightCount - 1) * verticalGap
    const node0Y = (rightStackHeight - props.nodeHeight) / 2

    return props.nodes.map((node, i) => {
      if (i === 0) {
        return { ...node, x: 0, y: Math.max(0, node0Y) }
      }
      const rightIndex = i - 1
      return {
        ...node,
        x: props.nodeWidth + props.gap,
        y: rightIndex * (props.nodeHeight + verticalGap),
      }
    })
  }

  return props.nodes.map((node, i) => ({
    ...node,
    x: isHorizontal.value ? i * (props.nodeWidth + props.gap) : 0,
    y: isHorizontal.value ? 0 : i * (props.nodeHeight + props.gap),
  }))
})

const contentWidth = computed(() => {
  if (isFanRight.value) {
    return 2 * props.nodeWidth + props.gap
  }
  const n = props.nodes.length
  return isHorizontal.value
    ? n * props.nodeWidth + Math.max(0, n - 1) * props.gap
    : props.nodeWidth
})

const contentHeight = computed(() => {
  if (isFanRight.value) {
    const rightCount = props.nodes.length - 1
    return rightCount * props.nodeHeight + Math.max(0, rightCount - 1) * verticalGap
  }
  const n = props.nodes.length
  return isHorizontal.value
    ? props.nodeHeight
    : n * props.nodeHeight + Math.max(0, n - 1) * props.gap
})

const svgW = computed(() => contentWidth.value + padding * 2)
const svgH = computed(() => contentHeight.value + padding * 2)

const viewBox = computed(() =>
  `${-padding} ${-padding} ${svgW.value} ${svgH.value}`
)

const nodeShapes = computed(() => {
  return positions.value.map((node) => {
    const colors = variantColors[node.variant || 'default']
    const drawable = gen.rectangle(node.x, node.y, props.nodeWidth, props.nodeHeight, {
      roughness: props.roughness,
      seed: props.seed + hashId(node.id),
      stroke: colors.stroke,
      fill: colors.fill,
      fillStyle: 'solid',
      strokeWidth: 2,
    })
    return {
      id: node.id,
      label: node.label,
      subtitle: node.subtitle,
      click: node.click,
      x: node.x,
      y: node.y,
      paths: gen.toPaths(drawable),
    }
  })
})

const edgeShapes = computed(() => {
  const posMap = new Map(positions.value.map(n => [n.id, n]))

  return props.edges.map((edge) => {
    const from = posMap.get(edge.from)
    const to = posMap.get(edge.to)
    if (!from || !to) return null

    let x1: number, y1: number, x2: number, y2: number
    if (horizontalEdges.value) {
      x1 = from.x + props.nodeWidth
      y1 = from.y + props.nodeHeight / 2
      x2 = to.x
      y2 = to.y + props.nodeHeight / 2
    } else {
      x1 = from.x + props.nodeWidth / 2
      y1 = from.y + props.nodeHeight
      x2 = to.x + props.nodeWidth / 2
      y2 = to.y
    }

    const edgeSeed = props.seed + hashId(edge.from + edge.to)
    const strokeColor = 'rgba(255, 107, 237, 0.5)'

    const lineDrawable = gen.line(x1, y1, x2, y2, {
      roughness: props.roughness * 0.5,
      seed: edgeSeed,
      stroke: strokeColor,
      strokeWidth: 2,
    })

    // Arrowhead — two short lines forming a V at the target end
    const arrowLen = 12
    let a1x: number, a1y: number, a2x: number, a2y: number
    if (horizontalEdges.value) {
      a1x = x2 - arrowLen; a1y = y2 - arrowLen * 0.6
      a2x = x2 - arrowLen; a2y = y2 + arrowLen * 0.6
    } else {
      a1x = x2 - arrowLen * 0.6; a1y = y2 - arrowLen
      a2x = x2 + arrowLen * 0.6; a2y = y2 - arrowLen
    }

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
      labelX: (x1 + x2) / 2,
      labelY: (y1 + y2) / 2,
    }
  }).filter(Boolean) as NonNullable<ReturnType<typeof Object>>[]
})

function isVisible(click?: number): boolean {
  if (click == null) return true
  return clicks.value >= click
}
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
