<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div id="app" class="h-screen">
    <RouterView />
  </div>
</template>

<style lang="postcss" scoped>
body {
  /* @apply min-h-screen h-screen flex; */
  margin: 0 !important;
  padding: 0 !important;
  height: 100vh !important;
}
</style>
