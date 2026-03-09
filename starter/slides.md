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
clicks: 6
---

# The LWW Map — How Real Objects Merge

<CoMapDiagram />

<!--
A CoMap -- like a database row but with a globally unique ID.

CLICK 1 -- Alice creates todo: title "Buy milk" + done: false. Both at 8:01.

CLICK 2 -- Bob renames it to "Buy oat milk" on device 1 -- offline.

CLICK 3 -- Bob refines to "Get oat milk" -- still offline.

CLICK 4 -- Meanwhile on Bob's phone (device 2) -- marks it done.

CLICK 5 -- Alice changes title to "Buy eggs" -- conflict! LWW: 8:05 > 8:03, Alice wins.

CLICK 6 -- Bob marks it not done. Final state merges per-field LWW.

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
clicks: 3
---

# What If Your Database WAS a CRDT?

<div class="grid grid-cols-[1fr_1.6fr] gap-8 mt-4 items-start">

<div v-click="1" class="flex flex-col items-center">
  <ChatWireframe />
  <div class="text-xs op-40 mt-2">What we're building</div>
</div>

<div class="space-y-4">

<div v-click="2">

<Card variant="muted">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-stack-bold" /> Traditional Stack</div>

1. Define schema
2. Write SQL migrations
3. Build REST/GraphQL API
4. Add caching layer
5. Implement sync logic
6. Handle conflict resolution

<div class="mt-1 text-xs op-50">6 layers between your data and your UI</div>

</Card>

</div>

<div v-click="3">

<Card glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-lightning-bold" /> With Jazz...</div>

- Real-time sync, image uploads, edit history, permissions
- **Define schema → Done.**

<div class="mt-1 text-xs op-50">Schema IS the CRDT. Database IS the sync engine.</div>

</Card>

</div>

</div>

</div>

<!--
Let's build a chat app for this conference.

CLICK -- Here's what it'll look like. Simple wireframe. Messages, an input, send. But also: image uploads, edit history, permissions — all from the same schema.

CLICK -- Normally? Schema, migrations, API, cache, sync, conflicts. SIX layers. Every layer = more code, more bugs, more maintenance.

CLICK -- With Jazz: define schema, done. Real-time sync, image uploads, edit history, permissions — all included. Schema IS the CRDT. Database IS the sync engine.

[pause] Let me show you the code...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: schema.ts
tabs: schema.ts
step: Step 1
transition: fade
clicks: 1
files: |
  src
    schema.ts
    RootApp.vue
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

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

export const Message = co.map({
  text: co.plainText(),
  image: co.optional(co.image()),
})

export const Chat = co.list(Message)
```
````

<!--
The schema. Six lines. Think of this like a Prisma model — except it's also your API, your sync layer, and your permissions. All in one.

Message — co.map is a typed object. Text and optional image.

CLICK: Add exports. Chat is a list of Messages. That's your entire data model. No .resolved(), no .withPermissions() — we'll handle those where they're used.

6 lines of schema, zero API routes. This IS your database AND your API.

TRANSITION: Now let's wire it up...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: RootApp.vue
tabs: schema.ts, RootApp.vue
step: Step 2
transition: fade
clicks: 1
files: |
  src
    schema.ts
    RootApp.vue
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```vue
<!-- RootApp.vue -->
<script setup lang="ts">
import { JazzVueProvider } from 'community-jazz-vue'
import type { SyncConfig } from 'jazz-tools'
import App from './App.vue'

const sync: SyncConfig = {
  peer: `wss://cloud.jazz.tools/?key=${import.meta.env.VITE_JAZZ_KEY}`,
}
</script>
```
```vue
<!-- RootApp.vue -->
<script setup lang="ts">
import { JazzVueProvider } from 'community-jazz-vue'
import type { SyncConfig } from 'jazz-tools'
import App from './App.vue'

const sync: SyncConfig = {
  peer: `wss://cloud.jazz.tools/?key=${import.meta.env.VITE_JAZZ_KEY}`,
}
</script>

<template>
  <JazzVueProvider :sync="sync" :defaultProfileName="'Anonymous'">
    <App />
  </JazzVueProvider>
