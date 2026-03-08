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

  Local-First is a software design philosophy built on the idea of building apps where users have more control over their data. It is related to the offline-first concept, but takes it a step further. In this talk, I will explain what Local-First means and how we can build applications with Vue.
hideFooter: true
---

<div class="flex items-center justify-center h-full">
  <img src="/vue-amsterdam.png" class="max-h-full max-w-full" />
</div>

---

<PartSlide title="How to Build Local-First Apps with Vue" subtitle="Vue Amsterdam 2026 — Alexander Opalic" />

<!--
[breathe] [scan room]

Excited to be here -- favorite topic
Local-first + Vue

Newer community, growing FAST
Introductory talk -- build your own by the end

TRANSITION: Quick intro...
-->

---

# About me

<About />

<!--
Quick intro from my side

Alexander Opalic -- Vue 8+ years, backend too
Germany, OTTO Payments -- e-commerce
Blog posts + talks on topics I love

TRANSITION: Quick show of hands...
-->

---
layout: statement
transition: fade-out
---

# Raise your hand if you've ever built an app that works offline

<!--
[scan room]

Quick survey -- how familiar are you?

[wait 3 seconds]

TRANSITION: Now keep those hands up...
-->

---
layout: statement
transition: fade-out
---

# Keep it up if you've heard of local-first

<v-click>

# And who has actually built a local-first app?

</v-click>

<!--
[scan room] [wait 3 seconds]

Way fewer hands -- THAT gap is why we're here

[click] Even fewer -- and that's totally fine, that's exactly why this talk exists

[pause]
-->

---

<PyramidOutline :items="[
  { title: 'The Status Quo', subtitle: 'Vue abstracts the DOM, not the data' },
  { title: 'Offline-First', subtitle: 'The app that never stops working' },
  { title: 'Sync Engines', subtitle: 'The new data layer' },
  { title: 'Jazz', subtitle: 'The database that syncs' },
  { title: 'Local-First', subtitle: `It's about values, not just technology` }
]" />

<!--
Overview -- universe is big, structured like this:

- Status quo -- how apps are built today
- Offline-first -- work without WiFi
- Sync engines
- Deep dive into ONE library
- Define local-first at the end

TRANSITION: Let's start at the bottom -- the status quo.
-->

---
transition: fade
---

<PartSlide part="0" title="The Status Quo" subtitle="Vue Abstracts the DOM, Not the Data" />

<!--
[scan room]

Where we are NOW -- how most Vue apps are built
-->

---
clicks: 2
---

<div class="flex items-center justify-center h-full">
<DuplicatedArchDiagram
  :panels="[
    {
      title: 'FRONTEND',
      click: 1,
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
      warningClick: 2,
    },
    {
      title: 'BACKEND',
      click: 1,
      items: [
        { id: 'get', label: 'app.get(\'/todos\')', click: 1 },
        { id: 'validate', label: 'validate(...)', click: 1 },
        { id: 'insert', label: 'db.insert(...)', click: 1 },
        { id: 'auth', label: 'authorize(...)', click: 1 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 2,
    },
  ]"
  :connections="[
    { label: 'GET', click: 1 },
    { label: 'POST', click: 1 },
  ]"
  :database="{ label: 'query / write', click: 1 }"
  :callout="{ label: 'DUPLICATED', click: 2, variant: 'danger' }"
  :seed="150"
/>
</div>

<!--
Classical 3-tier -- state DUPLICATED in two places
Frontend: refs, Pinia
Database: also the state

Even simple CRUD = lots of code

CLICK

Duplicated: validation, auth, error types
Frontend doing TOO much -- leads to bugs

TRANSITION: Kyle Mathews has a great analogy...
-->

---
layout: quote
transition: fade
---

<QuoteCard author="Kyle Mathews — Co-founder of ElectricSQL, creator of Gatsby" highlight="jQuery era of data">
  We're in the jQuery era of data.
</QuoteCard>

<!--
QUOTE: Kyle Mathews -- Gatsby founder, now ElectricSQL
Source: localfirst.fm podcast

[slow down]
jQuery = fiddling with DOM manually
Vue freed us

BUT -- same dance with DATA
Fetch, cache, retry, invalidate

[pause] History repeating

TRANSITION: Where we are in this evolution...
-->

---
---

# But Who Solves Data Sync?

<FlowDiagram
  :nodes="[
    { id: 'jquery', label: 'jQuery Era', subtitle: 'YOU → DOM', variant: 'muted' },
    { id: 'vue', label: 'Vue Era', subtitle: 'ref() → VDOM → DOM' },
    { id: 'now', label: 'Now', subtitle: '??? → ??? → DB', variant: 'accent' },
  ]"
  :edges="[
    { from: 'jquery', to: 'vue' },
    { from: 'vue', to: 'now' },
  ]"
/>

- jQuery era: **YOU** were the sync engine for the DOM
- Vue era: **Vue** became the sync engine for the DOM
- Now: Who's the sync engine for **DATA**?

<!--
jQuery -- YOU were the sync engine
getElementById, appendChild, manual everything

Vue -- FRAMEWORK syncs the DOM
Declarative. Reactive.

Now -- who syncs the DATA?

[pause]
Same pattern, one layer UP
Vue solved rendering -- need something for data

TRANSITION: What about tools you already use?
-->

---

# "But I Already Use TanStack Query / Pinia?"

<div class="grid grid-cols-2 gap-4 mt-3">

<div v-click>
<div class="font-bold text-brand mb-2 text-sm">TanStack Query — server cache</div>

```ts
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
// edit a todo → mutate → refetch
await updateTodo(1, body)
client.invalidateQueries(['todos'])
```

</div>

<div v-click>
<div class="font-bold text-brand mb-2 text-sm">Pinia — client state</div>

