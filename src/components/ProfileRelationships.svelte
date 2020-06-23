<script>
	export let data;
</script>

<style>
	#data {
		padding: 0.5em 2em;
	}
</style>

<section id="data" class="col s12 m7 l8 white">
	<h5>Children</h5>
	<div class="collection">
		{#if (data.children).length == 0}
			<div class="collection-item">No children</div>
		{:else}
			{#each data.children as child}
				<a href='/profile/{child.id}' class="collection-item">{child.name}</a>
			{/each}
		{/if}
	</div>

	<h5>Parents</h5>
	<div class="collection">
		{#if (data.parents).length == 0}
			<div class="collection-item">No parents</div>
		{:else}
			{#each data.parents as parent}
				<a href="/profile/{parent.id}" class="collection-item">{parent.name}</a>
			{/each}
		{/if}
	</div>

	<h5>Married</h5>
	<div class="collection">
		{#if (data.marriage).length == 0}
			<div class="collection-item">Not married</div>
		{:else}
			{#each data.marriage as spouse}
				<a href="/profile/{spouse.spouse_id}" class="collection-item">{spouse.name}</a>
			{/each}
		{/if}
	</div>
</section>