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
clicks: 6
---

<div class="flex items-center justify-center h-full">
<DuplicatedArchDiagram
  :panels="[
    {
      title: 'FRONTEND',
      click: 1,
      items: [
        { id: 'ref', label: 'ref([])', click: 2 },
        { id: 'loading', label: 'loading = true', click: 2 },
        { id: 'try', label: 'try { ... }', click: 2 },
        { id: 'catch', label: 'catch { ... }', click: 2 },
        { id: 'finally', label: 'finally { ... }', click: 2 },
        { id: 'cache', label: 'invalidateCache()', click: 2 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 5,
    },
    {
      title: 'BACKEND',
      click: 1,
      items: [
        { id: 'get', label: 'app.get(\'/todos\')', click: 4 },
        { id: 'validate', label: 'validate(...)', click: 4 },
        { id: 'insert', label: 'db.insert(...)', click: 4 },
        { id: 'auth', label: 'authorize(...)', click: 4 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 5,
    },
  ]"
  :connections="[
    { label: 'GET', click: 3 },
    { label: 'POST', click: 3 },
  ]"
  :database="{ label: 'query / write', click: 4 }"
  :callout="{ label: 'DUPLICATED', click: 6, variant: 'danger' }"
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

- Kyle Mathews = founder of Gatsby, now CPO and co-founder of ElectricSQL
- Said this on localfirst.fm podcast
- "With jQuery, you'd grab a DOM element, tweak text, remove a child... you were fiddling with the DOM constantly. Vue freed us from that."
- "But we're STILL doing the same imperative dance with DATA — fetch this, cache that, retry this, invalidate that."
- "We're in the jQuery era of data. History is repeating."

PAUSE — let the analogy sink in.

TRANSITION: "Let me show you where we are in this evolution..."
-->

---
clicks: 5
---

# But Who Solves Data Sync?

<FlowDiagram
  :nodes="[
    { id: 'jquery', label: 'jQuery Era', subtitle: 'YOU → DOM', variant: 'muted' },
    { id: 'vue', label: 'Vue Era', subtitle: 'ref() → VDOM → DOM', click: 1 },
    { id: 'now', label: 'Now', subtitle: '??? → ??? → DB', click: 2, variant: 'accent' },
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
  <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-lightning text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Fast</div>
    <div class="text-xs text-gray-500 leading-tight">No spinners. Instant response.</div>
  </div>
  <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-devices text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Multi-device</div>
    <div class="text-xs text-gray-500 leading-tight">Your work on any device.</div>
  </div>
  <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-wifi-slash text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Works offline</div>
    <div class="text-xs text-gray-500 leading-tight">The network is optional.</div>
  </div>
  <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-users-three text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Collaboration</div>
    <div class="text-xs text-gray-500 leading-tight">Seamless real-time teamwork.</div>
  </div>
</div>

<div class="flex justify-center gap-3 mt-3">
  <div class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-clock-countdown text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Longevity</div>
    <div class="text-xs text-gray-500 leading-tight">Your data outlives the app.</div>
  </div>
  <div class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-shield-check text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">Privacy</div>
    <div class="text-xs text-gray-500 leading-tight">Security and privacy by default.</div>
  </div>
  <div class="w-[calc(25%-9px)] p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 text-center">
    <div class="i-ph-key text-2xl text-pink-400/50" />
    <div class="text-sm font-semibold text-gray-300">User control</div>
    <div class="text-xs text-gray-500 leading-tight">You retain ownership and control.</div>
  </div>
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
All 7 ideal cards are visible immediately — let the audience read them for a beat.

"Fast. Multi-device. Works offline. Collaboration. Longevity. Privacy. User control."

Sweep through them verbally — don't linger on each one.

CLICK 1 — reveal the Ink & Switch attribution.
"These aren't random criteria. These are the seven ideals from the Local-First Software paper by Ink & Switch, 2019."

CLICK 2 — reveal the verdict.
"And right now, with the typical Vue app? Zero out of seven. The rendering layer is solved. The data layer hasn't started. Let's change that."

TRANSITION: "What if we flipped the model?"

[CHECK: ~5:00 — entering Part 1]
-->

---
transition: fade
---

<PartSlide part="1" title="Offline-First" subtitle="The App That Works Without WiFi" />

<!--
Section transition — let the slide breathe for a moment.

"What if we flip the model? What if data lives on the client FIRST, and syncs to the server when it can?"

BREATHE.
-->

---
clicks: 5
---

# The Offline-First Architecture

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

# The PWA Gotcha

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
layout: center
class: text-center
---

# I wrote a blog post about this

<div class="mt-6 mx-auto max-w-lg">
  <a href="https://alexop.dev/posts/create-pwa-vue3-vite-4-steps/" target="_blank" class="block rounded-xl overflow-hidden border border-gray-700/50 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-shadow">
    <img src="/pwa-blog-post.png" class="w-full" />
  </a>
</div>

<div class="mt-4 text-sm text-gray-400">
  <mdi-open-in-new class="inline-block mr-1 text-xs" /> alexop.dev/posts/create-pwa-vue3-vite-4-steps
</div>

<!--
"I actually wrote a blog post on how to convert any Vue app into a PWA in 4 steps — it's up on my site. Feel free to check it out later."

- Quick mention, don't dwell — the audience can scan the page
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
          { text: 'Bundle: ~900KB WASM' },
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
- Note: PGlite is actually Postgres-in-WASM, not SQLite — mention it as a third option if asked.
- "Both work. Different tradeoffs. Most sync engines we'll see later pick one for you."

TRANSITION: "But how long does that data actually stick around?"

[CHECK: ~10:00]
-->

---

# How Long Does Your Data Survive?

<div class="grid grid-cols-2 gap-8 mt-4">

<div v-click class="border border-gray-600 rounded-xl p-5 bg-gray-800/40">
  <div class="flex items-center gap-2 mb-3">
    <logos-chrome class="text-2xl" />
    <span class="font-bold text-lg">Chrome</span>
  </div>
  <div class="space-y-2 text-sm">
    <div class="flex items-center gap-2">
      <span class="text-green-400">&#x2713;</span> <span>Data persists <strong>indefinitely</strong></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-yellow-400">&#x26A0;</span> <span>Evicted only under <strong>storage pressure</strong></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-400">&#x25CF;</span> <span>Up to <strong>60%</strong> of disk per origin</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-400">&#x25CF;</span> <span>LRU eviction — least recently used goes first</span>
    </div>
  </div>
</div>

<div v-click class="border border-gray-600 rounded-xl p-5 bg-gray-800/40">
  <div class="flex items-center gap-2 mb-3">
    <logos-safari class="text-2xl" />
    <span class="font-bold text-lg">Safari</span>
  </div>
  <div class="space-y-2 text-sm">
    <div class="flex items-center gap-2">
      <span class="text-red-400">&#x2717;</span> <span><strong>7-day cap</strong> — no user visit = data deleted</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-yellow-400">&#x26A0;</span> <span>Part of Intelligent Tracking Prevention</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-gray-400">&#x25CF;</span> <span>Affects IndexedDB, Cache API, Service Workers</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-green-400">&#x2713;</span> <span><strong>PWAs exempt</strong> — home screen apps keep data</span>
    </div>
  </div>
</div>

</div>

<div v-click class="mt-6 border border-pink-500/40 rounded-xl p-4 bg-pink-500/5">
  <div class="font-bold text-pink-400 mb-1">PWA + Storage API = Protection</div>
  <div class="text-sm text-gray-300">

  ```ts
  // Request persistent storage — browser won't auto-evict
  const isPersisted = await navigator.storage.persist() // true = protected
  ```

  Safari exempts installed PWAs from the 7-day cap. Chrome auto-grants persistence for engaged sites.
  </div>
</div>

<!--
This is a critical gotcha slide — audiences always react to the Safari 7-day rule.

CLICK 1: "Chrome — pretty generous. Your IndexedDB data stays until the disk fills up. Least recently used origins get evicted first."

CLICK 2: "Safari — this is the one that bites. 7-day cap. If the user doesn't visit your site for a week, Safari deletes everything. IndexedDB, Cache API, Service Workers — all gone. This is part of their Intelligent Tracking Prevention. BUT — if your app is installed as a PWA on the home screen, you're exempt."

CLICK 3: "The fix? The Storage API. navigator.storage.persist() tells the browser: don't auto-evict my data. Chrome auto-grants it for sites with high engagement. And for Safari — making your app a PWA is the best protection you have."

TRANSITION: "So we can store data, and we can keep it around. But the hard part..."

[CHECK: ~11:00 — if past 11:30, tighten the next two slides]
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
CLICK 1 — reveal the 2 green cards.

"Offline-first gives us two things for free: speed — because data is local, reads are instant — and offline capability."

CLICK 2 — reveal the 5 question marks.

"But five question marks are still open. We need something more."

CLICK 3 — reveal the counter.

"That's 2 out of 7 local-first principles. Good progress — but not enough."

TRANSITION: "So what's holding us back?"
-->

---
clicks: 3
---

# The Missing Piece: How Do You Sync?

Storing data locally is the **easy part**.

<FlowDiagram
  :nodes="[
    { id: 'a', label: 'Device A', subtitle: 'title: Buy milk', variant: 'accent' },
    { id: 'conflict', label: '???', subtitle: 'conflict', click: 2, variant: 'danger' },
    { id: 'b', label: 'Device B', subtitle: 'title: Buy oats', click: 1, variant: 'accent' },
  ]"
  :edges="[
    { from: 'a', to: 'conflict', click: 2 },
    { from: 'b', to: 'conflict', click: 2 },
  ]"
  :nodeHeight="60"
  :gap="80"
  :roughness="1.0"
  :seed="150"