```ts
const ui = useUiStore()
ui.sidebarOpen = true
ui.formDraft = 'Buy milk'
ui.theme = 'dark'
// page refresh?
// formDraft is gone
// no persistence, no sync
```

</div>

</div>

<div v-click class="mt-3 mx-auto w-2/3">
<div class="font-bold text-brand mb-2 text-sm">Sync engine — local truth</div>

```ts
const todos = useQuery(db.todos)
db.todos.insert({ text: 'Buy milk' })
// instant — local DB write | works offline | syncs to all devices
```

</div>

<div v-click class="mt-3 text-sm op-70 text-center">

Different layers. Sync engines replace the **fetch → cache → invalidate** cycle entirely.

</div>

<!--
"I already use TanStack / Pinia" -- why something else?

CLICK -- TanStack = server cache. Fetch, cache, invalidate, repeat. Yes, it has optimistic mutations -- but you're still duct-taping over the round-trip.

CLICK -- Pinia = client state. Refresh? Gone.

CLICK -- Sync engine = DIFFERENT layer. Write locally, instant, offline, syncs everywhere.

CLICK -- Replace the fetch-cache-invalidate cycle ENTIRELY.

TRANSITION: Where that leaves us on the scorecard...
-->

---

# The Status Quo Scorecard

<div class="grid grid-cols-4 gap-3 mt-6">
  <Card variant="muted" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-lightning text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Fast</div>
      <div class="text-xs text-gray-500 leading-tight">No spinners. Instant response.</div>
    </div>
  </Card>
  <Card variant="muted" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-devices text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Multi-device</div>
      <div class="text-xs text-gray-500 leading-tight">Your work on any device.</div>
    </div>
  </Card>
  <Card variant="muted" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-wifi-slash text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Works offline</div>
      <div class="text-xs text-gray-500 leading-tight">The network is optional.</div>
    </div>
  </Card>
  <Card variant="muted" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-users-three text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Collaboration</div>
      <div class="text-xs text-gray-500 leading-tight">Seamless real-time teamwork.</div>
    </div>
  </Card>
</div>

<div class="flex justify-center gap-3 mt-3">
  <Card variant="muted" size="sm" class="w-[calc(25%-9px)]">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-clock-countdown text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Longevity</div>
      <div class="text-xs text-gray-500 leading-tight">Your data outlives the app.</div>
    </div>
  </Card>
  <Card variant="muted" size="sm" class="w-[calc(25%-9px)]">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-shield-check text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">Privacy</div>
      <div class="text-xs text-gray-500 leading-tight">Security and privacy by default.</div>
    </div>
  </Card>
  <Card variant="muted" size="sm" class="w-[calc(25%-9px)]">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-key text-2xl text-brand/50" />
      <div class="text-sm font-semibold text-gray-300">User control</div>
      <div class="text-xs text-gray-500 leading-tight">You retain ownership and control.</div>
    </div>
  </Card>
</div>

<div v-click="1" class="mt-4 text-center text-gray-500">

Vue solved **rendering**. But the data layer? Still the jQuery era. **0 out of 7.**

</div>

<div v-click="2" class="mt-6 text-center">
  <span class="text-sm text-gray-400 italic">The 7 ideals from </span>
  <a href="https://www.inkandswitch.com/essay/local-first/" target="_blank" class="text-sm font-semibold italic" style="color: #ff6bed">"Local-First Software"</a>
  <span class="text-sm text-gray-400 italic"> — Ink & Switch, 2019</span>
</div>

<!--
Seven ideals -- our scorecard for the WHOLE talk

[gesture] Walk through each card briefly

CLICK -- Not random criteria
STAT: 7 ideals from Ink & Switch paper, 2019

CLICK -- Typical Vue app? ZERO out of seven

[pause] [look up]
Rendering = solved. Data layer = not started.
Let's change that.

[wait for reaction]
-->

---
transition: fade
---

<PartSlide part="1" title="Offline-First" subtitle="The App That Works Without WiFi" />

<!--
[scan room]

Flip the model -- data lives on CLIENT first
Syncs to server when it can
-->

---
clicks: 7
---

# Local Storage Options

<StorageFunnelDiagram
  :rejected="[
    { id: 'ls', label: 'localStorage', subtitles: ['~5 MB limit', 'Sync API (blocks UI)', 'Strings only'], status: 'rejected', click: 1 },
    { id: 'ss', label: 'sessionStorage', subtitles: ['Tab-scoped only', 'Gone on close', '~5 MB limit'], status: 'rejected', click: 2 },
    { id: 'ck', label: 'Cookies', subtitles: ['~4 KB limit', 'Sent with every request', 'Not for app data'], status: 'rejected', click: 3 },
  ]"
  :accepted="[
    { id: 'idb', label: 'IndexedDB', subtitles: ['Unlimited storage', 'Async API', 'Structured data'], status: 'accepted', click: 4 },
    { id: 'sql', label: 'SQLite (WASM)', subtitles: ['Full SQL queries', 'OPFS persistence', '~900KB bundle'], status: 'accepted', click: 5 },
    { id: 'pg', label: 'PGlite (Postgres WASM)', subtitles: ['Full Postgres in the browser', 'pgvector & extensions', '<3MB gzipped'], status: 'accepted', click: 6 },
  ]"
  summary="For local-first: IndexedDB (native), SQLite WASM (SQL power), or PGlite (full Postgres)"
  :summary-click="7"
/>

<!--
Store data locally -- what options?

CLICK -- localStorage. 5 MB, sync API, strings only. Not enough.

CLICK -- sessionStorage. Tab-scoped. Close tab = gone.

CLICK -- Cookies. 4 KB. Not for app data.

CLICK -- IndexedDB. NOW we're talking. Unlimited, async, structured.

