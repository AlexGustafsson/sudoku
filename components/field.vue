<template>
  <div class="field">
    <div class="grid">
      <div class="grid subgrid" v-for="subgrid in subgrids">
        <cell v-for="cell in subgrid.cells" :key="cell.id" v-on:selected="cellSelected"
          v-bind="cell"></cell>
      </div>
    </div>
  </div>
</template>

<script src="./scripts/field.js"></script>
<style src="./styles/field.css"></style>
<style src="./styles/grid.css"></style>
