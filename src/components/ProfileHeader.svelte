<script>
	export let data;
	import { onMount } from 'svelte'
	import { goto } from '@sapper/app'
	
	onMount(() => {
		//initialize modal
		var elems = document.querySelectorAll('.modal')
		var instances = M.Modal.init(elems, {preventScrolling: true, dismissable: true})
	})

	async function deleteUser(id) {
		let res = await fetch(`profile/delete/${id}.json`);
		let data = await res.json();
		if (res.status === 200) {
			//redirect page to /profile
			await goto(`/profile`)
		} else {
			alert(res.status, data.message)
		}
	}
</script>

<style>
	span {
		position: relative;
		top: -3px;
		left: 3px;
	}
	a {
		padding-left: 1em;
	}
	.modal {
		max-width: 400px;
	}
	img {
		width: 200px;
		max-width: 40vw;
	}
</style>

<div class="row valign-wrapper">
	<img class="col center-align" src="images/placeholder.svg" alt="{data.info.gender} placeholder" width="90%">
	<div class="col">
		<h2>{data.name}</h2>
		<p><b>Gender: {data.info.gender}</b></p>
		<a class="btn indigo darken-2" href="/profile/edit/{data.info.id}">
			<i class="material-icons">edit</i><span>Edit</span>
		</a>
		<button data-target="deleteModal" class="btn modal-trigger red darken-2">
			<i class="material-icons">delete</i><span>Delete</span>
		</button>
	</div>
</div>

<div id="deleteModal" class="modal">
    <div class="modal-content">
		<h4>Delete {data.name}</h4>
		<p>Are you sure you want to delete {data.name}? This cannot be undone.</p>
    </div>
    <div class="modal-footer">
		<button class="modal-close btn red darken-2" on:click={deleteUser(data.id)}>Yes</button>
		<button class="modal-close btn indigo darken-2">No</button>
    </div>
</div>