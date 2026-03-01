<script setup lang="ts">
interface PathInfo {
  d: string
  stroke?: string
  strokeWidth?: number
  fill?: string
}

const { paths, strokeDasharray } = defineProps<{
  paths: PathInfo[]
  strokeDasharray?: string
}>()
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
