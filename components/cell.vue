<template>
  <div class="cell">
    <div class="grid hints" v-bind:class="{hide: number}">
      <p v-for="i in 9" v-bind:class="{hide: !enabled[i]}">{{i}}</p>
    </div>
    <input type="text" v-model="number" />
  </div>
</template>

<script src="./scripts/cell.js"></script>
<style src="./styles/cell.css"></style>
<style src="./styles/grid.css"></style>
