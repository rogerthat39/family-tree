<script>
	import { onMount } from 'svelte'
	onMount(() => {
		//initialize action button
		var elems = document.querySelectorAll('.fixed-action-btn')
		var instances = M.FloatingActionButton.init(elems, {
			hoverEnabled: false
		})

		//initialize tooltips
		var tooltip_elems = document.querySelectorAll('.tooltipped')
		var tooltip_instances = M.Tooltip.init(tooltip_elems, {position: "left"})
 	})
</script>

<style>
	.fixed-action-btn {
		margin: 20px;
	}
</style>

<div class="fixed-action-btn click-to-toggle">
	<button class="btn-floating btn-large indigo darken-3">
		<i class="large material-icons">add</i>
	</button>
	<ul>
		<li><a class="btn-floating tooltipped blue" href="/profile/new" data-tooltip="Add new profile">
			<i class="material-icons">person_add</i>
		</a></li>
	</ul>
</div>