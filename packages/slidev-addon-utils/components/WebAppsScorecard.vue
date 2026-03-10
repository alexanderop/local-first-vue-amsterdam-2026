<template>
  <div class="mt-2">
    <div class="text-base op-70 mb-3">From the original Ink & Switch paper — how do today's apps score?</div>

    <div
      class="rounded-lg border overflow-hidden"
      style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1)"
    >
      <!-- Header row -->
      <div class="grid items-center text-center text-sm font-semibold" :style="gridStyle">
        <div class="px-3 py-2.5" />
        <div v-for="ideal in IDEALS" :key="ideal.key" class="px-2 py-2.5 flex flex-col items-center gap-1">
          <div :class="ideal.icon" class="text-base text-brand/60" />
          <span class="text-xs text-gray-300">{{ ideal.label }}</span>
        </div>
      </div>

      <!-- App rows -->
      <div
        v-for="(app, i) in apps"
        :key="app.name"
        v-click="i + 1"
        class="grid items-center text-center border-t"
        :style="{ ...gridStyle, borderColor: 'rgba(255,255,255,0.06)' }"
        :class="i % 2 === 0 ? 'bg-white/[0.02]' : ''"
      >
        <div class="px-3 py-2.5 text-sm font-semibold text-left text-gray-200">{{ app.name }}</div>
        <div v-for="(score, j) in app.scores" :key="j" class="px-2 py-2.5 flex justify-center">
          <span v-if="score === 'yes'" class="text-emerald-400 text-lg">✓</span>
          <span v-else-if="score === 'partial'" class="text-amber-400 text-lg font-bold">—</span>
          <span v-else class="text-red-400 text-lg">✗</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IDEALS } from '../constants/ideals'

type Score = 'yes' | 'partial' | 'no'

interface AppScore {
  name: string
  scores: Score[] // one per ideal, in IDEALS order
}

const apps: AppScore[] = [
  // Fast, Multi-device, Offline, Collaboration, Longevity, Privacy, User control
  { name: 'Google Docs', scores: ['partial', 'yes', 'partial', 'yes', 'partial', 'no', 'partial'] },
  { name: 'Trello', scores: ['partial', 'yes', 'partial', 'yes', 'partial', 'no', 'no'] },
  { name: 'Pinterest', scores: ['no', 'yes', 'no', 'yes', 'no', 'no', 'no'] },
  { name: 'Dropbox', scores: ['yes', 'partial', 'partial', 'no', 'yes', 'partial', 'yes'] },
  { name: 'Git + GitHub', scores: ['yes', 'partial', 'yes', 'partial', 'yes', 'partial', 'yes'] },
]

const gridStyle = {
  gridTemplateColumns: `120px repeat(${IDEALS.length}, 1fr)`,
}
</script>