/>

<div v-click="3" class="text-center mt-4 text-gray-400">

This is a **distributed systems** problem. It needs a **sync engine**.

</div>

<!--
"Storing data locally? Easy. We just did it."

CLICK 1: "But now imagine two devices editing the same todo offline."
CLICK 2: "They both come back online. Who wins?" Point at the ??? conflict node.
CLICK 3: "This is a distributed systems problem. And it needs a sync engine."

PAUSE — let the problem statement hang. This is the cliffhanger into Part 2.

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

Three teams — **Linear, Figma, and Notion** — all converged on this independently.

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
"This isn't theoretical. Linear, Figma, Notion — three of the most successful product teams — all independently arrived at the SAME architecture."

PAUSE — let "independently" land. That's the signal.

- Local store = instant reads/writes, no spinners
- Server store = durability, authority
- Sync protocol = minimal deltas between them

HOW EACH TEAM DOES IT (pick 1-2 to elaborate on if time allows):

- **Linear** — IndexedDB as primary store, writes local-first. WebSocket delta packets for sync. Pages load in <50ms. Full offline PWA.
- **Figma** — Document tree synced via WebSocket. CRDT-inspired LWW registers (not full CRDTs). Server validates and broadcasts.
- **Notion** — SQLite on client. Push-based sync on per-page channels. Offline pages migrated to CRDT model for conflict resolution.

