<script setup lang="ts">
import RoughRect from './RoughRect.vue'
import RoughLine from './RoughLine.vue'
const { roughness = 1.2, seed = 500 } = defineProps<{
  roughness?: number
  seed?: number
}>()

// Colors
const success = 'rgba(52, 211, 153, 0.8)'
const danger = 'rgba(248, 113, 113, 0.8)'
const muted = 'rgba(255, 255, 255, 0.3)'
const panelStroke = 'rgba(255, 255, 255, 0.15)'
const panelFill = 'rgba(255, 255, 255, 0.03)'

// Layout
const panelW = 330
const panelH = 240
const gap = 40
const svgW = panelW * 2 + gap
const svgH = 340

// Panel positions
const leftX = 0
const rightX = panelW + gap

// Item layout inside panels
const itemPadX = 20
const itemW = panelW - itemPadX * 2
const itemH = 54
const itemGap = 12
const itemStartY = 40

// Good fit items
const goodItems = [
  { title: 'File Editing', desc: 'docs, spreadsheets, graphics' },
  { title: 'Productivity', desc: 'notes, tasks, calendar' },
  { title: 'EU Data Sovereignty', desc: 'on-device, GDPR-aligned' },
]

// Bad fit items
const badItems = [
  { title: 'Money', desc: 'banking, payments' },
  { title: 'Physical Resources', desc: 'e-commerce, inventory' },
  { title: 'Vehicles', desc: 'car sharing, logistics' },
]

function itemY(index: number): number {
  return itemStartY + index * (itemH + itemGap)
}

// Footer
const footerY = panelH + 30
</script>

