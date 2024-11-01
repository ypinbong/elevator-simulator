<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ElevatorSim from './components/ElevatorSim.vue'
</script>

<template>
  <header class="h-[60px] flex items-center px-8">
    <h1 class="text-2xl text-[--color-heading]">Proposed Elevator Control System</h1>
  </header>
  <div class="flex-1 grid grid-cols-2 border-r-1 border-white-200 max-h-full overflow-hidden">
    <ElevatorSim />
    <div class="p-4">
      <nav class="flex text-xl gap-4">
        <RouterLink activeClass="active" to="/">Settings</RouterLink>
        <div class="border-r-2 border-[var(--color-text)] min-h-full flex" />
        <RouterLink activeClass="active" to="/about">About</RouterLink>
      </nav>
      <div class="container mt-8">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  grid-template-rows: 60px 1fr;
}
</style>
