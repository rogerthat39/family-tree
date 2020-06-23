<script>
	export let data
	import { onMount } from 'svelte'

	onMount(() => {
		//initialize collapsible cards
		var elems = document.querySelectorAll('.collapsible');
    	var instances = M.Collapsible.init(elems);
	})

	const event_icon_names = {
		"Marriage": "favorite",
		"Residence": "home",
		"Adoption": "child_friendly",
		"Child": "child_friendly",
		"Immigration": "flight",
		"Burial": "local_florist",
		"Other": "event"
	}
</script>

<style>
	img {
		width: 28px;
		margin-right: 1em;
	}
	#events {
		padding: 0.5em 2em;
	}
</style>

<aside id="events" class="col s12 m5 l4 grey lighten-5">
	<h5>Events</h5>
	<ul class="collapsible">
		<li>
			<div class="collapsible-header"><i class="material-icons">cake</i>Birth - {data.info.birth_date}</div>
			<div class="collapsible-body white"><span>Birth location: {data.info.birth_location != '' ? data.info.birth_location : 'unknown'}</span></div>
		</li>

		{#each data.events as event}
			<li>
				<div class="collapsible-header">
					<i class="material-icons">{event_icon_names[event.event_name]}</i>
					{event.event_name} - {event.date}</div>
				<div class="collapsible-body white"><span>{event.text}</span></div>
			</li>
		{/each}

		{#if data.info.death_date != ''}
			<li>
				<div class="collapsible-header"><img src="images/grave.svg" alt="skull icon">Death - {data.info.death_date}</div>
				<div class="collapsible-body white"><span>Death location: {data.info.death_location != '' ? data.info.death_location : 'unknown'}</span></div>
			</li>
		{/if}
	</ul>
</aside>