CLICK -- SQLite WASM. Full SQL in WebAssembly. Uses OPFS -- Origin Private File System -- for persistence.
STAT: Notion -- 20% faster page nav after switching

CLICK -- PGlite. Full Postgres in WASM, <3MB gzipped. pgvector + extensions.

CLICK -- Bottom line: IndexedDB, SQLite WASM, or PGlite.
Most sync engines pick one for you.

TRANSITION: How long does that data stick around?
-->

---
layout: center
---

# Want to go deeper on SQLite?

<div class="flex flex-col items-center">
  <Youtube id="7yNG1aj7-Aw" width="560" height="315" />
  <p class="mt-2 opacity-70">Conrad Hofmeyr (PowerSync) — "SQLite Persistence on the Web" @ Sync Conf 2025</p>
</div>

<!--
Quick shout-out -- if SQLite in the browser sounds interesting, Aaron's talk from last year's Local-First Conf is THE deep dive. Link is on the slide, check it out after.

TRANSITION: How long does that data stick around?
-->


---
clicks: 2
---

# The Offline-First Architecture

<SplitDiagram
  :panels="[
    {
      title: 'ONLINE',
      click: 1,
      nodes: [
        { id: 'local', label: 'Local Store', subtitle: '(IndexedDB / SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 1 },
        { id: 'server', label: 'Server DB', variant: 'success', click: 1 },
      ],
      edges: [
        { from: 'local', to: 'server', label: 'sync ↕', click: 1 },
      ],
    },
    {
      title: 'OFFLINE',
      click: 2,
      nodes: [
        { id: 'local2', label: 'Local Store', subtitle: '(IndexedDB / SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 2 },
        { id: 'pending', label: 'Pending Writes', variant: 'muted', click: 2 },
      ],
      edges: [
        { from: 'local2', to: 'pending', label: 'queued', click: 2 },
      ],
      badges: [
        { text: '✗ no network', position: 'inline', variant: 'danger', click: 2 },
        { text: 'Still works!', position: 'bottom', variant: 'success', click: 2 },
      ],
    },
  ]"
  :seed="200"
/>

<!--
[gesture] Online side: read/write LOCAL. Sync in background.

Offline side: network drops -- app doesn't care
Writes queue, sync when network returns

[look up] App NEVER stops working

TRANSITION: But there's a gotcha most people miss...
-->

---
clicks: 2
---

# The PWA Gotcha

<PwaDiagram
  :panels="[
    {
      title: 'WITHOUT PWA',
      titleIcon: '❌',
      click: 1,
      boxes: [
        { id: 'error', label: '🦕 Chrome Dino', subtitle: 'No Internet', variant: 'danger', click: 1 },
      ],
      arrows: [],
      annotations: [
        { text: 'IndexedDB has data...', variant: 'muted', click: 1 },
        { text: 'but who cares?', variant: 'muted', click: 1 },
        { text: 'App cannot even load.', variant: 'danger', click: 1 },
      ],
    },
    {
      title: 'WITH PWA',
      titleIcon: '✅',
      click: 2,
      boxes: [
        { id: 'sw', label: 'Service Worker', subtitle: 'intercepts fetch', variant: 'accent', click: 2 },
        { id: 'cache', label: 'Cache Storage', subtitle: 'HTML, JS, CSS, WASM', variant: 'default', click: 2 },
      ],
      arrows: [
        { from: 'sw', to: 'cache', click: 2 },
      ],
      annotations: [],
      resultText: 'App loads!',
      resultIcon: '🚀',
      resultVariant: 'success',
      resultClick: 2,
    },
  ]"
  :seed="300"
  :panelHeight="280"
/>

<!--
Data in IndexedDB -- but app shell can't LOAD offline?
None of it matters. Chrome dino.

Without PWA = dino
With PWA = Service Worker intercepts, serves from cache

[look up] PWA is the foundation. Data layer sits on top.
-->

---

# Want to Learn More About PWAs?

<div class="grid grid-cols-2 gap-8 mt-8 items-center">
  <div class="flex flex-col items-center">
    <img src="/pwa-blog-post.png" class="rounded-lg shadow-xl border border-gray-700" />
  </div>
  <div class="flex flex-col items-center">
    <img src="/pwa-blog-qr.png" class="w-60 rounded-lg" />
    <div class="mt-4 text-sm op-50">
      Scan to read the post
    </div>
  </div>
</div>

<!--
PWA + Vue 3 + Vite -- blog post, 4 steps
Scan QR later
-->

---

<OfflineStackDiagram />

<!--
[gesture] Three layers:
- Top: Vue / Nuxt components
- Middle: IndexedDB or SQLite WASM
- Bottom: Service Worker -- caches the shell

vite-plugin-pwa or @vite-pwa/nuxt -- easy to add

TRANSITION: What does offline-first already give us?
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
CLICK -- Two things FREE: speed (local reads) + offline capability

CLICK -- Five question marks still open

CLICK -- 2 out of 7. Good progress, NOT enough.

TRANSITION: What's holding us back?
-->

---
clicks: 5
---

# The Missing Piece: How Do You Sync?

<TodoSyncConflictDemo :roughness="1.2" :seed="900" />

<!--
Data stored locally -- great. But TWO devices, same todo.

CLICK -- Both go offline. Can't see each other.

CLICK -- Device A: "Buy oat milk"

CLICK -- Device B: "Buy almond milk"

CLICK -- Reconnect. Now what? Which wins?

CLICK -- Distributed systems problem. Needs a SYNC ENGINE.
-->

---
transition: fade
---

<PartSlide part="2" title="Sync Engines" subtitle="The New Data Layer" />

<!--
[scan room]

Now things get REALLY interesting
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
[gesture] Traditional: every client talks to server via HTTP
Server = single source of truth

