<script setup lang="ts">
defineProps<{
  items?: { title: string; subtitle: string }[]
}>()
</script>

<template>
  <div class="outline">
    <div
      v-for="(item, i) in items"
      :key="i"
      v-click
      class="outline__item"
    >
      <span class="outline__number">{{ String(i + 1).padStart(2, '0') }}</span>
      <div class="outline__text">
        <span class="outline__title">{{ item.title }}</span>
        <span class="outline__subtitle">{{ item.subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  padding: 40px 80px;
}

.outline__item {
  display: flex;
  align-items: baseline;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.slidev-vclick-hidden).outline__item {
  transform: translateY(12px) !important;
  opacity: 0;
}

.outline__number {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 107, 237, 0.5);
  flex-shrink: 0;
}

.outline__title {
  font-family: 'Geist', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: rgba(234, 237, 243, 0.95);
}

.outline__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.outline__subtitle {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.35);
}
</style>
