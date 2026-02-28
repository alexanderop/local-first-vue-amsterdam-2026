---
theme: '@alexop/slidev-theme-brand'
addons:
  - '@alexop/slidev-addon-utils'
title: 'Building Websites with Local-First and Vue'
transition: slide-left
mdc: true
drawings:
  persist: false
info: |
  ## Building Websites with Local-First and Vue

  By Alexander Opalic — Vue Amsterdam 2026
layout: cover
---

# Building Websites with Local-First and Vue

<div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 600 } }">

From jQuery to reactive frameworks to sync engines — and why the data layer is the next frontier.

</div>

<div class="abs-bl mx-14 my-12 flex flex-col gap-2 text-left">
  <div class="text-sm op-50">Vue Amsterdam 2026</div>
  <div class="text-sm op-50">Alexander Opalic</div>
</div>

<!--
Welcome everyone! Today we're going on a journey — from the days of manual DOM manipulation, through the reactive revolution, all the way to a fundamentally different way of thinking about data in web applications.

By the end of this talk, you'll understand what local-first means, why it matters, and how to start building this way with Vue today.
-->

---

# About me

<About />

<!--
Quick intro about myself.
-->

---
layout: statement
transition: fade-out
---

# Raise your hand if you've heard of local-first

<!--
Quick pulse check — who here has heard of local-first? Great, a good number of you. For those who haven't, don't worry — by the end of this talk you'll know exactly what it means and why it matters.
-->

---
layout: statement
transition: fade-out
---

# Keep it up if you've built an offline-capable app

<!--
Now keep your hand up if you've actually built an app that works offline. Usually way fewer hands — that's exactly why we're here today.
-->

---

# Talk Outline

<div class="grid gap-3 mt-6">
  <Card v-click variant="muted">
    <div class="flex items-center gap-3">
      <span class="text-white/30 font-mono text-sm w-6">0</span>
      <span class="font-bold">The Status Quo</span>
      <span class="text-sm op-50 ml-auto">Vue abstracts the DOM, not the data</span>
    </div>
  </Card>
  <Card v-click variant="muted">
    <div class="flex items-center gap-3">
      <span class="text-white/30 font-mono text-sm w-6">1</span>
      <span class="font-bold">Offline-First</span>
      <span class="text-sm op-50 ml-auto">The app that never stops working</span>
    </div>
  </Card>
  <Card v-click variant="muted">
    <div class="flex items-center gap-3">
      <span class="text-white/30 font-mono text-sm w-6">2</span>
      <span class="font-bold">Sync Engines</span>
      <span class="text-sm op-50 ml-auto">The new data layer</span>
    </div>
  </Card>
  <Card v-click variant="muted">
    <div class="flex items-center gap-3">
      <span class="text-white/30 font-mono text-sm w-6">3</span>
      <span class="font-bold">Local-First</span>
      <span class="text-sm op-50 ml-auto">It's about values, not just technology</span>
    </div>
  </Card>
</div>

<!--
Here's the roadmap. We'll start with where we are today — the status quo. Then we'll add offline support, layer on sync engines, and finally zoom out to understand what local-first really means. Each part builds on the last. Let's go.
-->

---
layout: section
transition: fade
---

# Part 0

## The Status Quo — Vue Abstracts the DOM, Not the Data

<!--
Before we talk about where we're going, let's be honest about where we are. Vue gave us reactive rendering — but the data layer? That's still on us.
-->

---

# The Problem That Remains

Vue solved client-side sync, but we still <span v-mark="{ type: 'highlight', color: '#ff6bed' }" class="font-bold">duplicate logic</span> across frontend and backend.

State management became its own discipline: Vuex, Pinia, TanStack Query, SWR...

