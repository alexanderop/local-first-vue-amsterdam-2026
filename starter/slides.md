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
Hello everyone, I am really excited to have the opportunity to give a talk about one of my favorite tech topics — local first — and of course also Vue.

Local first is a newer and trendier community that gets slowly more and more traction.

This will be an introductory talk and I hope by the end of it you have a good understanding of the topic and are motivated to build your own local first apps.
-->

---

# About me

<About />

<!--
Now before we dive deeper into local first, a quick introduction from my side.

My name is Alexander Opalic. I have been a Vue developer for more than 8 years and also worked on backend.

I live in Germany and I work for OTTO Payments, a German e-commerce marketplace.

What I also do is write blog posts or give talks about the tech topics that interest me.

TRANSITION: Quick show of hands...
-->

---
layout: statement
transition: fade-out
---

# Raise your hand if you've ever built an app that works offline

<!--
Ok now a quick survey so that I know how familiar you are all with local first.

Raise your hand if you've ever built an app that works offline.

TRANSITION: Now keep those hands up...
-->

---
layout: statement
transition: fade-out
---

# Keep it up if you've heard of local-first

<!--
Now keep your hand up if you've also heard the term local-first.

Yeah — way fewer hands. That gap is exactly why we're here today.
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
Now my goal of this talk is to give you an overview. The local-first universe is quite big, this is why I decided to structure my talk like this:

- Status quo — how most apps are built
- Offline-first — how we give any Vue app the ability to work offline
- Sync engines
- Deep dive into one concrete library
- And at the end, with all the knowledge we gained before, we define the local-first term

TRANSITION: Let's start at the bottom — the status quo.
-->

---
transition: fade
---

<PartSlide part="0" title="The Status Quo" subtitle="Vue Abstracts the DOM, Not the Data" />

<!--
Now let's begin where we are at the moment and how most Vue applications are built nowadays.
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
If you think about the classical architecture, we always follow a 3-tier approach where state is duplicated in two places:
- Frontend has its own state — refs, Pinia, etc.
- Database also has the state

Even if CRUD functionality is simple, we always have to add a lot of code to achieve something.

CLICK

Many things are often duplicated:
- Validation logic
- Auth
- Error types

Sometimes the frontend is even doing too much, which can also lead to bugs.

TRANSITION: "Kyle Mathews has a great analogy for this..."
-->

---
layout: quote
transition: fade
---

<QuoteCard author="Kyle Mathews — Co-founder of ElectricSQL, creator of Gatsby" highlight="jQuery era of data">
  We're in the jQuery era of data.
</QuoteCard>

<!--
This is a quote from Kyle Mathews, the founder of Gatsby and now co-founder of ElectricSQL. He said this on the localfirst.fm podcast.

With jQuery, you would grab a DOM element, tweak text, remove a child — you were fiddling with the DOM constantly. Vue freed us from that.

But we are still doing the same imperative dance with data — fetch this, cache that, retry this, invalidate that.

We are in the jQuery era of data. History is repeating.

TRANSITION: Let me show you where we are in this evolution...
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
In the jQuery era, you were the sync engine. getElementById, appendChild, manual everything.

Then Vue came along and Vue became the sync engine for the DOM. Declarative. Reactive.

But now — who is the sync engine for data?

The same pattern repeats, one layer up. Vue solved rendering. Now we need something to solve data.

TRANSITION: But wait — what about the tools you are already using?
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
Now some of you might think — I already use TanStack Query or Pinia, why do I need something else?

CLICK — TanStack Query is a server cache. You fetch, cache, invalidate, fetch again.

CLICK — Pinia is client state. Great for toggles, but refresh and it is gone.

CLICK — A sync engine is different. You write locally, it is instant, works offline, and syncs to all devices.

CLICK — These are different layers. Sync engines replace the fetch-cache-invalidate cycle entirely.

TRANSITION: Let's see where that leaves us on the scorecard...
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

<div v-click="1" class="mt-6 text-center">
  <span class="text-sm text-gray-400 italic">The 7 ideals from </span>
  <span class="text-sm font-semibold italic" style="color: #ff6bed">"Local-First Software"</span>
  <span class="text-sm text-gray-400 italic"> — Ink & Switch, 2019</span>
</div>

