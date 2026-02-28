<template>
  <div class="bg-main slidev-layout h-full">
    <div class="grid grid-cols-2 gap-10 h-full items-start px-14 py-12">
      <!-- Left Column -->
      <div class="flex flex-col">
        <slot />
      </div>

      <!-- Right Column -->
      <div class="flex flex-col">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
