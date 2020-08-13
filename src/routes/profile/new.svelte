<script context="module">
	export async function preload( _, {user}) {
		if(user == null) {
			return this.redirect(302, '/login')
		} else {
			const res = await this.fetch(`profile/new.json`);
			const data = await res.json();

			//dropdowns should only contain people the current user has created
			data.people = data.people.filter(p => p.user_id == user)

			if (res.status === 200) {
				return { data: data };
			} else {
				this.error(res.status, data.message);
			}
		}
	}
</script>

<script>
	import Form from '../../components/Form.svelte'
	import { stores } from '@sapper/app';
	const { session } = stores();
	
	export let data
	var message = null

	async function formSubmit(event) {
		if(event.target.birth_date.value != "" && event.target.death_date.value != ""
		&& event.target.birth_date.value > event.target.death_date.value) {
			message = "Death date must be after birth date!"
		} else {
			var response = await fetch("/profile/new.json", {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'},
				body: JSON.stringify({
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
		}

		//show message
		const message_div = document.getElementsByClassName("hidden")[0]
		if(message == "New person created!") {
			document.getElementById("person-form").reset()
			message_div.classList.add("green")
			message_div.classList.remove("red")
		} else {
			message_div.classList.add("red")
		}
		message_div.classList.remove("hidden")
	}
</script>

<svelte:head>
	<title>New Profile</title>
</svelte:head>

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

<div class="container grey lighten-3">
	<form id="person-form" method="POST" on:submit|preventDefault="{formSubmit}">
		<Form title={"New person"} dropdown_data={data.people}/>
		<p id="message" class="hidden col s12 center align lighten-3">{message}</p>
	</form>
</div>