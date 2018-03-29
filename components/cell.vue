<template>
  <div class="cell" v-bind:class="{selected: selected, highlit: highlit}" v-on:click="clicked">
    <div class="grid hints" v-bind:class="{hide: number}">
      <p v-for="i in 9" v-bind:class="{hide: !marks[i], highlit: highlitMarks[i]}">{{i}}</p>
    </div>
    <p>{{number}}</p>
  </div>
</template>

<script src="./scripts/cell.js"></script>
<style src="./styles/cell.css"></style>
<style src="./styles/grid.css"></style>
