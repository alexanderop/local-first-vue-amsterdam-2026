<script setup lang="ts">
// Minimal rough-drawn chat wireframe using existing rough primitives
</script>

<template>
  <RoughSvg :width="220" :height="300" :padding="16" :roughness="1.2" :seed="77">
    <!-- App frame -->
    <RoughRect :x="0" :y="0" :width="220" :height="300" variant="default" :stroke-width="1.5" />

    <!-- Title bar separator -->
    <RoughLine :x1="0" :y1="36" :x2="220" :y2="36" stroke="rgba(255,255,255,0.15)" :stroke-width="1" />
    <RoughText :x="110" :y="20" variant="label">Chat</RoughText>

    <!-- Message: left-aligned (other person) -->
    <RoughRect :x="12" :y="50" :width="120" :height="28" variant="muted" :stroke-width="1" fill-style="solid" />

    <!-- Message: right-aligned (me) -->
    <RoughRect :x="88" :y="90" :width="120" :height="28" variant="accent" :stroke-width="1" fill-style="solid" />

    <!-- Message: left-aligned -->
    <RoughRect :x="12" :y="130" :width="100" :height="28" variant="muted" :stroke-width="1" fill-style="solid" />

    <!-- Message: right-aligned -->
    <RoughRect :x="98" :y="170" :width="110" :height="28" variant="accent" :stroke-width="1" fill-style="solid" />

    <!-- Message: left-aligned -->
    <RoughRect :x="12" :y="210" :width="130" :height="28" variant="muted" :stroke-width="1" fill-style="solid" />

    <!-- Input field -->
    <RoughRect :x="10" :y="260" :width="200" :height="28" variant="muted" :stroke-width="1" fill-style="solid" stroke-dasharray="6 4" />
    <RoughText :x="24" :y="274" variant="subtitle" text-anchor="start">Type here...</RoughText>
  </RoughSvg>
</template>