</template>
```
````

<!--
Step 2: the provider. Like Vue Router — wrap your app, give it config, done.

JazzVueProvider connects to a sync server. Anonymous auth by default — no login screen, no Auth0.

CLICK: Wrap your App component. One provider, one config object. Your app is SYNCING.

That's it for wiring.

TRANSITION: Now let's create a chat...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: index.vue
tabs: schema.ts, RootApp.vue, index.vue
step: Step 3
transition: fade
clicks: 1
files: |
  src
    schema.ts
    RootApp.vue
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```vue
<!-- pages/index.vue — creating a chat with permissions -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Group } from 'jazz-tools'
import { Chat } from '@/schema'

const router = useRouter()
</script>
```
```vue
<!-- pages/index.vue — creating a chat with permissions -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Group } from 'jazz-tools'
import { Chat } from '@/schema'

const router = useRouter()

onMounted(() => {
  const group = Group.create()
  group.addMember('everyone', 'writer')
  const chat = Chat.create([], { owner: group })
  router.push(`/chat/${chat.$jazz.id}`)
})
</script>

<template>
  <div>Creating chat...</div>
</template>
```
````

<!--
Step 3: creating a chat — imports and setup. Group is Jazz's permission primitive.

CLICK: onMounted — Group.create, addMember 'everyone' as 'writer'. Chat.create with that group as owner. Permissions travel WITH the data — encrypted, enforced cryptographically. Not by a server. BY THE DATA ITSELF.

No API call, no await, no POST request. Created locally, Jazz syncs in the background.

TRANSITION: Now the chat page itself...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: useChat.ts
tabs: schema.ts, RootApp.vue, index.vue, useChat.ts
step: Step 4
transition: fade
clicks: 2
openFolders: src, composables
files: |
  src
    schema.ts
    RootApp.vue
    composables/
      useChat.ts
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// composables/useChat.ts
import { computed, ref, type Ref } from 'vue'
import { useAccount, useCoState } from 'community-jazz-vue'
import type { ID } from 'jazz-tools'
import { Chat, Message } from '@/schema'

export function useChat(chatId: Ref<ID<typeof Chat>>) {
  // 1. Load the chat — resolve each message deeply
  const chat = useCoState(Chat, () => chatId.value, {
    resolve: { $each: true },
  })
  const me = useAccount(undefined, { resolve: { profile: true } })
}
```
```ts
// composables/useChat.ts
import { computed, ref, type Ref } from 'vue'
import { useAccount, useCoState } from 'community-jazz-vue'
import type { ID } from 'jazz-tools'
import { Chat, Message } from '@/schema'

export function useChat(chatId: Ref<ID<typeof Chat>>) {
  // 1. Load the chat — resolve each message deeply
  const chat = useCoState(Chat, () => chatId.value, {
    resolve: { $each: true },
  })
  const me = useAccount(undefined, { resolve: { profile: true } })

  // 2. Reactive state — last 30 messages, reversed for display
  const inputValue = ref('')
  const messages = computed(() => {
    if (!chat.value?.$isLoaded) return []
    return chat.value.slice(-30).toReversed()
  })
}
```
```ts
// composables/useChat.ts
import { computed, ref, type Ref } from 'vue'
import { useAccount, useCoState } from 'community-jazz-vue'
import type { ID } from 'jazz-tools'
import { Chat, Message } from '@/schema'

export function useChat(chatId: Ref<ID<typeof Chat>>) {
  // 1. Load the chat — resolve each message deeply
  const chat = useCoState(Chat, () => chatId.value, {
    resolve: { $each: true },
  })
  const me = useAccount(undefined, { resolve: { profile: true } })

  // 2. Reactive state — last 30 messages, reversed for display
  const inputValue = ref('')
  const messages = computed(() => {
    if (!chat.value?.$isLoaded) return []
    return chat.value.slice(-30).toReversed()
  })

  // 3. Send — create, push, done. No API call needed.
  function sendMessage() {
    if (!inputValue.value.trim() || !chat.value?.$isLoaded) return
    chat.value.push(
      Message.create({ text: inputValue.value }, chat.value._owner)
    )
    inputValue.value = ''
  }

  return { chat, me, inputValue, messages, sendMessage }
}
```
````

<!--
Step 4: the useChat composable — Vue-idiomatic, zero API calls.

