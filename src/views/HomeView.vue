<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore';
import CaretRightOutline from '@/components/icons/CaretRightOutline.vue';
import CaretRightDoubleOutline from '@/components/icons/CaretRightDoubleOutline.vue';
import RocketOutline from '@/components/icons/RocketOutline.vue';
import InfoCircledOutline from '@/components/icons/InfoCircledOutline.vue';
import { onMounted, ref } from 'vue';
import CaretUp from '@/components/icons/CaretUp.vue';
import CaretDown from '@/components/icons/CaretDown.vue';

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
];

const isAutomationRunning = ref(true);

// declare outside scope to potentially clear interval if needs to be stopped
let automationInterval: ReturnType<typeof setInterval> | null = null;

const startAutomation = () => {
  isAutomationRunning.value = true;
  automationInterval = setInterval(() => {
    store.generateRandomFloorRequests();
  }, store.elevatorSpeed * 2);
};

const stopAutomation = () => {
  isAutomationRunning.value = false;
  if (automationInterval) {
    clearInterval(automationInterval);
  }
};

onMounted(() => {
  startAutomation();
});

</script>

<template>
  <main class="overflow-hidden flex flex-col h-full">
    <div class="h-auto mb-4">
      <h1 class="text-[var(--color-heading)]">Controls:</h1>
      <i class="text-xs flex items-center">
        <InfoCircledOutline class="text-xs w-[18px] mr-1" /> Change the speed of the elevator operation (10s, 5s, 2s - default)
      </i>
      <i class="text-xs flex items-center">
        <InfoCircledOutline class="text-xs w-[18px] mr-1" /> You can start and stop the autogeneration of the elevator requests by clicking the button below
      </i>
      <i class="text-xs flex items-center">
        <InfoCircledOutline class="text-xs w-[18px] mr-1" /> You can manually request an elevator by clicking the up(<CaretUp />) or down(<CaretDown />) buttons on the floors
      </i>
      <div class="flex gap-x-2 mt-1">
        <button
          v-for="speed in speedControl"
          data-tooltip-target="tooltip-default"
          type="button"
          :key="speed.label"
          class="flex items-center hover:bg-gray-800 p-2 rounded-xl transition-all hover:text-[var(--color-heading)]"
          :class="store.elevatorSpeed === speed.speed ? 'bg-[var(--color-heading)] text-[var(--color-background)]' : ''"
          @click="store.setOperationSpeed(speed.speed)"
        >
          <component :is="speed.svg" />
        </button>
        <button
          class="px-4 flex items-center hover:bg-gray-800 p-2 rounded-xl transition-all hover:text-[var(--color-heading)]"
          @click="isAutomationRunning ? stopAutomation() : startAutomation()"
        >
          {{ isAutomationRunning ? "Stop Autogeneration" : "Start Autogeneration" }}
        </button>
      </div>
    </div>
    <div class="flex-1 max-h-full overflow-hidden">
      <h1 class="text-[var(--color-heading)] capitalize">Active Requests({{ isAutomationRunning ? "autogeneration running" : "autogeneration stopped" }}):</h1>
      <div class="flex flex-col h-max-full overflow-auto">
        <div v-for="request in store.floorRequests" :key="request.id">
          <p class="text-sm">
            Request from floor {{ request.pickupFloor }} to floor {{ request.destinationFloors.join(", ") }}: <span class="capitalize">{{ request.requestStatus }} {{ request.assignedCar ? `- Car ${request.assignedCar}` : "" }}</span>
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
