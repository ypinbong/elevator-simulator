export interface Elevator {
  id: number;
  currentFloor: number;
  targetFloor?: number | null;
  direction: 'up' | 'down' | 'idle';
  isMoving: boolean;
  isDoorOpen: boolean;
  destinations: Set<number>;
}

export interface FloorRequest {
  pickupFloor: number;
  destinationFloor: number;
  direction: 'up' | 'down';
  timestamp: number;
}

export interface ElevatorState {
  elevators: Elevator[];
  floorRequests: FloorRequest[];
  floors: number[];
}