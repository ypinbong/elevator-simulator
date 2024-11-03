<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ElevatorSim from './components/ElevatorSim.vue'
</script>

<template>
  <header class="h-[60px] flex items-center px-8">
    <h1 class="text-2xl text-[--color-heading]">Proposed Elevator Control System</h1>
  </header>
  <div class="flex-1 grid lg:grid-cols-2 grid-cols-1 border-r-1 border-white-200 overflow-hidden">
    <ElevatorSim />
    <div class="grid px-6 place-items-center h-full w-full overflow-hidden">
      <div class="container h-[80vh] overflow-auto">
        <nav class="flex text-xl sticky top-0 bg-[var(--color-background)] gap-4 pb-4">
          <RouterLink activeClass="active" to="/">Logs</RouterLink>
          <div class="border-r-2 border-[var(--color-text)] min-h-full flex" />
          <RouterLink activeClass="active" to="/about">About</RouterLink>
        </nav>
        <div class="flex-1">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>