<div v-click="2" class="mt-4 text-center text-gray-500">

Vue solved **rendering**. But the data layer? Still the jQuery era. **0 out of 7.**

</div>

<!--
These are the seven ideals we will be looking at throughout the talk:
- Fast — no spinners, your work at your fingertips
- Multi-device — your work is not trapped on one device
- Works offline — the network is optional
- Collaboration — seamless collaboration with your colleagues
- Longevity — the long now
- Privacy — security and privacy by default
- User control — you retain ultimate ownership and control

CLICK — These are not random criteria. These are the seven ideals from the Local-First Software paper by Ink and Switch from 2019.

CLICK — And right now, with the typical Vue app? Zero out of seven. The rendering layer is solved. The data layer has not started. Let's change that.
-->

---
transition: fade
---

<PartSlide part="1" title="Offline-First" subtitle="The App That Works Without WiFi" />

<!--
What if we flip the model? What if data lives on the client first, and syncs to the server when it can?
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
If we want to store data locally, what are our options?

CLICK — localStorage — we have all used it. But 5 MB, sync API, strings only. Not enough.

CLICK — sessionStorage — even worse, tab-scoped. Close the tab, it is gone.

CLICK — Cookies — 4 KB, sent with every request. Not for app data.

CLICK — IndexedDB — now we are talking. Unlimited storage, async, structured data. The native choice.

CLICK — SQLite WASM — a full SQL engine compiled to WebAssembly. This is what Notion uses — they got 20% faster page navigation after switching.

CLICK — PGlite by ElectricSQL — full Postgres compiled to WASM, under 3MB gzipped. Supports dynamic extensions including pgvector.

CLICK — Bottom line: IndexedDB, SQLite WASM, or PGlite. Most sync engines we will see later pick one for you.

TRANSITION: But how long does that data actually stick around?
-->

---

# How Long Does Your Data Survive?

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="border border-gray-600 rounded-xl p-4 bg-gray-800/40 text-center">
    <logos-chrome class="text-2xl mx-auto mb-2" />
    <div class="font-bold text-sm">Chrome</div>
    <div class="text-xs text-gray-400 mt-2">Persistent</div>
    <div class="text-xs text-gray-500 mt-1">Evicted only under storage pressure</div>
  </div>
  <div v-click class="border border-red-500/30 rounded-xl p-4 bg-gray-800/40 text-center">
    <logos-safari class="text-2xl mx-auto mb-2" />
    <div class="font-bold text-sm">Safari</div>
    <div class="text-xs text-red-400 mt-2 font-semibold">7-day cap</div>
    <div class="text-xs text-gray-500 mt-1">PWAs exempt from the cap</div>
  </div>
</div>

<div v-click class="mt-4 mx-auto w-2/3 border border-pink-500/40 rounded-xl p-4 bg-pink-500/5">
  <div class="flex items-center justify-center gap-2 mb-2">
    <div class="i-ph-shield-check text-xl text-brand" />
    <div class="font-bold text-sm">Fix</div>
  </div>

```ts
await navigator.storage.persist()
// one line — browser won't auto-evict your data
```

</div>

<!--
CLICK — Chrome is generous. Data persists until disk fills up.

CLICK — Safari is the gotcha. There is a 7-day cap. If you do not visit for a week, data is gone. But PWAs are exempt from this cap.

CLICK — The fix is one line. navigator.storage.persist(). Chrome auto-grants for engaged sites.

TRANSITION: Now let's see how this all fits together architecturally...
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
On the online side, reads and writes go to the local store. Syncing happens in the background.

On the offline side, the network drops and the app does not care. Writes queue up and sync when the network returns.

The app never stops working.

TRANSITION: But there is a gotcha most people miss...
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
You can put all your data in IndexedDB. But if the app shell itself cannot load offline, none of it matters. You get the Chrome dinosaur.

Without a PWA — you see the dino.

With a PWA — the Service Worker intercepts the request, serves from cache, and the app loads.

The PWA is the foundation. The data layer sits on top.
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
If you want a step-by-step guide on setting up a PWA with Vue 3 and Vite, I wrote a blog post that walks you through it in 4 steps. Check it out later.
-->

---

<OfflineStackDiagram />