KEY INSIGHT: Same two-box pattern, but sync protocols differ based on data model shape — object graph (Linear), design tree (Figma), block tree (Notion).

TRANSITION: "Let's look at what's out there. But first — there's one question they all answer differently."
-->

---
layout: statement
transition: fade
---

# Before We Look at Engines...

<div class="mt-4 text-xl op-70">They all solve the same fundamental problem differently.</div>

<!--
"Three teams built the same architecture. But there's a critical question they answered DIFFERENTLY."

PAUSE.

"When two devices edit the same data offline and reconnect — WHO decides what happened?"

TRANSITION: "Actually, it's not just two answers — it's a spectrum."
-->

---
clicks: 5
---

# Conflict Resolution: It's a Spectrum

<FlowDiagram
  :nodes="[
    { id: 'lww', label: 'Last-Write-Wins', subtitle: 'Simplest', variant: 'danger' },
    { id: 'server', label: 'Server Authority', subtitle: 'Centralized', click: 1, variant: 'muted' },
    { id: 'oplog', label: 'Operation Logs', subtitle: 'Replayable', click: 2, variant: 'default' },
    { id: 'crdt', label: 'CRDTs', subtitle: 'Math-based', click: 3, variant: 'success' },
    { id: 'hybrid', label: 'Hybrid / Manual', subtitle: 'User decides', click: 4, variant: 'accent' },
  ]"
  :edges="[
    { from: 'lww', to: 'server', click: 1 },
    { from: 'server', to: 'oplog', click: 2 },
    { from: 'oplog', to: 'crdt', click: 3 },
    { from: 'crdt', to: 'hybrid', click: 4 },
  ]"
  direction="horizontal"
  :nodeWidth="140"
  :nodeHeight="65"
  :gap="25"
  :roughness="1.2"
  :seed="777"
