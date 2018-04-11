<template>
	<div class="keyboard">
    <p v-for="i in 9" class="keyboardButton" v-on:click="clicked(i)">{{i}}</p>
		<p class="keyboardButton" v-on:click="clicked('g')">?</p>
		<p class="keyboardButton" v-on:click="clicked('h')">??</p>
	</div>
</template>

<script src="./scripts/keyboard.js"></script>
<style src="./styles/keyboard.css"></style>
