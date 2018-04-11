<template>
	<div id="app">
		<div v-on:click="openMenu" class="menuToggle"><p></p></div>
		<div class="menu" v-bind:class="{hide: !menuVisible}">
			<div>
				<h1>Sudoku</h1>
					<div class="github">
						<a target="_blank" href="https://github.com/AlexGustafsson/sudoku">
							<img src="/GitHub-Mark-64px.png" />
						</a>
					</div>
				<br />
				<br />
				<h2 v-bind:class="{hide: !endState}">You did it!</h2>
				<p v-if="!endState && firstTime" class="button" v-on:click="play">Play</p>
				<p v-else-if="endState" class="button" v-on:click="play">Play again</p>
				<p v-else-if="!firstTime" class="button" v-on:click="play">Resume</p>
				<p v-if="!endState && !firstTime" class="button" v-on:click="restart">Restart</p>
				<p v-on:click="cycleDifficulty" class="button">{{level}}</p>
			</div>
		</div>
		<div class="game">
	    <field v-on:completed="fieldCompleted"></field>
	    <keyboard></keyboard>
		</div>
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
