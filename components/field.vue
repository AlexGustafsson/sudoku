<template>
  <div class="field">
    <div class="grid">
      <div class="grid subgrid" v-for="i in 9">
        <cell v-for="j in 9" :key="j">1</cell>
      </div>
    </div>
  </div>
</template>

<script src="./scripts/field.js"></script>
<style src="./styles/field.css"></style>
<style src="./styles/grid.css"></style>