/>

<Callout v-click="5" type="info">

Most sync engines **combine strategies** — auto-merge where possible, escalate where necessary.

</Callout>

<!--
SPECTRUM BRIDGE — ~45 seconds. Set the framing before diving into binary choices.

"Before I show you the two main camps, I want you to see the full picture."

LWW (visible immediately): "The simplest approach — last write wins. Whoever saves last, their version sticks. Fast, but you LOSE data."

CLICK 1: "Next step: a server decides. More nuanced — the server can apply business rules. But you need a server."

CLICK 2: "Operation logs — instead of saving STATE, you save every OPERATION. You can replay, reorder, and merge. This is where things get interesting."

CLICK 3: "CRDTs — Conflict-free Replicated Data Types. The math guarantees that independent merges ALWAYS converge. No server needed."

CLICK 4: "And at the far end: hybrid. Surface the conflict to the user, like Git merge conflicts. Or combine multiple strategies depending on the data type."

CLICK 5: "The key insight: most production systems are NOT purely one approach. They combine strategies. Auto-merge names, LWW timestamps, user-prompt for document conflicts."

TRANSITION: "Now let's zoom into the two main camps that matter most for local-first."
-->

---
clicks: 4
---

# The Hardest Problem: Where Do You Resolve Conflicts?

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click="1">

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-pink-400 mb-2 flex items-center gap-2"><div class="i-ph-cloud-bold" /> Server-Side Resolution</div>

- Server decides who wins
- Simpler to implement
- Familiar mental model (Postgres, Rails, etc.)
- **But:** requires a server you trust & control
- Client rollback on rejection

<div class="mt-2 text-xs op-50">Zero, Dexie Cloud, traditional APIs</div>

</Card>

</div>

<div v-click="2">

<Card size="lg" glow>

<div class="text-sm font-bold text-pink-400 mb-2 flex items-center gap-2"><div class="i-ph-devices-bold" /> Client-Side Resolution</div>

- Every client merges independently
- No server authority needed
- Works offline & P2P
- **But:** harder — needs math that always converges
- Server just relays bytes

<div class="mt-2 text-xs op-50">Yjs, Jazz, Automerge (CRDTs)</div>

</Card>

</div>

</div>

<Callout v-click="3" type="info">

Client-side resolution is what makes **true local-first** possible — the server becomes a dumb pipe. But it requires data structures that **mathematically guarantee convergence**: CRDTs.

</Callout>

<div v-click="4" class="mt-4 op-60 text-sm flex items-center gap-2">
<div class="i-ph-git-merge-bold text-lg text-pink-300" />
<span>**Third option:** surface conflicts to the user — like Git merge conflicts. Some apps combine all three.</span>
</div>

