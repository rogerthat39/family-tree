<script context="module">
	export async function preload(page, {user}) {
		if(user == null) {
			return this.redirect(302, '/login')
		} else {
			const res = await this.fetch(`profile/edit/${page.params.id}.json`);
			const data = await res.json();

			//dropdowns should only contain people the current user has created
			data.people = data.people.filter(p => p.user_id == user)

			if (res.status === 200) {
				return { data: data };
			} else {
				this.error(res.status, data.message)
			}
		}
	}
</script>

<script>
	import Form from '../../../components/Form.svelte'
	import { goto, stores } from '@sapper/app';
	const { session } = stores();
	export let data

	var message = null

	async function formSubmit(event) {
		const id = event.target.id.value
		var response = await fetch(`/profile/edit/${id}.json`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: id,
				user_id: $session.user,
				first_name: event.target.first_name.value, 
				last_name: event.target.last_name.value,
				gender: event.target.gender.value,
				birth_date: event.target.birth_date.value,
				death_date: event.target.death_date.value,
				birth_location: event.target.birth_location.value,
				death_location: event.target.death_location.value,
				parent1: event.target.parent1.value,
				parent2: event.target.parent2.value,
				marriage: event.target.marriage.value,
				children: event.target.children.selectedOptions
			})
		})
		var data = await response.json()
		message = await data.message

		//show message
		const message_div = document.getElementById("message")
		message_div.classList.remove("hidden")
		if(message == "Update successful!") {
			document.getElementById("person-form").reset()
			message_div.classList.add("green")
			//redirect page to /profile/[id]
			await goto(`/profile/${id}`)
		} else {
			message_div.classList.add("red")
		}
	}
</script>

<style>
	form {
		padding: 1em 2em;
	}
	#message {
		padding: 1em 0;
	}
	.hidden {
		display: none;
	}
</style>

<svelte:head>
	<title>{data.name} - Edit</title>
</svelte:head>

<div class="container grey lighten-5">
	<form id="person-form" method="POST" on:submit|preventDefault="{formSubmit}">
		<input type="hidden" id="id" value={data.info.id}>
		<Form title={"Editing " + data.name} {data} dropdown_data={data.people}/>
		<p id="message" class="hidden col s12 center align lighten-3">{message}</p>
	</form>
</div>