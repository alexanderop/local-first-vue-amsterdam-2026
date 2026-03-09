<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useClickVisibility } from '../composables/useClickVisibility'

const { clicks } = useClickVisibility()

const USER_COLORS = { alice: '#34D399', bob: '#F59E0B' } as const

interface HistoryEvent {
  click: number
  user: 'alice' | 'bob'
  device: number
  field: 'title' | 'done'
  value: string | number | boolean
  time: string
}

const EVENTS: HistoryEvent[] = [
  { click: 1, user: 'alice', device: 1, field: 'title', value: 'Buy milk',     time: '8:01 AM' },
  { click: 1, user: 'alice', device: 1, field: 'done',  value: false,          time: '8:01 AM' },
  { click: 2, user: 'bob',   device: 1, field: 'title', value: 'Buy oat milk', time: '8:02 AM' },
  { click: 3, user: 'bob',   device: 1, field: 'title', value: 'Get oat milk', time: '8:03 AM' },
  { click: 4, user: 'bob',   device: 2, field: 'done',  value: true,           time: '8:04 AM' },
  { click: 5, user: 'alice', device: 1, field: 'title', value: 'Buy eggs',     time: '8:05 AM' },
  { click: 6, user: 'bob',   device: 1, field: 'done',  value: false,          time: '8:06 AM' },
]

const visibleEvents = computed(() => EVENTS.filter(e => clicks.value >= e.click))

const columns = computed(() => {
  const alice1: HistoryEvent[] = []
  const bob1: HistoryEvent[] = []
  const bob2: HistoryEvent[] = []
  for (const e of visibleEvents.value) {
    if (e.user === 'alice' && e.device === 1) alice1.push(e)
    else if (e.user === 'bob' && e.device === 1) bob1.push(e)
    else if (e.user === 'bob' && e.device === 2) bob2.push(e)
  }
  return [
    { key: 'alice1', user: 'alice' as const, device: 1, events: alice1 },
    { key: 'bob1',   user: 'bob'   as const, device: 1, events: bob1 },
    { key: 'bob2',   user: 'bob'   as const, device: 2, events: bob2 },
  ]
})

const mergedState = computed(() => {
  const state: Record<string, string | number | boolean> = {}
  for (const e of visibleEvents.value) {
    state[e.field] = e.value
  }
  return state
})

const mergedEntries = computed(() => Object.entries(mergedState.value))

const currentTime = computed(() => {
  const visible = visibleEvents.value
  return visible.length > 0 ? visible.at(-1).time : '8:00 AM'
})

// Track which fields just changed for flash animation
const changedFields = ref<Set<string>>(new Set())
let prevState: Record<string, string | number | boolean> = {}
let flashTimer: ReturnType<typeof setTimeout> | null = null

watch(mergedState, (newState) => {
  const changed = new Set<string>()
  for (const key of Object.keys(newState)) {
    if (prevState[key] !== newState[key]) changed.add(key)
  }
  changedFields.value = changed
  prevState = { ...newState }

  if (flashTimer) clearTimeout(flashTimer)
  if (changed.size > 0) {
    flashTimer = setTimeout(() => {
      changedFields.value = new Set()
      flashTimer = null
    }, 700)
  }
})

onUnmounted(() => {
  if (flashTimer) clearTimeout(flashTimer)
  prevState = {}
})

function eventKey(e: HistoryEvent) {
  return `${e.user}-${e.device}-${e.field}-${e.click}`
}
</script>

