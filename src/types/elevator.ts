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
  currentFloor: number;
  nextFloor: number;
  requestDirection: DIRECTION;
  direction: DIRECTION;
  status: ELEVATOR_STATUS;
  stops: Set<number>;
}

export enum REQUEST_STATUS {
  FINDING_ELEVATOR = 'finding elevator',
  TRANSPORTING = 'transporting',
  DELIVERED = 'delivered',
  PICKED_UP = 'picked up',
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}
export interface FloorRequest {
  id: string;
  pickupFloor: number;
  destinationFloors: number[];
  direction: DIRECTION;
  requestStatus: REQUEST_STATUS;
}