<!--
Three layers:
- Top: Vue or Nuxt components — your app
- Middle: Data layer — IndexedDB or SQLite WASM
- Bottom: Service Worker — caches the shell

Vue for rendering, a local database for data, and a Service Worker to make the whole thing load offline.

You can use vite-plugin-pwa or @vite-pwa/nuxt — easy to add.

TRANSITION: So what does offline-first already give us?
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
CLICK — Offline-first gives us two things for free: speed, because data is local and reads are instant, and offline capability.

CLICK — But five question marks are still open. We need something more.

CLICK — That is 2 out of 7 local-first principles. Good progress, but not enough.

TRANSITION: So what is holding us back?
-->

---
clicks: 5
---

# The Missing Piece: How Do You Sync?

<TodoSyncConflictDemo :roughness="1.2" :seed="900" />

<!--
We have stored data locally. Great. But now imagine two devices editing the same todo.

CLICK — Both devices go offline. They cannot see each other.

CLICK — Device A edits the todo to "Buy oat milk".

CLICK — Device B also edits it to "Buy almond milk". Neither knows about the other.

CLICK — They reconnect. Now what? Which version is correct?

CLICK — This is a distributed systems problem. And it needs a sync engine.
-->

---
transition: fade
---

<PartSlide part="2" title="Sync Engines" subtitle="The New Data Layer" />

<!--
This is where things get really interesting.
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
This is not a niche pattern. Look at this list — project management, design tools, note-taking, email, presentations, collaborative editing. Across every category, the most responsive apps are built on sync engines.

Why they all do it:
- Instant UI — reads and writes hit a local store, no spinners
- Offline support — works without network, changes queue and sync when reconnected
- Real-time collaboration — multiple users editing simultaneously
- Competitive advantage — Linear's snappiness is their number one differentiator over Jira, Figma killed Sketch with real-time multiplayer

These companies did not adopt sync engines for fun — they did it because it is the only way to deliver the UX their users demand.

TRANSITION: Let's look at what is out there. But first — there is one question they all answer differently.
-->

---
layout: statement
transition: fade
---

# Before We Look at Engines...

<div class="mt-4 text-xl op-70">They all solve the same fundamental problem differently.</div>

<!--
Three teams built the same architecture. But there is a critical question they answered differently.

When two devices edit the same data offline and reconnect — who decides what happened?

Actually, it is not just two answers — it is a spectrum.
-->

---
clicks: 5
---

# Conflict Resolution: It's a Spectrum

<ConflictSpectrumDiagram
  :items="[
    { id: 'lww', label: 'Last-Write-Wins', subtitle: 'Fastest', pro: 'Simple & fast', con: 'Loses data', variant: 'danger', weight: 1 },
    { id: 'server', label: 'Server Authority', subtitle: 'Centralized', pro: 'Biz rules', con: 'Needs server', variant: 'muted', click: 1, weight: 2 },
    { id: 'oplog', label: 'Operation Logs', subtitle: 'Replayable', pro: 'Full history', con: 'Storage cost', variant: 'default', click: 2, weight: 3 },
    { id: 'crdt', label: 'CRDTs', subtitle: 'Auto-converge', pro: 'No server', con: 'Complex types', variant: 'success', click: 3, weight: 4 },
    { id: 'hybrid', label: 'Hybrid / Manual', subtitle: 'User decides', pro: 'Full control', con: 'UX complexity', variant: 'accent', click: 4, weight: 5 },
  ]"
  :roughness="1.2"
  :seed="777"
/>

<Callout v-click="5" type="info">

Most sync engines **combine strategies** — auto-merge where possible, escalate where necessary.

</Callout>

<!--
Before I show you the two main camps, I want you to see the full picture.

The simplest approach is last write wins. Whoever saves last, their version sticks. Fast, but you lose data.

CLICK — Next step: a server decides. More nuanced — the server can apply business rules. But you need a server.

CLICK — Operation logs — instead of saving state, you save every operation. You can replay, reorder, and merge.

CLICK — CRDTs — Conflict-free Replicated Data Types. The math guarantees that independent merges always converge. No server needed.

CLICK — And at the far end: hybrid. Surface the conflict to the user, like Git merge conflicts. Or combine multiple strategies depending on the data type.