```
┌─────────────────────┐         ┌─────────────────────┐
│      FRONTEND       │         │      BACKEND        │
│                     │         │                     │
│  ref([])            │  fetch  │  app.get('/todos')  │
│  loading = true     │◀───────▶│  validate(...)      │
│  try { ... }        │  POST   │  db.insert(...)     │
│  catch { ... }      │◀───────▶│  authorize(...)     │
│  finally { ... }    │         │                     │
│  invalidateCache()  │         │  SAME LOGIC         │
│                     │         │  DUPLICATED         │
└─────────────────────┘         └─────────────────────┘
```

<!--
This is the pain we all know. We solved rendering with Vue, but we're still stuck manually syncing data between client and server. Loading states, error handling, cache invalidation — we write this over and over. Sound familiar?
-->

---
layout: quote
transition: fade
---

# "We're in the <span v-mark="{ type: 'circle', color: '#ff6bed' }">jQuery era of data</span>."

Kyle Mathews

<!--
Kyle Mathews nailed it. Just like we used to manually sync the DOM, we now manually sync data between frontend and backend. History is repeating itself. Let me show you what that looks like in code.
-->

---
layout: two-cols
---

## Traditional Vue

```ts
const todos = ref([])
const loading = ref(true)
const error = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await fetch(...)
    todos.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}
```

<div class="text-sm mt-2">

15 lines, loading states, error handling, cache invalidation, <span class="text-pink-400 font-bold">works online only</span>

</div>

::right::

<div v-click>

## With a Sync Engine

```ts
const todos = useQuery(...)

function addTodo(title) {
  mutate({ title })
}

// No loading. No error.
// No cache invalidation.
// Data is already local.
```

<div class="text-sm mt-2">

8 lines, no loading states, no error handling, no cache invalidation, <span class="text-green-400 font-bold">works offline + syncs</span>

</div>

</div>

<!--
Look at this difference. On the left, the traditional approach — tons of boilerplate just to fetch and display data. On the right, a sync engine handles all of that for you. The data is local, so reads are instant. Writes queue and sync when possible. But how did we get here?
-->

---

# A Brief History: From DOM Sync to Data Sync

Vue solved **DOM sync** — you declare state with `ref()`, the framework keeps the UI in sync.

```
Source → Reconciler → Target

ref(0)  →  Virtual DOM (diff)  →  Real DOM
```

But who solves <span v-mark="{ type: 'circle', color: '#ff6bed' }" class="font-bold">data sync</span>?

```
jQuery era:    YOU were the sync engine for the DOM
Vue era:       Vue became the sync engine for the DOM
Now:           Who's the sync engine for DATA?
```

The **source → reconciler → target** pattern repeats at every layer. Vue solved it for rendering. Sync engines solve it for data. This is the pattern we'll see again and again.

<!--
Here's the key insight. In the jQuery era, you were the sync engine — manually updating the DOM with getElementById and appendChild. Vue solved that with reactivity. But now we have the exact same problem one layer up: data sync between client and server. The source-reconciler-target pattern repeats. Vue solved rendering. Now we need something to solve data. Keep this pattern in mind — it comes back later.
-->

---

# The Status Quo Scorecard

<div v-click="1" class="grid grid-cols-7 gap-2 mt-6">
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Fast?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Multi-device?</div>
  </Card>
  <Card variant="muted" dashed dimmed size="sm">
    <div class="flex items-center justify-center gap-1 text-sm"><div class="i-ph-question text-base" /> Works offline?</div>
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

<div v-click="2" class="mt-8 text-center text-gray-500">

Vue solved **rendering**. But the data layer? Still the jQuery era. **0 out of 7.**

</div>

<!--
This is where most Vue apps are today. Zero out of seven. Vue abstracted the DOM beautifully — but we're still manually wiring up data fetching, caching, syncing, error handling. The rendering era is solved. The data era hasn't started yet. Let's change that.
-->

---
layout: section
transition: fade
---

# Part 1

## Offline-First — The App That Never Stops Working

