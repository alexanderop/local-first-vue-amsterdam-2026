---
theme: '@alexop/slidev-theme-brand'
addons:
  - '@alexop/slidev-addon-utils'
title: 'How to Build Local-First Apps with Vue'
transition: slide-left
mdc: true
drawings:
  persist: false
info: |
  ## How to Build Local-First Apps with Vue 

  Local-First is a new community that was created based on the idea of building apps where users have more control over them. It is related to the offline-first concept, but takes it a step further. In this talk, I will explain what Local-First means and how we can build applications with Vue
hideFooter: true
---

<div class="flex items-center justify-center h-full">
  <img src="/vue-amsterdam.png" class="max-h-full max-w-full" />
</div>

---

<PartSlide title="How to Build Local-First Apps with Vue" subtitle="Vue Amsterdam 2026 — Alexander Opalic" />

<!--
BREATHE. Smile. Make eye contact.

"Hey everyone — thanks for being here. Today I want to take you on a journey: from the jQuery days of manual DOM manipulation, through the reactive revolution that Vue gave us, all the way to a fundamentally different way of thinking about data in web applications."

- By the end: what local-first means, why it matters, how to start with Vue TODAY
- Promise: you'll leave with code you can use on Monday

[CHECK: 0:00 — starting]
-->

---

# About me

<About />

<!--
- Name, company, role — keep it to 15 seconds
- Mention: blog at alexop.dev, article comparing 7 sync engines for Vue
- "Enough about me — let's talk about you."

TRANSITION: "Quick show of hands..."
-->

---
layout: statement
transition: fade-out
---

# Raise your hand if you've heard of local-first

<!--
EYE CONTACT — scan the room.

"Raise your hand if you've heard of local-first."

- Wait 3 full seconds. Let hands go up.
- "Great — a good number. For those who haven't, don't worry. By the end you'll know exactly what it means."

TRANSITION: "Now keep those hands up..."
-->

---
layout: statement
transition: fade-out
---

# Keep it up if you've built an offline-capable app

<!--
"...keep your hand up if you've actually BUILT an app that works offline."

PAUSE — watch hands drop. Smile.

"Yeah — way fewer hands. That gap is exactly why we're here today."

TRANSITION: "Here's the roadmap for the next 25 minutes..."
-->

---

<PyramidOutline :items="[
  { title: 'The Status Quo', subtitle: 'Vue abstracts the DOM, not the data' },
  { title: 'Offline-First', subtitle: 'The app that never stops working' },
  { title: 'Sync Engines', subtitle: 'The new data layer' },
  { title: 'Local-First', subtitle: `It's about values, not just technology` }
]" />

<!--
"Four parts, each building on the last."

- Point at pyramid as you name each: status quo → offline-first → sync engines → local-first
- "Each level adds capabilities. By the end we'll have a full scorecard."

TRANSITION: "Let's start at the bottom — the status quo."

[CHECK: ~2:00 — if past 3:00 you're slow, pick up pace]
-->

---
transition: fade
---

<PartSlide part="0" title="The Status Quo" subtitle="Vue Abstracts the DOM, Not the Data" />

<!--
SLOW DOWN — this is a section transition. Let it land.

"Before we talk about where we're going, let's be honest about where we are."

- WHY IT MATTERS: The audience needs to feel the pain before you offer the cure
- "Vue gave us reactive rendering — but the data layer? That's still entirely on us."
-->

---
clicks: 5
---

<div class="flex items-center justify-center h-full">
<DuplicatedArchDiagram
  :panels="[
    {
      title: 'FRONTEND',
      items: [
        { id: 'ref', label: 'ref([])', click: 1 },
        { id: 'loading', label: 'loading = true', click: 1 },
        { id: 'try', label: 'try { ... }', click: 1 },
        { id: 'catch', label: 'catch { ... }', click: 1 },
        { id: 'finally', label: 'finally { ... }', click: 1 },
        { id: 'cache', label: 'invalidateCache()', click: 1 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 4,
    },
    {
      title: 'BACKEND',
      items: [
        { id: 'get', label: 'app.get(\'/todos\')', click: 2 },
        { id: 'validate', label: 'validate(...)', click: 2 },
        { id: 'insert', label: 'db.insert(...)', click: 2 },
        { id: 'auth', label: 'authorize(...)', click: 2 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 4,
    },
  ]"
  :connections="[
    { label: 'fetch', click: 3 },
    { label: 'POST', click: 3 },
  ]"
  :callout="{ label: 'DUPLICATED', click: 5, variant: 'danger' }"
  :seed="150"
/>
</div>

<!--
Point at the diagram. Let them read it for 3 seconds.

- "Look at all this duplicated logic — validation on both sides, auth checks on both sides, error types on both sides."
- "We solved rendering. But we're still manually wiring the data plumbing. Over and over."

PAUSE — let them nod. They know this pain.

TRANSITION: "Kyle Mathews has a great analogy for this..."
-->

---
layout: quote
transition: fade
---

# "We're in the <span v-mark="{ type: 'circle', color: '#ff6bed' }">jQuery era of data</span>."

Kyle Mathews

<!--
SLOW DOWN — this is a key quote.

- Kyle Mathews = founder of Gatsby, now CEO of ElectricSQL
- Said this on localfirst.fm podcast
- "With jQuery, you'd grab a DOM element, tweak text, remove a child... you were fiddling with the DOM constantly. Vue freed us from that."
- "But we're STILL doing the same imperative dance with DATA — fetch this, cache that, retry this, invalidate that."
- "We're in the jQuery era of data. History is repeating."

PAUSE — let the analogy sink in.

TRANSITION: "Let me show you what that looks like in Vue code..."
-->

---

# What Does This Look Like in Code?

````md magic-move {lines: true}
```ts
// Traditional Vue — Loading Todos
const todos = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchTodos() {
  loading.value = true
  try {
    todos.value = await fetch('/api/todos').then(r => r.json())
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}
```
```ts
// Traditional Vue — Now let's add a todo...
const todos = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchTodos() { /* ... */ }

async function addTodo(title) {
  const temp = { id: crypto.randomUUID(), title, done: false }
  todos.value.push(temp) // optimistic update
  try {
    const saved = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }).then(r => r.json())
    todos.value = todos.value.map(t => t.id === temp.id ? saved : t)
  } catch (e) {
    todos.value = todos.value.filter(t => t.id !== temp.id) // rollback
    error.value = e
  }
}
```
```ts
// Traditional Vue — And we still need...
const todos = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchTodos() { /* ... */ }
async function addTodo(title) { /* ... */ }

onMounted(fetchTodos)
// TODO: real-time updates? → polling? websocket?
// TODO: offline support?   → service worker? local cache?
// TODO: optimistic UI?     → rollback on failure?
// TODO: multiple tabs?     → BroadcastChannel? shared worker?
```
```ts
// With a sync engine (e.g. LiveStore)
const todos = useQuery(queryDb(tables.todos.select()))
const { commit } = useStore()

function addTodo(title) {
  commit(events.todoCreated({ id: crypto.randomUUID(), title }))
}

// Optimistic updates    — built in
// Real-time sync        — built in
// Offline reads/writes  — built in
// Conflict resolution   — built in
// Multi-tab sync        — built in
```
````

<!--
Step 1: "OK, let's load some todos. Already 3 refs and a try/catch/finally just to fetch data."

CLICK → Step 2: "Now we want to add a todo. Optimistic update so it feels instant... but we need rollback if the server fails. Look how much code that is."

CLICK → Step 3: "And we're still not done. Real-time? Offline? Conflicts? Multiple tabs? Each one is another weekend of work."

CLICK → Step 4: Magic move collapses everything. "With LiveStore — useQuery gives you a reactive computed, store.commit writes an event that's applied locally and synced. Offline, real-time, conflict resolution via git-like rebasing, multi-tab — all built in."

TRANSITION: "To understand this, let's look at what Vue already solved..."

[CHECK: ~5:00]
-->

---
clicks: 2
---

<FlowDiagram
  :nodes="[
    { id: 'source', label: 'Source', subtitle: 'ref(0)', variant: 'accent' },
    { id: 'reconciler', label: 'Reconciler', subtitle: 'Virtual DOM diff', click: 1 },
    { id: 'target', label: 'Target', subtitle: 'Real DOM', click: 2, variant: 'success' },
  ]"
  :edges="[
    { from: 'source', to: 'reconciler', click: 1 },
    { from: 'reconciler', to: 'target', click: 2 },
  ]"
/>

<!--
- "Vue solved this: you declare state, the framework syncs the DOM."
- Point at the three boxes: source → reconciler → target

CLICK — reveal the callback.

"This pattern — source, reconciler, target — remember it. It comes back."

- Repeat: "Source. Reconciler. Target." Emphasize each word.
-->

---
clicks: 2
---

# But Who Solves Data Sync?

<FlowDiagram
  :nodes="[
    { id: 'jquery', label: 'jQuery Era', subtitle: 'YOU → DOM', variant: 'muted' },
    { id: 'vue', label: 'Vue Era', subtitle: 'Vue → DOM', click: 1 },
    { id: 'now', label: 'Now', subtitle: '??? → DB', click: 2, variant: 'accent' },
  ]"
  :edges="[
    { from: 'jquery', to: 'vue', click: 1 },
    { from: 'vue', to: 'now', click: 2 },
  ]"
