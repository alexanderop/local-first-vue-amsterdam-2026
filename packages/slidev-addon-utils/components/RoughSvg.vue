<script setup lang="ts">
import { computed, provide } from 'vue'
import rough from 'roughjs'
import type { RoughGenerator } from 'roughjs/bin/generator'

const { width, height, padding = 24, roughness = 1.0, seed = 42 } = defineProps<{
  width: number
  height: number
  padding?: number
  roughness?: number
  seed?: number
}>()

const gen: RoughGenerator = rough.generator()

provide('roughGenerator', gen)
provide('roughness', computed(() => roughness))
provide('seed', computed(() => seed))

const svgW = computed(() => width + padding * 2)
const svgH = computed(() => height + padding * 2)

const viewBox = computed(() =>
  `${-padding} ${-padding} ${svgW.value} ${svgH.value}`
)
</script>

<template>
  <svg
    :viewBox="viewBox"
    :width="svgW"
    :height="svgH"
    class="rough-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <slot />
  </svg>
</template>

<style scoped>
.rough-svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}
</style>