CLICK — The key insight: most production systems are not purely one approach. They combine strategies. Auto-merge names, LWW for timestamps, user-prompt for document conflicts.

TRANSITION: Now let's zoom into the two main camps that matter most for local-first.
-->

---
clicks: 4
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

<Callout v-click="3" type="info">

Client-side resolution makes **true local-first** possible — but requires **CRDTs** to guarantee convergence.

</Callout>



<!--
There are exactly two places conflict resolution can live.

CLICK — Option one: the server decides. This is what you are used to. POST to the API, server validates, server picks a winner. It is simpler to implement — you have one source of truth. But the catch: you need a server. And your app breaks without it. Zero and Dexie Cloud work this way.

CLICK — Option two: the client decides. Every device resolves conflicts on its own. No central authority. The server is just a relay, a dumb pipe. You can even go fully peer-to-peer. But the hard part: you need data structures where independent merges always produce the same result. Yjs and Jazz do this.

CLICK — Client-side resolution is what makes true local-first possible. But it needs math. It needs CRDTs.

CLICK — But there is a third option hiding in plain sight — let the user decide. Think Git merge conflicts. The system detects the conflict but presents both versions to the human. In practice, most production apps are hybrids — auto-merge what you can, escalate what you cannot.

TRANSITION: So what are CRDTs, and how do they work?
-->

---
clicks: 5
---

# CRDTs: Merge Without a Server

<CrdtCounterDemo :roughness="1.2" :seed="800" />


<!--
CLICK — Two peers go offline. They cannot see each other.

CLICK — Peer A counts plus 1 independently.

CLICK — Peer B counts plus 2 independently. Neither knows about the other.

CLICK — They sync. With last-write-wins, you get 2. That is wrong. But the CRDT keeps a slot per peer — A: 1, B: 2. Sum the slots. 1 + 2 = 3. That is correct.

Think of two doctors editing the same patient record on a flight. Doctor A adds an allergy, Doctor B updates the dosage. With LWW, one edit disappears when they land. With CRDTs, both edits survive — because the data structure tracks who changed what, not just when.

CLICK — With real data — objects, not counters — three rules cover almost everything:
- Different fields? Auto-merge. Title from A, done from B — no conflict.
- Same field? Last-write-wins. Deterministic, but you can lose data.
- Delete vs update? Delete wins — the tombstone pattern.

This is why CRDTs matter. The server needs zero conflict resolution logic — it just relays bytes.

TRANSITION: Now let's look at the landscape.
-->

---
---

# The Sync Engine Landscape

<div class="grid grid-cols-2 gap-4 mt-4">
  <Card variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-brand">Yjs</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Production · 10+ years</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">CRDT library. Client-side conflict resolution. Bring your own backend. P2P possible. Maximum flexibility.</div>
  </Card>
  <Card variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-brand">Dexie</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Production · 10+ years</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">IndexedDB wrapper. Server-side field-level merge via Dexie Cloud. Progressive upgrade path. Millions of users.</div>
  </Card>
  <Card variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-brand">Jazz</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Early · Active dev</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">Batteries-included. Client-side CRDTs. Auth, permissions, E2E encryption, sync — all built in. <strong>Official Vue bindings via jazz-vue.</strong></div>
  </Card>
  <Card variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-brand">Zero</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Alpha · Well-funded</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">Query-driven sync. Server resolves all conflicts. Reactive Postgres to client SQLite. Great DX, but not truly local-first.</div>
  </Card>
</div>

<div class="mt-4 text-xs op-50 text-center">Also worth watching: LiveStore, TanStack DB, Automerge, PowerSync, cr-sqlite — full comparison at alexop.dev</div>

<!--
Four engines, four philosophies — a quick sweep:
- Yjs — most mature, CRDTs, bring your own backend
- Dexie — IndexedDB wrapper, server-side merge, easiest on-ramp
- Jazz — batteries-included, CRDTs, everything built in, and crucially: official Vue community bindings via jazz-vue
- Zero — great DX, server-first, not truly local-first

Today we are going deep on Jazz — because it is the most complete vision for local-first Vue apps.
-->

---
layout: statement
transition: fade
---

# Why Jazz?

<div class="mt-4 text-xl op-70">The most batteries-included option — with official Vue community bindings.</div>