useCoState loads the chat by ID. resolve with $each: true tells Jazz to deeply load each message. useAccount gives us the current user. That's the entire data layer — two lines.

CLICK: Reactive state. inputValue is a plain ref. messages is a computed that grabs the last 30 and reverses. Standard Vue reactivity — nothing special.

CLICK: sendMessage. Create a Message, push it to the list. No axios.post, no mutation, no optimistic update. The owner carries permissions automatically.

Three numbered sections, three concerns. This is a composable any Vue dev would write — except it's real-time, offline-first, and end-to-end encrypted.

TRANSITION: Now let's see how clean the component becomes...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: '[chatId].vue'
tabs: useChat.ts, '[chatId].vue'
step: Step 5
transition: fade
clicks: 2
openFolders: src, composables, pages, chat
files: |
  src
    schema.ts
    RootApp.vue
    composables/
      useChat.ts
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```vue
<!-- pages/chat/[chatId].vue -->
<script setup lang="ts">
import { toRef } from 'vue'
import type { ID } from 'jazz-tools'
import { Chat } from '@/schema'
import { useChat } from '@/composables/useChat'

const props = defineProps<{ chatId: ID<typeof Chat> }>()

const { chat, me, inputValue, messages, sendMessage } = useChat(
  toRef(() => props.chatId)
)
</script>
```
```vue
<!-- pages/chat/[chatId].vue -->
<script setup lang="ts">
import { toRef } from 'vue'
import type { ID } from 'jazz-tools'
import { Chat } from '@/schema'
import { useChat } from '@/composables/useChat'

const props = defineProps<{ chatId: ID<typeof Chat> }>()

const { chat, me, inputValue, messages, sendMessage } = useChat(
  toRef(() => props.chatId)
)
</script>

<template>
  <template v-if="chat?.$isLoaded && me?.$isLoaded">
    <div v-for="msg in messages" :key="msg.$jazz.id">
      <strong>{{ msg.$jazz.createdBy === me!.$jazz.id ? 'You' : 'Other' }}:</strong>
      {{ msg.text }}
    </div>
  </template>
  <div v-else>Loading...</div>
</template>
```
```vue
<!-- pages/chat/[chatId].vue -->
<script setup lang="ts">
import { toRef } from 'vue'
import type { ID } from 'jazz-tools'
import { Chat } from '@/schema'
import { useChat } from '@/composables/useChat'

const props = defineProps<{ chatId: ID<typeof Chat> }>()

const { chat, me, inputValue, messages, sendMessage } = useChat(
  toRef(() => props.chatId)
)
</script>

<template>
  <template v-if="chat?.$isLoaded && me?.$isLoaded">
    <div v-for="msg in messages" :key="msg.$jazz.id">
      <strong>{{ msg.$jazz.createdBy === me!.$jazz.id ? 'You' : 'Other' }}:</strong>
      {{ msg.text }}
    </div>

    <form @submit.prevent="sendMessage">
      <input v-model="inputValue" placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  </template>
  <div v-else>Loading...</div>
</template>
```
````

<!--
Step 5: the component itself — 10 lines of script setup, that's it. One import, one destructure. All the logic lives in useChat.

CLICK: The template — plain Vue. v-for to loop messages, v-if for loading state. Standard Vue patterns.

CLICK: Add the form — v-model on input, submit calls sendMessage. No special syntax, no store, no server calls.

This is what local-first looks like in Vue: a composable any Vue dev would recognize, powering a component any Vue dev could read.

TRANSITION: Let me show you what that one line replaces...
-->

---
clicks: 1
---

# The Line That Replaces Your Entire API

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click="1">

<Card variant="muted">

<div class="text-sm font-bold text-brand mb-2">Traditional Vue</div>

```ts
async function sendMessage(msg: string) {
  const optimistic = store.addOptimistic(msg)
  try {
    await axios.post('/api/messages', { text: msg })
    socket.emit('newMessage', msg)
  } catch (e) {
    store.rollback(optimistic)
  }
}
```

<div class="mt-2 text-xs op-50">Pinia + axios + socket.io + error handling</div>

</Card>

</div>

<div v-click="1">

<Card glow>

