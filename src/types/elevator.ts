export enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
  IDLE = 'idle',
}

export enum ELEVATOR_STATUS {
  IDLE = 'idle',
  MOVING = 'moving',
  LOADING_UNLOADING = 'loading/unloading',
}

export interface Elevator {
  id: number;
  originFloor: number;
  currentFloor: number;
  targetFloor?: number | null;
  direction: DIRECTION;
  status: ELEVATOR_STATUS;
  stops: Set<number>;
}

export interface FloorRequest {
  pickupFloor: number;
  destinationFloors: number[];
  direction: DIRECTION;
}
