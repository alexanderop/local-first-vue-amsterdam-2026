<template>
  <div class="editor-tree">
    <div class="editor-tree__header">EXPLORER</div>
    <!-- Folder: src -->
    <div class="editor-tree__folder">
      <div class="editor-tree__caret" aria-hidden="true">
        <div class="i-carbon:chevron-right" />
      </div>
      <div class="editor-tree__icon" aria-hidden="true">
        <div class="i-carbon:folder" />
      </div>
      <span>src</span>
    </div>
    <!-- Files -->
    <div
      v-for="file in files"
      :key="file.name"
      class="editor-tree__file"
      :class="{ 'editor-tree__file--active': file.name === activeFile }"
    >
      <div class="editor-tree__icon" aria-hidden="true">
        <div :class="file.icon" />
      </div>
      <span>{{ file.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeFile: string
  files: { name: string; icon: string }[]
}>()
</script>

<style scoped>
.editor-tree {
  padding: 8px 0;
  font-family: 'Geist Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(234, 237, 243, 0.6);
  user-select: none;
}

.editor-tree__header {
  padding: 4px 12px 8px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.5;
}

.editor-tree__folder {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
}

.editor-tree__folder .editor-tree__caret {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(90deg);
  color: rgb(255, 107, 237);
}

.editor-tree__icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.editor-tree__file {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px 3px 34px;
  border-radius: 3px;
  margin: 0 4px;
}

.editor-tree__file--active {
  background: rgba(255, 107, 237, 0.12);
  color: rgb(255, 107, 237);
}
</style>