Works -- but network goes away?
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
[gesture] Now: each client has LOCAL DB + sync layer
Read/write locally -- instant
Sync client handles replication in background

THIS is what sync engines give you
-->

---

# Who Uses Sync Engines?

<div class="grid grid-cols-4 gap-4 mt-6">
<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Linear</div>
  <div class="text-xs op-50">Project management</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Figma</div>
  <div class="text-xs op-50">Design tool</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Notion</div>
  <div class="text-xs op-50">Knowledge management</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Superhuman</div>
  <div class="text-xs op-50">Email client</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Excalidraw</div>
  <div class="text-xs op-50">Whiteboard</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Google Docs</div>
  <div class="text-xs op-50">Collaborative editing</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Pitch</div>
  <div class="text-xs op-50">Presentations</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Obsidian</div>
  <div class="text-xs op-50">Note-taking</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">AFFiNE</div>
  <div class="text-xs op-50">Workspace editor</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Logseq</div>
  <div class="text-xs op-50">Knowledge graph</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Tiptap</div>
  <div class="text-xs op-50">Rich text editor</div>
</div>

<div class="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
  <div class="text-lg font-bold text-[#ff6bed]">Anytype</div>
  <div class="text-xs op-50">Productivity platform</div>
</div>

</div>

<div class="mt-6 text-lg text-gray-400 text-center">

All chose sync engines for the same reasons: **instant UI**, **offline support**, and **real-time collaboration**.

</div>

<!--
NOT a niche pattern

[gesture] Every category -- most responsive apps use sync

Why:
- Instant UI -- no spinners
- Offline -- queue + sync on reconnect
- Real-time collab
- COMPETITIVE advantage
STAT: Linear's snappiness = #1 differentiator vs Jira
Figma killed Sketch with real-time multiplayer

[look up] Not for fun -- ONLY way to deliver the UX users demand

TRANSITION: What's out there. But first -- one question they all answer differently.
-->

---
layout: statement
transition: fade
---

# Before We Look at Engines...

<div class="mt-4 text-xl op-70">They all solve the same fundamental problem differently.</div>

<!--
Same architecture, DIFFERENT answer to one question:
Two devices, same data, offline -- who decides?

Not two answers -- it's a SPECTRUM
-->

---
clicks: 3
---

# Conflict Resolution: It's a Spectrum

<ConflictSpectrumDiagram
  :items="[
    { id: 'lww', label: 'Last-Write-Wins', subtitle: 'Fastest', pro: 'Simple & fast', con: 'Loses data', variant: 'danger', weight: 1 },
    { id: 'crdt', label: 'CRDTs', subtitle: 'Auto-converge', pro: 'No server', con: 'Complex types', variant: 'success', click: 1, weight: 3 },
    { id: 'hybrid', label: 'Hybrid / Manual', subtitle: 'User decides', pro: 'Full control', con: 'UX complexity', variant: 'accent', click: 2, weight: 5 },
  ]"
  :roughness="1.2"
  :seed="777"
/>

<Callout v-click="3" type="info">

What if you got LWW's simplicity with CRDT's guarantees? That's exactly what a **CoMap** is.

</Callout>

<!--
Full picture before the two main camps

LWW -- simplest. Last save wins. Fast, but LOSES data.

CLICK -- CRDTs. Math guarantees convergence. No server needed.

CLICK -- Hybrid. Surface conflict to user (like Git merge).

CLICK -- What if LWW simplicity + CRDT guarantees? That's a CoMap.

TRANSITION: Two main camps for local-first...
-->

---
clicks: 2
---

# The Hardest Problem: Where Do You Resolve Conflicts?

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click="1">

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-cloud-bold" /> Server-Side Resolution</div>

- Server decides who wins
- Simpler, familiar mental model
- **But:** requires a trusted server

<div class="mt-2 text-xs op-50">Zero, Dexie Cloud, traditional APIs</div>

</Card>

</div>

<div v-click="2">

<Card size="lg" glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-devices-bold" /> Client-Side Resolution</div>

- Every client merges independently
- Works offline & peer-to-peer
- **But:** needs math that always converges

<div class="mt-2 text-xs op-50">Yjs, Jazz, Automerge (CRDTs)</div>

</Card>

</div>

</div>

<!--
Two places conflict resolution can live

CLICK -- Server decides. POST, validate, pick winner.
Simpler -- one source of truth. But: NEEDS a server.
Zero + Dexie Cloud = this approach.

CLICK -- Client decides. Every device resolves on its own.
Server = dumb relay. Can go fully P2P.
Hard part: merges must ALWAYS converge.
Yjs + Jazz = this approach.

TRANSITION: What are CRDTs, and how do they work?
-->

---
clicks: 5
---

# CRDTs: Merge Without a Server

<CrdtCounterDemo :roughness="1.2" :seed="800" />


<!--
CLICK -- Two peers go offline

CLICK -- Peer A: +1

CLICK -- Peer B: +2, independent

CLICK -- LWW = 2 (WRONG), CRDT = slot per peer. 1+2 = 3 (CORRECT)

[slow down]
Analogy: two doctors on a flight
- A adds allergy, B updates dosage
- LWW: one edit LOST. CRDT: both survive

CLICK -- Real objects, three rules:
- Different fields -> auto-merge
- Same field -> LWW
- Delete vs update -> delete wins (tombstone)

[look up]
Server needs ZERO conflict logic -- just relays bytes

TRANSITION: But a counter is just numbers. Real apps have objects...
-->

---
layout: statement
clicks: 1
---

# From Counter to Map

G-Counter = one number per peer. But real apps have **objects with fields**.

<div v-click="1" class="mt-8 text-lg op-80">

Each field stores `{ value, timestamp, peerId }` — an **LWW Register**.

Many registers together → an **LWW Map**.

</div>

<!--
Counter was great for the concept. But real data = objects.