/>

<v-clicks>

- jQuery era: **YOU** were the sync engine for the DOM
- Vue era: **Vue** became the sync engine for the DOM
- Now: Who's the sync engine for **DATA**?

</v-clicks>

<!--
Build this progressively with clicks:

CLICK 1: "jQuery era — YOU were the sync engine. getElementById. appendChild. Manual everything."
CLICK 2: "Vue era — Vue became the sync engine for the DOM. Declarative. Reactive."
CLICK 3: "Now — who's the sync engine for DATA?" PAUSE. Let them think.

- "The same pattern repeats, one layer up."
- "Vue solved rendering. Now we need something to solve data."

TRANSITION: "Let's see where that leaves us on the scorecard..."
-->

---

# The Status Quo Scorecard

<div class="grid grid-cols-4 gap-3 mt-6">
  <div v-click="1" class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-lightning text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Fast</div>
    <div class="text-xs text-gray-500 leading-tight">No spinners. Instant response.</div>
  </div>
  <div v-click="2" class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-devices text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Multi-device</div>
    <div class="text-xs text-gray-500 leading-tight">Your work on any device.</div>
  </div>
  <div v-click="3" class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-wifi-slash text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Works offline</div>
    <div class="text-xs text-gray-500 leading-tight">The network is optional.</div>
  </div>
  <div v-click="4" class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-users-three text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Collaboration</div>
    <div class="text-xs text-gray-500 leading-tight">Seamless real-time teamwork.</div>
  </div>
</div>

<div class="flex justify-center gap-3 mt-3">
  <div v-click="5" class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-clock-countdown text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Longevity</div>
    <div class="text-xs text-gray-500 leading-tight">Your data outlives the app.</div>
  </div>
  <div v-click="6" class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-shield-check text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Privacy</div>
    <div class="text-xs text-gray-500 leading-tight">Security and privacy by default.</div>
  </div>
  <div v-click="7" class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-key text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">User control</div>
    <div class="text-xs text-gray-500 leading-tight">You retain ownership and control.</div>
  </div>
</div>

<div v-click="8" class="mt-6 text-center">
  <span class="text-sm text-gray-400 italic">The 7 ideals from </span>
  <span class="text-sm font-semibold italic" style="color: #ff6bed">"Local-First Software"</span>
  <span class="text-sm text-gray-400 italic"> — Ink & Switch, 2019</span>
</div>

<div v-click="9" class="mt-4 text-center text-gray-500">

Vue solved **rendering**. But the data layer? Still the jQuery era. **0 out of 7.**

</div>

<!--
CLICK 1 — "Fast"
"Your app should respond instantly. No loading spinners, no waiting for the server."

CLICK 2 — "Multi-device"
"People work across laptops, phones, tablets. The data should follow them."

CLICK 3 — "Works offline"
"Airplane mode, bad WiFi, underground — the app should still work."

CLICK 4 — "Collaboration"
"Multiple people should be able to work on the same data, at the same time."

CLICK 5 — "Longevity"
"If a company shuts down, your data shouldn't disappear with it."

CLICK 6 — "Privacy"
"Your data should be encrypted and private by default."

CLICK 7 — "User control"
"You should own your data. Export it, move it, delete it — your choice."

CLICK 8 — reveal the local-first paper attribution.
"These aren't random criteria. These are the seven ideals from the Local-First Software paper by Ink & Switch."

CLICK 9 — reveal the verdict.
"And right now, with the typical Vue app? Zero out of seven. The rendering era is solved. The data era hasn't started. Let's change that."

TRANSITION: "What if we flipped the model?"

[CHECK: ~7:00 — entering Part 1]
-->

---
transition: fade
---

<PartSlide part="1" title="Offline-First" subtitle="The App That Never Stops Working" />

<!--
Section transition — let the slide breathe for a moment.

"What if we flip the model? What if data lives on the client FIRST, and syncs to the server when it can?"

BREATHE.
-->

---
clicks: 5
---



<SplitDiagram
  :panels="[
    {
      title: 'ONLINE',
      nodes: [
        { id: 'local', label: 'Local Store', subtitle: '(IDB/SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 1 },
        { id: 'server', label: 'Server DB', variant: 'success', click: 2 },
      ],
      edges: [
        { from: 'local', to: 'server', label: 'sync ↕', click: 2 },
      ],
    },
    {
      title: 'OFFLINE',
      click: 3,
      nodes: [
        { id: 'local2', label: 'Local Store', subtitle: '(IDB/SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 3 },
        { id: 'pending', label: 'Pending Writes', variant: 'muted', click: 4 },
      ],
      edges: [
        { from: 'local2', to: 'pending', label: 'queued', click: 4 },
      ],
      badges: [
        { text: '✗ no network', position: 'inline', variant: 'danger', click: 4 },
        { text: 'Still works!', position: 'bottom', variant: 'success', click: 5 },
      ],
    },
  ]"
  :seed="200"
/>

<!--
Point at ONLINE side: "Reads and writes go to local store. Syncs in the background."
Point at OFFLINE side: "Network drops? App doesn't care. Writes queue up, sync when it returns."

- Key phrase: "The app never stops working."
- "Still works!" — point at the bottom right

TRANSITION: "But there's a gotcha most people miss..."
-->

---
clicks: 5
---

<PwaDiagram
  :panels="[
    {
      title: 'WITHOUT PWA',
      titleIcon: '❌',
      boxes: [
        { id: 'error', label: '🦕 Chrome Dino', subtitle: 'No Internet', variant: 'danger', click: 1 },
      ],
      arrows: [],
      annotations: [
        { text: 'IndexedDB has data...', variant: 'muted', click: 2 },
        { text: 'but who cares?', variant: 'muted', click: 2 },
        { text: 'App cannot even load.', variant: 'danger', click: 2 },
      ],
    },
    {
      title: 'WITH PWA',
      titleIcon: '✅',
      boxes: [
        { id: 'sw', label: 'Service Worker', subtitle: 'intercepts fetch', variant: 'accent', click: 3 },
        { id: 'cache', label: 'Cache Storage', subtitle: 'HTML, JS, CSS, WASM', variant: 'default', click: 4 },
      ],
      arrows: [
        { from: 'sw', to: 'cache', click: 4 },
      ],
      annotations: [],
      resultText: 'App loads!',
      resultIcon: '🚀',
      resultVariant: 'success',
      resultClick: 5,
    },
  ]"
  :seed="300"