<div class="text-sm font-bold text-brand mb-2">Jazz</div>

```ts
function sendMessage(msg: string) {
  chat.value.push(
    Message.create({ text: msg }, chat.value._owner)
  )
}
```

<div class="mt-2 text-xs op-50">That's it. Synced, persisted, encrypted.</div>

</Card>

</div>

</div>

<!--
[pause] Let that sink in.

CLICK -- On the left: what you'd write today. Pinia for state, axios for the API call, socket.io for real-time, plus rollback on error. Five dependencies. Six lines of plumbing.

On the right: Message.create with the owner, push to the list. Jazz handles sync, persistence, conflict resolution, and encryption. All of it.

[look up] THIS is the promise of local-first. Not "offline mode." Not "cache layer." Your entire data layer — gone.

TRANSITION: Let me zoom out...
-->

---
layout: center
class: text-center
---

<div class="text-2xl font-bold op-90">

Schema + Provider + Group + `useCoState` = **your entire data layer**

</div>
<div class="mt-3 text-base op-60">Real-time. Offline. Encrypted. Permissioned.</div>

<!--
[pause] [look up]

Schema, provider, group, useCoState. That's it. Your entire data layer. Real-time, offline, encrypted, and permissioned.

TRANSITION: But wait — there's more you get for free...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: '[chatId].vue'
tabs: '[chatId].vue'
step: Step 6
transition: fade
clicks: 1
files: |
  src
    schema.ts
    RootApp.vue
    composables/
      useChat.ts
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// Edit history — FREE with every CoValue

// Get the edit history for a message's text field
const lastEdit = msg.$jazz.getEdits().text
```
```ts
// Edit history — FREE with every CoValue

// Get the edit history for a message's text field
const lastEdit = msg.$jazz.getEdits().text

// Who wrote it?
lastEdit.by?.profile?.name  // → "Alexander"

// When did they write it?
lastEdit.madeAt             // → 2026-03-09T14:32:00Z

// Full history of every change
msg.$jazz.getEdits().text
  // → [{ by, madeAt, value }, { by, madeAt, value }, ...]
```
````

<!--
Step 6: edit history. Every CoValue in Jazz tracks its own history automatically. getEdits gives you the edit trail for any field.

CLICK: Who wrote it? When? Full history of every change — for FREE. No audit log table, no event sourcing, no changelog migration. It's just THERE.

Think about what this normally costs. With Jazz? Two lines.

TRANSITION: One more thing...
-->

---
layout: code-editor
project: vue-jazz-chat
activeFile: '[chatId].vue'
tabs: '[chatId].vue'
step: Step 7
transition: fade
clicks: 1
files: |
  src
    schema.ts
    RootApp.vue
    composables/
      useChat.ts
    pages/
      index.vue
      chat/
        [chatId].vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// Image uploads — co.image() from our schema

import { createImage } from 'jazz-tools'

async function sendImage(file: File) {
  const image = await createImage(file, {
    owner: chat.value._owner,
  })
}
```
```ts
// Image uploads — co.image() from our schema

import { createImage } from 'jazz-tools'

async function sendImage(file: File) {
  const image = await createImage(file, {
    owner: chat.value._owner,
  })

  chat.value.push(
    Message.create(
      { text: file.name, image },
      chat.value._owner
    )
  )
}
```
````

<!--
Step 7: image uploads. Remember co.image() in our schema? createImage takes a file and an owner — same Group pattern. Blur-up placeholders and progressive loading out of the box.

CLICK: Then push a Message with the image. Same pattern as text. No S3, no signed URLs, no upload service. Everything synced, encrypted, permissioned — automatically.

TRANSITION: Let me show you what you DIDN'T have to build...
-->

---
clicks: 1
---

# What You Didn't Have to Build

<div class="grid grid-cols-2 gap-8 mt-4">

<div v-click="1">

<Card variant="muted">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-stack-bold" /> Traditional Stack</div>

