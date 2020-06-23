<script>
	import { stores } from '@sapper/app';
	const { session } = stores();
	//remove user id from session
	session.set({user: null})
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="container center-align grey lighten-5" style="padding: 1em;">
	{#if $session.user == null}
		<div class="row">
			<h6>Logged out successfully.</h6>
		</div>
	{:else}
		<div class="row">
			<h6>Did not log out. Please try again</h6>
		</div>
	{/if}
</div>