/>

<!--
WHY IT MATTERS: Most people skip this — it's the #1 gotcha.

"You can put all your data in IndexedDB. But if the app shell itself can't load offline — none of it matters. You get the Chrome dinosaur."

Point at left: "Without PWA — dino."
Point at right: "With PWA — Service Worker intercepts, serves from cache. App loads."

- "The PWA is the FOUNDATION. Data layer sits on top."
-->

---
clicks: 4
---

<OfflineStackDiagram />

<!--
- Top: Vue/Nuxt components — your app
- Middle: Data layer — IndexedDB or SQLite WASM
- Bottom: Service Worker — caches the shell

"Three layers. Vue for rendering, a local database for data, and a Service Worker to make the whole thing load offline."

- Mention: vite-plugin-pwa or @vite-pwa/nuxt — easy to add

TRANSITION: "Now which local database should you pick?"
-->

---
clicks: 4
---

# Local Storage Options

<LocalStorageDiagram
  :panels="[
    {
      panel: { title: 'IndexedDB', click: 1 },
      stores: [
        { label: 'Object Store A', value: '{ key: value }', click: 2 },
        { label: 'Object Store B', value: '{ key: value }', click: 2 },
      ],
      meta: {
        lines: [
          { text: 'API: async, callbacks' },
          { text: 'Storage: native' },
          { text: 'Since: 2015, everywhere' },
        ],
        click: 3,
      },
    },
    {
      panel: { title: 'SQLite (WASM)', click: 1 },
      table: {
        headers: ['id', 'name', 'age'],
        rows: [['1', 'Alex', '30'], ['2', 'Sara', '25']],
        click: 2,
      },
      meta: {
        lines: [
          { text: 'API: full SQL queries' },
          { text: 'Storage: OPFS / memory' },
          { text: 'Bundle: ~500KB WASM' },
        ],
        click: 3,
      },
    },
  ]"
  :libraries="{ items: [
    { name: 'Dexie' },
    { name: 'wa-sqlite' },
    { name: 'SQLite WASM' },
    { name: 'PGlite' },
  ], click: 4 }"
/>

<!--
Don't read the diagram — audience can read. Focus on the comparison:

- Left: "IndexedDB — native, everywhere. API is rough. Dexie wraps it beautifully."
- Right: "SQLite WASM — full SQL engine compiled to WebAssembly. The new kid on the block."
- Point at the key-value vs table visual: "Object stores vs relational tables — fundamentally different models."
- "Both work. Different tradeoffs. For today's demo we'll use Dexie."

TRANSITION: "Storing data locally is the easy part. The hard part..."

[CHECK: ~10:00]
-->

---

# The Missing Piece: How Do You Sync?

Storing data locally is the **easy part**.

<v-clicks>

- What happens when two devices change the same data offline?
- This is a **distributed systems** problem
- It needs a **sync engine**

</v-clicks>

<!--
Build tension here — this is the cliffhanger before Part 2.

"Storing data locally? Easy. We just did it."

CLICK: "But what happens when two devices change the same data offline?"
CLICK: "That's a distributed systems problem."
CLICK: "And it needs a sync engine."

PAUSE — let the problem statement hang.

TRANSITION: "But first, let's see what offline-first already gives us..."
-->

---

# What Offline-First Already Gives Us

<div v-click="1" class="grid grid-cols-2 gap-4 mt-6">
  <Card variant="success" glow size="lg">
    <div class="flex items-center gap-2 text-emerald-400 font-bold text-lg"><div class="i-ph-check-circle-fill text-xl" /> Fast — no spinners</div>
    <p class="text-sm text-gray-400 mt-1 pl-7">Data is local. Reads are instant. No waiting for the network.</p>
  </Card>
  <Card variant="success" glow size="lg">
    <div class="flex items-center gap-2 text-emerald-400 font-bold text-lg"><div class="i-ph-check-circle-fill text-xl" /> Works offline</div>
    <p class="text-sm text-gray-400 mt-1 pl-7">The whole point. Read and write without connectivity.</p>
  </Card>
</div>

<div v-click="2" class="grid grid-cols-5 gap-2 mt-4">
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Multi-device?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Collaboration?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Longevity?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Privacy?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> User control?</div>
  </Card>
</div>

<div v-click="3" class="text-center mt-8 text-sm text-gray-500 tracking-wide">
  <span class="text-emerald-400 font-bold">2</span> / <span class="text-gray-400">7</span> local-first principles achieved
</div>

<!--
CLICK — reveal the 2 green cards.

"Offline-first gives us two things for free: speed — because data is local, reads are instant — and offline capability."

CLICK — reveal the 5 question marks.

"But five question marks are still open. We need something more."

CLICK — reveal the counter.

"That's 2 out of 7 local-first principles. We need something more."

TRANSITION: "That something is a sync engine."

[CHECK: ~12:00 — entering Part 2]
-->

---
transition: fade
---

<PartSlide part="2" title="Sync Engines" subtitle="The New Data Layer" />

<!--
Section transition — energy up! This is the exciting part.

"This is where things get really interesting."

BREATHE.
-->

---
---

<ClientServerDiagram
  :clients="[
    { title: 'Client A', layers: [{ label: 'App code' }] },
    { title: 'Client B', layers: [{ label: 'App code' }] },
  ]"
  server-label="API server"
  connection-label="fetch()"
  server-db-label="SQL"
  database-label="Database"
  caption="Sharing data with APIs"
  :seed="300"
/>

<!--
Traditional architecture: every client talks to the server via HTTP.

The server is the single source of truth. Clients fetch, mutate, re-fetch.

This works — but what happens when the network goes away?
-->

---
---

<ClientServerDiagram
  :clients="[
    {
      title: 'Client A',
      layers: [
        { label: 'App code' },
        { label: 'Sync client', variant: 'accent' },
        { label: 'Local DB', variant: 'success' },
      ],
    },
    {
      title: 'Client B',
      layers: [
        { label: 'App code' },
        { label: 'Sync client', variant: 'accent' },
        { label: 'Local DB', variant: 'success' },
      ],
    },
  ]"
  server-label="Sync server"
  connection-label="Sync"
  server-db-label="SQL"
  database-label="Database"
  caption="Sharing data with sync"
  :seed="310"
/>

<!--
Now each client has its own local database and a sync layer.

The app reads and writes locally — instant. The sync client handles replication in the background.

This is the architecture that sync engines give you.
-->

---
clicks: 2
---

# What Is a Sync Engine?

Same pattern as Vue's reactivity, but **bidirectional** and **across the network**.

<div class="text-xs op-60 mb-1">Layer 2: DATA SYNC</div>
<FlowDiagram
  :nodes="[
    { id: 'local', label: 'Local Store', variant: 'accent' },
    { id: 'sync', label: 'Sync Engine', subtitle: 'protocol', click: 1 },
    { id: 'server', label: 'Server DB', click: 1, variant: 'success' },
  ]"
  :edges="[
    { from: 'local', to: 'sync', click: 1 },
    { from: 'sync', to: 'server', click: 1 },
  ]"
  :nodeHeight="60"
  :gap="80"
  :seed="100"
/>

<div class="text-xs op-60 mb-1 mt-2">Layer 1: UI SYNC (Vue already solved this)</div>
<FlowDiagram
  :nodes="[
    { id: 'ref', label: 'ref()', variant: 'muted', click: 2 },
    { id: 'vdom', label: 'Virtual DOM', variant: 'muted', click: 2 },
    { id: 'dom', label: 'Real DOM', variant: 'muted', click: 2 },
  ]"
  :edges="[
    { from: 'ref', to: 'vdom', click: 2 },
    { from: 'vdom', to: 'dom', click: 2 },
  ]"
  :nodeHeight="60"
  :gap="80"
  :seed="200"
