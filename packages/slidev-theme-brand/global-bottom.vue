<script setup lang="ts">
import LayoutFooter from './components/LayoutFooter.vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()
</script>

<template>
  <LayoutFooter v-if="!$frontmatter.hideFooter" />
</template>