<!--
So what if we flip the model? What if data lives on the client first, and syncs to the server when it can?
-->

---

# What Is Offline-First?

The app works without a network connection — reads and writes happen **locally**.

The server is still the authority, but the client doesn't wait for it.

```
        ONLINE                          OFFLINE
┌─────────────────────┐       ┌─────────────────────┐
│  ┌───────┐  read    │       │  ┌───────┐  read    │
│  │Local  │◀─────    │       │  │Local  │◀─────    │
│  │Store  │          │       │  │Store  │          │
│  │(IDB/  │─────▶    │       │  │(IDB/  │─────▶    │
│  │SQLite)│  write   │       │  │SQLite)│  write   │
│  └───┬───┘          │       │  └───┬───┘          │
│      │ sync ↕       │       │      │ queued       │
│  ┌───▼───┐          │       │      │ ✗ no network │
│  │Server │          │       │  ┌───▼───┐          │
│  │  DB   │          │       │  │Pending│          │
│  └───────┘          │       │  │Writes │          │
└─────────────────────┘       └─────────────────────┘
                                Still works!
```

<!--
Offline-first means the app works even when the network drops. Reads come from a local store — IndexedDB or SQLite. Writes are queued locally and sync when connectivity returns.
-->

---

# PWAs: The Shell That Makes Offline Possible

Before we can store data offline, we need the **app itself** to load offline.

Progressive Web Apps give us this via **Service Workers**.

```
WITHOUT PWA                        WITH PWA
───────────                        ────────

User opens app offline:            User opens app offline:

┌─────────────────────┐           ┌─────────────────────┐
│                     │           │  ┌───────────────┐  │
│    ┌───────────┐    │           │  │ Service Worker│  │
│    │  Chrome   │    │           │  │ intercepts    │  │
│    │  Dino     │    │           │  │ request       │  │
│    │           │    │           │  └───────┬───────┘  │
│    │  No       │    │           │          ▼          │
│    │  Internet │    │           │  ┌───────────────┐  │
│    └───────────┘    │           │  │ Cached HTML,  │  │
│                     │           │  │ JS, CSS, WASM │  │
│ Data in IndexedDB?  │           │  │ → App loads!  │  │
│ Doesn't matter —    │           │  └───────────────┘  │
│ app can't even load.│           │                     │
└─────────────────────┘           └─────────────────────┘
```

<!--
This is a crucial point that's easy to miss. You can put all your data in IndexedDB, but if the app shell can't load offline, none of it matters. Service Workers cache your HTML, JS, CSS, and even WASM binaries so the app loads from cache.
-->

---

# The Offline-First Stack

In Vue/Nuxt: `vite-plugin-pwa` or `@vite-pwa/nuxt` handles the Service Worker.

The PWA is the **delivery mechanism**, IndexedDB/SQLite is the **data layer**.

```
┌─────────────────────────────────────────────────┐
│                   YOUR APP                      │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         Vue / Nuxt Components           │    │
│  └────────────────┬────────────────────────┘    │
│                   │                             │
│  ┌────────────────▼────────────────────────┐    │
│  │         Data Layer                      │    │
│  │   IndexedDB / SQLite (WASM)             │    │
│  │   Dexie, wa-sqlite, ...                 │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
├─────────────────────────────────────────────────┤
│  SERVICE WORKER (PWA)                           │
│  Caches app shell for offline loading           │
│  vite-plugin-pwa / @vite-pwa/nuxt               │
│  Precaches HTML, JS, CSS, WASM                  │
└─────────────────────────────────────────────────┘
```

<!--
Here's the full stack. Vue components at the top, a data layer with IndexedDB or SQLite in the middle, and a Service Worker at the bottom ensuring the whole thing loads offline. Three layers working together.
-->

---
layout: two-cols
---

## IndexedDB

- Native browser API since 2015
- Object store (not relational)
- Async only
- Widely considered slow
- Works everywhere

