import { ref } from 'vue';
import { defineStore } from 'pinia';
import { DIRECTION, ELEVATOR_STATUS, type Elevator, type FloorRequest } from '../types/elevator';

export const useElevatorStore = defineStore('elevator', () => {
  const getRandomFloor = () => Math.floor(Math.random() * 10) + 1;
  const FLOOR_TRAVEL_TIME = 2000;
  const DOOR_OPERATION_TIME = 5000;

  const elevators = ref<Elevator[]>(
    Array.from({ length: 4 }, (_, i) => {
      const randomFloor = getRandomFloor();
      return {
        id: i + 1,
        originFloor: randomFloor,
        currentFloor: randomFloor,
        targetFloor: null,
        direction: DIRECTION.IDLE,
        status: ELEVATOR_STATUS.IDLE,
        stops: new Set()
      }
    })
  );

  const floors = ref<number[]>(Array.from({ length: 10 }, (_, i) => i + 1).reverse());
  const floorRequests = ref<FloorRequest[]>([]);
  const elevatorSpeed = ref(FLOOR_TRAVEL_TIME);

  const findNearestElevator = (pickupFloor: number, direction: DIRECTION) => {
    //Assigns the closest available elevator moving in the right direction.
    // If no elevator is moving in the correct direction, it chooses the closest idle elevator.
    let nearestElevator: Elevator | undefined;

    const availableElevators = elevators.value
      .filter(item => {
        if (item.status === ELEVATOR_STATUS.IDLE) {
          return true
        } else if (item.status === ELEVATOR_STATUS.MOVING) {
          if (item.direction === direction && item.stops.size > 0) {
            if (direction === DIRECTION.UP && item.currentFloor < pickupFloor) {
              return true;
            }
            if (direction === DIRECTION.DOWN && item.currentFloor > pickupFloor) {
              return true;
            }

          }
        }
      });
    const elevatorAtTheSameFloor = availableElevators.find(item => item.currentFloor === pickupFloor);
    if (!elevatorAtTheSameFloor) {
      nearestElevator = availableElevators.reduce((prev, current) => {
        return Math.abs(current.currentFloor - pickupFloor) < Math.abs(prev.currentFloor - pickupFloor) ? current : prev;
      });
    }
    return elevatorAtTheSameFloor ? elevatorAtTheSameFloor : nearestElevator;
  };

  const generateRequestsFromThisFloor = (pickupFloor: number, direction: DIRECTION) => {
    let destinationFloors: number[] = [];

    const uniqueFloors = new Set<number>();
    // generate 1-3 random floor requests for current floor on the same direction
    while (uniqueFloors.size < Math.floor(Math.random() * 3) + 1) {
      const floor = direction === DIRECTION.UP
        ? Math.floor(Math.random() * (10 - pickupFloor)) + pickupFloor + 1
        : Math.floor(Math.random() * (pickupFloor - 1)) + 1;
      uniqueFloors.add(floor);
    }
    destinationFloors = Array.from(uniqueFloors);

    const request: FloorRequest = {
      pickupFloor,
      destinationFloors,
      direction,
    };

    floorRequests.value.push(request);
    processRequests();
  };

  // How will elevator move between floors?
  // Elevator moves one floor at a time
  // A function will check if the elevator should stop at the current floor or proceeds to the next floor
  // Elevator will move to the next floor in the direction of travel
  // If the elevator reaches the top or bottom floor, it will change direction
  // If the elevator reaches a stop, it will open the door
  // If the elevator has no more stops, it will change status to idle
  const moveElevator = async (elevator: Elevator, direction: DIRECTION) => {
    elevator.status = ELEVATOR_STATUS.MOVING;
    elevator.direction = direction;

    while (elevator.stops.size > 0) {
      elevator.status = ELEVATOR_STATUS.MOVING;
      if (elevator.currentFloor > (elevator.targetFloor || 0) && elevator.currentFloor !== 0) {
        elevator.currentFloor--;
        elevator.direction = DIRECTION.DOWN;
      } else {
        elevator.direction = DIRECTION.UP;
        elevator.currentFloor++;
      }
      await new Promise(resolve => setTimeout(resolve, (elevatorSpeed.value - 1000)));

      if (shouldStopAtFloor(elevator, elevator.currentFloor)) {
        elevator.stops.delete(elevator.currentFloor);
        elevator.status = ELEVATOR_STATUS.LOADING_UNLOADING;
        await new Promise(resolve => setTimeout(resolve, DOOR_OPERATION_TIME));
      }
    }

    elevator.status = ELEVATOR_STATUS.IDLE;
    elevator.direction = DIRECTION.IDLE;
  };

  const shouldStopAtFloor = (elevator: Elevator, floor: number) => {
    return elevator.stops.has(floor);
  };

  const processRequests = async () => {
    const request = floorRequests.value[0];
    if (!request) return;

    let elevator = findNearestElevator(request.pickupFloor, request.direction);
    console.log("elevatorStore.ts ~ line 118: elevator:", elevator);
    if (!elevator) return;

    // elevator.stops.add(request.pickupFloor);

    if (elevator.currentFloor === request.pickupFloor) {
      elevator.status = ELEVATOR_STATUS.LOADING_UNLOADING;
      await new Promise(resolve => setTimeout(resolve, DOOR_OPERATION_TIME));
      request.destinationFloors.forEach(floor => elevator.stops.add(floor));
      floorRequests.value.shift();
      moveElevator(elevator, request.direction);
    } else {
      // if requests is not on the same floor, move elevator to the floor

      elevator.currentFloor = request.pickupFloor;
      moveElevator(elevator, request.direction);
    }
    // floorRequests.value.shift();
  }

  return {
    elevators,
    floors,
    elevatorSpeed,
    floorRequests,
    findNearestElevator,
    requestElevator: generateRequestsFromThisFloor,
  };
});