import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Elevator, FloorRequest } from '../types/elevator';

export const useElevatorStore = defineStore('elevator', () => {
  const getRandomFloor = () => Math.floor(Math.random() * 10) + 1;
  const FLOOR_TRAVEL_TIME = 2000;
  const DOOR_OPERATION_TIME = 2000;

  const elevators = ref<Elevator[]>(
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      currentFloor: getRandomFloor(),
      targetFloor: null,
      direction: 'idle',
      isMoving: false,
      isDoorOpen: false,
      destinations: new Set()
    }))
  );
  const floors = ref<number[]>(Array.from({ length: 10 }, (_, i) => i + 1).reverse());
  const floorRequests = ref<FloorRequest[]>([]);
  const elevatorSpeed = ref(FLOOR_TRAVEL_TIME);

  const findNearestElevator = (floor: number, direction: 'up' | 'down') => {
    return elevators.value.reduce((nearest, elevator) => {
      if (elevator.isMoving && elevator.direction !== direction) return nearest;
      
      const currentDistance = Math.abs(elevator.currentFloor - floor);
      const nearestDistance = nearest ? Math.abs(nearest.currentFloor - floor) : Infinity;
      
      if (elevator.isMoving) {
        // If elevator is moving, only consider it if it's moving in the same direction
        // and the requested floor is in its path
        if (direction === 'up' && elevator.currentFloor > floor) return nearest;
        if (direction === 'down' && elevator.currentFloor < floor) return nearest;
      }
      
      return currentDistance < nearestDistance ? elevator : nearest;
    }, null as Elevator | null);
  };

  const requestElevator = (pickupFloor: number, direction: 'up' | 'down', destinationFloor?: number) => {
    // Generate a random destination floor in the direction of travel
    console.log("elevatorStore.ts ~ line 45: pickupFloor:", pickupFloor);
    if (!destinationFloor) {
      if (direction === 'up') {
        destinationFloor = Math.floor(Math.random() * (10 - pickupFloor)) + pickupFloor + 1;
      } else {
        destinationFloor = Math.floor(Math.random() * (pickupFloor - 1)) + 1;
      }
    }
    // let destinationFloor;
    // if (direction === 'up') {
    //   destinationFloor = Math.floor(Math.random() * (10 - pickupFloor)) + pickupFloor + 1;
    // } else {
    //   destinationFloor = Math.floor(Math.random() * (pickupFloor - 1)) + 1;
    // }

    const request: FloorRequest = {
      pickupFloor,
      destinationFloor,
      direction,
      timestamp: Date.now()
    };
    
    floorRequests.value.push(request);
    processRequests();
  };

  const shouldStopAtFloor = (elevator: Elevator, floor: number) => {
    return elevator.destinations.has(floor);
  };

  const processRequests = async () => {
    const request = floorRequests.value[0];
    if (!request) return;

    const elevator = findNearestElevator(request.pickupFloor, request.direction);
    if (!elevator) return;

    // Add both pickup and destination floors to the elevator's destinations
    elevator.destinations.add(request.pickupFloor);
    elevator.destinations.add(request.destinationFloor);
    
    if (elevator.direction === 'idle') {
      elevator.direction = request.direction;
      elevator.isMoving = true;
    }

    // Process all floors in the elevator's path
    while (elevator.destinations.size > 0) {
      const currentFloor = elevator.currentFloor;
      
      if (shouldStopAtFloor(elevator, currentFloor)) {
        elevator.isMoving = false;
        elevator.isDoorOpen = true;
        elevator.destinations.delete(currentFloor);
        
        await new Promise(resolve => setTimeout(resolve, DOOR_OPERATION_TIME));
        elevator.isDoorOpen = false;
      }

      if (elevator.destinations.size === 0) {
        break;
      }

      // Move to next floor
      elevator.isMoving = true;
      const nextFloor = elevator.direction === 'up' ? currentFloor + 1 : currentFloor - 1;
      await new Promise(resolve => setTimeout(resolve, FLOOR_TRAVEL_TIME));
      elevator.currentFloor = nextFloor;

      // Check if we need to change direction
      if (nextFloor === 10 || nextFloor === 1) {
        elevator.direction = elevator.direction === 'up' ? 'down' : 'up';
      }
    }

    elevator.isMoving = false;
    elevator.direction = 'idle';
    floorRequests.value.shift();
  };

  const generateRandomRequest = () => {
    const floor = Math.floor(Math.random() * 10) + 1;
    const direction = Math.random() < 0.5 ? 'up' : 'down';
    requestElevator(floor, direction);
  };

  return {
    elevators,
    floors,
    elevatorSpeed,
    requestElevator,
    generateRandomRequest
  };
});