A todo has title, done, assignee. Not just a number.

CLICK -- Each field is an LWW Register. Value + timestamp + who wrote it.
Put many registers together? You get an LWW Map.

TRANSITION: Let me show you exactly how this merges...
-->

---
clicks: 4
---

# The LWW Map — How Real Objects Merge

<CoMapDiagram :roughness="1.2" :seed="900" />

<!--
A CoMap -- like a database row but with a globally unique ID.

CLICK -- Alice creates todo: title + done. Both at 8:01.

CLICK -- Bob edits title on one device, toggles done on another -- all offline.

CLICK -- Reconnect: per-field LWW. Title conflict -- latest wins (8:03 > 8:01). Done -- no conflict, both survive.

CLICK -- THIS is the CoMap. Every field is an LWW register.
Two simple rules cover everything:
✓ Different fields → both survive
⚡ Same field → latest timestamp wins

TRANSITION: So what if your database worked like this?
-->

---
clicks: 2
---

# What If Your Database WAS a CRDT?

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click="1">

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-stack-bold" /> Traditional Stack</div>

1. Define schema
2. Write SQL migrations
3. Build REST/GraphQL API
4. Add caching layer
5. Implement sync logic
6. Handle conflict resolution

<div class="mt-2 text-xs op-50">6 layers between your data and your UI</div>

</Card>

</div>

<div v-click="2">

<Card size="lg" glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-lightning-bold" /> What If...</div>

1. Define schema
2. **Done.**

Schema IS the CRDT.

Database IS the sync engine.

<div class="mt-2 text-xs op-50">The schema is all you need</div>

</Card>

</div>

</div>

<!--
Traditional stack -- you all know this.

CLICK -- Schema, migrations, API, cache, sync, conflicts. SIX layers.
Every layer = more code, more bugs, more maintenance.

CLICK -- What if: define schema, done. Schema IS the CRDT.
Database IS the sync engine. No API. No cache. No conflict code.

[pause] That's not a dream. That's Jazz.

TRANSITION: Let's look at the landscape and then dive into Jazz...
-->

---
layout: iframe
url: https://www.localfirst.fm/landscape
---

<!--
Here's the full landscape -- localfirst.fm maintains this great overview of all the sync engines out there.

Take a screenshot if you want to explore later.

[look up] We're going deep on Jazz -- most COMPLETE vision for local-first Vue
-->

---
layout: statement
transition: fade
---

<img src="/jazz-logo.png" class="w-24 h-24 mx-auto mb-6" alt="Jazz logo" />

# Why Jazz?

<div class="mt-4 text-xl op-70">The database that syncs — with official Vue bindings.</div>

<!--
Most AMBITIOUS engine -- only one with first-class Vue support
community-jazz-vue on their GitHub

Let me show you what you get -- starting with the SIMPLEST possible example...
-->

---
clicks: 3
---

# CoValues — One Abstraction, Three Problems Solved

<div class="text-center text-sm op-60 mb-4">
The CoMap you just saw? That's a CoValue. Jazz adds persistence and encryption on top.
</div>

<div class="flex justify-center">
<FlowDiagram
  :nodes="[
    { id: 'covalue', label: 'CoValue', subtitle: 'co.map / co.list', variant: 'accent' },
    { id: 'sync', label: 'Sync', subtitle: 'Real-time CRDT merge', click: 1 },
    { id: 'persist', label: 'Persistence', subtitle: 'IndexedDB, offline-first', click: 2 },
    { id: 'security', label: 'Security', subtitle: 'Groups, roles, E2E encryption', click: 3 },
  ]"
  :edges="[
    { from: 'covalue', to: 'sync', click: 1 },
    { from: 'covalue', to: 'persist', click: 2 },
    { from: 'covalue', to: 'security', click: 3 },
  ]"
  layout="fan-right"
  :node-width="220"
  :node-height="80"
  :gap="140"
/>
</div>

<div v-click="3" class="text-center mt-6 text-sm op-60">
You define the shape. Jazz handles sync, storage, and access control automatically.
</div>

<!--
The CoMap you just saw? That's a CoValue. Jazz adds persistence and encryption on top.

CLICK -- SYNC. Every CoValue is a CRDT. Changes merge automatically, even offline, even with conflicts. Real-time across all connected peers.

CLICK -- PERSISTENCE. Automatically persisted to IndexedDB. Offline-first by default. No cache layer.

CLICK -- SECURITY. Every CoValue belongs to a Group. Roles: admin, writer, reader. End-to-end encrypted. Server is just a relay.

[look up]
One abstraction. Three problems that usually take THREE separate libraries.

TRANSITION: Let's see this in code...
-->

---
clicks: 5
---

# Jazz in 30 Seconds — A Collaborative Counter

````md magic-move {lines: true}
```ts
// schema.ts — define your collaborative data
import { co, z } from 'jazz-tools'

const Counter = co.map({ count: z.number() })
```
```ts
// schema.ts — define your collaborative data
import { co, z } from 'jazz-tools'

export const Counter = co.map({ count: z.number() })
```
```vue
<!-- Counter.vue -->
<script setup lang="ts">
import { useCoState } from 'community-jazz-vue'
import { Counter } from './schema'

const counter = useCoState(Counter, counterId)
</script>
```
```vue
<!-- Counter.vue -->
<script setup lang="ts">
import { useCoState } from 'community-jazz-vue'
import { Counter } from './schema'

const counter = useCoState(Counter, counterId)

function increment() {
  if (counter.value) counter.value.count++
}
</script>
```
```vue
<!-- Counter.vue -->
<script setup lang="ts">
import { useCoState } from 'community-jazz-vue'
import { Counter } from './schema'

const counter = useCoState(Counter, counterId)

function increment() {
  if (counter.value) counter.value.count++
}
</script>

<template>
  <button @click="increment">{{ counter?.count ?? 0 }}</button>
</template>
```
````