/>

<!--
"Remember the pattern I asked you to remember? Source, reconciler, target."

Point at Layer 1: "Vue handles UI sync — we know this."
Point at Layer 2: "A sync engine is the SAME pattern, but for data across the network."

- "Two layers. Same idea. Vue solved layer 1. A sync engine solves layer 2."
-->

---

# The Object Sync Engine Pattern

Three teams — **Linear, Figma, and Asana** — all converged on this independently.

<FlowDiagram
  :nodes="[
    { id: 'local', label: 'Local Store', subtitle: 'Instant reads/writes', variant: 'accent' },
    { id: 'server', label: 'Server Store', subtitle: 'Authority + durability', variant: 'success' },
  ]"
  :edges="[
    { from: 'local', to: 'server', label: 'sync protocol' },
  ]"
  :gap="160"
/>

Three teams built this independently. **Same architecture.** That's a strong signal.

<!--
"This isn't theoretical. Linear, Figma, Asana — three of the most successful product teams — all independently arrived at the SAME architecture."

PAUSE — let "independently" land. That's the signal.

- Local store = instant reads/writes, no spinners
- Server store = durability, authority
- Sync protocol = minimal deltas between them

TRANSITION: "Let's look at what's out there. The ecosystem has exploded."
-->

---
transition: fade
---

<PartSlide title="The Sync Engine Landscape" subtitle="Choose Your Weapon" icon="🧭" />

<!--
Energy shift — this is the exciting part!

"Now that we know we need a sync engine, let's look at what's out there. The ecosystem has EXPLODED."

BREATHE.

[CHECK: ~14:00 — landscape section starts]
-->

---
clicks: 6
---

# The Landscape

<div class="grid grid-cols-3 gap-3 mt-4">
  <Card v-click="1" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">Jazz</div>
    <div class="text-xs text-gray-400 mt-1">Batteries-included. Auth, permissions, E2E encryption, sync — all built in.</div>
  </Card>
  <Card v-click="2" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">LiveStore</div>
    <div class="text-xs text-gray-400 mt-1">Event-sourced. Reactive SQLite WASM in the browser. Git-like rebasing for conflicts.</div>
  </Card>
  <Card v-click="3" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">Dexie</div>
    <div class="text-xs text-gray-400 mt-1">IndexedDB wrapper. Add DexieCloud for sync. Progressive upgrade path.</div>
  </Card>
  <Card v-click="4" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">Yjs</div>
    <div class="text-xs text-gray-400 mt-1">CRDT library. Bring your own backend. P2P possible. Maximum flexibility.</div>
  </Card>
  <Card v-click="5" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">Zero</div>
    <div class="text-xs text-gray-400 mt-1">Query-driven sync. Reactive Postgres to client SQLite. Server-authoritative.</div>
  </Card>
  <Card v-click="6" variant="muted" size="md">
    <div class="text-sm font-bold text-pink-400">DIY: Nuxt + Nitro</div>
    <div class="text-xs text-gray-400 mt-1">Roll your own with WebSockets + CRDTs. Full control. Full responsibility.</div>
  </Card>
</div>

<!--
Build with clicks — one card at a time:

CLICK 1: "Jazz — batteries-included. Auth, permissions, end-to-end encryption, sync — everything built in. You define your data as CoValues and it just works."

CLICK 2: "LiveStore — event-sourced. SQLite WASM running IN the browser. You define events and tables, it materializes state like a git rebase."

CLICK 3: "Dexie — wraps IndexedDB with a clean API. Add DexieCloud for sync. Great progressive upgrade path."

CLICK 4: "Yjs — a CRDT library. Not a platform. You bring your own backend. WebSocket, WebRTC, even P2P. Maximum flexibility."

CLICK 5: "Zero — query-driven sync from Postgres to client-side SQLite. Instant reads. BUT — server is the source of truth. Not truly local-first."

CLICK 6: "Or build your own. Nuxt plus Nitro WebSocket plus Yjs. Full control. Full responsibility."

TRANSITION: "Let me show you what each looks like in code..."
-->

---

# Wait — What About rstore?

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

**rstore** (Guillaume Chau / Directus) is a **data management layer**, not a sync engine.

<div class="text-sm mt-4 text-gray-400">

- Normalized reactive cache
- Plugin system — fetch from any source
- Reads are always local (from cache)
- First-class Nuxt module (`@rstore/nuxt`)

</div>

</div>

<div>

```ts
const store = useStore()

const { data: todos } = await store.todos
  .query(q => q.many())

// Reads: instant from cache
// Writes: optimistic, then server
await store.todos.create({
  title: 'New todo', done: false,
})
```

</div>

</div>

<Callout type="info">

**Complementary, not competing.** rstore manages data in your app (like TanStack Query). Sync engines replicate data across devices. You could plug a sync engine into rstore's plugin system.

</Callout>

<!--
"Quick sidebar — some of you might have heard of rstore. Guillaume Chau — Akryum, Vue core team — built this at Directus."

"rstore is NOT a sync engine. It's a data management layer — like TanStack Query but Vue-native, with a normalized cache."

"Its reads are always local from cache — that's a local-first principle. And its plugin system means you COULD plug a sync engine underneath."

"Think of it as a complementary layer. rstore manages your data. A sync engine replicates it."

"Guillaume has a talk about it at this conference — check it out!"

TRANSITION: "Now let me show you how the actual sync engines look in code..."
-->

---

# What Does Each Look Like in Vue?

````md magic-move {lines: true}
```ts
// Jazz — Batteries-included
import { co, z } from 'jazz-tools'
import { useCoState } from 'jazz-vue'

const Todo = co.map({ title: z.string(), done: z.boolean() })
const TodoList = co.list(Todo)

// In your component:
const todos = useCoState(TodoList, listId)

function addTodo(title: string) {
  todos.value?.push(Todo.create({ title, done: false }))
}
// ✅ Auth, permissions, E2E encryption — all included
// ✅ Real-time sync via Jazz Cloud or self-host
```
```ts
// LiveStore — Event-sourced reactive SQLite
import { useStore, useQuery } from 'vue-livestore'
import { queryDb } from '@livestore/livestore'
import { tables, events } from './schema'

// In your component:
const todos = useQuery(queryDb(tables.todos.select()))
const { commit } = useStore()

function addTodo(title: string) {
  commit(events.todoCreated({ id: crypto.randomUUID(), title }))
}
// ✅ SQLite WASM running in the browser — full SQL queries
// ✅ Git-like rebasing for conflict resolution
```
```ts
// Dexie — IndexedDB wrapper + optional cloud
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'
import { db } from './db'

// In your component:
const todos = useObservable(
  from(liveQuery(() => db.todos.orderBy('createdAt').toArray()))
)

async function addTodo(title: string) {
  await db.todos.add({ title, done: false, createdAt: new Date() })
}
// ✅ Progressive: local-only → npm i dexie-cloud-addon → sync
// ⚠ Last-write-wins conflict resolution
```
```ts
// Yjs — CRDT library, bring your own backend
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ref } from 'vue'

const ydoc = new Y.Doc()
const ytodos = ydoc.getArray('todos')
new WebsocketProvider('ws://localhost:1234', 'room', ydoc)

// Bridge to Vue reactivity:
const todos = ref(ytodos.toArray())
ytodos.observe(() => { todos.value = ytodos.toArray() })

function addTodo(title: string) {
  ytodos.push([{ id: crypto.randomUUID(), title, done: false }])
}
// ✅ True CRDTs — automatic conflict resolution
// ✅ P2P possible (y-webrtc), or use y-sweet, y-redis
```
```ts
// Zero — Server-authoritative query sync
import { useQuery } from 'zero-vue'

// In your component:
const { data: todos } = useQuery(
  z.query.todo.orderBy('createdAt', 'asc')
)

function addTodo(title: string) {
  z.mutate.todo.insert({
    id: crypto.randomUUID(), title, done: false,
  })
}
// ✅ Instant reads from client-side SQLite cache
// ⚠ Server is source of truth — not truly local-first
```
```ts
// DIY — Nuxt + Nitro WebSocket + Yjs
// server/routes/_ws.ts
export default defineWebSocketHandler({
  message(peer, message) {
    // Broadcast CRDT updates to all connected peers
    for (const p of peer.peers) p.send(message.rawData)
  },
})

// composables/useSync.ts — connect Yjs to Nitro
const ydoc = new Y.Doc()
const ws = new WebSocket('/_ws')
ydoc.on('update', (update) => ws.send(update))
ws.onmessage = (e) => Y.applyUpdate(ydoc, new Uint8Array(e.data))
// ✅ Full control over your sync protocol
// ⚠ You build and maintain everything yourself
```
````