**Libraries:** Dexie — nice API, live queries, transactions

::right::

## SQLite (WASM)

- Compiled to WASM via wa-sqlite or official SDK
- Full SQL engine — ACID, triggers, FTS, JSON, CTE
- OPFS + sync handles (2023)
- ~500KB bundle

**Libraries:** wa-sqlite, SQLite WASM (official), PGlite

<!--
Two main options for client-side storage. IndexedDB is native and everywhere, but its API is rough — Dexie wraps it beautifully. SQLite via WASM is the new kid on the block, bringing full SQL power to the browser. Both work, different tradeoffs.
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
We can store data locally no problem. But the moment you want that data on multiple devices, or want two users editing the same thing... you've entered distributed systems territory. And that needs a sync engine.
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

<!--
So that's Part 1. Offline-first naturally gives us two things: speed and offline capability. But there's a lot more we're missing — five question marks still open. We need something more.
-->

---
layout: section
transition: fade
---

# Part 2

## Sync Engines — The New Data Layer

<!--
This is where things get really interesting. Sync engines are the missing piece between offline-first and true multi-device collaboration.
-->

---

# What Is a Sync Engine?

Same pattern as Vue's reactivity, but **bidirectional** and **across the network**.

```
Layer 2: DATA SYNC (bidirectional — the hard part)
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐     ┌─────────────┐     ┌──────────┐  │
│  │  Local   │◀───▶│ Sync Engine │◀───▶│  Server  │  │
│  │  Store   │     │  (protocol) │     │  Database│  │
│  └────┬─────┘     └─────────────┘     └──────────┘  │
│       │                                              │
└───────┼──────────────────────────────────────────────┘
        │
Layer 1: UI SYNC (one-directional — Vue already solved this)
┌───────┼──────────────────────────────────────────────┐
│       ▼                                              │
│  ┌──────────┐     ┌─────────────┐     ┌──────────┐  │
│  │  ref()   │────▶│ Virtual DOM │────▶│ Real DOM │  │
│  └──────────┘     └─────────────┘     └──────────┘  │
└──────────────────────────────────────────────────────┘
```

<!--
Remember the source-reconciler-target pattern from earlier? A sync engine is the same thing, but for data across the network. Layer 1 — Vue handles UI sync. Layer 2 — a sync engine handles data sync. Two layers of the same pattern.
-->

---

# The Object Sync Engine Pattern

Three teams — **Linear, Figma, and Asana** — all converged on this independently.

```
┌──────────────┐                    ┌──────────────┐
│ LOCAL STORE  │                    │ SERVER STORE │
│              │     Sync           │              │
│  Instant     │     Protocol       │  Authority   │
│  reads       │◀──────────────────▶│  Durability  │
│  Instant     │  (minimal deltas)  │  Server-side │
│  writes      │                    │  compute     │
│  No          │                    │              │
│  spinners    │                    │              │
└──────────────┘                    └──────────────┘
```

Three teams built this independently. **Same architecture.** That's a strong signal.

<!--
This isn't theoretical. Three of the most successful product companies — Linear, Figma, and Asana — all independently arrived at the same architecture. Local store for instant reads and writes, server store for durability, and a sync protocol to keep them in sync.
-->

---
layout: section
transition: fade
---

# Let's Build It

## Dexie.js + Vue

<!--
Enough theory. Let's write some code! We'll use Dexie — it's the most accessible entry point for Vue developers. You can start local and add sync later.
-->

---

# Why Dexie for Vue Developers?

<v-clicks>

1. Wraps IndexedDB with a **clean API**
2. `liveQuery()` is reactive like `computed()`
3. Works **offline out of the box**
4. Add DexieCloud = instant **multi-device sync**
5. Built-in **auth + conflict resolution**

</v-clicks>

<Callout v-click type="info">

