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
        <div
          class="grid place-items-center border border-black w-full h-full absolute bottom-0 z-10 transition-all ease-linear bg-[var(--color-heading)]"
          :style="`
            bottom: calc((100% * ${elevator.nextFloor - 1}) + ${elevator.nextFloor - 1}px);
            transition-duration: ${store.elevatorSpeed}ms;
          `"
        >
          {{ elevatorStatusIndicator }}
          <span class="text-[8px] absolute top-[-18px] text-gray-500 capitalize whitespace-nowrap w-max">
            {{ getElevatorStatus }}
          </span>
          <span class="text-xs absolute bottom-[-18px] text-gray-500 whitespace-nowrap w-max">
            {{ pickedUpRequests }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useElevatorStore } from '@/stores/elevatorStore';
import { ELEVATOR_STATUS, REQUEST_STATUS, type Elevator } from '@/types/elevator';

const store = useElevatorStore();

const props = defineProps<{
  floors: number[];
  elevator: Elevator;
}>();

const elevatorStatusIndicator = computed(() => {
  if (props.elevator.status === ELEVATOR_STATUS.LOADING_UNLOADING) return '🚪';
  if (props.elevator.status === ELEVATOR_STATUS.MOVING) return props.elevator.direction === 'up' ? '⬆️' : '⬇️';
  return '•';
});

const getElevatorStatus = computed(() => {
  let status = '';
  switch (props.elevator.status) {
    case ELEVATOR_STATUS.LOADING_UNLOADING:
      status = "door open";
      break;
    case ELEVATOR_STATUS.MOVING:
      if (pickedUpRequests.value) {
        status = "delivery";
      } else {
        status = "pick up";
        
      }
      break;
  
    default:
      status = props.elevator.status;
      break;
  }
  return status;
});

const pickedUpRequests = computed(() => {
  const requests = Array.from(props.elevator.stops).filter(floor => {
    return store.floorRequests.some(request => {
      return request.destinationFloors.includes(floor) && request.requestStatus === REQUEST_STATUS.PICKED_UP;
    });
  });
  return requests.join(', ');
});
</script>

<style scoped>
</style>