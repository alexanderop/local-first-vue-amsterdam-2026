<script setup lang="ts">
import { useClickVisibility } from '../composables/useClickVisibility'

const { click, fallbackClick } = defineProps<{
  click?: number
  fallbackClick?: number
}>()

const { isVisible } = useClickVisibility()
</script>

<template>
  <g
    class="click-group"
    :class="{ '--hidden': !isVisible(click, fallbackClick) }"
  >
    <slot />
  </g>
</template>

<style scoped>
.click-group {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.click-group.--hidden {
  opacity: 0;
}
</style>
