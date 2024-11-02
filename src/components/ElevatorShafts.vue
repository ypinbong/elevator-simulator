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
            transition-duration: ${Math.abs(elevator.originFloor - (elevator.targetFloor || 0)) * store.elevatorSpeed}ms;
      -->
        <div
          class="grid place-items-center border border-black w-full h-full absolute bottom-0 z-10 transition-all"
          :style="`
            bottom: calc((100% * ${elevator.currentFloor - 1}) + ${elevator.currentFloor - 1}px);
            transition-duration: ${store.elevatorSpeed}ms;
          `"
        >
          {{ elevatorStatus }}
          <span class="text-xs absolute bottom-[-18px] text-gray-500 whitespace-nowrap w-max">
            {{ Array.from(elevator.stops).join(", ") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore';
import { ELEVATOR_STATUS, type Elevator } from '@/types/elevator';
import { computed } from 'vue';

const store = useElevatorStore();

const props = defineProps<{
  floors: number[];
  elevator: Elevator;
}>();

console.log("ElevatorShafts.vue ~ line 43: props.elevator.stops:", props.elevator.stops);

const elevatorStatus = computed(() => {
  if (props.elevator.status === ELEVATOR_STATUS.LOADING_UNLOADING) return '🚪';
  if (props.elevator.status === ELEVATOR_STATUS.MOVING) return props.elevator.direction === 'up' ? '⬆️' : '⬇️';
  return '•';
});

</script>

<style scoped>
</style>