<!--
THIS IS THE KEY CONCEPTUAL SLIDE — go slow.

"Remember the sync protocol arrow? There are exactly two places conflict resolution can live."

CLICK 1: "Option one: the SERVER decides."
- "This is what you're used to. POST to the API, server validates, server picks a winner."
- "It's simpler to implement — you have one source of truth. Postgres is great at this."
- "But the catch: you NEED a server. And your app breaks without it."
- "Zero and Dexie Cloud work this way."

CLICK 2: "Option two: the CLIENT decides."
- "Every device resolves conflicts on its own. No central authority."
- "The advantage: the server is LESS powerful. It's just a relay. A dumb pipe."
- "You can even go fully P2P — no server at all."
- "But the hard part: you need data structures where independent merges ALWAYS produce the same result."
- "Yjs and Jazz do this."

CLICK 3: "Client-side resolution is what makes TRUE local-first possible. But it needs math. It needs CRDTs."

CLICK 4: "But there's a third option hiding in plain sight — let the USER decide."
- "Think Git merge conflicts. The system detects the conflict but presents BOTH versions to the human."
- "Notion does this for some block-level conflicts. Figma shows a notification."
- "In practice, most production apps are HYBRIDS — auto-merge what you can, escalate what you can't."

PAUSE — let it land. This frames everything that follows.

TRANSITION: "So what ARE CRDTs, and how do they work?"

[CHECK: ~14:00]
-->

---
clicks: 5
---

# CRDTs: Merge Without a Server

<CrdtCounterDemo :roughness="1.2" :seed="800" />

<!--
CLICK-DRIVEN DEMO — each spacebar/arrow press advances one step:

Click 1: Go offline — "Two peers go offline. They can't see each other."
Click 2: Peer A increments to 1 — "Peer A counts +1 independently."
Click 3: Peer B increments to 2 — "Peer B counts +2 independently. Neither knows about the other."
Click 4: Sync — three boxes appear:
  - LEFT (red): Last-Write-Wins → 2. "LWW picks the highest value. WRONG."
  - CENTER (pink): G-Counter state { A: 1, B: 2 }. "The CRDT keeps a slot per peer."
  - RIGHT (green): CRDT → 3. "Sum the slots. 1 + 2 = 3. CORRECT."

DOCTOR ANALOGY (use if audience looks confused):
"Imagine two doctors editing the same patient record on a flight. Doctor A adds an allergy. Doctor B updates the dosage. With LWW, one edit DISAPPEARS when they land. With CRDTs, both edits survive — because the data structure tracks WHO changed WHAT, not just WHEN."

MATH INTUITION:
"Think of it like addition: 1 + 2 = 2 + 1. CRDTs design every operation so that merge order never matters. That's the whole trick — commutativity."

"THIS is why CRDTs matter. The server needs ZERO conflict resolution logic — it just relays bytes."

TRANSITION: "That's the math. But what does this look like with real data?"

[CHECK: ~15:30]
-->

---
clicks: 5
---

# CRDTs in Practice: Field-Level Merging

<CrdtResolutionDiagram :roughness="1.5" :seed="500" />

<!--
"Let's see how CRDTs handle a more realistic scenario — two users editing the SAME object."

CLICK 1: "User A renames the todo. User B marks it done. Both offline."
CLICK 2: "They reconnect and sync."

CLICK 3 — RULE 1: DIFFERENT FIELDS → auto-merge
- "Different fields? No conflict at all. Title from A, completed from B — they don't overlap."
- "This covers roughly 90% of real-world edits. Most of the time, users aren't touching the same field."

CLICK 4 — RULE 2: SAME FIELD → Last-Write-Wins (vector clocks)
- "Same field? We fall back to LWW — the most recent timestamp wins."
- "Remember the spectrum slide? This is where we sit: deterministic, automatic, but you CAN lose data."
- "Vector clocks help — they track causality, not just wall-clock time."