- <div class="i-ph-database inline-block align-middle" /> Database + migrations
- <div class="i-ph-plugs inline-block align-middle" /> REST/GraphQL API
- <div class="i-ph-broadcast inline-block align-middle" /> WebSocket server
- <div class="i-ph-user-circle inline-block align-middle" /> Auth service
- <div class="i-ph-shield-check inline-block align-middle" /> Permission middleware
- <div class="i-ph-upload inline-block align-middle" /> File upload service
- <div class="i-ph-clock-counter-clockwise inline-block align-middle" /> Audit log system
- <div class="i-ph-hard-drives inline-block align-middle" /> Offline + cache layer
- <div class="i-ph-arrows-clockwise inline-block align-middle" /> Optimistic updates

</Card>

</div>

<div v-click="1">

<Card glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-lightning-bold" /> Jazz Equivalent</div>

- `co.map()` / `co.list()`
- `useCoState`
- Built into CoValues
- Passkeys, built in
- Groups + roles
- `co.image()`
- `$jazz.getEdits()`
- IndexedDB + CRDTs
- Automatic

</Card>

</div>

</div>

<!--
[pause] Let that sink in.

CLICK -- On the left: everything you'd normally build. Database, API, WebSockets, auth, permissions, file uploads, audit logs, offline layer, optimistic updates. NINE services.

On the right: Jazz equivalents. co.map, useCoState, Groups, co.image, getEdits. Each one is a line or two. Most are automatic.

[look up] This isn't a shortcut. It's a different architecture. When your data IS a CRDT, all of this comes for free.

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

Schema + Provider + Group + useCoState = THAT.

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
layout: two-cols
transition: slide-left
---

<div class="h-full flex flex-col justify-center">

## <span class="text-green-400">Great Fit</span>

<div class="space-y-2 mt-4">

<div v-click class="flex items-start gap-2">
  <span class="text-green-400 text-lg">✓</span>
  <span>Note-taking & productivity <span class="op-50 text-sm">(Linear, Obsidian)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-green-400 text-lg">✓</span>
  <span>Creative tools <span class="op-50 text-sm">(docs, design, whiteboards)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-green-400 text-lg">✓</span>
  <span>Personal data <span class="op-50 text-sm">(health, finance, journals)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-green-400 text-lg">✓</span>
  <span>Field / mobile apps <span class="op-50 text-sm">(healthcare, logistics)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-green-400 text-lg">✓</span>
  <span>Privacy-sensitive apps</span>
</div>

</div>

<div v-click class="mt-6 text-sm op-70 italic">

Heuristic: "User creates and owns the data"

</div>

</div>

::right::

<div class="h-full flex flex-col justify-center">

## <span class="text-yellow-400">Think Twice</span>

<div class="space-y-2 mt-4">

<div v-click class="flex items-start gap-2">
  <span class="text-yellow-400 text-lg">⚠</span>
  <span>Banking & financial transactions <span class="op-50 text-sm">(strong consistency)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-yellow-400 text-lg">⚠</span>
  <span>E-commerce inventory <span class="op-50 text-sm">(overselling risk)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-yellow-400 text-lg">⚠</span>
  <span>Ride-sharing / real-time matching <span class="op-50 text-sm">(central arbitration)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-yellow-400 text-lg">⚠</span>
  <span>Large shared datasets <span class="op-50 text-sm">(analytics, social networks)</span></span>
</div>

<div v-click class="flex items-start gap-2">
  <span class="text-yellow-400 text-lg">⚠</span>
  <span>Strict centralized access control</span>
</div>

</div>

<div v-click class="mt-6 text-sm op-70 italic">

Heuristic: "A central authority must arbitrate"

</div>

</div>

<div v-click class="absolute bottom-8 left-8 right-8">

<Callout type="info">

**EU Data Sovereignty** — The US CLOUD Act lets authorities demand data from US-owned companies regardless of server location. Local-first = data stays on the user's device = no foreign server to subpoena. A structural solution to a legal problem.

</Callout>

</div>

<!--
Linear is the poster child — feels impossibly fast because reads/writes are local DB operations.

Banking: "An offline banking app that lets you initiate a transfer with an out-of-date balance is dangerous" (RxDB)

E-commerce: two warehouses claiming the last item → CRDTs can't resolve this automatically.

EU angle: US providers hold 70% of European cloud market; Schrems II invalidated Privacy Shield; CLOUD Act applies even to EU-hosted servers if the company is US-based.

Key framing: local-first is data sovereignty by architecture, not by legal agreement.
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
