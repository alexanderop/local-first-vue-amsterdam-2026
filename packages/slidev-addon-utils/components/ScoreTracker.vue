<script setup lang="ts">
const { score, total, teaser = false } = defineProps<{
  score: number
  total?: number
  teaser?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="flex items-center gap-2">
      <div
        v-for="i in score"
        :key="`filled-${i}`"
        class="w-4 h-4 rounded-full"
        style="background: #ff6bed; box-shadow: 0 0 8px rgba(255,107,237,0.5)"
      />
      <div
        v-for="i in ((total ?? score) - score)"
        :key="`empty-${i}`"
        class="w-4 h-4 rounded-full bg-white/8"
      />
      <span v-if="teaser" class="text-gray-600 text-2xl leading-none ml-1">···</span>
    </div>
    <div class="text-gray-500 text-sm">
      <slot />
    </div>
  </div>
</template>
