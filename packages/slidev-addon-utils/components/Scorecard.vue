<template>
  <!-- Intro mode: all cards muted, vertical icon layout -->
  <template v-if="mode === 'intro'">
    <div class="grid grid-cols-4 gap-3 mt-6">
      <Card v-for="ideal in IDEALS.slice(0, 4)" :key="ideal.key" variant="muted" size="sm">
        <div class="flex flex-col items-center gap-2 text-center">
          <div :class="ideal.icon" class="text-2xl text-brand/50" />
          <div class="text-sm font-semibold text-gray-300">{{ ideal.label }}</div>
          <div class="text-xs text-gray-500 leading-tight">{{ getDescription(ideal) }}</div>
        </div>
      </Card>
    </div>

    <div class="flex justify-center gap-3 mt-3">
      <Card v-for="ideal in IDEALS.slice(4)" :key="ideal.key" variant="muted" size="sm" class="w-[calc(25%-9px)]">
        <div class="flex flex-col items-center gap-2 text-center">
          <div :class="ideal.icon" class="text-2xl text-brand/50" />
          <div class="text-sm font-semibold text-gray-300">{{ ideal.label }}</div>
          <div class="text-xs text-gray-500 leading-tight">{{ getDescription(ideal) }}</div>
        </div>
      </Card>
    </div>

    <slot />
  </template>

  <!-- Progress mode: achieved/pending split -->
  <template v-else>
    <!-- Achieved cards -->
    <div v-if="achievedIdeals.length > 0 && !allAchieved" v-click="1" class="grid grid-cols-2 gap-4 mt-6">
      <Card v-for="ideal in achievedIdeals" :key="ideal.key" variant="success" glow size="lg">
        <div class="flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <div class="i-ph-check-circle-fill text-xl" /> {{ ideal.label }}
        </div>
        <p class="text-sm text-gray-400 mt-1 pl-7">{{ getDescription(ideal) }}</p>
      </Card>
    </div>

    <!-- All 7 achieved: first 6 -->
    <div v-if="allAchieved" v-click="1" class="grid grid-cols-2 gap-4 mt-4">
      <Card v-for="ideal in achievedIdeals.slice(0, 6)" :key="ideal.key" variant="success" glow size="lg">
        <div class="flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <div class="i-ph-check-circle-fill text-xl" /> {{ ideal.label }}
        </div>
        <p class="text-sm text-gray-400 mt-1 pl-7">{{ getDescription(ideal) }}</p>
      </Card>
    </div>

    <!-- All 7 achieved: 7th card centered -->
    <div v-if="allAchieved" v-click="2" class="grid grid-cols-1 gap-2 mt-4 max-w-xs mx-auto">
      <Card variant="success" glow size="lg">
        <div class="flex items-center justify-center gap-2 text-emerald-400 font-bold text-lg">
          <div class="i-ph-check-circle-fill text-xl" /> {{ achievedIdeals[6].label }}
        </div>
        <p class="text-sm text-gray-400 mt-1 text-center">{{ getDescription(achievedIdeals[6]) }}</p>
      </Card>
    </div>

    <!-- Pending cards -->
    <div
      v-if="pendingIdeals.length > 0"
      v-click="2"
      class="gap-2 mt-4"
      :style="{ display: 'grid', gridTemplateColumns: `repeat(${pendingIdeals.length}, minmax(0, 1fr))` }"
    >
      <Card v-for="ideal in pendingIdeals" :key="ideal.key" variant="muted" dashed dimmed size="sm">
        <div class="flex items-center justify-center gap-1 text-sm">
          <div class="i-ph-question text-base" /> {{ ideal.label }}?
        </div>
      </Card>
    </div>

    <!-- Summary -->
    <div v-if="showSummary" v-click="3" class="text-center text-sm text-gray-500 tracking-wide" :class="allAchieved ? 'mt-6' : 'mt-8'">
      <span class="text-emerald-400 font-bold">{{ score }}</span> / <span class="text-gray-400">7</span> local-first principles achieved
    </div>

    <slot />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IDEALS } from '../constants/ideals'
import type { IdealKey, Ideal } from '../constants/ideals'
import Card from './Card.vue'

const props = withDefaults(defineProps<{
  achieved: IdealKey[]
  descriptions?: Partial<Record<IdealKey, string>>
  mode?: 'progress' | 'intro'
  showSummary?: boolean
}>(), {
  mode: 'progress',
  showSummary: true,
})

const achievedSet = computed(() => new Set(props.achieved))
const score = computed(() => props.achieved.length)
const allAchieved = computed(() => score.value === 7)

const achievedIdeals = computed(() =>
  IDEALS.filter(i => achievedSet.value.has(i.key))
)

const pendingIdeals = computed(() =>
  IDEALS.filter(i => !achievedSet.value.has(i.key))
)

function getDescription(ideal: Ideal): string {
  return props.descriptions?.[ideal.key] ?? ideal.description
}
</script>
