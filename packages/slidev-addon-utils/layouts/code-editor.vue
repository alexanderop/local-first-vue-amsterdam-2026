<template>
  <div class="editor-window">
    <!-- Title bar -->
    <div class="editor-titlebar">
      <div class="editor-titlebar__dots">
        <span class="dot dot--red" />
        <span class="dot dot--yellow" />
        <span class="dot dot--green" />
      </div>
      <div class="editor-titlebar__title">vue-jazz-chat</div>
      <div class="editor-titlebar__spacer" />
    </div>

    <div class="editor-body">
      <!-- Sidebar -->
      <div class="editor-sidebar">
        <EditorFileTree :active-file="activeFile" :files="fileEntries" />
      </div>

      <!-- Main area -->
      <div class="editor-main">
        <!-- Tab bar -->
        <div class="editor-tabs">
          <div
            v-for="tab in resolvedTabs"
            :key="tab"
            class="editor-tab"
            :class="{ 'editor-tab--active': tab === activeFile }"
          >
            <div class="editor-tab__icon" aria-hidden="true">
              <div :class="getFileIcon(tab)" />
            </div>
            {{ tab }}
          </div>
          <div class="editor-tabs__spacer" />
          <div v-if="step" class="editor-tabs__step">{{ step }}</div>
        </div>

        <!-- Code area (default slot) -->
        <div class="editor-code">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  activeFile?: string
  tabs?: string | string[]
  step?: string
}>(), {
  activeFile: 'schema.ts',
})

const resolvedTabs = computed(() => {
  if (!props.tabs) return [props.activeFile]
  if (typeof props.tabs === 'string') {
    return props.tabs.split(',').map(t => t.trim())
  }
  return props.tabs
})

function getFileIcon(filename: string): string {
  if (filename.endsWith('.ts')) return 'i-logos:typescript-icon'
  if (filename.endsWith('.vue')) return 'i-logos:vue'
  return 'i-carbon:document'
}

const fileEntries = computed(() =>
  resolvedTabs.value.map(name => ({ name, icon: getFileIcon(name) }))
)
</script>

<style scoped>
.editor-window {
  position: absolute;
  inset: 24px 32px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid rgba(171, 75, 153, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  background: rgba(20, 24, 36, 0.95);
}

/* Title bar */
.editor-titlebar {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 14px;
  background: rgba(20, 24, 36, 0.95);
  border-bottom: 1px solid rgba(171, 75, 153, 0.15);
  flex-shrink: 0;
}

.editor-titlebar__dots {
  display: flex;
  gap: 7px;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.dot--red { background: #ff5f57; }
.dot--yellow { background: #febc2e; }
.dot--green { background: #28c840; }

.editor-titlebar__title {
  flex: 1;
  text-align: center;
  font-family: 'Geist Sans', sans-serif;
  font-size: 0.8rem;
  opacity: 0.4;
}

.editor-titlebar__spacer {
  width: 52px;
}

/* Body: sidebar + main */
.editor-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.editor-sidebar {
  width: 180px;
  background: rgba(52, 63, 96, 0.2);
  border-right: 1px solid rgba(171, 75, 153, 0.15);
  flex-shrink: 0;
  overflow-y: auto;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Tab bar */
.editor-tabs {
  display: flex;
  align-items: center;
  height: 34px;
  background: rgba(20, 24, 36, 0.6);
  border-bottom: 1px solid rgba(171, 75, 153, 0.15);
  flex-shrink: 0;
}

.editor-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 14px;
  height: 100%;
  font-family: 'Geist Mono', monospace;
  font-size: 0.75rem;
  color: rgba(234, 237, 243, 0.4);
  border-right: 1px solid rgba(171, 75, 153, 0.1);
  white-space: nowrap;
}

.editor-tab--active {
  color: rgba(234, 237, 243, 0.9);
  border-bottom: 2px solid rgb(255, 107, 237);
  background: rgba(52, 63, 96, 0.15);
}

.editor-tab__icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-tabs__spacer {
  flex: 1;
}

.editor-tabs__step {
  padding: 0 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 0.7rem;
  opacity: 0.4;
  white-space: nowrap;
}

/* Code area */
.editor-code {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

/* Override Slidev code block backgrounds */
.editor-code :deep(pre),
.editor-code :deep(code) {
  background: transparent !important;
}

.editor-code :deep(.slidev-code-wrapper) {
  background: transparent !important;
}

.editor-code :deep(.shiki) {
  background: transparent !important;
}
</style>
