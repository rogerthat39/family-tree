<script>
	import { goto, stores } from '@sapper/app';
	import { onMount } from 'svelte';
	const { session } = stores();

	var message = null
	
	async function formSubmit(event) {
		var response = await fetch(`/register.json`, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'},
			body: JSON.stringify({
				username: event.target.username.value, 
				password: event.target.password.value
			})
		})
		var data = await response.json()
        message = await data.message

		//show message
		const message_div = document.getElementById("message")
		message_div.classList.remove("hidden")

		if(message == "Successfully created user. Click here to log in.") {
			message_div.classList.add("green")
		} else {
			message_div.classList.add("red")
		}
	}
</script>

<style>
	.container {
		padding: 1em;
		max-width: 500px;
	}
	.hidden {
		display: none;
	}
</style>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="container center-align grey lighten-5">
	<h3>Register new account</h3>
	<div class="row">
		<form id="register-form" method="POST" on:submit|preventDefault={formSubmit}>
			<div class="input-field col s12">
				<input id="username" name="username" type="text" required />
				<label for="username" class="active">Username</label>
			</div>
			<div class="input-field col s12">
				<input id="password" name="password" type="password" required />
				<label for="password" class="active">Password</label>
			</div>
			<button type="submit" class="btn indigo darken-1 waves-effect waves-light">
				Submit <i class="material-icons right">send</i>
			</button>
			<p id="message" class="hidden col s12 center align lighten-3">{message}</p>
		</form>
	</div>
</div>