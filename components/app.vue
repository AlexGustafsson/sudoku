<template>
	<div id="app">
    <field v-on:completed="fieldCompleted"></field>
	</div>
</template>

<script src="./scripts/app.js"></script>
<style src="./styles/app.css"></style>
<style src="./styles/grid.css"></style>

<!--Included here as they are used in both cell.vue and field.vue.
		Optimally, they would be placed in those files instead of here,
		but the current setup would then include the files multiple times,
		https://github.com/egoist/poi/issues/402
-->
<style src="./styles/grid.css"></style>
<style src="./styles/sudoku-me.css"></style>
