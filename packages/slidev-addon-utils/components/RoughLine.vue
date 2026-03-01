<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'
import { EDGE_STROKE } from '../constants/colors'

const { x1, y1, x2, y2, stroke, strokeWidth = 2, strokeDasharray, roughness, seed } = defineProps<{
  x1: number
  y1: number
  x2: number
  y2: number
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  roughness?: number
  seed?: number
}>()

const injectedGen = inject<RoughGenerator>('roughGenerator', null!)
const injectedRoughness = inject<Ref<number>>('roughness', null!)
const injectedSeed = inject<Ref<number>>('seed', null!)

const gen = injectedGen || rough.generator()

const paths = computed(() => {
  const r = roughness ?? ((injectedRoughness?.value ?? 1.0) * 0.5)
  const s = seed ?? injectedSeed?.value ?? 42

  const drawable = gen.line(x1, y1, x2, y2, {
    roughness: r,
    seed: s,
    stroke: stroke ?? EDGE_STROKE,
    strokeWidth,
  })
  return gen.toPaths(drawable)
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
