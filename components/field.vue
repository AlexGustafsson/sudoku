<template>
  <div class="field">
    <div class="grid">
      <div class="grid subgrid" v-for="subgrid in subgrids">
        <cell v-for="cell in subgrid.cells" :key="cell.id" v-on:selected="cellSelected"
          v-bind="cell"></cell>
      </div>
    </div>
    <div class="overlaygrid">
      <div v-bind:class="{hide: !selectedCell}" class="horizontal overlay" v-bind:style="lineColumn"></div>
      <div v-bind:class="{hide: !selectedCell}" class="vertical overlay" v-bind:style="lineRow"></div>
    </div>
    <keyboard></keyboard>
  </div>
</template>

<script src="./scripts/field.js"></script>
<style src="./styles/field.css"></style>
<style src="./styles/grid.css"></style>
<style src="./styles/sudoku-me.css"></style>
