<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore';
import CaretRightOutline from '@/components/icons/CaretRightOutline.vue';
import CaretRightDoubleOutline from '@/components/icons/CaretRightDoubleOutline.vue';
import RocketOutline from '@/components/icons/RocketOutline.vue';
import InfoCircledOutline from '@/components/icons/InfoCircledOutline.vue';

const store = useElevatorStore();

const speedControl = [
  {
    speed: 10000,
    label: "Normal",
    svg: CaretRightOutline,
  },
  {
    speed: 5000,
    label: "Busy",
    svg: CaretRightDoubleOutline,
  },
  {
    speed: 2000,
    label: "Chaos",
    svg: RocketOutline,
  },
]
</script>

<template>
  <main class="overflow-hidden flex flex-col h-full">
    <div class="h-auto mb-8">
      <h1 class="text-[var(--color-heading)]">Speed Control</h1>
      <i class="text-xs flex items-center">
        <InfoCircledOutline class="text-xs w-[18px] mr-1" /> Change the speed of the elevator operation (10s, 5s, 2s)
      </i>
      <div class="flex">
        <button
          v-for="speed in speedControl"
          data-tooltip-target="tooltip-default"
          type="button"
          :key="speed.label"
          class="flex items-center hover:bg-gray-800 p-2 rounded-xl transition-all hover:text-[var(--color-heading)]"
          :class="store.elevatorSpeed === speed.speed ? 'text-[var(--color-heading)]' : ''"
          @click="store.setOperationSpeed(speed.speed)"
        >
          <component :is="speed.svg" />
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <h1 class="text-[var(--color-heading)]">Active Requests:</h1>
      <div class="flex flex-col h-max-full overflow-auto">
        <div v-for="request in store.floorRequests">
          <p class="text-sm">
            Request from floor {{ request.pickupFloor }} to floor {{ request.destinationFloors.join(", ") }}: {{ request.requestStatus }}
          </p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 w-max-[500px] h-auto">
      <div
        v-for="elevator in store.elevators"
        :key="elevator.id"
        class="my-4"
      >
        <h1 class="text-[var(--color-heading)]">Car {{ elevator.id }}</h1>
        <p class="text-sm capitalize">Current floor: {{ elevator.currentFloor }}</p>
        <p class="text-sm capitalize">Direction: {{ elevator.direction }}</p>
        <p class="text-sm capitalize">Status: {{ elevator.status }}</p>
        <p class="text-sm capitalize">Stops at: {{ Array.from(elevator.stops).length ? "F" + Array.from(elevator.stops).join(", ") : "none" }}</p>
      </div>
    </div>
  </main>
</template>