**Progressive upgrade path:** Dexie (local only) → `npm install dexie-cloud-addon` → DexieCloud (sync + auth + collaboration). Same API. Same queries. Now it syncs.

</Callout>

<!--
Dexie is great for Vue developers because it follows the same reactive patterns we're already used to. liveQuery works like computed — when the data changes, your UI updates. And the upgrade path from local-only to cloud sync is just an npm install and one config line.
-->

---

# Step 1: Define Your Database

```ts {all|1-2|4-9|11-20|22-27|all}
import Dexie, { type Table } from 'dexie'
import dexieCloud from 'dexie-cloud-addon'

export interface Todo {
  id?: string
  title: string
  completed: boolean
  createdAt: Date
}

export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('TodoDB', { addons: [dexieCloud] })
    this.version(1).stores({
      todos: '@id, title, completed, createdAt'
      //      ^^^ Dexie Cloud generates IDs
    })
  }
}

export const db = new TodoDB()

db.cloud.configure({
  databaseUrl: import.meta.env.VITE_DEXIE_CLOUD_URL,
  requireAuth: true,
})
```

<!--
Here's the database definition. Standard Dexie setup with the cloud addon. The @ prefix on id means Dexie Cloud generates the IDs. The cloud.configure call at the bottom is all you need to enable sync. One line to go from local to cloud.
-->

---

# Step 2: The Composable

```ts {all|1-4|6-7|9-13|15-17|19-27|29-35|all}
import { db, type Todo } from '@/db/todo'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'
import { from } from 'rxjs'

import { computed, ref } from 'vue'

export function useTodos() {
  const newTodoTitle = ref('')

  // Reactive query — like computed() but for IndexedDB
  const todos = useObservable<Todo[]>(
    from(liveQuery(() => db.todos.orderBy('createdAt').toArray()))
  )

  const pendingTodos = computed(
    () => todos.value?.filter(t => !t.completed) ?? []
  )

  const addTodo = async () => {
    if (!newTodoTitle.value.trim()) return
    await db.todos.add({
      title: newTodoTitle.value,
      completed: false,
      createdAt: new Date(),
    })
    newTodoTitle.value = ''
  }

  const toggleTodo = async (todo: Todo) => {
    await db.todos.update(todo.id!, {
      completed: !todo.completed,
    })
  }

  return { todos, newTodoTitle, pendingTodos, addTodo, toggleTodo }
}
```

<Callout type="info">

**Required packages:** dexie, dexie-cloud-addon, rxjs, @vueuse/rxjs

</Callout>

<!--
This is the full composable. liveQuery from Dexie gives us a reactive subscription to IndexedDB data — just like computed, it re-evaluates when the underlying data changes. No loading state. No error handling boilerplate. No cache invalidation. Data is local, so reads are instant. And it already syncs across devices.
-->

---

# Step 3: How Dexie Handles Conflicts

Two users edit the same todo offline, then reconnect:

```
┌──────────────────┐           ┌──────────────────┐
│    User A        │           │    User B        │
│                  │           │                  │
│  Changes TITLE   │           │  Toggles DONE    │
│  "Buy milk"      │           │  completed: true │
│  → "Buy oat milk"│           │                  │
└────────┬─────────┘           └────────┬─────────┘
         │                              │
         │  reconnect + sync            │
         ▼                              ▼
┌────────────────────────────────────────────────┐
│                                                │
│  Different fields? → AUTO-MERGE                │
│  title: "Buy oat milk" + completed: true       │
│                                                │
│  Same field? → LAST-WRITE-WINS                 │
│                                                │
│  Delete vs update? → DELETE WINS               │
│  Prevents "zombie" records                     │
│                                                │
└────────────────────────────────────────────────┘
```

You don't write this logic. **Dexie handles it.**

<!--
Conflict resolution is automatic. If users edit different fields, Dexie auto-merges them. Same field? Last write wins. Delete versus update? Delete wins to prevent zombie records. You get all of this for free.
-->