<!--
Let magic-move animate each transition. Don't read the code — focus on the KEY DIFFERENCE:

CLICK → Jazz: "useCoState gives you a reactive reference. push() to write. Auth, permissions, encryption — all included. Zero boilerplate."

CLICK → LiveStore: "Event-sourced. You commit events, they materialize into SQLite state. Like Redux but with a real database."

CLICK → Dexie: "Wraps IndexedDB. liveQuery is reactive like computed(). Add DexieCloud later for sync."

CLICK → Yjs: "A CRDT library, not a platform. You CHOOSE your transport. WebSocket, WebRTC, peer-to-peer."

CLICK → Zero: "Server-authoritative. Postgres on the server, SQLite cache on the client. Great DX. But server owns the data."

CLICK → DIY: "Nuxt plus Nitro WebSocket. Use Yjs for CRDTs. Full control, full responsibility."

TRANSITION: "So how do we choose?"

[CHECK: ~18:00]
-->

---
clicks: 7
---

# Choosing the Right Engine

<div class="text-sm mt-2">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-2"></th>
      <th class="text-left py-1.5 px-1 text-xs">Local DB</th>
      <th class="text-left py-1.5 px-1 text-xs">Sync</th>
      <th class="text-left py-1.5 px-1 text-xs">Conflicts</th>
      <th class="text-left py-1.5 px-1 text-xs">Offline W</th>
      <th class="text-left py-1.5 px-1 text-xs">Vue</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Jazz</td>
      <td class="py-1.5 px-1 text-xs">CoValues</td>
      <td class="py-1.5 px-1 text-xs">Jazz Cloud / self-host</td>
      <td class="py-1.5 px-1 text-xs">CRDTs</td>
      <td class="py-1.5 px-1 text-xs text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">jazz-vue</td>
    </tr>
    <tr v-click="2" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">LiveStore</td>
      <td class="py-1.5 px-1 text-xs">SQLite WASM</td>
      <td class="py-1.5 px-1 text-xs">Built-in</td>
      <td class="py-1.5 px-1 text-xs">Event rebasing</td>
      <td class="py-1.5 px-1 text-xs text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">vue-livestore</td>
    </tr>
    <tr v-click="3" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Dexie</td>
      <td class="py-1.5 px-1 text-xs">IndexedDB</td>
      <td class="py-1.5 px-1 text-xs">DexieCloud</td>
      <td class="py-1.5 px-1 text-xs">Last-write-wins</td>
      <td class="py-1.5 px-1 text-xs text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">liveQuery + VueUse</td>
    </tr>
    <tr v-click="4" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Yjs</td>
      <td class="py-1.5 px-1 text-xs">Y.Doc (memory)</td>
      <td class="py-1.5 px-1 text-xs">y-websocket / y-webrtc</td>
      <td class="py-1.5 px-1 text-xs">CRDTs</td>
      <td class="py-1.5 px-1 text-xs text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">DIY composable</td>
    </tr>
    <tr v-click="5" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Zero</td>
      <td class="py-1.5 px-1 text-xs">SQLite (cache)</td>
      <td class="py-1.5 px-1 text-xs">zero-cache server</td>
      <td class="py-1.5 px-1 text-xs">Server authority</td>
      <td class="py-1.5 px-1 text-xs text-red-400">No</td>
      <td class="py-1.5 px-1 text-xs">zero-vue</td>
    </tr>
    <tr v-click="6" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Nuxt DIY</td>
      <td class="py-1.5 px-1 text-xs">Your choice</td>
      <td class="py-1.5 px-1 text-xs">Nitro WebSocket</td>
      <td class="py-1.5 px-1 text-xs">Your choice (CRDTs)</td>
      <td class="py-1.5 px-1 text-xs text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">Native</td>
    </tr>
  </tbody>
</table>
</div>

<Callout v-click="7" type="info">

**No one-size-fits-all.** Jazz and LiveStore are closest to the local-first ideal. Dexie is the easiest entry point. Yjs gives you maximum flexibility. Zero is great DX for server-first apps. DIY when you need full control.

</Callout>

<!--
Build the table progressively. Don't read every cell — focus on the KEY DIFFERENTIATOR:

CLICK 1: "Jazz — everything built in. CRDTs, auth, permissions. Closest to the ideal."
CLICK 2: "LiveStore — event-sourced with SQLite WASM. Events in, state out. Like git rebase for your data."
CLICK 3: "Dexie — the easiest entry point. IndexedDB locally, add cloud sync later."
CLICK 4: "Yjs — a CRDT library. YOU choose the transport. Maximum flexibility."
CLICK 5: "Zero — great DX, but notice that red No. No offline writes. Server is the authority."
CLICK 6: "Or DIY with Nuxt and Nitro WebSocket. Full control. Pick your own database and CRDTs."

CLICK 7 (callout): "No one-size-fits-all. The right choice depends on YOUR app."

TRANSITION: "But are any of these truly local-first?"

[CHECK: ~19:00]
-->

---
layout: statement
transition: fade-out
---

# But Are These Truly Local-First?

<div v-click class="mt-8 text-xl op-80">

Let's test them against Martin Kleppmann's three criteria.

</div>

<!--
PAUSE — build tension.

"We've seen the landscape. But which of these are actually local-first?"

CLICK — reveal the sub-question.

"Martin Kleppmann — author of Designing Data-Intensive Applications — defines truly local-first as meeting three criteria."

[CHECK: ~20:00]
-->

---
clicks: 7
---

# The Local-First Litmus Test

1. **Multiplayer / multi-device sync** 2. **Works offline** — full read + write 3. **Survives the developer shutting down**

<div class="mt-2 text-sm">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-2"></th>
      <th class="text-center py-1.5 px-1 text-xs">Sync</th>
      <th class="text-center py-1.5 px-1 text-xs">Offline R/W</th>
      <th class="text-center py-1.5 px-1 text-xs">Survives Shutdown</th>
      <th class="text-left py-1.5 px-1 text-xs">Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">Jazz</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-yellow-400">~</td>
      <td class="py-1.5 px-1 text-xs">Open-source, self-hostable</td>
    </tr>
    <tr v-click="2" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">LiveStore</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-yellow-400">~</td>
      <td class="py-1.5 px-1 text-xs">Open-source, self-hostable</td>
    </tr>
    <tr v-click="3" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">Dexie</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-red-400">No</td>
      <td class="py-1.5 px-1 text-xs">DexieCloud is proprietary</td>
    </tr>
    <tr v-click="4" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">Yjs</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">Fully open, P2P possible</td>
    </tr>
    <tr v-click="5" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">Zero</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-red-400">No</td>
      <td class="text-center py-1.5 px-1 text-red-400">No</td>
      <td class="py-1.5 px-1 text-xs">Server-authoritative</td>
    </tr>
    <tr v-click="6" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold">Nuxt DIY</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">You own everything</td>
    </tr>
  </tbody>
