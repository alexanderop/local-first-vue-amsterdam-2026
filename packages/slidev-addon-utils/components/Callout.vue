<script setup lang="ts">
const { type } = defineProps<{
  type?: 'info' | 'warn' | 'error'
}>()

const iconClass: Record<string, string> = {
  info: 'i-ph-info-bold text-blue-400',
  warn: 'i-ph-warning-bold text-yellow-400',
  error: 'i-ph-x-circle-bold text-red-400',
}
</script>

<template>
  <div
    class="p-4 rounded-lg border-l-4"
    :class="{
      'border-blue-400 bg-blue-950/30': type === 'info',
      'border-yellow-400 bg-yellow-950/30': type === 'warn',
      'border-red-400 bg-red-950/30': type === 'error'
    }"
  >
    <div class="flex gap-3">
      <div v-if="type" :class="iconClass[type]" class="text-lg flex-shrink-0 mt-0.5" />
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
