<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import About from './NoteNew.svelte';
</script>

<nav>
	<a  href="/">Home</a>
	<a href="/#/about">About</a>
</nav>

<Router routes={{
	'/': Home,
	'/about': About,
}} />
