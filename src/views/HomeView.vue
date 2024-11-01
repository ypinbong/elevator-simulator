<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore';
import { ref } from 'vue';

const store = useElevatorStore();
const origin = ref(0);
const destination = ref(0);

function moveElevator() {
  store.$patch((state) => {
    state.elevators[0].currentFloor = origin.value;
    state.elevators[0].targetFloor = destination.value;
  });
}
</script>

<template>
  <main class="overflow-auto">
    <!-- <div class="flex flex-col">
      <label>Floor Origin</label>
      <div class="flex gap-1">
        <div class="flex items-center" v-for="floor in store.floors">
          <input
            type="radio"
            name="origin"
            :value="origin"
            @change="origin = floor"
          >
          {{ floor }}
        </div>
      </div>
      <label class="mt-6">Floor Destination</label>
      <div class="flex gap-1">
        <div class="flex items-center" v-for="floor in store.floors">
          <input
            type="radio"
            name="destination"
            :value="destination === floor"
            @change="destination = floor"
          >
          {{ floor }}
        </div>
      </div>
      <button class="w-max border rounded-sm px-6 mt-5" @click="moveElevator">Submit</button>
    </div>
    <div
      v-for="elevator in store.elevators"
      :key="elevator.id"
      class="my-4"
    >
      <h1>Car{{ elevator.id }}</h1>
      <p>Current floor: {{ elevator.currentFloor }}</p>
      <p>Direction: {{ elevator.direction }}</p>
      <p>Is moving: {{ elevator.isMoving }}</p>
      <p>Is door open: {{ elevator.isDoorOpen }}</p>
    </div> -->
  </main>
</template>