<div v-click="5" class="mt-4 text-center text-lg op-80">

`counter.count++` — **synced**, **persisted**, **encrypted**. No fetch. No API.

</div>

<!--
Let's build the simplest Jazz app. A counter.

STEP 1: Start with schema. co.map with one field. That's your "database table."

CLICK: Export it so our component can use it.

CLICK: Counter.vue — useCoState takes schema + ID, gives you a reactive ref. Auto-subscribes.

CLICK: Mutation? Just counter.count++. That's it.

CLICK: Template — one button. Standard Vue.

CLICK: [slow down] That increment... is synced in real-time, persisted offline, encrypted. All of it.

[pause] [look up]
Three lines of schema. A few lines of component. ENTIRE data layer.

TRANSITION: Let's build something real...
-->

---
layout: center
class: text-center
---

<div class="text-4xl font-bold">Let's Build a Chat App</div>
<div class="mt-4 text-xl op-60">Schema → Provider → Component — three steps</div>

<!--
Counter was the concept. Now let's build something REAL.

Chat app. Three steps. You'll USE this app yourself in a few minutes.
-->

---
clicks: 1
---

# Step 1 — Define Your Schema

```ts
// schema.ts
import { co } from 'jazz-tools'

const Message = co.map({
  text: co.plainText(),
  image: co.optional(co.image()),
})

const Chat = co.list(Message).withPermissions({
  onCreate: (owner) => owner.addMember('everyone', 'writer'),
})
```

<Callout v-click="1" type="info">

`co.plainText()` = collaborative rich text. `co.optional(co.image())` = optional image upload built in. `.withPermissions()` = anyone with the link can write — permissions baked into the schema.

</Callout>

<!--
Step 1: Schema.

Two types. Message = text + optional image. Chat = list of messages.
Permissions declared right in the schema -- everyone gets writer access on create.

CLICK -- plainText for collaborative text. Image upload is part of the schema. Permissions are NOT an afterthought -- they're baked in.

TRANSITION: Wire it up...
-->

---

# Step 2 — Wire Up the Provider

```vue
<!-- RootApp.vue -->
<script setup lang="ts">
import { JazzVueProvider } from 'community-jazz-vue'

const peer = 'wss://cloud.jazz.tools/?key=vue-chat@example.com'
const sync = { peer }
</script>

<template>
  <JazzVueProvider :sync="sync" :defaultProfileName="'Anonymous'">
    <App />
  </JazzVueProvider>
</template>
```

<!--
Step 2: Provider.

Same provider pattern as before. Anonymous auth -- no login needed.
defaultProfileName gives every user a random name automatically.

[look up] That's it. App is SYNCING.

TRANSITION: Using it in the component...
-->

---
clicks: 2
---

# Step 3 — Use It in Your Component

```vue
<script setup lang="ts">
import { useAccount, useCoState } from 'community-jazz-vue'
import { Chat } from './schema'

const chat = useCoState(Chat, () => chatId, {
  resolve: { $each: { text: true, image: true } },
})
const me = useAccount()
</script>
```

<div v-click="1">

```ts
const inputValue = ref('')

function sendMessage() {
  if (!inputValue.value.trim() || !chat.value?.$isLoaded) return
  chat.value.$jazz.push({ text: inputValue.value })
  inputValue.value = ''
}
```

</div>

<div v-click="2">

```vue
<template>
  <div v-for="msg in chat" :key="msg.$jazz.id">
    {{ msg.text }}
  </div>
  <form @submit.prevent="sendMessage">
    <input v-model="inputValue" placeholder="Message" />
  </form>
</template>
```

</div>

<!--
Step 3: Component.

useCoState loads the chat. resolve: $each deeply loads each message's text and image.
useAccount gives us the current user.

CLICK -- sendMessage. Push to the list. That's it. No fetch, no mutation, no loading spinner.

CLICK -- Template. Standard v-for. A form. Nothing special.
The data layer is INVISIBLE.

[pause] [look up]
THIS is what you'll use in a moment with the QR code.
Schema + Provider + useCoState = your ENTIRE data layer. Real-time. Offline. Encrypted.

TRANSITION: Let me show you what you get for free...
-->

---

# What You Get — Zero Extra Code

<div class="grid grid-cols-3 gap-3 mt-6">
  <Card icon="i-ph-arrows-clockwise" label="Real-time Sync" size="sm">
    <div class="text-xs text-gray-400 mt-1">CRDTs merge changes across devices. No conflict resolution code.</div>
  </Card>
  <Card icon="i-ph-wifi-slash" label="Offline-First" size="sm">
    <div class="text-xs text-gray-400 mt-1">IndexedDB persistence. Works without network. Syncs on reconnect.</div>
  </Card>
  <Card icon="i-ph-shield-check" label="E2E Encrypted" size="sm">
    <div class="text-xs text-gray-400 mt-1">BLAKE3 + Ed25519 + XSalsa20. Server never sees plaintext.</div>
  </Card>
  <Card icon="i-ph-users-three" label="Groups & Roles" size="sm">
    <div class="text-xs text-gray-400 mt-1">admin / writer / reader. Enforced cryptographically, not by server.</div>
  </Card>
  <Card icon="i-ph-user-circle" label="Built-in Auth" size="sm">
    <div class="text-xs text-gray-400 mt-1">Passkeys or demo auth. No Auth0 or third-party service.</div>
  </Card>
  <Card icon="i-ph-cloud-arrow-up" label="Jazz Cloud / Self-Host" size="sm">
    <div class="text-xs text-gray-400 mt-1">Managed cloud or your own sync server. Fully open-source.</div>
  </Card>
</div>

