import { ref } from 'vue';
import { defineStore } from 'pinia';

import { v4 as uuidv4 } from 'uuid';

import { DIRECTION, ELEVATOR_STATUS, REQUEST_STATUS, type Elevator, type FloorRequest } from '../types/elevator';

export const useElevatorStore = defineStore('elevator', () => {
  const BUILDING_LEVELS = 10;
  const getRandomFloor = () => Math.floor(Math.random() * BUILDING_LEVELS) + 1;
  const FLOOR_TRAVEL_TIME = 2000;
  const DOOR_OPERATION_TIME = 2000;
  const RANDOM_FLOOR_REQUESTS_LIMIT = 1;

  const elevators = ref<Elevator[]>(
    Array.from({ length: 4 }, (_, i) => {
      const randomFloor = getRandomFloor();
      return {
        id: i + 1,
        currentFloor: randomFloor,
        nextFloor: randomFloor,
        direction: DIRECTION.IDLE,
        requestDirection: DIRECTION.IDLE,
        status: ELEVATOR_STATUS.IDLE,
        stops: new Set()
      }
    })
  );

  const floors = ref<number[]>(Array.from({ length: BUILDING_LEVELS }, (_, i) => i + 1).reverse());
  const floorRequests = ref<FloorRequest[]>([]); // queue of floor requests
  const doorOperationTime = ref(DOOR_OPERATION_TIME);
  const elevatorSpeed = ref(FLOOR_TRAVEL_TIME);

  const setOperationSpeed = (speed: number) => {
    elevatorSpeed.value = speed;
    doorOperationTime.value = speed;
  }

  const findNearestElevator = (floor: number, direction: DIRECTION) => {
    // Assigns the closest available elevator moving in the right direction.
    // If no elevator is moving in the correct direction, it chooses the closest idle elevator.
    let nearestElevator: Elevator | undefined;

    const availableElevators = elevators.value.filter(elevator => {
      if (elevator.status === ELEVATOR_STATUS.IDLE) {
        return true;
      } else if (elevator.status === ELEVATOR_STATUS.MOVING) {
        if (elevator.requestDirection === direction) {
          if (direction === DIRECTION.UP && elevator.currentFloor < floor) {
            return true;
          }
          if (direction === DIRECTION.DOWN && elevator.currentFloor > floor) {
            return true;
          }
        }
      }
      return false;
    });

    const elevatorAtSameFloor = availableElevators.find(elevator => elevator.currentFloor === floor && elevator.requestDirection === direction);
    if (!elevatorAtSameFloor) {
      nearestElevator = availableElevators.reduce((prev, current) => {
        return Math.abs(current.currentFloor - floor) < Math.abs(prev.currentFloor - floor) ? current : prev;
      }, availableElevators[0]);
    }

    return elevatorAtSameFloor ? elevatorAtSameFloor : nearestElevator;
  };

  const generateRequestsFromThisFloor = (pickupFloor: number, direction: DIRECTION) => {
    let destinationFloors: number[] = [];

    const uniqueFloors = new Set<number>();
    let potentialFloors = Array.from({ length: BUILDING_LEVELS }, (_, i) => i + 1)
      .filter(floor => 
      floor !== pickupFloor &&
      ((direction === DIRECTION.UP && floor > pickupFloor) ||
      (direction === DIRECTION.DOWN && floor < pickupFloor))
      );

    if (potentialFloors.length === 0) {
      potentialFloors = [pickupFloor === 1 ? 2 : pickupFloor - 1];
    }

    for (let i = 0; i < RANDOM_FLOOR_REQUESTS_LIMIT && i < potentialFloors.length; i++) {
      uniqueFloors.add(potentialFloors[i]);
    }
    destinationFloors = Array.from(uniqueFloors);

    const request: FloorRequest = {
      id: uuidv4(),
      pickupFloor,
      destinationFloors,
      direction,
      requestStatus: REQUEST_STATUS.PENDING
    };

    floorRequests.value.push(request);
    processRequests();
  };

  const shouldStopAtFloor = (elevator: Elevator, floor: number) => {
    let shouldStop = false;
    if (elevator.stops.has(floor)) {
      shouldStop = true;
    } else if (elevator.direction === DIRECTION.UP && elevator.currentFloor < floor) {
      shouldStop = true;
    } else if (elevator.direction === DIRECTION.DOWN && elevator.currentFloor > floor) {
      shouldStop = true;
    }
    return shouldStop;
  }

  const processRequests = async () => {
    while (floorRequests.value.length > 0) {
      const request = floorRequests.value.find(item => item.requestStatus === REQUEST_STATUS.PENDING);
      if (!request) {
        break;
      }
      const elevator = findNearestElevator(request.pickupFloor, request.direction);
      if (!elevator) {
        break;
      }

      //? this is where the stops are added to the elevator.stops
      //? only add the pickup floor if the elevator.currentFloor is not the same as the pickup floor
      elevator.stops.add(request.pickupFloor);
      // moveElevator(elevator, request.direction);
      floorRequests.value = floorRequests.value.map(item => 
        item.id === request.id ? { ...item, requestStatus: REQUEST_STATUS.PROCESSING, assignedCar: elevator.id } : item
      );

      //? movement logic
      while (elevator.stops.size > 0) {
        const nextStop = Array.from(elevator.stops)
          .sort((a, b) => request.direction === DIRECTION.DOWN ? b - a : a - b)[0];
        if (!nextStop) return;
        elevator.status = ELEVATOR_STATUS.MOVING;
        if (elevator.currentFloor < nextStop) {
          elevator.direction = DIRECTION.UP;
          elevator.nextFloor = Math.min(elevator.nextFloor + 1, floors.value.length);
          await new Promise(resolve => setTimeout(resolve, elevatorSpeed.value));
          elevator.currentFloor = Math.min(elevator.currentFloor + 1, floors.value.length);
        } else if (elevator.currentFloor > nextStop) {
          elevator.direction = DIRECTION.DOWN;
          elevator.nextFloor--;
          await new Promise(resolve => setTimeout(resolve, elevatorSpeed.value));
          elevator.currentFloor--;
        } else if (shouldStopAtFloor(elevator, nextStop)) {
          request.destinationFloors.forEach(floor => elevator.stops.add(floor));
          elevator.stops.delete(nextStop);
          elevators.value = elevators.value.map(item => item.id === elevator.id ? elevator : item);
          elevator.status = ELEVATOR_STATUS.LOADING_UNLOADING;
          await new Promise(resolve => setTimeout(resolve, doorOperationTime.value));
          elevator.status = ELEVATOR_STATUS.IDLE;
          elevator.direction = DIRECTION.IDLE;
          setTimeout(() => {
            floorRequests.value = floorRequests.value.map(item => 
              item.id === request.id ? { ...item, requestStatus: item.requestStatus === REQUEST_STATUS.PICKED_UP ? REQUEST_STATUS.COMPLETED : REQUEST_STATUS.PICKED_UP } : item
            );
          }, 50);
        }
      }
      floorRequests.value = floorRequests.value.filter(item => item.id !== request.id);
    }
  }

  const generateRandomFloorRequests = () => {
    let randomFloor: number;
    //? No more than 5 requests at a time
    if (floorRequests.value.length >= 5) return;
    //? This is a blocker for generating requests from the same floor
    do {
      randomFloor = getRandomFloor();
    } while (floorRequests.value.some(request => request.pickupFloor === randomFloor));
    const randomDirection = Math.random() > 0.5 ? DIRECTION.UP : DIRECTION.DOWN;
    generateRequestsFromThisFloor(randomFloor, randomDirection);
  }

  return {
    elevators,
    floors,
    elevatorSpeed,
    floorRequests,
    findNearestElevator,
    requestElevator: generateRequestsFromThisFloor,
    generateRandomFloorRequests,
    setOperationSpeed
  };
});