<template>
  <div class="comap-wrap">
    <!-- Time display -->
    <div class="time-display">{{ currentTime }}</div>

    <!-- Title bar -->
    <div class="title-bar">
      <span class="title-id">CoMap</span>
      <span class="title-hash">co_z3YG8oTv5VWNMQT</span>
    </div>

    <!-- Outer frame -->
    <div class="outer-frame">

      <!-- HEADER section -->
      <div class="section-row">
        <div class="section-label"><span>HEADER</span></div>
        <div class="header-content">
          <div class="header-field"><span class="header-key">type:</span> <span class="header-val">"todo"</span></div>
          <div class="header-field"><span class="header-key">createdAt:</span> <span class="header-val">8:00 AM</span></div>
          <div class="header-field"><span class="header-key">owner:</span> <span class="header-val" :style="{ color: USER_COLORS.alice }">alice</span></div>
          <div class="header-field"><span class="header-key">uniqueness:</span> <span class="header-val">co_z3YG8oTv5VWNMQT</span></div>
        </div>
      </div>

      <div class="section-divider" />

      <!-- HISTORY section -->
      <div class="section-row history-section">
        <div class="section-label"><span>HISTORY</span></div>
        <div class="history-columns">
          <div v-for="col in columns" :key="col.key" class="history-col">
            <div class="col-header">
              <span class="col-user" :style="{ color: USER_COLORS[col.user] }">{{ col.user }}</span>
              <span class="col-device">device {{ col.device }}</span>
            </div>
            <TransitionGroup name="entry" tag="div" class="entries">
              <div
                v-for="e in col.events"
                :key="eventKey(e)"
                class="entry-row"
                :class="{ 'entry-new': clicks === e.click }"
              >
                <span class="entry-field">{{ e.field }}: <span class="entry-value">{{ e.value }}</span></span>
                <span class="entry-time">{{ e.time }}</span>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Triangle separator -->
      <div class="triangle-separator">
        <span class="triangle-label">LWW merge</span>
        <span class="triangle-icon">&#9660;</span>
      </div>

      <div class="section-divider" />

      <!-- STATE section -->
      <div class="section-row">
        <div class="section-label"><span>STATE</span></div>
        <div class="state-content">
          <span class="state-brace">{</span>
          <span
            v-for="([key, val], i) in mergedEntries"
            :key="key"
            class="state-entry"
          >
            <span class="state-key">{{ key }}</span>:
            <span
              class="state-value"
              :class="{ 'state-flash': changedFields.has(key) }"
            >{{ val }}</span><span v-if="i < mergedEntries.length - 1">,&nbsp;</span>
          </span>
          <span class="state-brace">}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.comap-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Geist Mono', monospace;
  color: rgba(255, 255, 255, 0.7);
}

.time-display {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 13px;
}

.title-id {
  color: rgba(255, 107, 237, 0.9);
  font-weight: 600;
}

.title-hash {
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
}

.outer-frame {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  width: 680px;
  overflow: hidden;
}

.section-row {
  display: flex;
}

.section-label {
  width: 28px;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 0;
}

.section-label span {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
}

.section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

/* HEADER */
.header-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 24px;
  padding: 10px 16px;
  font-size: 11px;
}

.header-key {
  color: rgba(255, 255, 255, 0.35);
}

.header-val {
  color: rgba(255, 255, 255, 0.6);
}

/* HISTORY */
.history-section {
  min-height: 140px;
}

.history-columns {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
}

.history-col {
  padding: 8px 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.history-col:last-child {
  border-right: none;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 11px;
}

.col-user {
  font-weight: 600;
}

.col-device {
  color: rgba(255, 255, 255, 0.25);
  font-size: 10px;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  font-size: 11px;
}

.entry-new {
  background: rgba(255, 107, 237, 0.12);
}

.entry-field {
  color: rgba(255, 255, 255, 0.5);
}

.entry-value {
  color: rgba(255, 107, 237, 0.85);
}

.entry-time {
  color: rgba(255, 255, 255, 0.2);
  font-size: 9px;
  margin-left: 8px;
  white-space: nowrap;
}

/* Entry transitions */
.entry-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.entry-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

/* Triangle separator */
.triangle-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 0;
  color: rgba(255, 255, 255, 0.2);
  font-size: 11px;
}

.triangle-label {
  letter-spacing: 0.05em;
}

.triangle-icon {
  font-size: 10px;
}

/* STATE */
.state-content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 12px 16px;
  font-size: 13px;
}

.state-brace {
  color: rgba(255, 255, 255, 0.25);
}

.state-entry {
  color: rgba(255, 255, 255, 0.4);
}

.state-key {
  color: rgba(255, 255, 255, 0.55);
}

.state-value {
  color: rgba(255, 107, 237, 0.85);
  padding: 1px 4px;
  border-radius: 3px;
}

.state-flash {
  animation: flash 0.6s ease-out;
}

@keyframes flash {
  0% {
    background: rgba(255, 107, 237, 0.35);
  }
  100% {
    background: transparent;
  }
}
</style>
