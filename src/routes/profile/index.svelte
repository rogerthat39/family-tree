<script context="module">
	export async function preload( _, {user}) {
		if(user == null) {
			return this.redirect(302, '/login')
		} else {
			const res = await this.fetch(`profile.json`)
			const data = await res.json()
			//only return people belonging to logged in user
			return {profiles: data.people.filter(p => p.user_id == user)}
		}
	}
</script>

<script>
	export let profiles;
	import ActionButton from '../../components/ActionButton.svelte'

	let searchTerm = ""
	let resultArray = profiles

	//dynamically filter list of profiles by search term
	$: {
		resultArray = profiles.filter((item) => {
			if(item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
				return item
			}
		})
	}
</script>

<style>
	#search-form {
		width: 50%;
		position: relative;
		margin: 10px auto;
	}
	.collection {
		max-width: 75em;
		margin: 0 auto;
	}
	#search-bar {
		padding-left: 50px;
		width: 90%;
		border: 1px solid #eee;
		border-radius: 2rem;
	}
	::placeholder {
		color: black;
	}
</style>

<svelte:head>
	<title>Profiles</title>
</svelte:head>

<form id="search-form">
	<div class="input-field">
		<input id="search-bar" class="grey lighten-3" type="search" placeholder="Search profiles..." bind:value={searchTerm}>
		<label class="label-icon" for="search"><i class="material-icons prefix">search</i></label>
	</div>
</form>

<div class="collection">
	{#each resultArray as profile}
		<a class="collection-item" href='profile/{profile.id}' rel=prefetch>{profile.name}</a>
	{/each}
	{#if resultArray.length == 0}
		<div class="collection-item">No results!</div>
	{/if}
</div>

<ActionButton/>