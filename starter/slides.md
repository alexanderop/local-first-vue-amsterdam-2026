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
  { title: 'Local-First', subtitle: 'More than just offline' },
  { title: 'Jazz', subtitle: 'Local-first Vue in practice' }
]" />

<!--
Overview -- universe is big, structured like this:

- Status quo -- how apps are built today
- Offline-first -- work without WiFi
- Sync engines -- the new data layer
- Local-first -- what it really means
- Jazz -- build it for real

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

<Scorecard mode="intro" :achieved="[]" :show-summary="false" />

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

<Scorecard :achieved="['fast', 'offline']" :descriptions="{
  fast: 'Data is local. Reads are instant. No waiting for the network.',
  offline: 'The whole point. Read and write without connectivity.'
}" />

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

TRANSITION: But here's the fundamental question...
-->

---
layout: statement
transition: fade
---

# The Fundamental Problem

<div class="mt-4 text-xl op-70">Two devices go offline. Both edit the same data. How do you merge?</div>

<!--
Two devices, same data, offline edits — how do you merge?

Let me show you the most elegant solution first...
-->

---
clicks: 5
---

# CRDTs: Git for JSON

<CrdtCounterDemo :roughness="1.2" :seed="800" />


<!--
CLICK -- Two peers go offline

CLICK -- Peer A: +1

CLICK -- Peer B: +2, independent

CLICK -- LWW = 2 (WRONG), CRDT = slot per peer. 1+2 = 3 (CORRECT)

CLICK -- Both online again. Both peers now show 3. That's the magic — they converge.

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
clicks: 5
---

# The LWW Map — How Real Objects Merge

<CoMapDiagram :roughness="1.2" :seed="900" />

<!--
A CoMap -- like a database row but with a globally unique ID.

CLICK -- Alice creates todo: title + done. Both at 8:01.

CLICK -- Bob edits title on device 1 -- offline.

CLICK -- Bob marks done on device 2 -- also offline.

CLICK -- Reconnect: per-field LWW. Title conflict -- latest wins (8:03 > 8:01). Done -- no conflict, both survive.

CLICK -- THIS is the CoMap. Every field is an LWW register.
Two simple rules cover everything:
✓ Different fields → both survive
⚡ Same field → latest timestamp wins

TRANSITION: Now you've seen how CRDTs work — let's zoom out and see the full spectrum of approaches...
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
Full picture -- now that you've SEEN CRDTs in action

LWW -- simplest. Last save wins. Fast, but LOSES data.

CLICK -- CRDTs. Math guarantees convergence. No server needed. You just saw this!

CLICK -- Hybrid. Surface conflict to user (like Git merge).

CLICK -- What if LWW simplicity + CRDT guarantees? That's a CoMap — you just saw it.

TRANSITION: But WHERE does this resolution happen?
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

TRANSITION: Let's look at the apps you already love...
-->

---
---

# Sync Engines in the Wild

<div class="grid grid-cols-3 gap-6 mt-6">

<Card variant="muted" size="lg">
<div class="text-lg font-bold text-brand mb-2">Linear</div>

- Syncs workspace to **IndexedDB**
- Sub-50ms page loads
- Server remains source of truth

</Card>

<Card variant="muted" size="lg">
<div class="text-lg font-bold text-brand mb-2">Figma</div>

- CRDT-**inspired**, not a true CRDT
- Central server decides ordering
- Offline limited to open files only

</Card>

<Card variant="muted" size="lg">
<div class="text-lg font-bold text-brand mb-2">Notion</div>

- **SQLite WASM** replaced IndexedDB
- 33% faster in India, 20% overall
- Offline mode shipped Dec 2025

</Card>

</div>

<div v-click class="mt-6 text-center text-lg op-70">

All three use sync engines. All work offline. But are they **local-first**?

</div>

<!--
Apps you USE every day -- all sync-engine powered

Linear -- sub-50ms page loads. Syncs workspace to IndexedDB.
BUT: server is the source of truth. It can reject your writes.

Figma -- CRDT-inspired, NOT a true CRDT. Central server decides ordering.
Offline? Only files already open in your tab. Can't open new ones.

Notion -- IndexedDB failed at scale (too slow per-row for their block model).
Switched to SQLite WASM. 33% faster in India. Offline mode only shipped Dec 2025.

CLICK -- [slow down] All three. Sync engines. Fast. Some offline.
But... are they truly local-first? What happens if Linear shuts down?
Your data? Gone. Your workspace? Gone.

TRANSITION: Let's define what truly local-first means...
-->

---

# What Sync Engines Add

<Scorecard :achieved="['fast', 'offline', 'multi-device', 'collaboration']" :descriptions="{
  fast: 'Local reads, optimistic writes. UI never waits for the server.',
  offline: 'Sync engines queue changes and reconcile when back online.',
  'multi-device': 'State syncs across devices via the server in real time.',
  collaboration: 'Multiple users edit the same document — conflicts resolved automatically.'
}" />

<!--
CLICK -- Four things covered now: speed, offline, multi-device, collaboration.
Sync engines are POWERFUL.