CLICK 5 — RULE 3: DELETE vs UPDATE → delete wins (tombstone)
- "Delete versus update? Delete wins. Always."
- "This is the tombstone pattern — you mark something as deleted, and it stays deleted."
- "It's controversial: some teams prefer update-wins. But delete-wins is safer — it prevents zombie records from coming back."

"Three rules. That's the entire conflict resolution playbook for most CRDT-based engines."

TRANSITION: "Now let's look at the landscape — and you'll immediately see which engines use CRDTs and which don't."

[CHECK: ~17:00]
-->

---
layout: statement
transition: fade
---

# The Sync Engine Landscape

<div class="mt-4 text-xl op-70">Now that you know HOW they differ — let's see what's out there.</div>

<!--
Energy shift — this is the exciting part!

"You now understand the two approaches: server decides, or client decides with CRDTs. Let's see how four real engines make that choice — and what it means for your app."

BREATHE.

[CHECK: ~17:30 — landscape section starts]
-->

---
clicks: 4
---

# The Landscape

<div class="grid grid-cols-2 gap-4 mt-4">
  <Card v-click="1" variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-pink-400">Yjs</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Production · 10+ years</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">CRDT library. Client-side conflict resolution. Bring your own backend. P2P possible. Maximum flexibility.</div>
  </Card>
  <Card v-click="2" variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-pink-400">Dexie</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Production · 10+ years</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">IndexedDB wrapper. Server-side field-level merge via Dexie Cloud. Progressive upgrade path. Millions of users.</div>
  </Card>
  <Card v-click="3" variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-pink-400">Jazz</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Early · Active dev</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">Batteries-included. Client-side CRDTs. Auth, permissions, E2E encryption, sync — all built in.</div>
  </Card>
  <Card v-click="4" variant="muted" size="md">
    <div class="flex items-center gap-2">
      <div class="text-sm font-bold text-pink-400">Zero</div>
      <div class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Alpha · Well-funded</div>
    </div>
    <div class="text-xs text-gray-400 mt-1">Query-driven sync. Server resolves all conflicts. Reactive Postgres to client SQLite. Great DX, but not truly local-first.</div>
  </Card>
</div>

<div v-click="4" class="mt-4 text-xs op-50 text-center">Also worth watching: LiveStore, TanStack DB, Automerge, PowerSync, cr-sqlite — full comparison at alexop.dev/vue-amsterdam</div>

<!--
Four engines, four different philosophies. Now the audience has the conflict resolution framework — they can immediately classify each one.

CLICK 1: "Yjs — the most mature. 10+ years in production. CLIENT-side CRDTs — remember the right card? YOU bring the backend. WebSocket, WebRTC, even P2P."

CLICK 2: "Dexie — 10+ years, millions of users. SERVER-side field-level merge — the left card. Start local-only, add Dexie Cloud for sync later."

CLICK 3: "Jazz — newer, but the most ambitious. Also client-side CRDTs. Auth, permissions, E2E encryption — everything built in."

CLICK 4: "Zero — great DX, well-funded. But notice: SERVER resolves all conflicts. Postgres on the server, SQLite cache on the client. NOT truly local-first — and now you know exactly why."

"There are more — LiveStore, TanStack DB, Automerge, PowerSync — I'll link a full comparison at the end. But these four cover the key patterns."

TRANSITION: "Let me show you what each looks like in code..."
-->

---

# Yjs — CRDT Library (BYO Backend)

```ts
// Yjs — CRDT library with Nuxt + Nitro WebSocket
// server/routes/_ws.ts
export default defineWebSocketHandler({
  message(peer, message) {
    for (const p of peer.peers) p.send(message.rawData)
  },
})

// composables/useSync.ts
const ydoc = new Y.Doc()
const todos = ydoc.getArray<Todo>('todos')
const ws = new WebSocket('/_ws')
ydoc.on('update', (update) => ws.send(update))
ws.onmessage = (e) => Y.applyUpdate(ydoc, new Uint8Array(e.data))

function addTodo(title: string) {
  todos.push([{ title, done: false }])
}
// ✅ Fully open-source, P2P possible — truly local-first
// ✅ You choose the transport: WebSocket, WebRTC, file sync
```

