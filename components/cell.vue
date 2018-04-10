<template>
  <div class="cell" v-bind:class="{hasNumber: number, selected, highlit, secondary: secondarySelected, hasHighlitMark, crossed, locked, correct, legal}" v-on:click="clicked">
    <div class="grid hints" v-bind:class="{hide: number && !secondarySelected}">
      <div v-for="i in 9" v-bind:class="{hide: !marks[i], highlit: highlitMarks[i]}" class="hint">
        <p class="hintLabel">{{i}}</p>
      </div>
    </div>
    <p v-bind:class="{translucent: secondarySelected}">{{number}}</p>
  </div>
</template>

<script src="./scripts/cell.js"></script>
<style src="./styles/cell.css"></style>
