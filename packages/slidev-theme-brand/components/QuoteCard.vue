<template>
  <div class="quote-card">
    <div class="quote-mark" aria-hidden="true">"</div>
    <blockquote class="quote-text">
      <span v-if="highlight" v-html="highlightedText" />
      <slot v-else />
    </blockquote>
    <div class="quote-author">
      <span class="author-dash" />
      <span>{{ author }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<{
  author: string
  highlight?: string
}>()

const slots = useSlots()

const highlightedText = computed(() => {
  if (!props.highlight || !slots.default) return ''
  const slotContent = slots.default()
  const text = slotContent.map((vnode: any) => {
    if (typeof vnode.children === 'string') return vnode.children
    return ''
  }).join('')
  return text.replaceAll(
    props.highlight,
    `<span class="quote-highlight">${props.highlight}</span>`
  )
})
</script>

<style scoped>
.quote-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.quote-mark {
  font-size: 6rem;
  line-height: 1;
  color: var(--brand-accent);
  font-family: Georgia, serif;
  opacity: 0.8;
  margin-bottom: -1rem;
}

.quote-text {
  font-size: 2.2rem;
  font-weight: 300;
  line-height: 1.4;
  color: #fff;
  text-align: center;
  max-width: 800px;
  border: none;
  padding: 0;
  margin: 0;
}

.quote-text :deep(.quote-highlight) {
  color: var(--brand-accent);
  font-weight: 500;
}

.quote-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

.author-dash {
  display: inline-block;
  width: 2rem;
  height: 2px;
  background: var(--brand-accent);
}
</style>