---
layout: statement
transition: fade-out
---

# But Wait — Is Dexie Cloud Truly Local-First?

<div v-click class="mt-8 text-xl op-80">

After everything we've seen — would you say yes or no?

</div>

<!--
Here's where we need to be honest. We've built something great, but is it actually local-first? Let's find out.

[click] Take a moment. Think about it. Raise your hand if you'd say yes — Dexie Cloud is truly local-first. And raise your hand if you'd say no. Interesting split. Let me show you the answer.
-->

---

# The Incredible Journey Test

Martin Kleppmann defines **truly local-first** as meeting three criteria:

1. **Multiplayer / multi-device sync** — works across devices and users
2. **Works offline** — full read + write without a network
3. **Survives the developer shutting down** — your data and workflow keep going

<div class="mt-4 text-sm">
<table class="w-full">
  <thead>
    <tr class="border-b border-white/20">
      <th class="text-left py-1.5 pr-4">Criterion</th>
      <th class="text-left py-1.5 px-2">Dexie Cloud</th>
      <th class="text-left py-1.5 px-2">Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Multiplayer / multi-device sync</td>
      <td class="py-1.5 px-2">Yes — while cloud is up</td>
      <td class="py-1.5 px-2">Tied to their servers</td>
    </tr>
    <tr v-click="2" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Works offline</td>
      <td class="py-1.5 px-2">Yes — reads & writes from IndexedDB</td>
      <td class="py-1.5 px-2 text-emerald-400">Full pass</td>
    </tr>
    <tr v-click="3" class="border-b border-white/5">
      <td class="py-1.5 pr-4">Survives developer shutdown</td>
      <td class="py-1.5 px-2">No — sync, auth, new device setup all break</td>
      <td class="py-1.5 px-2 font-bold text-red-400">Fail</td>
    </tr>
  </tbody>
</table>
</div>

<Callout v-click="4" type="warn">

**2 out of 3.** And #3 is the one that matters most — it's what separates offline-first from truly local-first. Some engines like Zero are open-source and self-hostable, but in practice most teams still rely on hosted infrastructure — and if that goes away, sync breaks.

</Callout>

<!--
Kleppmann's definition cuts right through the noise. Truly local-first needs three things: multi-device sync, offline support, and surviving the developer shutting down. Dexie Cloud passes two out of three. And that third one — surviving shutdown — is the defining criterion. If they shut down tomorrow, your local data survives in IndexedDB, but sync, auth, and new device setup are all gone. Some engines like Zero are open-source and self-hostable, which helps — but most teams still depend on hosted infrastructure in practice.
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
So what would actually satisfy that third criterion? Here's a spectrum. Proprietary servers offer zero protection. Open-source self-hostable is better, but who's going to run a server for your grandma? Peer-to-peer removes the central server entirely, but offline peers can't discover each other without signaling. File sync via Dropbox or iCloud is actually the most resilient — but real-time collaboration breaks. No single approach nails it. But notice that P2P option — it needs conflict resolution without a central authority. Peers must independently merge changes and converge.
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
That's Part 2. Adding a sync engine upgrades us from 2 to 4. We get multi-device sync and real-time collaboration. But there are still three things we haven't addressed. What are they? Turns out, they're not technology problems at all.
-->

---
layout: section
transition: fade
---

# Part 3

## Local-First — It's About Values, Not Just Technology

<!--
We've been tracking a scorecard throughout this talk. We hit 2 out of 7 with offline-first, 4 out of 7 with sync engines. Now let's reveal what those 7 actually are — and why the last 3 change everything.
-->

---

# The Reveal: The 7 Ideals

From the Ink & Switch essay on local-first software (2019):

<div v-click="1" class="mt-4">

**Technology:**