</table>
</div>

<Callout v-click="7" type="warn">

**The spectrum is real.** Most engines are "local-first-ish." Yjs and DIY can truly survive a vendor disappearing. Jazz and LiveStore get you 90% there. Zero is server-first with a great cache.

</Callout>

<!--
Build progressively with clicks:

CLICK 1: "Jazz — open-source, self-hostable. Gets close. But most people will use Jazz Cloud in practice."
CLICK 2: "LiveStore — same story. Open-source core, but sync infrastructure still needs to run somewhere."
CLICK 3: "Dexie — sync depends on proprietary DexieCloud. Local data survives, but sync doesn't."
CLICK 4: "Yjs — fully open-source. CRDTs mean peers can sync without a central server. Closest to truly local-first."
CLICK 5: "Zero — no offline writes. Server-authoritative. Great DX, but fundamentally not local-first."
CLICK 6: "DIY — you own everything. If you build it right, it's truly local-first."

CLICK 7 (callout): "The spectrum is real. No engine perfectly nails all three criteria. But some get much closer than others."

TRANSITION: "So if surviving the shutdown matters — what would actually work?"

[CHECK: ~21:00]
-->

---

# Surviving the Shutdown

If criterion #3 is the dealbreaker — what would actually satisfy it?

Ranked **worst → best**:

<div class="text-sm">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-4">Approach</th>
      <th class="text-left py-1.5 px-2">Protection</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Proprietary servers</td>
      <td class="py-1.5 px-2">None — sync gone when they shut down</td>
    </tr>
    <tr v-click="2" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Open-source self-hostable</td>
      <td class="py-1.5 px-2">Better — but who runs it for non-technical users?</td>
    </tr>
    <tr v-click="3" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Peer-to-peer</td>
      <td class="py-1.5 px-2">No central server — but offline peers can't find each other. Signaling servers?</td>
    </tr>
    <tr v-click="4" class="border-b border-white/5">
      <td class="py-1.5 pr-4">File sync (Dropbox / iCloud)</td>
      <td class="py-1.5 px-2">Most resilient — but real-time collaboration breaks</td>
    </tr>
  </tbody>
</table>
</div>

<Callout v-click="5" type="info">

Each step improves resilience, but none is the full answer. Notice: the P2P option needs **conflict resolution without a central authority** — peers must merge changes independently and converge on the same result.

</Callout>

<!--
Build the table progressively — worst to best:

CLICK 1: "Proprietary servers — zero protection. They shut down, you're done."
CLICK 2: "Open-source self-hostable — better. But who runs a server for your grandma?"
CLICK 3: "Peer-to-peer — no central server! But... offline peers can't find each other."
CLICK 4: "File sync — Dropbox, iCloud. Actually the MOST resilient! But real-time collab breaks."

CLICK 5 (callout): "No single approach nails it. But notice the P2P option — it needs conflict resolution WITHOUT a central authority."

TRANSITION: "And that's where CRDTs come in."
-->

---

# CRDTs: Merge Without a Server

<div v-click="1" class="mb-4">

**The problem — last-write-wins is broken:**

```
Peer A (offline):  counter = 3   ── both go online ──┐
Peer B (offline):  counter = 2   ─────────────────────┤
                                                       ▼
                            Last-write-wins → 3 or 2 (both wrong — real answer is 5)
```

</div>

<div v-click="2" class="mb-4">

**G-Counter CRDT — each peer owns a slot:**

```
Peer A: { A: 3, B: 0 }     merge = max per key
Peer B: { A: 0, B: 2 }     ─────────────────→  { A: 3, B: 2 }  →  sum = 5 ✓
```

Deterministic. No coordination. Always converges.

</div>

<Callout v-click="3" type="info">

The server needs **zero conflict-resolution logic** — it just relays bytes. This is what makes the P2P option from the previous slide actually work.

</Callout>

<!--
SLOW DOWN — this is the most technical slide. Explain carefully.

CLICK 1: "Imagine two peers offline, both incrementing a counter. A counted 3, B counted 2."
- "They reconnect. Last-write-wins gives you 3 or 2 — BOTH WRONG."
- "The real answer is 5."

PAUSE — let the problem land.

CLICK 2: "G-Counter CRDT. Each peer owns a slot. To merge: take the max per key."
- "A:3, B:2. Sum = 5. Correct. Deterministic. No coordination."

CLICK 3: "Key insight: the SERVER needs zero conflict resolution logic. It just relays bytes."
- "THIS is what makes true P2P sync possible."

TRANSITION: "Let's update our scorecard..."

[CHECK: ~22:00]
-->

---

# What Sync Engines Add to Our Scorecard

<div v-click="1" class="flex justify-center gap-12 mt-2 mb-4">
  <ScoreTracker :score="2" :total="7">Offline-First</ScoreTracker>
  <div class="text-2xl text-white/30 self-center">→</div>
  <ScoreTracker :score="4" :total="7">+ Sync Engines</ScoreTracker>
</div>

<div v-click="2" class="grid grid-cols-7 gap-2">
  <Card variant="success" size="sm">
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-check-circle-fill text-emerald-400 text-sm" /> Fast</div>
  </Card>
  <Card variant="success" size="sm">
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-check-circle-fill text-emerald-400 text-sm" /> Offline</div>
  </Card>
  <Card size="sm" glow>
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-star-fill text-pink-400 text-sm" /> Multi-device</div>
  </Card>
  <Card size="sm" glow>
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-star-fill text-pink-400 text-sm" /> Collab</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-question text-sm" /> Longevity</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-question text-sm" /> Privacy</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-question text-sm" /> Control</div>
  </Card>
</div>

<div v-click="3" class="mt-6 grid grid-cols-2 gap-x-8 gap-y-1 text-sm max-w-xl mx-auto">
  <div class="text-emerald-400/80">Fast — already had this</div>
  <div class="text-emerald-400/80">Works offline — already had this</div>
  <div class="text-pink-400 font-semibold">Multi-device — NEW! Sync engine</div>
  <div class="text-pink-400 font-semibold">Collaboration — NEW! Real-time</div>
  <div class="text-white/30">Longevity? Still not addressed.</div>
  <div class="text-white/30">Privacy? Still not addressed.</div>
  <div class="text-white/30 col-span-2 text-center">User control? Still not addressed.</div>
</div>

<!--
CLICK 1: "From 2 to 4. Sync engines add multi-device and collaboration."
CLICK 2: Point at the 7 cards — "Two green from before, two new pink stars."
CLICK 3: "But three question marks remain."

PAUSE.

"Turns out — they're not technology problems at all."

TRANSITION: "They're values."
-->

---
transition: fade
---

<PartSlide part="3" title="Local-First" subtitle="It's About Values, Not Just Technology" />

<!--
Section transition — this is the philosophical turn. Slow down.

"We've been tracking a scorecard. 0, then 2, then 4. Now let's reveal what those 7 actually are."

BREATHE.

[CHECK: ~23:00 — if past 25:00, speed up closing slides]
-->

---

# The Reveal: The 7 Ideals

From the Ink & Switch essay on local-first software (2019):

<div v-click="1" class="mt-4">

**Technology:**

<div class="grid gap-1.5 ml-1">
  <div class="flex items-center gap-2"><div class="i-ph-lightning-bold text-pink-400" /> <span><strong>Fast</strong> — No spinners. Data is local.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-devices-bold text-pink-400" /> <span><strong>Multi-device</strong> — Sync across all your devices.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-wifi-slash-bold text-pink-400" /> <span><strong>Works offline</strong> — Network is optional.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-users-bold text-pink-400" /> <span><strong>Collaboration</strong> — Real-time co-editing.</span></div>
