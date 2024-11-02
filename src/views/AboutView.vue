<template>
  <div class="about__wrapper max-h-full overflow-auto pr-4">
    <p>
      This program is an elementary elevator control system. The focus is only on moving and
      tracking elevators in a building - real world concerns like weight limits, fire control, overrides, holds, etc.,
      are beyond the scope of the program.
    </p>
    <p>Parameters for the program:</p>
    <ul class="list-disc">
      <li class="ml-4">the building has 10 floors</li>
      <li class="ml-4">there are four elevators</li>
      <li class="ml-4">it takes 10 seconds for an elevator car to move from one floor to the next</li>
      <li class="ml-4">when a car stops on a floor, it takes 10 seconds for passengers to enter / leave and then the car is ready to move again</li>
    </ul>
    <p>
      This program generates random calls for the elevator on floors throughout the building.
      The elevator cars will move to pick up passengers and disembark them. The algorithm is simple and
      naive, but in general, an "up" elevator should keep going up until it has no more passengers and the same
      for a "down" elevator - an elevator doesn't yo-yo up and down between floors while still containing
      passengers. There is an optimized algorithm in that could pick up requests along the direction of the elevators movement. The program also
      indicates the relative position of the elevator cars (car 1 is on floor 3, car 2 is on floor 10) and user actions
      ("down" request on floor 4 received, "up" request on floor 7 received); a simple console
      logging can be seen in the simulation section.
    </p>
    <p>
      This is a simple programming exercise. This was made using Vue 3, TypeScript, and Tailwind CSS.
    </p>
  </div>
</template>

<style scoped lang="less">
.about__wrapper {
  & > * {
    margin-bottom: 1rem;
  }
}
</style>