<div class="grid gap-1.5 ml-1">
  <div class="flex items-center gap-2"><div class="i-ph-lightning-bold text-pink-400" /> <span><strong>Fast</strong> — No spinners. Data is local.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-devices-bold text-pink-400" /> <span><strong>Multi-device</strong> — Sync across all your devices.</span></div>
  <div class="flex items-center gap-2"><div class="i-ph-wifi-none-bold text-pink-400" /> <span><strong>Works offline</strong> — Network is optional.</span></div>
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
Here they are — the 7 ideals of local-first software. The first four are technology. We've already seen them. But the last three — longevity, privacy, user control — those are VALUES. That's what makes local-first fundamentally different from just another architecture pattern. It's a philosophy about who owns the data.
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
This is the key philosophical difference. Offline-first still treats the server as the authority — the client is just a cache. Local-first flips that completely. You are the owner of your data. The server is just a utility for relay and backup. It can't reject your writes. It just syncs them.
-->

---

# The Honest Truth: Real Local-First Is Still Hard

The app that comes closest to nailing all 7 ideals? **Obsidian.**

<div class="grid gap-1 text-sm mt-2">
  <div class="flex items-center gap-2"><div class="i-ph-lightning-bold text-emerald-400" /> <strong>Fast</strong> — local markdown files</div>
  <div class="flex items-center gap-2"><div class="i-ph-devices-bold text-emerald-400" /> <strong>Multi-device</strong> — Obsidian Sync / git / iCloud</div>
  <div class="flex items-center gap-2"><div class="i-ph-wifi-none-bold text-emerald-400" /> <strong>Offline</strong> — plain files on your disk</div>
  <div class="flex items-center gap-2"><div class="i-ph-users-bold text-yellow-400" /> <strong>Collaboration</strong> — limited (git, shared vaults)</div>
  <div class="flex items-center gap-2"><div class="i-ph-clock-bold text-emerald-400" /> <strong>Longevity</strong> — it's just `.md` files!</div>
  <div class="flex items-center gap-2"><div class="i-ph-lock-bold text-emerald-400" /> <strong>Privacy</strong> — your files, your disk</div>
  <div class="flex items-center gap-2"><div class="i-ph-user-bold text-emerald-400" /> <strong>User control</strong> — open any folder, no lock-in</div>
</div>

<Callout type="warn">

**But:** sync = git or paid Obsidian Sync. Non-technical users can't use git. And building this for the **web?** Much harder.

</Callout>

<!--
Obsidian is the gold standard. It works because it uses the filesystem — plain markdown files. But on the web we don't have that luxury. We need IndexedDB or SQLite plus a sync layer. And every sync engine today ties you to their cloud.
-->

---

# What's Missing: The Generic Sync Engine

From Martin Kleppmann at Local-First Conf 2024 — **the local-first endgame:**

```
TODAY: Every sync engine = proprietary cloud

┌──────────┐    locked to    ┌──────────────┐
│ Your App │◀──────────────▶│ Dexie Cloud  │
│          │   their API     │ (proprietary)│
└──────────┘                 └──────────────┘

They shut down? Sync is gone. Switch provider? Rewrite your app.
```

```
THE LOCAL-FIRST ENDGAME: generic sync, multiple backends

┌──────────┐                 ┌──────────────┐
│ Your App │    open         │  AWS / Cloud │
│          │    protocol     ├──────────────┤
│ ALL biz  │◀──────────────▶│  Self-hosted │
│ logic    │  standardized   ├──────────────┤
│ HERE     │                 │  P2P / NAS   │
└──────────┘                 └──────────────┘
                              ▲ ▲ ▲
                              all active simultaneously
                              — redundancy, not just choice

Like email: pick Gmail, Fastmail, self-host —
the protocol is the same. Your data moves freely.
Run multiple backends at once for true resilience.
```