</div>

</div>

<div v-click="2" class="mt-4 pt-4 border-t border-white/10">

**Values:**

<div class="grid gap-1.5 ml-1">
  <div class="flex items-center gap-2"><div class="i-ph-clock-bold text-pink-400" /> <span><strong>Longevity</strong> — Data accessible forever. Survives the developer shutting down.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-lock-bold text-pink-400" /> <span><strong>Privacy</strong> — End-to-end encryption. The server never sees your data.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-user-bold text-pink-400" /> <span><strong>User control</strong> — You own your data. Full stop. Export it. Delete it. Script against it.</span></div>
</div>

</div>

<!--
From the Ink & Switch essay (2019) — the foundational text.

CLICK 1 — Technology: "The first four we already know. Fast, multi-device, offline, collaboration. Technology."

CLICK 2 — Values: "But THESE three — longevity, privacy, user control..."

PAUSE.

"These are VALUES. Not features. That's what makes local-first fundamentally different from just another architecture pattern. It's a philosophy about who owns the data."
-->

---
layout: two-cols
---

<div class="h-full flex flex-col justify-center">

## Offline-First Asks

"How do I keep working without a server?"

<Card variant="muted" size="lg" class="mt-8 text-center">

<span v-mark="{ type: 'highlight', color: '#ff6bed' }" class="font-bold">Server</span> is the owner

Client is a cache

</Card>

<div class="mt-4 text-sm op-70">

If server rejects your write → client rolls back

</div>

</div>

::right::

<div class="h-full flex flex-col justify-center">

## Local-First Asks

"Why does the server own my data at all?"

<Card variant="muted" size="lg" class="mt-8 text-center">

<span v-mark="{ type: 'underline', color: '#ff6bed' }" class="font-bold">YOU</span> are the owner

Server is a utility

</Card>

<div class="mt-4 text-sm op-70">

Server can't reject your write → it just relays

</div>

</div>

<!--
Point left: "Offline-first asks: how do I keep working without a server? The server is still the OWNER. Client is a cache."

Point right: "Local-first asks a different question entirely: why does the server own my data AT ALL?"

PAUSE — let the contrast land.

"YOU are the owner. Server is a utility. It can't reject your writes. It just relays them."

- This is the single most important conceptual shift in the talk
-->

---

# The Honest Truth: Real Local-First Is Still Hard

The app that comes closest to nailing all 7 ideals? **Obsidian.**

<div class="grid gap-1 text-sm mt-2">
  <div class="flex items-center gap-2"><div class="i-ph-lightning-bold text-emerald-400" /> <strong>Fast</strong> — local markdown files</div>
  <div class="flex items-center gap-2"><div class="i-ph-devices-bold text-emerald-400" /> <strong>Multi-device</strong> — Obsidian Sync / git / iCloud</div>
  <div class="flex items-center gap-2"><div class="i-ph-wifi-slash-bold text-emerald-400" /> <strong>Offline</strong> — plain files on your disk</div>
  <div class="flex items-center gap-2"><div class="i-ph-users-bold text-yellow-400" /> <strong>Collaboration</strong> — limited (git, shared vaults)</div>
  <div class="flex items-center gap-2"><div class="i-ph-clock-bold text-emerald-400" /> <strong>Longevity</strong> — it's just `.md` files!</div>
  <div class="flex items-center gap-2"><div class="i-ph-lock-bold text-emerald-400" /> <strong>Privacy</strong> — your files, your disk</div>
  <div class="flex items-center gap-2"><div class="i-ph-user-bold text-emerald-400" /> <strong>User control</strong> — open any folder, no lock-in</div>
</div>

<Callout type="warn">

**But:** sync = git or paid Obsidian Sync. Non-technical users can't use git. And building this for the **web?** Much harder.

</Callout>

<!--
"The app that comes closest to all 7? Obsidian."

- Don't read the list — audience can read
- Key point: "It works because it's just markdown files on your disk."
- "But on the WEB? We don't have a filesystem. We need IndexedDB or SQLite plus a sync layer."
- "And every sync engine today ties you to their cloud."

TRANSITION: "So what's missing?"
-->

---

# What's Missing: The Generic Sync Engine

From Martin Kleppmann at Local-First Conf 2024 — **the local-first endgame:**

<div class="mt-8 flex justify-center">
<FlowDiagram
  :nodes="[
    { id: 'app', label: 'Your App' },
    { id: 'dexie', label: 'Dexie Cloud', subtitle: '(proprietary)' },
  ]"
  :edges="[
    { from: 'app', to: 'dexie', label: 'locked to their API' },
  ]"
  direction="horizontal"
  :node-width="200"
  :node-height="80"
  :gap="120"
/>
</div>

<div class="mt-6 text-center text-white/50">
They shut down? Sync is gone. Switch provider? Rewrite your app.
</div>

<!--
Point at diagram: "Today — every sync engine locks you to one cloud."

"They shut down? Sync is gone. Switch provider? Rewrite your app."
-->

---

# The Local-First Endgame

Generic sync, multiple backends:

<div class="mt-8 flex justify-center">
<FlowDiagram
  :nodes="[
    { id: 'app', label: 'Your App', subtitle: 'ALL biz logic HERE', variant: 'accent' },
    { id: 'aws', label: 'AWS / Cloud' },
    { id: 'self', label: 'Self-hosted' },
    { id: 'p2p', label: 'P2P / NAS' },
  ]"
  :edges="[
    { from: 'app', to: 'aws', label: 'open protocol' },
    { from: 'app', to: 'self' },
    { from: 'app', to: 'p2p' },
  ]"
  layout="fan-right"
  :node-width="180"
  :node-height="70"
  :gap="120"
/>
</div>

<div class="mt-6 text-center text-white/50">
Like email: pick Gmail, Fastmail, self-host — the protocol is the same.
</div>

<!--
Point at diagram: "The endgame — open protocol, MULTIPLE backends. AWS for convenience, self-hosted for control, P2P for resilience. All active at once."

"Like email. Pick Gmail, Fastmail, self-host. The protocol is the same. Your data moves freely."

- This doesn't fully exist yet — but this is where the ecosystem is heading
- THIS is what makes ideals 5, 6, 7 possible

TRANSITION: "Now — is this idealistic? Yes. But..."

[CHECK: ~25:00 — entering closing]
-->

---

# Pragmatism vs. Idealism

Movements succeed when **idealists define the vision** and **pragmatists build the infrastructure**.

Historical parallels:

<v-clicks>

- Cypherpunks → SSL → **Let's Encrypt**
- Free Software → Open Web → **GitHub + npm**
- Local-first ideals → Sync engines → **???**

</v-clicks>

We're in the <span v-mark="{ type: 'underline', color: '#ff6bed' }" class="font-bold">pragmatist phase</span> — the tools aren't perfect, but you can start today.

<!--
Adam Wiggins = co-founder of Heroku.

Build with clicks:

CLICK 1: "Cypherpunks dreamed of encrypted communication. Decades later: Let's Encrypt."
CLICK 2: "Free software idealists. Decades later: GitHub and npm."
CLICK 3: "Local-first ideals. The pragmatic infrastructure is... being built right now."

"We're in the pragmatist phase. The tools aren't perfect. But they're good enough to start."
-->

---

# What You Can Do Today

<Card v-click variant="muted" size="lg" class="mb-4">

### <span class="inline-flex items-center gap-2"><span class="i-ph-compass-bold text-pink-400" /> Step 1: Pick your sync engine.</span>

**Dexie** for the easiest start. **Jazz** for batteries-included. **Yjs** for max flexibility. **LiveStore** for event-sourced SQLite. Match the engine to your app.

</Card>

<Card v-click variant="muted" size="lg" class="mb-4">