<template>
  <svg
    :viewBox="`-10 -10 ${svgW + 20} ${svgH + 20}`"
    :width="svgW + 20"
    :height="svgH + 20"
    class="fit-guide"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- ═══════ Left Panel: Good Fit ═══════ -->
    <g>
      <!-- Panel border -->
      <RoughRect
        :x="leftX"
        :y="0"
        :width="panelW"
        :height="panelH"
        :stroke="panelStroke"
        :fill="panelFill"
        :roughness="roughness"
        :seed="seed"
        :stroke-width="1.5"
      />

      <!-- Panel title -->
      <text
        :x="leftX + panelW / 2"
        :y="24"
        text-anchor="middle"
        class="fit-guide__panel-title --success"
      >
        GOOD FIT
      </text>

      <!-- Good fit items -->
      <g v-for="(item, i) in goodItems" :key="'good-' + i">
        <!-- Item background -->
        <RoughRect
          :x="leftX + itemPadX"
          :y="itemY(i)"
          :width="itemW"
          :height="itemH"
          variant="success"
          :roughness="roughness"
          :seed="seed + 10 + i * 10"
          :stroke-width="1.5"
        />

        <!-- Checkmark -->
        <RoughLine
          :x1="leftX + itemPadX + 14"
          :y1="itemY(i) + itemH / 2"
          :x2="leftX + itemPadX + 22"
          :y2="itemY(i) + itemH / 2 + 8"
          :stroke="success"
          :stroke-width="2.5"
          :roughness="roughness * 0.4"
          :seed="seed + 10 + i * 10 + 1"
        />
        <RoughLine
          :x1="leftX + itemPadX + 22"
          :y1="itemY(i) + itemH / 2 + 8"
          :x2="leftX + itemPadX + 36"
          :y2="itemY(i) + itemH / 2 - 8"
          :stroke="success"
          :stroke-width="2.5"
          :roughness="roughness * 0.4"
          :seed="seed + 10 + i * 10 + 2"
        />

        <!-- Item title -->
        <text
          :x="leftX + itemPadX + 50"
          :y="itemY(i) + 22"
          class="fit-guide__item-title"
        >
          {{ item.title }}
        </text>

        <!-- Item description -->
        <text
          :x="leftX + itemPadX + 50"
          :y="itemY(i) + 40"
          class="fit-guide__item-desc"
        >
          {{ item.desc }}
        </text>
      </g>
    </g>

    <!-- ═══════ Right Panel: Bad Fit ═══════ -->
    <g>
      <!-- Panel border -->
      <RoughRect
        :x="rightX"
        :y="0"
        :width="panelW"
        :height="panelH"
        :stroke="panelStroke"
        :fill="panelFill"
        :roughness="roughness"
        :seed="seed + 100"
        :stroke-width="1.5"
      />

      <!-- Panel title -->
      <text
        :x="rightX + panelW / 2"
        :y="24"
        text-anchor="middle"
        class="fit-guide__panel-title --danger"
      >
        BAD FIT
      </text>

      <!-- Bad fit items -->
      <g v-for="(item, i) in badItems" :key="'bad-' + i">
        <!-- Item background -->
        <RoughRect
          :x="rightX + itemPadX"
          :y="itemY(i)"
          :width="itemW"
          :height="itemH"
          variant="danger"
          :roughness="roughness"
          :seed="seed + 110 + i * 10"
          :stroke-width="1.5"
        />

        <!-- X mark -->
        <RoughLine
          :x1="rightX + itemPadX + 14"
          :y1="itemY(i) + itemH / 2 - 8"
          :x2="rightX + itemPadX + 30"
          :y2="itemY(i) + itemH / 2 + 8"
          :stroke="danger"
          :stroke-width="2.5"
          :roughness="roughness * 0.4"
          :seed="seed + 110 + i * 10 + 1"
        />
        <RoughLine
          :x1="rightX + itemPadX + 30"
          :y1="itemY(i) + itemH / 2 - 8"
          :x2="rightX + itemPadX + 14"
          :y2="itemY(i) + itemH / 2 + 8"
          :stroke="danger"
          :stroke-width="2.5"
          :roughness="roughness * 0.4"
          :seed="seed + 110 + i * 10 + 2"
        />

        <!-- Item title -->
        <text
          :x="rightX + itemPadX + 44"
          :y="itemY(i) + 22"
          class="fit-guide__item-title"
        >
          {{ item.title }}
        </text>

        <!-- Item description -->
        <text
          :x="rightX + itemPadX + 44"
          :y="itemY(i) + 40"
          class="fit-guide__item-desc"
        >
          {{ item.desc }}
        </text>
      </g>
    </g>

    <!-- ═══════ Footer ═══════ -->
    <g>
      <!-- Dashed divider -->
      <RoughLine
        :x1="20"
        :y1="footerY"
        :x2="svgW - 20"
        :y2="footerY"
        :stroke="muted"
        :stroke-width="1"
        stroke-dasharray="6 4"
        :roughness="roughness * 0.3"
        :seed="seed + 200"
      />

      <!-- Left description -->
      <text
        :x="leftX + panelW / 2"
        :y="footerY + 28"
        text-anchor="middle"
        class="fit-guide__footer"
      >
        Ideal for apps where users
      </text>
      <text
        :x="leftX + panelW / 2"
        :y="footerY + 46"
        text-anchor="middle"
        class="fit-guide__footer --italic"
      >
        freely manipulate their data
      </text>

      <!-- Right description -->
      <text
        :x="rightX + panelW / 2"
        :y="footerY + 28"
        text-anchor="middle"
        class="fit-guide__footer"
      >
        Better with centralized cloud/server
      </text>
      <text
        :x="rightX + panelW / 2"
        :y="footerY + 46"
        text-anchor="middle"
        class="fit-guide__footer --italic"
      >
        model for real-world resources
      </text>
    </g>
  </svg>
</template>

<style scoped>
.fit-guide {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}

.fit-guide__panel-title {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fit-guide__panel-title.--success {
  fill: rgba(52, 211, 153, 0.9);
}

.fit-guide__panel-title.--danger {
  fill: rgba(248, 113, 113, 0.9);
}

.fit-guide__item-title {
  font-family: 'Geist', sans-serif;
  font-size: 14px;
  font-weight: 600;
  fill: rgba(234, 237, 243, 0.95);
}

.fit-guide__item-desc {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.4);
}

.fit-guide__footer {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  fill: rgba(255, 255, 255, 0.45);
}

.fit-guide__footer.--italic {
  font-style: italic;
  fill: rgba(255, 107, 237, 0.7);
}
</style>