<!--
Here's the endgame Kleppmann describes. Today every sync engine locks you to one proprietary cloud. The local-first endgame isn't just choosing any single provider — it's running multiple backends simultaneously. AWS for convenience, self-hosted for control, P2P or NAS for resilience. All active at once through a standardized open protocol. Like email — you pick your provider, the protocol is the same, your data moves freely. This is what makes ideals 5, 6, and 7 possible. It doesn't fully exist yet, but this is where the ecosystem is heading.
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
Adam Wiggins makes a great point. Every technology movement follows this pattern. Idealists articulate the vision. Pragmatists make it practical. We're in the pragmatist phase of local-first. The tools aren't perfect yet, but they're good enough to start building.
-->

---

# What You Can Do Today

<Card v-click variant="muted" size="lg" class="mb-4">

### <span class="inline-flex items-center gap-2"><span class="i-ph-database-bold text-pink-400" /> Step 1: Use Dexie.</span>

Offline-first. 4/7 ideals. A **real improvement** for your users.

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
So where do you start? Three concrete steps. Step one: use Dexie. You get offline-first with four out of seven ideals. That's already a massive upgrade for your users. Step two: add a data export button. JSON, CSV, whatever. That's the simplest gesture toward user ownership. Step three: keep watching this space. When the generic sync protocol arrives, upgrading will be a config change, not a rewrite.
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
    <tr v-click="1" class="border-b border-white/5"><td class="py-1.5 pr-4 flex items-center gap-1.5"><div class="i-ph-wifi-none-bold text-pink-400 text-xs" /> Works offline</td><td class="text-center"><div class="i-ph-minus text-white/20 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-emerald-400 mx-auto" /></td><td class="text-center"><div class="i-ph-check-circle-fill text-pink-400 mx-auto" /></td></tr>
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
And there it is — the full picture. Offline-first gets you 2 out of 7. Add a sync engine and you're at 4. But the last three — longevity, privacy, user control — require a fundamentally different approach to data ownership. That's the gap between offline-first and local-first. Seven out of seven is the goal.
-->

---
layout: section
transition: fade
---

# Closing

## The Rendering Era Is Over

---

# The Arc of Frontend Development

<div v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 800 } }">

```
  jQuery          Reactive          Sync             Local-First
  (2006)          (2014)            (2020)           (now)
    │               │                 │                 │
    ▼               ▼                 ▼                 ▼
  You sync        Vue syncs         Engine syncs      User owns
  the DOM         the DOM           the data          the data
    │               │                 │                 │
────●───────────────●─────────────────●─────────────────●────▶
    │               │                 │                 │
  Manual          Declarative       No spinners       Privacy
  getElementById  ref() + v-bind    No cache mgmt     Longevity
  innerHTML       computed()        Multi-device      Full control
```

</div>

**We solved rendering. The data layer is where it's happening now.**

<!--
Here's the arc. jQuery era — you were the sync engine. Reactive era — Vue handles the DOM. Sync era — engines handle the data. Local-first era — the user owns everything. We solved rendering. The data layer is the next frontier. And Vue is perfectly positioned to be part of it.
-->

---

# References

<div class="text-sm">

- **Local-First Software** — Ink & Switch (2019) — the original essay
- **Past, Present, and Future of Local-First** — Kleppmann, Local-First Conf 2024
- **Sync Engines for Vue Developers** — alexop.dev — comparing 7 engines through Vue's lens
- **A Gentle Introduction to CRDTs** — Matt Wonlaw
- **Local-First Software: Pragmatism vs. Idealism** — Adam Wiggins
- **The Object Sync Engine** — the pattern Linear/Figma/Asana converged on
- **SQLite Persistence on the Web** — SQLite WASM is production-ready

</div>

<!--
Here are all the references if you want to dive deeper. The Ink & Switch essay is the foundational read. My article on sync engines for Vue developers compares seven engines through Vue's lens. All links will be shared after the talk.
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
Thank you! If you want to get started with any of this, check out my article comparing sync engines for Vue developers. Happy to chat about local-first after the talk.
-->
