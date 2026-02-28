<template>
  <div class="grid grid-cols-2 gap-10 h-full items-center px-2">
    <!-- Left: Avatar + Name + Socials -->
    <div class="flex flex-col items-center">
      <div class="relative">
        <div
          class="absolute -inset-2 rounded-full opacity-40 blur-xl"
          style="background: radial-gradient(circle, rgba(255,107,237,0.5) 0%, transparent 70%)"
        />
        <img
          class="relative w-40 h-40 rounded-full object-cover border-3"
          style="border-color: rgba(255,107,237,0.5)"
          src="https://avatars.githubusercontent.com/u/33398393?v=4"
          alt="Alex Opalic"
        />
      </div>
      <h2 class="mt-4 text-xl font-bold tracking-tight">Alex Opalic</h2>
      <div class="flex items-center gap-2 mt-1 text-xs" style="color: rgba(234,237,243,0.5)">
        <span>alexop.dev</span>
        <span class="op-30">·</span>
        <span>@alexanderopalic</span>
      </div>
    </div>

    <!-- Right: Info cards in 2-col grid -->
    <div class="flex flex-col gap-2.5">
      <Card v-for="(item, i) in items" :key="i" :icon="item.icon" :label="item.label" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'

const items = [
  { icon: 'i-ph-rocket-launch-bold', label: '7 years building with Vue' },
  { icon: 'i-ph-briefcase-bold', label: 'Developer at Otto Payments' },
  { icon: 'i-ph-map-pin-bold', label: 'Geretsried, Bavaria' },
  { icon: 'i-ph-pencil-line-bold', label: 'Blogger at alexop.dev' },
  { icon: 'i-ph-microphone-stage-bold', label: 'Speaker & contributor' },
]
</script>
