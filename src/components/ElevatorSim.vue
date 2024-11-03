<template>
  <div class="grid px-6 place-items-center h-full w-full">
    <div class="flex justify-center mx-auto bg-[var(--color-heading)] w-full h-[80vh] p-8 pb-[3px] rounded border-b-[30px] border-gray-200">
      <div class="building-container bg-gray-100 flex-1 gap-6 pr-6 border-1 border-black rounded-t max-w-[450px]">
        <div class="floor-area grid border-r-2 divide-y bg-[var(--color-heading)] border-black h-full col-span-2">
          <div
            v-for="floor in store.floors"
            :key="floor"
            class="px-1 relative grid grid-flow-row"
          >
            <span class="text-black text-xs absolute left-1 select-none">F{{ floor }}</span>
            <div class="floor-btns grid grid-rows-2 row-span-2 max-h-full box-border overflow-hidden">
              <button
                v-if="floor !== store.floors[0]"
                class="floor-btn flex items-center text-gray-200 disabled:cursor-none disabled:pointer-events-none"
                @click="() => store.requestElevator(floor, DIRECTION.UP)"
                :disabled="!!currentFloorRequests(floor, DIRECTION.UP).length"
              >
                <span class="text-xs text-gray-500 select-none">{{ currentFloorRequests(floor, DIRECTION.UP).join(", ") }}</span>
                <CaretUp />
              </button>
              <button
                v-if="floor !== store.floors[store.floors.length - 1]"
                class="floor-btn flex items-center text-gray-200 disabled:cursor-none disabled:pointer-events-none"
                @click="() => store.requestElevator(floor, DIRECTION.DOWN)"
                :disabled="!!currentFloorRequests(floor, DIRECTION.DOWN).length"
              >
                <span class="text-xs text-gray-500 select-none">{{ currentFloorRequests(floor, DIRECTION.DOWN).join(", ") }}</span>
                <CaretDown />
              </button>
            </div>
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
import { DIRECTION, REQUEST_STATUS } from '@/types/elevator';
import CaretDown from '@/components/icons/CaretDown.vue';
import CaretUp from '@/components/icons/CaretUp.vue';

const store = useElevatorStore();

const currentFloorRequests = (floor: number, direction: DIRECTION) => {
  const reqs = store.floorRequests
    .filter(item => {
      return item.pickupFloor === floor && item.direction === direction && item.requestStatus !== REQUEST_STATUS.PICKED_UP;
    })
    .map(request => {
      console.log("ElevatorSim.vue ~ line 60: request:", request);
      return request.destinationFloors;
    });
  return reqs;
};
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
.floor-area {
  position: relative;
  & > div:first-child, & > div:last-child {
    .floor-btns {
      position: relative;
      top: 50%;
      transform: translateY(-25%);
    }
  }
}
.floor-btn {
  background-color: transparent;
  padding-top: 1px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  transition: color 0.2s;
  &:hover {
    color: black;
  }
  // &:disabled {
  //   cursor: not-allowed;
  //   color: gray;
  // }
}
</style>