CLICK -- But three question marks remain: longevity, privacy, user control.
If Linear shuts down -- your data is gone. Server owns it.

CLICK -- 4 out of 7. Great engineering, but not truly local-first yet.

TRANSITION: Let's define what truly local-first means...
-->

---
transition: fade
---

<PartSlide part="3" title="Local-First" subtitle="More Than Just Offline" />

<!--
[breathe]

We just saw Linear, Figma, Notion -- incredible apps.
Sync engines, offline, fast.
But something's missing.

TRANSITION: What separates offline-first from local-first?
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
Linear, Figma, Notion -- great sync. Great offline.
But are they truly LOCAL-FIRST?

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

Key insight: No single approach (proprietary, self-host, P2P, file sync) fully solves criterion 3. Each improves resilience but has trade-offs.

TRANSITION: Let's compare offline-first and local-first directly...
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

No foreign kill switch — your data, your jurisdiction

</div>

</div>

<!--
Offline-first: "how do I keep working without server?"
Server = owner. Client = cache.

Local-first: "why does the server own my data AT ALL?"

[look up]
YOU are the owner. Server = utility. Can't reject your writes.
No foreign kill switch -- your data stays in YOUR jurisdiction.

TRANSITION: Now that we know what local-first means -- let's see the full scorecard.
-->

---

# The Local-First Promise

<Scorecard :achieved="['fast', 'offline', 'multi-device', 'collaboration', 'longevity', 'privacy', 'user-control']" :descriptions="{
  fast: 'Data is local. Reads are instant. No waiting for the network.',
  offline: 'Full read and write without connectivity — not just a cache.',
  'multi-device': 'State syncs seamlessly across every device you own.',
  collaboration: 'Real-time multiplayer with automatic conflict resolution.',
  longevity: 'Your data outlives any company. No server dependency for access.',
  privacy: 'End-to-end encryption. The server never sees your plaintext data.',
  'user-control': 'You own your data. Export, switch, delete — your choice, always.'
}" />

<!--
CLICK -- All seven. That's the promise of local-first.
Fast, offline, multi-device, collaboration -- we had those with sync engines.

CLICK -- But now also: longevity, privacy, and USER CONTROL.
Your data outlives any company. Encrypted. Yours.

CLICK -- 7 out of 7. The full picture. Now -- how do we BUILD this in Vue?

TRANSITION: Let's build it with Jazz.
-->

---
transition: fade
---

<PartSlide part="4" title="Jazz" subtitle="Local-First Vue in Practice" />

<!--
[breathe]

Now that we know what local-first MEANS -- let's build it.
One library that nails all three criteria with Vue.

TRANSITION: What if your database was a CRDT?
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

TRANSITION: Let's dive into Jazz...
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
clicks: 4
---

# CoValues — One Abstraction, Three Problems Solved

<div class="text-center text-sm op-60 mb-4">
The CoMap you just saw? That's a CoValue. Jazz adds persistence and encryption on top.
</div>

<div class="grid grid-cols-[1fr_1.4fr] gap-8 items-start mt-2">

<div v-click="1" class="flex justify-center">
  <ChatWireframe />
</div>

<div class="space-y-4">
  <div v-click="2">
    <div class="text-base font-semibold text-[#ff6bed]">Sync</div>
    <ul class="text-sm op-70 mt-1 list-none pl-0">
      <li>Real-time CRDT merge</li>
      <li>Automatic conflict resolution</li>
      <li>Works across all peers</li>
    </ul>
  </div>

  <div v-click="3">
    <div class="text-base font-semibold text-[#ff6bed]">Persistence</div>
    <ul class="text-sm op-70 mt-1 list-none pl-0">
      <li>IndexedDB storage</li>
      <li>Offline-first by default</li>
      <li>No cache layer needed</li>
    </ul>
  </div>

  <div v-click="4">
    <div class="text-base font-semibold text-[#ff6bed]">Security</div>
    <ul class="text-sm op-70 mt-1 list-none pl-0">
      <li>Group-based access control</li>
      <li>Admin / writer / reader roles</li>
      <li>End-to-end encrypted</li>
    </ul>
  </div>
</div>

</div>

<div v-click="4" class="text-center mt-4 text-sm op-60">
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
layout: center
class: text-center
---

<div class="text-4xl font-bold">Let's Build a Chat App</div>
<div class="mt-4 text-xl op-60">Schema → Provider → Component — three steps</div>

<!--
Let's see Jazz in action. We'll build a real chat app.

Three steps. You'll USE this app yourself in a few minutes.
-->

---
clicks: 2
---

# Step 1 — Define Your Schema

<div class="text-sm op-60 -mt-2 mb-1">schema.ts</div>

````md magic-move {lines: true}
```ts
// schema.ts
import { co } from 'jazz-tools'

const Message = co.map({
  text: co.plainText(),
  image: co.optional(co.image()),
})
```
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
```ts
// schema.ts
import { co } from 'jazz-tools'

export const Message = co.map({
  text: co.plainText(),
  image: co.optional(co.image()),
})

export const Chat = co.list(Message).withPermissions({
  onCreate: (owner) => owner.addMember('everyone', 'writer'),
})
```
````