### <span class="inline-flex items-center gap-2"><span class="i-ph-download-simple-bold text-pink-400" /> Step 2: Let users export their data.</span>

JSON, CSV — whatever. Give them a **download button**. This is the simplest local-first gesture.

</Card>

<Card v-click variant="muted" size="lg">

### <span class="inline-flex items-center gap-2"><span class="i-ph-binoculars-bold text-pink-400" /> Step 3: Watch this space.</span>

The generic sync engine is coming. When it arrives, upgrading from offline-first to local-first will be a **configuration change**, not a rewrite.

</Card>

<!--
"So what can you do on Monday?"

CLICK 1: "Step one: pick a sync engine. Dexie for the easiest start, Jazz for batteries-included, Yjs for flexibility. Each gets you closer to local-first."

CLICK 2: "Step two: add a download button. Let users export their data. JSON, CSV — whatever. That's the SIMPLEST local-first gesture."

CLICK 3: "Step three: watch this space. When the generic sync protocol arrives, upgrading will be a config change, not a rewrite."

- "You're not betting on a specific vendor. You're betting on a PATTERN."

TRANSITION: "Let's see the full scorecard..."
-->

---

# The Full Scorecard

<div class="mt-2 text-sm">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-4"></th>
      <th class="text-center py-1.5 px-2">Status Quo</th>
      <th class="text-center py-1.5 px-2">Offline-First</th>
      <th class="text-center py-1.5 px-2">Sync Engines</th>
      <th class="text-center py-1.5 px-2 font-bold">Local-First</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-lightning-bold text-pink-400 text-xs" /> Fast</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-devices-bold text-pink-400 text-xs" /> Multi-device</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-wifi-slash-bold text-pink-400 text-xs" /> Works offline</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-users-bold text-pink-400 text-xs" /> Collaboration</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-clock-bold text-pink-400 text-xs" /> Longevity</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-lock-bold text-pink-400 text-xs" /> Privacy</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-user-bold text-pink-400 text-xs" /> User control</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
    <tr v-click="3"><td class="py-1.5 pr-4 font-bold">Score</td><td class="text-center font-bold">0/7</td><td class="text-center font-bold">2/7</td><td class="text-center font-bold">4/7</td><td class="text-center font-bold text-pink-400">7/7</td></tr>
  </tbody>
</table>
</div>

<Callout type="info">

Offline-first = a **subset** of local-first. Sync engines = a **bigger subset**. Local-first = **the whole picture.** The first 4 are technology. The last 3 are **values.**

</Callout>

<!--
The payoff slide — build it progressively.

CLICK 1: "Technology row — 0, 2, 4... and local-first nails all four."
CLICK 2: "Values row — only local-first checks these. That's the gap."
CLICK 3: "0, 2, 4, 7."

PAUSE — let the progression sink in.

"The first 4 are technology. The last 3 are values. That's the difference."
-->

---
transition: fade
---

<PartSlide title="Closing" subtitle="The Rendering Era Is Over" />

<!--
BREATHE. You're almost done.

"One more thing before I close."

[CHECK: ~27:00 — if past 28:00, go straight to arc then thank you]
-->

---
clicks: 5
layout: center
class: flex items-center justify-center h-full
---

<Timeline
  :items="[
    { id: 'jquery', title: 'jQuery', year: '(2006)', description: 'You sync the DOM', details: ['Manual', 'getElementById', 'innerHTML'], click: 1, variant: 'muted' },
    { id: 'reactive', title: 'Reactive', year: '(2014)', description: 'Vue syncs the DOM', details: ['Declarative', 'ref() + v-bind', 'computed()'], click: 2 },
    { id: 'sync', title: 'Sync', year: '(2020)', description: 'Engine syncs the data', details: ['No spinners', 'No cache mgmt', 'Multi-device'], click: 3, variant: 'success' },
    { id: 'local-first', title: 'Local-First', year: '(now)', description: 'User owns the data', details: ['Privacy', 'Longevity', 'Full control'], click: 4, variant: 'accent' },
  ]"
/>

<!--
Let the animation play. Then walk through the timeline:

"jQuery — you were the sync engine."
"Vue — the framework syncs the DOM."
"Sync engines — the engine syncs the data."
"Local-first — the USER owns the data."

PAUSE.

"We solved rendering. The data layer is where it's happening now. And Vue is perfectly positioned to be part of it."
-->

---

# References

<div class="text-sm">

- **Local-First Software** — Ink & Switch (2019) — the foundational essay
- **Past, Present, and Future of Local-First** — Kleppmann, Local-First Conf 2024
- **Jazz** — jazz.tools — batteries-included local-first framework
- **LiveStore** — livestore.dev — event-sourced reactive SQLite
- **Dexie.js** — dexie.org — IndexedDB wrapper + DexieCloud sync
- **Yjs** — yjs.dev — high-performance CRDT library
- **Zero** — zero.rocicorp.dev — query-driven sync from Rocicorp
- **rstore** — rstore.dev — reactive data management for Vue/Nuxt
- **Sync Engines for Vue Developers** — alexop.dev
- **A Gentle Introduction to CRDTs** — Matt Wonlaw

</div>

<!--
Don't read the list — just gesture.

"All the references are here and will be on the slides page."

- Only call out: "The Ink & Switch essay is the foundational read. Start there."
- "My article compares 7 sync engines through Vue's lens — link on the next slide."

TRANSITION: "Thank you."
-->

---
layout: end
transition: fade
---

# Thank You!

<div class="mt-4 text-lg">

**alexop.dev** · **@alexanderopalic**

</div>

<div class="mt-6 text-2xl font-bold" style="color: #ff6bed">

alexop.dev/vue-amsterdam

</div>

<div class="mt-2 text-sm op-50">

Slides, references & sync engine comparison

</div>

<!--
EYE CONTACT. Smile.

"Thank you!"

PAUSE — wait for applause to start.

"Slides and all the links are at alexop.dev/vue-amsterdam. Come find me if you want to chat about local-first. Thank you!"

[TARGET: ~28:00-30:00]
-->

---
layout: default
hideFooter: true
clicks: 6
---

# Rough Primitives Test

<RoughSvg :width="700" :height="280" :seed="99">
  <ClickGroup :click="1">
    <RoughRect :x="0" :y="100" :width="160" :height="80" variant="accent" :seed="100" />
    <text x="80" y="140" text-anchor="middle" dominant-baseline="central" :style="{ fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 600, fill: 'rgba(234,237,243,0.95)' }">Client</text>
  </ClickGroup>
  <ClickGroup :click="2">
    <RoughArrow :x1="170" :y1="140" :x2="260" :y2="140" :seed="101" />
  </ClickGroup>
  <ClickGroup :click="3">
    <RoughRect :x="270" :y="100" :width="160" :height="80" variant="success" :seed="102" />
    <text x="350" y="140" text-anchor="middle" dominant-baseline="central" :style="{ fontFamily: 'Geist, sans-serif', fontSize: '16px', fontWeight: 600, fill: 'rgba(234,237,243,0.95)' }">Server</text>
  </ClickGroup>
  <ClickGroup :click="4">
    <RoughLine :x1="270" :y1="185" :x2="430" :y2="185" stroke="rgba(255,255,255,0.3)" :seed="106" />
  </ClickGroup>
  <ClickGroup :click="5">
    <RoughArrow :x1="440" :y1="140" :x2="530" :y2="140" :seed="103" />
  </ClickGroup>
  <ClickGroup :click="6">
    <RoughCircle :x="580" :y="140" :diameter="80" variant="danger" :seed="104" />
    <text x="580" y="140" text-anchor="middle" dominant-baseline="central" :style="{ fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 600, fill: 'rgba(234,237,243,0.95)' }">DB</text>
  </ClickGroup>
</RoughSvg>
