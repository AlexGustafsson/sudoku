<template>
  <div class="cell" v-bind:class="{selected: selected, highlit: highlit, secondary: secondarySelected}" v-on:click="clicked">
    <div class="grid hints" v-bind:class="{hide: number && !secondarySelected}">
      <div v-for="i in 9" v-bind:class="{hide: !marks[i], highlit: highlitMarks[i]}">
        <p>{{i}}</p>
      </div>
    </div>
    <p v-bind:class="{translucent: secondarySelected}">{{number}}</p>
  </div>
</template>

<script src="./scripts/cell.js"></script>
<style src="./styles/cell.css"></style>
<style src="./styles/grid.css"></style>