<!--
Of all the engines we just saw, Jazz is the most ambitious — and the only one with first-class Vue support via jazz-vue on their GitHub.

Let me show you what you get out of the box.
-->

---
clicks: 6
---

# Jazz — What You Get Out of the Box

<div class="grid grid-cols-3 gap-3 mt-6">
  <Card v-click="1" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-database text-2xl text-brand" />
      <div class="text-sm font-semibold">CoValues</div>
      <div class="text-xs text-gray-400 leading-tight">Collaborative JSON-like values that sync automatically via CRDTs.</div>
    </div>
  </Card>
  <Card v-click="2" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-user-circle text-2xl text-brand" />
      <div class="text-sm font-semibold">Built-in Auth</div>
      <div class="text-xs text-gray-400 leading-tight">Passkeys, demo auth, or custom. No third-party auth service needed.</div>
    </div>
  </Card>
  <Card v-click="3" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-users-three text-2xl text-brand" />
      <div class="text-sm font-semibold">Groups & Permissions</div>
      <div class="text-xs text-gray-400 leading-tight">Role-based access: admin, writer, reader. Built into the data model.</div>
    </div>
  </Card>
  <Card v-click="4" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-shield-check text-2xl text-brand" />
      <div class="text-sm font-semibold">E2E Encryption</div>
      <div class="text-xs text-gray-400 leading-tight">BLAKE3 + Ed25519 + XSalsa20. Server never sees your data.</div>
    </div>
  </Card>
  <Card v-click="5" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-image text-2xl text-brand" />
      <div class="text-sm font-semibold">File & Image Uploads</div>
      <div class="text-xs text-gray-400 leading-tight">FileStream & progressive image loading — built into the schema.</div>
    </div>
  </Card>
  <Card v-click="6" size="sm">
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="i-ph-cloud-arrow-up text-2xl text-brand" />
      <div class="text-sm font-semibold">Jazz Cloud / Self-Host</div>
      <div class="text-xs text-gray-400 leading-tight">Managed cloud or run your own sync server. Fully open-source.</div>
    </div>
  </Card>
</div>

<!--
CLICK — CoValues — collaborative values. Think reactive JSON that syncs automatically via CRDTs.

CLICK — Built-in auth — passkeys, demo auth, custom. No Auth0 needed.

CLICK — Groups and permissions — admin, writer, reader. Built into the data model, not bolted on.

CLICK — End-to-end encryption — BLAKE3, Ed25519, XSalsa20. The server never sees your data in plaintext.

CLICK — File and image uploads — including progressive loading. Part of the schema.

CLICK — Jazz Cloud for managed hosting, or self-host. It is open-source.

All of this — zero boilerplate. No glue code. Let me show you the code.

TRANSITION: Let's start with the schema...
-->

---

# Jazz + Vue — Define Your Schema

```ts
// schema.ts — define your data model
import { co, z } from 'jazz-tools'

// CoMap = collaborative object (like a reactive record)
const Todo = co.map({
  title: z.string(),
  done: z.boolean(),
  priority: z.number().optional(),
})

// CoList = collaborative array (ordered, synced)
const TodoList = co.list(Todo)

// Account with root data — runs migration on first login
const MyAccount = co.account({
  profile: co.profile(),
  root: co.map({
    todos: TodoList,
  }),
}).withMigration(async (account) => {
  if (!account.$jazz.has('root')) {
    account.$jazz.set('root', { todos: [] })
  }
})
```

<!--
Jazz uses a schema-first approach. co.map and co.list — reactive objects and arrays that sync.

- co.map is a collaborative object, like a row in a database
- co.list is a collaborative array, ordered and synced
- z.string(), z.boolean() — that is Zod. Jazz uses Zod for validation
- The account schema runs a migration on first login — initializes your data

This schema is your database. No migrations file. No ORM. The schema drives everything.

TRANSITION: Now let's wire it up in Vue...
-->

---

# Jazz + Vue — Provider Setup

