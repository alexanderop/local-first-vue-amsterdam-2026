<template>
  <div
    class="rounded-lg border"
    :class="[sizeClasses, { 'opacity-40': dimmed, 'border-dashed': dashed }]"
    :style="cardStyle"
  >
    <template v-if="icon || label">
      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          :class="icon"
          class="shrink-0 w-4.5 h-4.5"
          :style="{ color: iconColor }"
        />
        <div v-if="label" class="font-semibold text-sm" style="color: rgba(234,237,243,0.95)">{{ label }}</div>
      </div>
    </template>
    <slot v-if="$slots.default" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { icon, label, variant = 'default', glow, dimmed, dashed, size = 'md' } = defineProps<{
  icon?: string
  label?: string
  variant?: 'default' | 'muted' | 'success'
  glow?: boolean
  dimmed?: boolean
  dashed?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const resolvedGlow = computed(() => {
  if (glow !== undefined) return glow
  return variant === 'default'
})

const sizeClasses = computed(() => {
  switch (size) {
    case 'sm': return 'px-3 py-2.5 text-sm'
    case 'lg': return 'p-5'
    default: return 'px-4 py-2.5'
  }
})

const iconColor = computed(() => {
  switch (variant) {
    case 'success': return 'rgb(52,211,153)'
    case 'muted': return 'rgba(255,255,255,0.5)'
    default: return 'rgb(255,107,237)'
  }
})

const cardStyle = computed(() => {
  const styles: Record<string, string> = {}

  switch (variant) {
    case 'default':
      styles.background = 'linear-gradient(135deg, rgba(255,107,237,0.04) 0%, rgba(52,63,96,0.4) 100%)'
      styles.borderColor = 'rgba(255,107,237,0.12)'
      break
    case 'success':
      styles.background = 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 100%)'
      styles.borderColor = 'rgba(52,211,153,0.3)'
      break
    case 'muted':
      styles.background = 'rgba(255,255,255,0.05)'
      styles.borderColor = 'rgba(255,255,255,0.1)'
      break
  }

  if (resolvedGlow.value) {
    const color = variant === 'success'
      ? '16,185,129'
      : '255,107,237'
    styles.boxShadow = [
      `0 0 0 1px rgba(${color},0.15)`,
      `0 0 15px -3px rgba(${color},0.2)`,
      `0 0 30px -5px rgba(${color},0.1)`,
    ].join(', ')
  }

  return styles
})
</script>
