<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'
import { EDGE_STROKE } from '../constants/colors'

const { x1, y1, x2, y2, stroke, strokeWidth = 2, strokeDasharray, arrowSize = 12, startArrow = false, endArrow = true, roughness, seed } = defineProps<{
  x1: number
  y1: number
  x2: number
  y2: number
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  arrowSize?: number
  startArrow?: boolean
  endArrow?: boolean
  roughness?: number
  seed?: number
}>()

const injectedGen = inject<RoughGenerator>('roughGenerator', null!)
const injectedRoughness = inject<Ref<number>>('roughness', null!)
const injectedSeed = inject<Ref<number>>('seed', null!)

const gen = injectedGen || rough.generator()

const paths = computed(() => {
  const r = roughness ?? injectedRoughness?.value ?? 1.0
  const lineRoughness = r * 0.5
  const headRoughness = r * 0.3
  const s = seed ?? injectedSeed?.value ?? 42
  const color = stroke ?? EDGE_STROKE

  // Main line
  const lineDrawable = gen.line(x1, y1, x2, y2, {
    roughness: lineRoughness,
    seed: s,
    stroke: color,
    strokeWidth,
  })

  const result = [...gen.toPaths(lineDrawable)]

  // Direction vector from start to end
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return result

  // Unit direction and perpendicular
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux

  const aLen = arrowSize
  const aWidth = aLen * 0.6

  // End arrowhead (V at target)
  if (endArrow) {
    const a1 = gen.line(
      x2, y2,
      x2 - ux * aLen + px * aWidth, y2 - uy * aLen + py * aWidth,
      { roughness: headRoughness, seed: s + 1, stroke: color, strokeWidth },
    )
    const a2 = gen.line(
      x2, y2,
      x2 - ux * aLen - px * aWidth, y2 - uy * aLen - py * aWidth,
      { roughness: headRoughness, seed: s + 2, stroke: color, strokeWidth },
    )
    result.push(...gen.toPaths(a1), ...gen.toPaths(a2))
  }

  // Start arrowhead (V at source, pointing back)
  if (startArrow) {
    const a1 = gen.line(
      x1, y1,
      x1 + ux * aLen + px * aWidth, y1 + uy * aLen + py * aWidth,
      { roughness: headRoughness, seed: s + 3, stroke: color, strokeWidth },
    )
    const a2 = gen.line(
      x1, y1,
      x1 + ux * aLen - px * aWidth, y1 + uy * aLen - py * aWidth,
      { roughness: headRoughness, seed: s + 4, stroke: color, strokeWidth },
    )
    result.push(...gen.toPaths(a1), ...gen.toPaths(a2))
  }

  return result
})
</script>

<template>
  <path
    v-for="(p, i) in paths"
    :key="i"
    :d="p.d"
    :stroke="p.stroke || 'none'"
    :stroke-width="p.strokeWidth"
    :fill="p.fill || 'none'"
    :stroke-dasharray="strokeDasharray"
  />
</template>