```ts
// main.ts — wire up JazzProvider
import { JazzProvider, useDemoAuth } from 'jazz-vue'
import { MyAccount } from './schema'
import { createApp, defineComponent, h } from 'vue'
import App from './App.vue'

const RootComponent = defineComponent({
  setup() {
    const { authMethod, state } = useDemoAuth()
    return () => h(
      JazzProvider,
      {
        AccountSchema: MyAccount,
        auth: authMethod.value,
        peer: 'wss://cloud.jazz.tools/?key=your-app@example.com',
      },
      { default: () => h(App) },
    )
  },
})

// Register for full TypeScript inference
declare module 'jazz-vue' {
  interface Register { Account: typeof MyAccount }
}

createApp(RootComponent).mount('#app')
```

<!--
jazz-vue gives you JazzProvider — wrap your app, pass the schema and auth method.

- useDemoAuth for prototyping — swap to passkeys for production
- peer points to Jazz Cloud — or your own sync server
- The Register interface gives you full TypeScript inference everywhere

That is it. Your app is now syncing.

TRANSITION: Now the fun part — using it in components...
-->

---

# Jazz + Vue — Reactive Data

```vue
<script setup lang="ts">
import { useCoState, useAccount } from 'jazz-vue'
import { Todo, TodoList } from './schema'

// Get current user
const { me } = useAccount()

// Load a CoValue reactively — auto-subscribes to changes
const todos = useCoState(TodoList, me.value?.root?.todos?.id)

// Write = just mutate. Jazz syncs it.
function addTodo(title: string) {
  todos.value?.push(Todo.create({ title, done: false }))
}

function toggleTodo(todo: Todo) {
  todo.done = !todo.done  // ← that's it. Synced. Offline-ready.
}
</script>
```

<Callout type="info">

`useCoState` returns a **reactive ref** that auto-subscribes to remote changes. Writes are local-first — instant, offline-capable, and synced via CRDTs.

</Callout>

<!--
useCoState is the core composable. Give it a schema and an ID, you get a reactive ref.

- It auto-subscribes. Remote changes appear instantly.
- Writing? Just mutate the object. todo.done = !todo.done. That is it.
- No fetch. No mutate. No invalidate. No loading state.
- It works offline. It syncs when you reconnect. CRDTs handle conflicts.

This is what the jQuery era of data being over actually looks like.

TRANSITION: But what about access control?
-->

---
clicks: 3
---

# Jazz — Permissions & Groups

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

```ts
import { Group } from 'jazz-tools'

// Create a group — you're admin
const team = Group.create()

// Add members with roles
team.addMember(bob, 'writer')
team.addMember(alice, 'reader')

// Make something public
team.addMember('everyone', 'reader')

// Create data owned by the group
const doc = Document.create(
  { title: 'Shared Doc' },
  { owner: team },
)
```

</div>

<div>

<Card v-click="1" variant="muted" size="sm" class="mb-3">
<div class="flex items-center gap-2 text-sm"><div class="i-ph-crown text-brand" /> <strong>admin</strong> — add/remove members, delete</div>
</Card>

<Card v-click="2" variant="muted" size="sm" class="mb-3">
<div class="flex items-center gap-2 text-sm"><div class="i-ph-pencil text-brand" /> <strong>writer</strong> — create and edit content</div>
</Card>

<Card v-click="3" variant="muted" size="sm">
<div class="flex items-center gap-2 text-sm"><div class="i-ph-eye text-brand" /> <strong>reader</strong> — view only</div>
</Card>

</div>

</div>

<!--
Permissions in Jazz are not bolted on — they are part of the data model.

- Group.create() — you are automatically admin
- addMember with a role: admin, writer, reader
- Create data with owner: team — the group controls access

CLICK — Admin — full control. Add members, remove members, delete.

CLICK — Writer — create and edit. Cannot change membership.

CLICK — Reader — view only. Cannot modify anything.

And here is the kicker: these permissions are enforced cryptographically. Not by a server — by the encryption itself. Remove a member? Keys rotate automatically.
-->

---

# Jazz — E2E Encryption & Security

<div class="grid grid-cols-2 gap-6 mt-6">

<div>

<div class="grid gap-3">
  <Card variant="muted" size="sm">
    <div class="flex items-center gap-2 text-sm"><div class="i-ph-hash text-brand" /> <strong>BLAKE3</strong> — content-addressed hashing</div>
  </Card>
  <Card variant="muted" size="sm">
    <div class="flex items-center gap-2 text-sm"><div class="i-ph-signature text-brand" /> <strong>Ed25519</strong> — every change is signed</div>
  </Card>
  <Card variant="muted" size="sm">
    <div class="flex items-center gap-2 text-sm"><div class="i-ph-lock-key text-brand" /> <strong>XSalsa20</strong> — stream cipher encryption</div>
  </Card>