<!--
First step: the schema. Think of this like defining a Prisma model — except it's also your API, your real-time sync layer, and your permissions system. All in one.

We start with Message. co.map is like a typed object — text and an optional image.

CLICK: Now add Chat — a list of Messages. withPermissions sets who can write. Here, everyone with the link is a writer. Permissions are baked into the data, not enforced by a server.

CLICK: Export both types. That's it. This schema IS your database AND your API. No endpoint, no Pinia action, no migration file.

TRANSITION: Now let's wire it up...
-->

---

# Step 2 — Wire Up the Provider

<div class="text-sm op-60 -mt-2 mb-1">RootApp.vue</div>

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
Step 2: the provider. If you've used Vue Router, this is the same idea — wrap your app, give it config, done.

JazzVueProvider connects to a sync server. Anonymous auth by default — no login screen, no Auth0. That's it. Your app is SYNCING.

10 lines. One concept. Move on.

TRANSITION: Now the fun part — using it in a component...
-->

---
clicks: 1
---

# Step 3a — Load & Write Data

<div class="text-sm op-60 -mt-2 mb-1">ChatApp.vue — &lt;script setup&gt;</div>

````md magic-move {lines: true}
```ts
import { useAccount, useCoState } from 'community-jazz-vue'
import { Chat } from './schema'

const chat = useCoState(Chat, () => chatId, {
  resolve: { $each: { text: true, image: true } },
})
const me = useAccount()
```
```ts
import { useAccount, useCoState } from 'community-jazz-vue'
import { Chat } from './schema'

const chat = useCoState(Chat, () => chatId, {
  resolve: { $each: { text: true, image: true } },
})
const me = useAccount()
const inputValue = ref('')

function sendMessage() {
  if (!inputValue.value.trim() || !chat.value?.$isLoaded) return
  chat.value.$jazz.push({ text: inputValue.value })
  inputValue.value = ''
}
```
````

<!--
Step 3: the component. First the script.

useCoState loads the chat. resolve: $each deeply loads each message — like Prisma's 'include'. useAccount gives us the current user. That's your entire data-fetching layer.

CLICK: Now we write data. sendMessage pushes to the list. That's your entire "API call". No axios.post, no mutation, no optimistic update code. Just push.

TRANSITION: Now the template...
-->

---

# Step 3b — Render It

<div class="text-sm op-60 -mt-2 mb-1">ChatApp.vue — &lt;template&gt;</div>

```html
<template>
  <div v-for="msg in chat" :key="msg.$jazz.id">
    {{ msg.text }}
  </div>
  <form @submit.prevent="sendMessage">
    <input v-model="inputValue" placeholder="Message" />
  </form>
</template>
```

<!--
And here's the template. Standard v-for, v-model. Nothing Jazz-specific here. The data layer is INVISIBLE — and that's the whole point.

No special components, no render props, no slot gymnastics. Just Vue.

TRANSITION: Let me zoom out and show you what you got for free...
-->

---
layout: center
class: text-center
---

<div class="text-2xl font-bold op-90">

Schema + Provider + `useCoState` = **your entire data layer**

</div>
<div class="mt-3 text-base op-60">Real-time. Offline. Encrypted. Three files.</div>

<!--
[pause] [look up]

Three files. That's it. Schema, provider, component. Your entire data layer.

THIS is what you'll use in a moment with the QR code.

TRANSITION: But first — let me show you what you get for free...
-->

---

# What You Get — Zero Extra Code

<div class="text-sm op-60 -mt-2 mb-2">This replaces Pinia + axios + socket.io + your REST API</div>

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
Everything you just saw in that chat app -- ZERO extra code for:

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

TRANSITION: What can you do today?
-->

---

# What You Can Do Today

<div class="text-sm op-70 mb-4">We're in the <span v-mark="{ type: 'underline', color: '#ff6bed' }" class="font-bold">pragmatist phase</span> — the tools aren't perfect, but you can start today.</div>

<Card v-click variant="muted" class="mb-3">

### <span class="inline-flex items-center gap-2"><span class="i-ph-compass-bold text-brand" /> Step 1: Pick your sync engine.</span>

**Jazz** for batteries-included local-first with Vue support out of the box.

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

TRANSITION: The rendering era is over...
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
layout: center
class: flex items-center justify-center h-full
---

<Timeline
  :items="[
    { id: 'jquery', title: 'jQuery', year: '(2006)', description: 'You sync the DOM', details: ['Manual', 'getElementById', 'innerHTML'], variant: 'muted' },
    { id: 'reactive', title: 'Reactive', year: '(2014)', description: 'Vue syncs the DOM', details: ['Declarative', 'ref() + v-bind', 'computed()'] },
    { id: 'sync', title: 'Sync', year: '(2020)', description: 'Engine syncs the data', details: ['No spinners', 'No cache mgmt', 'Multi-device'], variant: 'success' },
    { id: 'local-first', title: 'Local-First', year: '(now)', description: 'User owns the data', details: ['Privacy', 'Longevity', 'Full control'], variant: 'accent' },
  ]"
/>

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
