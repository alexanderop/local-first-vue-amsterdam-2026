<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  items?: { title: string; subtitle: string }[]
  taper?: number
  gap?: number
}>(), {
  taper: 7,
  gap: 1,
  items: () => [],
})

const levels = computed(() => {
  const total = props.items.length
  return props.items.map((item, i) => {
    const topInset = (i + 1) * props.taper
    const bottomInset = i * props.taper
    return {
      ...item,
      index: i,
      order: total - i,
      clipPath: `polygon(${topInset}% 0%, ${100 - topInset}% 0%, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`,
      paddingInline: `${topInset + 2}%`,
    }
  })
})
</script>

<template>
  <div class="pyramid" :style="{ gap: `${gap}px` }">
    <div
      v-for="level in levels"
      :key="level.index"
      v-click
      class="pyramid__level"
      :style="{
        order: level.order,
        clipPath: level.clipPath,
        paddingLeft: level.paddingInline,
        paddingRight: level.paddingInline,
      }"
    >
      <span class="pyramid__index">{{ level.index }}</span>
      <span class="pyramid__title">{{ level.title }}</span>
      <span class="pyramid__subtitle">{{ level.subtitle }}</span>
    </div>
  </div>
</template>

<style scoped>
.pyramid {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  padding: 40px 0 0;
}

.pyramid__level {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  background: linear-gradient(135deg, rgba(255, 107, 237, 0.06) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(255, 107, 237, 0.12);
  font-family: 'Geist', sans-serif;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.slidev-vclick-hidden).pyramid__level {
  transform: translateY(16px) scale(0.97) !important;
}

.pyramid__index {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 107, 237, 0.45);
  min-width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.pyramid__title {
  font-weight: 700;
  font-size: 20px;
  color: rgba(234, 237, 243, 0.95);
  white-space: nowrap;
}

.pyramid__subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  margin-left: auto;
  white-space: nowrap;
}
</style>