</div>

</div>

<div>

<div class="grid gap-3">
  <div class="flex items-center gap-2 text-sm"><div class="i-ph-check-circle text-emerald-400" /> Privacy by default — encrypted even on Jazz Cloud</div>
  <div class="flex items-center gap-2 text-sm"><div class="i-ph-check-circle text-emerald-400" /> Automatic key rotation when members are removed</div>
  <div class="flex items-center gap-2 text-sm"><div class="i-ph-check-circle text-emerald-400" /> Every transaction cryptographically signed</div>
  <div class="flex items-center gap-2 text-sm"><div class="i-ph-check-circle text-emerald-400" /> Zero-trust architecture — server is just a relay</div>
</div>

</div>

</div>

<Callout type="info">

The server **never** sees your data in plaintext. It relays encrypted bytes — nothing more. This is what makes criterion 3 (data survives the developer) architecturally possible.

</Callout>

<!--
Jazz does not just encrypt in transit — it encrypts at rest, even on their own servers.

- BLAKE3 for content hashing, Ed25519 for signatures, XSalsa20 for encryption
- Every single change is cryptographically signed — you can verify who wrote what
- Remove a member from a group? Keys rotate automatically, they lose access to future data
- The server is just a relay. Zero-trust.

Remember criterion 3 — data survives the developer shutting down? With E2E encryption and open-source sync, that becomes architecturally real.
-->

---
layout: center
class: text-center
---

# See It In Action

<div class="mt-8 text-6xl">🐱</div>

<div class="mt-4 text-xl op-70">
Live demo — a cat chat app built with Jazz + Nuxt
</div>

<div class="mt-4 text-sm op-50 max-w-lg mx-auto">
PWA · real-time collaboration · offline support · everyone in the room can post
</div>

<!--
This is a cat chat app built with Jazz and Nuxt. A PWA with real-time sync, offline writes, and zero backend code from me.

Demo steps:
- Show the app — a simple chat where anyone can post cat messages
- Post a message from your laptop — audience sees it appear instantly
- Toggle airplane mode on your phone — keep posting messages
- Reconnect — messages sync automatically, no data lost
- Invite audience to open the URL on their phones

Schema, JazzProvider, useCoState — that is the entire data layer you just saw. Everyone in this room is collaborating right now — Jazz handles all the conflict resolution via CRDTs.

TRANSITION: But are any of these truly local-first? Let's find out.
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
We have seen the landscape. But which of these are actually local-first?

CLICK — Martin Kleppmann, the co-author of the Ink and Switch paper and creator of Automerge, boils it down to three criteria.
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
CLICK — First: the app must work offline — not just reads, but writes too.

CLICK — Second: collaboration. Multiple devices, multiple users, changes merge.

CLICK — Third — and this is the big one — your data survives the developer shutting down.

CLICK — This third criterion is what separates offline-first from truly local-first. It is the dealbreaker.

TRANSITION: So what would it take to actually satisfy criterion 3?
-->

---

# Surviving the Shutdown

Remember Google Reader? Google Inbox? Sunrise Calendar? When they shut down, your data vanished with them.

What would actually satisfy criterion 3? Ranked **worst → best**:

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
CLICK — Proprietary servers — zero protection. They shut down, you are done.

CLICK — Open-source self-hostable — better. But who runs a server for your grandma?

CLICK — Peer-to-peer — no central server! But offline peers cannot find each other.

CLICK — File sync — Dropbox, iCloud. Actually the most resilient! But real-time collaboration breaks.

CLICK — No single approach nails it. But notice the P2P option — it needs conflict resolution without a central authority.

TRANSITION: Now let's update our scorecard with what sync engines give us.
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
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-star-fill text-brand text-sm" /> Multi-device</div>
  </Card>
  <Card size="sm" glow>
    <div class="flex items-center justify-center gap-1 text-xs"><div class="i-ph-star-fill text-brand text-sm" /> Collab</div>
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
  <div class="text-brand font-semibold">Multi-device — NEW! Sync engine</div>
  <div class="text-brand font-semibold">Collaboration — NEW! Real-time</div>
  <div class="text-white/30">Longevity? Still not addressed.</div>
  <div class="text-white/30">Privacy? Still not addressed.</div>
  <div class="text-white/30 col-span-2 text-center">User control? Still not addressed.</div>
