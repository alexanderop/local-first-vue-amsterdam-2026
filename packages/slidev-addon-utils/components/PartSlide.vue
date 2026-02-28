<script setup lang="ts">
const props = defineProps<{
  part?: string
  title: string
  subtitle?: string
  icon?: string
}>()

const hasNumber = props.part !== undefined
</script>

<template>
  <div class="part-slide">
    <!-- Ambient glow -->
    <div class="part-slide__glow" />

    <!-- Grid pattern overlay -->
    <div class="part-slide__grid" />

    <!-- Giant background number -->
    <div
      v-if="hasNumber"
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { duration: 1200, ease: 'easeOut' } }"
      class="part-slide__number"
    >
      {{ part }}
    </div>

    <!-- Icon fallback when no part number -->
    <div
      v-if="!hasNumber && icon"
      v-motion
      :initial="{ opacity: 0, scale: 0.5 }"
      :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
      class="part-slide__icon"
    >
      {{ icon }}
    </div>

    <!-- Content -->
    <div class="part-slide__content">
      <!-- "PART N" label -->
      <div
        v-if="hasNumber"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 300 } }"
        class="part-slide__label"
      >
        Part {{ part }}
      </div>

      <!-- Accent line -->
      <div
        v-motion
        :initial="{ scaleX: 0 }"
        :enter="{ scaleX: 1, transition: { duration: 800, delay: hasNumber ? 500 : 300 } }"
        class="part-slide__line"
      />

      <!-- Title -->
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: hasNumber ? 600 : 400 } }"
        class="part-slide__title"
      >
        {{ title }}
      </h1>

      <!-- Subtitle -->
      <p
        v-if="subtitle"
        v-motion
        :initial="{ opacity: 0, y: 15 }"
        :enter="{ opacity: 0.55, y: 0, transition: { duration: 700, delay: hasNumber ? 800 : 600 } }"
        class="part-slide__subtitle"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- Corner accent -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 1000, delay: 1000 } }"
      class="part-slide__corner"
    />
  </div>
</template>

<style scoped>
.part-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  background:
    radial-gradient(ellipse 80% 60% at 70% 50%, rgba(255, 107, 237, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 50% 80% at 20% 60%, rgba(52, 63, 96, 0.3) 0%, transparent 60%),
    rgb(33, 39, 55);
  overflow: hidden;
  font-family: 'Geist', sans-serif;
}

/* Pink ambient glow — positioned behind the number */
.part-slide__glow {
  position: absolute;
  top: 50%;
  right: 12%;
  width: 340px;
  height: 340px;
  transform: translate(50%, -50%);
  background: radial-gradient(circle, rgba(255, 107, 237, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* Subtle dot grid for texture */
.part-slide__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(234, 237, 243, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

/* Massive background number */
.part-slide__number {
  position: absolute;
  right: -2%;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(280px, 35vw, 420px);
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 107, 237, 0.12);
  font-family: 'Geist', sans-serif;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
}

/* Emoji icon for non-numbered slides */
.part-slide__icon {
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 160px;
  opacity: 0.12;
  pointer-events: none;
  user-select: none;
  filter: grayscale(0.5);
}

/* Left-aligned content block */
.part-slide__content {
  position: relative;
  z-index: 1;
  padding-left: 80px;
  max-width: 70%;
}

/* "Part 0" label in mono */
.part-slide__label {
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgb(255, 107, 237);
  margin-bottom: 16px;
}

/* Horizontal accent line */
.part-slide__line {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, rgb(255, 107, 237), rgba(255, 107, 237, 0.2));
  margin-bottom: 20px;
  transform-origin: left center;
  border-radius: 1px;
  box-shadow: 0 0 12px rgba(255, 107, 237, 0.3);
}

/* Main title */
.part-slide__title {
  font-size: clamp(36px, 5vw, 56px) !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  color: rgb(234, 237, 243) !important;
  margin: 0 !important;
  letter-spacing: -0.025em;
}

/* Subtitle */
.part-slide__subtitle {
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  color: rgb(234, 237, 243);
  margin-top: 12px;
  letter-spacing: -0.01em;
}

/* Bottom-right corner accent — two thin lines forming an L */
.part-slide__corner {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 32px;
  height: 32px;
  border-right: 1.5px solid rgba(255, 107, 237, 0.25);
  border-bottom: 1.5px solid rgba(255, 107, 237, 0.25);
  pointer-events: none;
}
</style>
