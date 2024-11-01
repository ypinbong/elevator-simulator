<template>
  <div class="relative grid border divide-y divide-dashed border-gray-300 bg-[var(--color-heading)] h-full">
    <div
      v-for="floor in props.floors"
      :key="floor"
      :id="`floor-shaft-${floor}`"
    >
      <div
        v-if="floor === 1"
        :ref="`elevator-car-id-${elevator.id}`"
        class="h-full w-full relative bottom-0 flex justify-center"
      >
      <!-- 
            transition-duration: ${Math.abs(elevator.currentFloor - (elevator.targetFloor || 0)) * 2000}ms;
      -->
        <div
          class="border border-black w-full h-full absolute bottom-0 z-10"
          :style="`
            bottom: calc((100% * ${elevator.currentFloor - 1}) + ${elevator.currentFloor - 1}px);
          `"
        >
          {{ elevatorStatus }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Elevator } from '@/types/elevator';
import { ref, onMounted, watch, computed, useTemplateRef } from 'vue';

const props = defineProps<{
  floors: number[];
  elevator: Elevator;
}>();

if (props.elevator.id === 1) {
  console.log("ElevatorShafts.vue ~ line 36: elevator:", props.elevator);
}

const elevatorStatus = computed(() => {
    if (props.elevator.isDoorOpen) return '🚪';
    if (props.elevator.isMoving) return props.elevator.direction === 'up' ? '⬆️' : '⬇️';
    return '•';
  });

const carEl = useTemplateRef<HTMLElement[] | null>("elevator-car-id-1");
const carHeight = ref(0);

</script>

<style scoped>
</style>