<!--
Everything you just saw in that todo app -- ZERO extra code for:

CLICK -- Real-time sync. CRDTs. Automatic conflict resolution.

CLICK -- Offline-first. IndexedDB. No service worker config.

CLICK -- E2E encryption. Server = relay. Zero-trust.

CLICK -- Groups, auth, cloud or self-host.

[look up] All this -- from schema + provider + useCoState. Nothing else.

TRANSITION: Let's see it LIVE...
-->

---

<div class="h-full flex items-center justify-center gap-12">
  <img src="/chat-qr.png" class="w-64 h-64 rounded-lg" />
  <div class="h-[420px] w-[400px] rounded-lg overflow-hidden border border-white/10">
    <iframe src="https://vue-jazz.vercel.app/chat/co_z7WAhSdGn5vcPwg3z42Su4Gbjc5" class="w-full h-full" />
  </div>
</div>

<!--
[breathe]

OK -- let's make this REAL.

Scan the QR code. Opens a live chat app -- Jazz + Vue.
Type something. Everyone in this room sees it INSTANTLY.

LEFT side: QR code for audience phones.
RIGHT side: live iframe -- I can type here, audience sees it appear.

DEMO STEPS:
1. Show app on screen -- type a message from laptop in the iframe
2. Audience sees it appear INSTANTLY
3. Invite audience to scan QR and type
4. Messages from audience appear in the iframe -- real-time
5. If brave: airplane mode -- keep typing -- reconnect -- messages sync

[if QR doesn't work: show URL on screen]

[look up]
Every message you just sent:
- Synced via CRDTs
- Persisted to IndexedDB on YOUR phone
- No backend server handling your data

Schema + Provider + useCoState = THAT.

TRANSITION: But are these truly local-first?
-->

---
layout: statement
transition: fade-out
---

# But Are These Truly Local-First?

<div v-click class="mt-8 text-xl op-80">

Martin Kleppmann defines truly local-first with three criteria.

</div>

<!--
Seen the landscape -- which are ACTUALLY local-first?

CLICK -- Martin Kleppmann (Ink & Switch, Automerge)
Boils it down to THREE criteria
-->

---
clicks: 4
---

# The Three Criteria

<div class="grid gap-3 mt-6">
  <Card v-click="1" variant="muted">
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-brand">1.</span> Offline reads <strong>and</strong> writes</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">Not just cached reads — the app must accept writes while disconnected and reconcile later.</p>
  </Card>
  <Card v-click="2" variant="muted">
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-brand">2.</span> Collaboration across devices</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">Multiple users and devices can edit concurrently, and changes merge automatically.</p>
  </Card>
  <Card v-click="3" glow>
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-brand">3.</span> Data survives the developer shutting down</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">If the company disappears, your data and app must keep working. No vendor lock-in.</p>
  </Card>
</div>

<div v-click="4" class="mt-4 text-center text-sm text-gray-500">

Criterion 3 is the hardest — and it's what separates **offline-first** from **local-first**.

</div>

<!--
CLICK -- Offline reads AND writes

CLICK -- Collaboration. Multiple devices, changes merge.

CLICK -- [slow down] Data survives the developer SHUTTING DOWN

CLICK -- This separates offline-first from local-first. The dealbreaker.

Key insight: No single approach (proprietary, self-host, P2P, file sync) fully solves criterion 3. Each improves resilience but has trade-offs. P2P needs conflict resolution without a central authority.

TRANSITION: The 7 Ideals...
-->

---

# The 7 Ideals

<div class="text-lg op-70 mb-2">It's about values, not just technology</div>

From the Ink & Switch essay on local-first software (2019):

<div v-click="1" class="mt-4">

**Technology:**

<div class="grid gap-1.5 ml-1">
  <div class="flex items-center gap-2"><div class="i-ph-lightning-bold text-brand" /> <span><strong>Fast</strong> — No spinners. Data is local.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-devices-bold text-brand" /> <span><strong>Multi-device</strong> — Sync across all your devices.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-wifi-slash-bold text-brand" /> <span><strong>Works offline</strong> — Network is optional.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-users-bold text-brand" /> <span><strong>Collaboration</strong> — Real-time co-editing.</span></div>
</div>

</div>

<div v-click="2" class="mt-4 pt-4 border-t border-white/10">

**Values:**

<div class="grid gap-1.5 ml-1">
  <div class="flex items-center gap-2"><div class="i-ph-clock-bold text-brand" /> <span><strong>Longevity</strong> — Data accessible forever. Survives the developer shutting down.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-lock-bold text-brand" /> <span><strong>Privacy</strong> — End-to-end encryption. The server never sees your data.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-user-bold text-brand" /> <span><strong>User control</strong> — You own your data. Full stop. Export it. Delete it. Script against it.</span></div>
</div>

</div>

<!--
Ink & Switch essay, 2019 -- the foundational text

CLICK -- First four: technology. We already know these.

CLICK -- [slow down] These three: longevity, privacy, user control
VALUES. Not features.
Not another architecture pattern -- a PHILOSOPHY about who owns the data.
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
Offline-first: "how do I keep working without server?"
Server = owner. Client = cache.

Local-first: "why does the server own my data AT ALL?"

[look up]
YOU are the owner. Server = utility. Can't reject your writes.
-->

---

# Where We're Headed

<div class="text-sm text-white/50 mb-2">Today: every sync engine locks you to one provider</div>

<div class="flex justify-center">
<FlowDiagram
  :nodes="[
    { id: 'app', label: 'Your App' },
    { id: 'dexie', label: 'Dexie Cloud', subtitle: '(proprietary)' },
  ]"
  :edges="[
    { from: 'app', to: 'dexie', label: 'locked to their API' },
  ]"
  direction="horizontal"
  :node-width="180"
  :node-height="60"
  :gap="100"