</div>

<!--
CLICK — From 2 to 4. Sync engines add multi-device and collaboration.

CLICK — Two green from before, two new pink stars.

CLICK — But three question marks remain.

Turns out — they are not technology problems at all. They are values.
-->

---
transition: fade
---

<PartSlide part="3" title="Local-First" subtitle="It's About Values, Not Just Technology" />

<!--
We have been tracking a scorecard. 0, then 2, then 4. Now let's reveal what those 7 actually are.
-->

---

# The Reveal: The 7 Ideals

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
These come from the Ink and Switch essay from 2019, the foundational text.

CLICK — The first four we already know. Fast, multi-device, offline, collaboration. These are technology.

CLICK — But these three — longevity, privacy, user control...

These are values. Not features. That is what makes local-first fundamentally different from just another architecture pattern. It is a philosophy about who owns the data.
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
Offline-first asks: how do I keep working without a server? The server is still the owner. The client is a cache.

Local-first asks a different question entirely: why does the server own my data at all?

You are the owner. The server is a utility. It cannot reject your writes. It just relays them.
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
The app that comes closest to all 7? Obsidian.

It works because it is just markdown files on your disk.

But on the web? We do not have a filesystem. We need IndexedDB or SQLite plus a sync layer. And every sync engine today ties you to their cloud.

TRANSITION: So what is missing?
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
Today, every sync engine locks you to one cloud.

They shut down? Sync is gone. Switch provider? Rewrite your app.
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
    { id: 'p2p', label: 'Peer-to-Peer / NAS', subtitle: 'Network-attached storage' },
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
The endgame — an open protocol with multiple backends. AWS for convenience, self-hosted for control, P2P for resilience. All active at once.

Like email. Pick Gmail, Fastmail, self-host. The protocol is the same. Your data moves freely.

This does not fully exist yet — but this is where the ecosystem is heading. And this is what makes ideals 5, 6, 7 possible.

TRANSITION: Now — is this idealistic? Yes. But...
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
Movements succeed when idealists define the vision and pragmatists build the infrastructure.

CLICK — Cypherpunks dreamed of encrypted communication. Decades later: Let's Encrypt.

CLICK — Free software idealists. Decades later: GitHub and npm.

CLICK — Local-first ideals. The pragmatic infrastructure is being built right now.

We are in the pragmatist phase. The tools are not perfect. But they are good enough to start.
-->

---

# What You Can Do Today

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
So what can you do on Monday?

CLICK — Step one: pick a sync engine. Dexie for the easiest start, Jazz for batteries-included, Yjs for flexibility. Each gets you closer to local-first.

CLICK — Step two: add a download button. Let users export their data. JSON, CSV — whatever. That is the simplest local-first gesture.

CLICK — Step three: watch this space. When the generic sync protocol arrives, upgrading will be a config change, not a rewrite.

You are not betting on a specific vendor. You are betting on a pattern.

TRANSITION: Let's see the full scorecard...
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
CLICK — Technology row — 0, 2, 4... and local-first nails all four.

CLICK — Values row — only local-first checks these. That is the gap.

CLICK — 0, 2, 4, 7.

The first 4 are technology. The last 3 are values. That is the difference.
-->

---
transition: fade
---

<PartSlide title="Closing" subtitle="The Rendering Era Is Over" />

<!--
One more thing before I close.
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
CLICK — jQuery — you were the sync engine.

CLICK — Vue — the framework syncs the DOM.

CLICK — Sync engines — the engine syncs the data.

CLICK — Local-first — the user owns the data.

CLICK — We solved rendering. The data layer is where it is happening now. And Vue is perfectly positioned to be part of it.
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
All the references are here and will be on the slides page.

The Ink and Switch essay is the foundational read. Start there. My article compares 7 sync engines through Vue's lens — link on the next slide.
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
Thank you!

Slides and all the links are at alexop.dev/vue-amsterdam. Come find me if you want to chat about local-first. Thank you!
-->
