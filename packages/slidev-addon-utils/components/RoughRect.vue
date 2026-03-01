<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'
import { getVariantColors } from '../constants/colors'
import type { Variant } from '../constants/colors'

const { x, y, width, height, variant, stroke, fill, roughness, seed, strokeWidth = 2, fillStyle = 'solid', strokeDasharray } = defineProps<{
  x: number
  y: number
  width: number
  height: number
  variant?: Variant
  stroke?: string
  fill?: string
  roughness?: number
  seed?: number
  strokeWidth?: number
  fillStyle?: string
  strokeDasharray?: string
}>()

const injectedGen = inject<RoughGenerator>('roughGenerator', null!)
const injectedRoughness = inject<Ref<number>>('roughness', null!)
const injectedSeed = inject<Ref<number>>('seed', null!)

const gen = injectedGen || rough.generator()

const paths = computed(() => {
  const colors = getVariantColors(variant)
  const r = roughness ?? injectedRoughness?.value ?? 1.0
  const s = seed ?? injectedSeed?.value ?? 42

  const drawable = gen.rectangle(x, y, width, height, {
    roughness: r,
    seed: s,
    stroke: stroke ?? colors.stroke,
    fill: fill ?? colors.fill,
    fillStyle,
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