/>
</div>

<div v-click class="mt-6">
<div class="text-sm text-center font-bold mb-2">The endgame — generic sync, multiple backends:</div>
<div class="flex justify-center">
<FlowDiagram
  :nodes="[
    { id: 'app2', label: 'Your App', subtitle: 'ALL biz logic HERE', variant: 'accent' },
    { id: 'aws', label: 'AWS / Cloud' },
    { id: 'self', label: 'Self-hosted' },
    { id: 'p2p', label: 'P2P / NAS' },
  ]"
  :edges="[
    { from: 'app2', to: 'aws', label: 'open protocol' },
    { from: 'app2', to: 'self' },
    { from: 'app2', to: 'p2p' },
  ]"
  layout="fan-right"
  :node-width="160"
  :node-height="55"
  :gap="100"
/>
</div>
</div>

<div v-click class="mt-3 text-center text-white/50 text-sm">
Like email: pick Gmail, Fastmail, self-host — the protocol is the same.
</div>

<!--
Today: locked to one cloud. Shut down? Sync gone. Switch? Rewrite.

CLICK -- [gesture] Endgame: open protocol, multiple backends
AWS for convenience, self-host for control, P2P for resilience

CLICK -- Like EMAIL -- Gmail, Fastmail, self-host. Protocol is the same.
Doesn't fully exist yet -- but where ecosystem is HEADING
Makes ideals 5, 6, 7 possible

TRANSITION: What can you do today?
-->

---

# What You Can Do Today

<div class="text-sm op-70 mb-4">We're in the <span v-mark="{ type: 'underline', color: '#ff6bed' }" class="font-bold">pragmatist phase</span> — the tools aren't perfect, but you can start today.</div>

<Card v-click variant="muted" class="mb-3">

### <span class="inline-flex items-center gap-2"><span class="i-ph-compass-bold text-brand" /> Step 1: Pick your sync engine.</span>

**Dexie** for the easiest start. **Jazz** for batteries-included. **Yjs** for max flexibility. Match the engine to your app.

</Card>

<Card v-click variant="muted" class="mb-3">

### <span class="inline-flex items-center gap-2"><span class="i-ph-download-simple-bold text-brand" /> Step 2: Let users export their data.</span>

JSON, CSV — whatever. Give them a **download button**. This is the simplest local-first gesture.

</Card>

<Card v-click variant="muted">

### <span class="inline-flex items-center gap-2"><span class="i-ph-binoculars-bold text-brand" /> Step 3: Watch this space.</span>

The generic sync engine is coming. When it arrives, upgrading from offline-first to local-first will be a **configuration change**, not a rewrite.

</Card>

<!--
Historical parallels: Cypherpunks → Let's Encrypt, Free Software → GitHub + npm, Local-first ideals → ???
Idealists define vision, pragmatists build infrastructure.

[look up] Pragmatist phase. Tools not perfect. Good enough to START.

CLICK -- Pick a sync engine. Dexie = easy, Jazz = batteries, Yjs = flexible.

CLICK -- Add a DOWNLOAD button. Export data. Simplest local-first gesture.

CLICK -- Watch this space. Generic sync protocol coming.
Upgrade = config change, not rewrite.

[look up] Not betting on a vendor. Betting on a PATTERN.

TRANSITION: Full scorecard...
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
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-lightning-bold text-brand text-xs" /> Fast</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-devices-bold text-brand text-xs" /> Multi-device</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-wifi-slash-bold text-brand text-xs" /> Works offline</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-users-bold text-brand text-xs" /> Collaboration</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-clock-bold text-brand text-xs" /> Longevity</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-lock-bold text-brand text-xs" /> Privacy</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="2" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-user-bold text-brand text-xs" /> User control</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-brand mx-auto" /></td></tr>
    <tr v-click="3"><td class="py-1.5 pr-4 font-bold">Score</td><td class="text-center font-bold">0/7</td><td class="text-center font-bold">2/7</td><td class="text-center font-bold">4/7</td><td class="text-center font-bold text-brand">7/7</td></tr>
  </tbody>
</table>
</div>

<Callout type="info">

Offline-first = a **subset** of local-first. Sync engines = a **bigger subset**. Local-first = **the whole picture.** The first 4 are technology. The last 3 are **values.**

</Callout>

<!--
CLICK -- Technology row: 0, 2, 4... local-first nails all four.

CLICK -- Values row: ONLY local-first checks these.

CLICK -- 0, 2, 4, 7.

[look up] First 4 = technology. Last 3 = VALUES. That's the difference.

[wait for reaction]
-->

---
transition: fade
---

<PartSlide title="Closing" subtitle="The Rendering Era Is Over" />

<!--
[breathe] [scan room]

One more thing...
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

<div v-click="5" class="text-center mt-4 text-sm op-70">
Vue's reactivity system was built for this — <code>ref()</code> + sync engine = the reactive data layer Vue never had.
</div>

<!--
CLICK -- jQuery: YOU were the sync engine

CLICK -- Vue: FRAMEWORK syncs the DOM

CLICK -- Sync engines: ENGINE syncs the data

CLICK -- Local-first: USER owns the data

CLICK -- [slow down] [look up]
We solved rendering. Data layer = where it's happening NOW.
Vue is perfectly POSITIONED.
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
- **Sync Engines for Vue Developers** — alexop.dev
- **PWA in 4 Steps** — alexop.dev/posts/create-pwa-vue3-vite-4-steps
- **A Gentle Introduction to CRDTs** — Matt Wonlaw

</div>

<!--
References on slides page
Ink & Switch = foundational read. Start there.
My article: 7 sync engines through Vue's lens -- next slide
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
[breathe] [look up]

Thank you!

alexop.dev/vue-amsterdam -- slides + links
Come find me to chat about local-first

[pause]
-->
