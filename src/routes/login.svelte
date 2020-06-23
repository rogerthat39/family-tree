<script>
	import { goto, stores } from '@sapper/app';
	import { onMount } from 'svelte';
	const { session } = stores();

	var message = null

	//set username as stored value (if set)
	onMount(() => {
		document.getElementById('username').value = localStorage.getItem("username")
	})
	
	async function formSubmit(event) {
		var response = await fetch(`/login.json`, {
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

		if(message == "Login successful!") {
			message_div.classList.add("green")
			//save username in local storage (if box checked)
			if(document.getElementById('checkbox').checked) {
				localStorage.setItem("username", document.getElementById('username').value)
			}
			//put user id in session
			session.set({user: data.id})
			//redirect to /profile page
			await goto(`/profile`)
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
	#checkboxLabel {
		position: initial;
		display: block;
		margin-top: -2em;
	}
</style>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="container center-align grey lighten-5">
	<h3>Login</h3>
	<div class="row">
		<form id="login-form" method="POST" on:submit|preventDefault={formSubmit}>
			<div class="input-field col s12">
				<input id="username" name="username" type="text" required />
				<label for="username" class="active">Username</label>
			</div>
			<div class="input-field col s12">
				<input id="password" name="password" type="password" required />
				<label for="password" class="active">Password</label>
			</div>
			<div class="input-field col s12">
				<label id="checkboxLabel">
					<input id="checkbox" type="checkbox" />
					<span>Remember username</span>
				</label>
			</div>
			<button type="submit" class="btn indigo darken-1 waves-effect waves-light">
				Submit <i class="material-icons right">send</i>
			</button>
			<p id="message" class="hidden col s12 center align lighten-3">{message}</p>
		</form>
	</div>
</div>