<!--
Yjs gives you CRDTs. You bring the backend. Here we're using Nuxt + Nitro WebSocket — but you could use WebRTC for peer-to-peer, or even file sync via Dropbox. Maximum flexibility, full ownership.
-->

---

# Dexie — IndexedDB + Optional Cloud

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
// ⚠ Server-side field-level merge (different fields auto-merge, same field = LWW)
```

<!--
Wraps IndexedDB. liveQuery is reactive like computed(). Start local-only, add Dexie Cloud later for sync. The easiest on-ramp — but Dexie Cloud is proprietary. Note: Dexie Cloud does field-level merge — different fields on the same object auto-merge, only same-field conflicts use last-write-wins.
-->

---

# Jazz — Batteries-included

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

<!--
useCoState gives you a reactive reference. push() to write. Auth, permissions, encryption — all included. Zero boilerplate. The most ambitious vision — but still early.
-->

---

# Zero — Server-authoritative Query Sync

```ts
// Zero — Server-authoritative query sync
import { createZeroComposables } from 'zero-vue'
import { schema } from './schema'

const { useQuery, useZero } = createZeroComposables(schema)

// In your component:
const zero = useZero()
const todos = useQuery((z) => z.query.todo.orderBy('createdAt', 'asc'))

function addTodo(title: string) {
  zero.value.mutate.todo.insert({
    id: crypto.randomUUID(), title, done: false,
  })
}
// ✅ Instant reads from client-side SQLite cache
// ⚠ Server is source of truth — not truly local-first
```

<!--
Server-authoritative. Postgres on the server, SQLite cache on the client. Great DX. Reads work offline from the local cache, but writes require the server. I'm showing this because it's important to understand the CONTRAST with true local-first.
-->

---
clicks: 5
---

# Choosing the Right Engine

<div class="text-sm mt-2">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-2"></th>
      <th class="text-center py-1.5 px-1 text-xs">Maturity</th>
      <th class="text-center py-1.5 px-1 text-xs">Conflicts</th>
      <th class="text-center py-1.5 px-1 text-xs">Offline R/W</th>
      <th class="text-center py-1.5 px-1 text-xs">Vendor-free</th>
      <th class="text-left py-1.5 px-1 text-xs">Vue</th>
      <th class="text-left py-1.5 px-1 text-xs">Best for</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Yjs</td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">10+ yrs</span></td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">CRDT</span></td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="py-1.5 px-1 text-xs">DIY composable</td>
      <td class="py-1.5 px-1 text-xs">Collab-first apps (docs, whiteboards)</td>
    </tr>
    <tr v-click="2" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Dexie</td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">10+ yrs</span></td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Server merge</span></td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-red-400">No</td>
      <td class="py-1.5 px-1 text-xs">liveQuery + VueUse</td>
      <td class="py-1.5 px-1 text-xs">Adding sync to existing apps</td>
    </tr>
    <tr v-click="3" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Jazz</td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Early</span></td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">CRDT</span></td>
      <td class="text-center py-1.5 px-1 text-emerald-400">Yes</td>
      <td class="text-center py-1.5 px-1 text-yellow-400">~</td>
      <td class="py-1.5 px-1 text-xs">jazz-vue</td>
      <td class="py-1.5 px-1 text-xs">New apps that want everything built-in</td>
    </tr>
    <tr v-click="4" class="border-b border-white/5">
      <td class="py-1.5 pr-2 font-semibold text-pink-400">Zero</td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">Alpha</span></td>
      <td class="text-center py-1.5 px-1"><span class="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">Server</span></td>
      <td class="text-center py-1.5 px-1 text-yellow-400">Read only</td>
      <td class="text-center py-1.5 px-1 text-red-400">No</td>
      <td class="py-1.5 px-1 text-xs">zero-vue</td>
      <td class="py-1.5 px-1 text-xs">Server-first apps that want speed</td>
    </tr>
  </tbody>
</table>
</div>

<Callout v-click="5" type="info">

**No one-size-fits-all.** Yjs is the most battle-tested and truly vendor-free. Dexie is the easiest on-ramp. Jazz is the most ambitious vision. Zero is great DX but server-first. Pick based on your app's needs.

</Callout>

<!--
One table, four engines. Sorted by maturity — most proven first.

CLICK 1: "Yjs — 10+ years in production, fully vendor-free. P2P possible. Best if you're building something collaborative like docs or whiteboards."

CLICK 2: "Dexie — 10+ years, battle-tested IndexedDB wrapper. Easiest entry point. But Dexie Cloud is proprietary — that red No matters."

CLICK 3: "Jazz — early but ambitious. Everything built in. Self-hostable, so you GET close to vendor-free. Best for greenfield apps."

CLICK 4: "Zero — great DX but notice: reads work offline, but writes require the server. No vendor independence. Server-first with a fast cache."

CLICK 5 (callout): "No one-size-fits-all. The right choice depends on YOUR app."

TRANSITION: "But are any of these truly local-first? Let's find out."

[CHECK: ~18:00]
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
PAUSE — build tension.

"We've seen the landscape. But which of these are actually local-first?"

CLICK — reveal the sub-question.

"Martin Kleppmann — co-author of the Ink & Switch paper and creator of Automerge — boils it down to three criteria."

[CHECK: ~18:30]
-->

---
clicks: 4
---

# The Three Criteria

<div class="grid gap-3 mt-6">
  <Card v-click="1" variant="muted">
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-pink-400">1.</span> Offline reads <strong>and</strong> writes</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">Not just cached reads — the app must accept writes while disconnected and reconcile later.</p>
  </Card>
  <Card v-click="2" variant="muted">
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-pink-400">2.</span> Collaboration across devices</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">Multiple users and devices can edit concurrently, and changes merge automatically.</p>
  </Card>
  <Card v-click="3" glow>
    <div class="flex items-center gap-2 text-lg font-bold"><span class="text-pink-400">3.</span> Data survives the developer shutting down</div>
    <p class="text-sm text-gray-400 mt-1 pl-6">If the company disappears, your data and app must keep working. No vendor lock-in.</p>
  </Card>
</div>

<div v-click="4" class="mt-4 text-center text-sm text-gray-500">

Criterion 3 is the hardest — and it's what separates **offline-first** from **local-first**.

</div>

<!--
Build progressively — this is a key conceptual moment.

CLICK 1: "First: the app must work offline — not just reads, but WRITES too."
CLICK 2: "Second: collaboration. Multiple devices, multiple users, changes merge."
CLICK 3: "Third — and this is the big one — your data survives the developer shutting down."

PAUSE — let criterion 3 sink in. Point at it.

CLICK 4: "This third criterion is what separates offline-first from truly local-first. It's the dealbreaker."

TRANSITION: "So what would it take to actually satisfy criterion 3?"
-->

---

# Surviving the Shutdown

What would actually satisfy criterion 3?

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

TRANSITION: "Now let's update our scorecard with what sync engines give us."
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

<Card v-click variant="muted" class="mb-3">

### <span class="inline-flex items-center gap-2"><span class="i-ph-compass-bold text-pink-400" /> Step 1: Pick your sync engine.</span>

**Dexie** for the easiest start. **Jazz** for batteries-included. **Yjs** for max flexibility. **LiveStore** for event-sourced SQLite. Match the engine to your app.

</Card>

<Card v-click variant="muted" class="mb-3">

### <span class="inline-flex items-center gap-2"><span class="i-ph-download-simple-bold text-pink-400" /> Step 2: Let users export their data.</span>

JSON, CSV — whatever. Give them a **download button**. This is the simplest local-first gesture.

</Card>

<Card v-click variant="muted">

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
