<template>
  <div class="app">
    <div class="header">
      <h1>Such wow snake game <button @click="init">Start</button></h1>
    </div>
    <div class="container">
      <div class="row" v-for="row in size">
        <div class="col" v-for="col in size">
          <div class="cell" :class="cellClass(col - 1, row - 1)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useSnake } from "./hooks/snake";

export default defineComponent({
  setup() {
    const {
      init,
      size,
      isLocationingSnake,
      isLocationingFood,
      isLocationAnyBody,
    } = useSnake();

    const cellClass = (x: number, y: number) => {
      const classes = ["cell"];

      classes.push(isLocationingSnake(x, y) ? "snake" : "");
      classes.push(isLocationingFood(x, y) ? "food" : "");
      classes.push(isLocationAnyBody(x, y) ? "body" : "");
      return classes;
    };

    return {
      init,
      size,
      cellClass,
    };
  },
});
</script>

<style lang="scss">
.app {
  display: flex;
  width: 90vw;
  height: 90vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  margin-bottom: 8px;
}

.container {
  display: flex;
  flex-direction: column;
  background: white;
}

.row {
  display: flex;
}

$snake-color: green;
$snake-body-color: darken($snake-color, 10%);
$food-color: orange;
.cell {
  font-size: 30px;
  color: lightyellow;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  &.snake {
    background: $snake-color !important;
  }
  &.food {
    background: $food-color;
  }
  &.body {
    background: $snake-body-color;
  }
}
</style>
