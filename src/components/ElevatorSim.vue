<template>
  <div class="grid px-6 place-items-center h-full w-full">
    <div class="flex justify-center mx-auto bg-[var(--color-heading)] w-full h-[80vh] p-8 pb-[3px] rounded border-b-[30px] border-gray-200">
      <div class="building-container bg-gray-100 flex-1 gap-6 pr-6 border-1 border-black rounded-t max-w-[450px]">
        <div class="grid border-r-2 divide-y bg-[var(--color-heading)] border-black h-full col-span-2">
          <div
            v-for="floor in store.floors"
            :key="floor"
            class="px-1"
          >
            <span @click="() => store.requestElevator(floor, floor >= 5 ? 'down' : 'up')" class="text-black text-xs">F{{ floor }}</span>
          </div>
        </div>
        <ElevatorShafts
          v-for="elevator in store.elevators"
          :key="elevator.id"
          :floors="store.floors"
          :elevator="elevator"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore';
import ElevatorShafts from '@/components/ElevatorShafts.vue';

const store = useElevatorStore();
</script>

<style scoped lang="less">
.building-container {
  box-sizing: border-box;
  min-height: 300px;
  border: 2px solid black;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  outline: 2px solid black;
  outline-offset: 3px;
  position: relative;
}
</style>