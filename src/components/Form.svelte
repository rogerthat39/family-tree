<script>
	//export let people
	export let title
	export let dropdown_data
	export let data = {
		name: "",
		parents: [],
		marriage: [],
		children: [],
		info: {
			first_name: "",
			last_name: "",
			gender: "",
			birth_date: "",
			birth_location: "",
			death_date: "",
			death_location: "",
		}}
	var children_ids = data.children.map(c => c.id)

	import { onMount } from 'svelte'
	
	onMount(() => {
		//initialize date pickers
		var elems = document.querySelectorAll('.datepicker')
		var instances = M.Datepicker.init(elems, {
			autoClose: true,
			format: "yyyy-mm-dd"
		})
		
		//initialize dropdowns
		var dropdown_elems = document.querySelectorAll('select')
		var dropdown_instances = M.FormSelect.init(dropdown_elems)
	})
</script>

<style>
	.input-field input[type=text] {
		padding-right: 10px;
	}
	h3 {
		margin-left: 8px;
	}
	label[for=gender], .radioButton {
		position: initial;
	}
	.radioButton {
		position: initial;
		display: block;
	}
</style>

<h3>{title}</h3>
<div class="row">
	<div class="input-field col s12">
		<input id="first_name" type="text" value={data.info.first_name} required>
		<label for="first_name" class={data.info.first_name != '' ? 'active' : ''}>First Name</label>
	</div>
	<div class="input-field col s12">
		<input id="last_name" type="text" value={data.info.last_name} required>
		<label for="last_name" class={data.info.last_name != '' ? 'active' : ''}>Last Name</label>
	</div>

	<!--gender radio buttons-->
	<div class="input-field col s12">
		<label for="gender">Gender</label>
		<label class="radioButton">
			<input name="gender" value="M" type="radio" required checked={data.info.gender == 'M'}/>
			<span>Male</span>
		</label>
		<label class="radioButton">
			<input name="gender" value="F" type="radio" required checked={data.info.gender == 'F'}/>
			<span>Female</span>
		</label>
		<label class="radioButton">
			<input name="gender" value="X" type="radio" required checked={data.info.gender == 'X'}/>
			<span>Other</span>
		</label>
	</div>

	<!--birth and death info-->
	<div class="input-field col s12 m6">
		<input id="birth_date" type="text" class="datepicker" value={data.info.birth_date}>
		<label for="birth_date" class={data.info.birth_date != '' ? 'active' : ''}>Birth Date</label>
	</div>
	<div class="input-field col s12 m6">
		<input id="birth_location" type="text" value={data.info.birth_location}>
		<label for="birth_location" class={data.info.birth_location != '' ? 'active' : ''}>Birth Location</label>
	</div>
	<div class="input-field col s12 m6">
		<input id="death_date" type="text" class="datepicker" value={data.info.death_date}>
		<label for="death_date" class={data.info.death_date != '' ? 'active' : ''}>Death Date</label>
	</div>
	<div class="input-field col s12 m6">
		<input id="death_location" type="text" value={data.info.death_location}>
		<label for="death_location" class={data.info.death_location != '' ? 'active' : ''}>Death Location</label>
	</div>

	<!--parent dropdowns-->
	<div class="input-field col s12 m6">
		<select id="parent1" value={data.parents.length > 0 ? data.parents[0].id : ''}>
			<option value=''>Choose parent 1</option>
			{#each dropdown_data as person}
				<option value={person.id}>{person.name}</option>
			{/each}
		</select>
		<label for="parent1">Parent 1</label>
	</div>
	<div class="input-field col s12 m6">
		<select id="parent2" value={data.parents.length > 1 ? data.parents[1].id : ''}>
			<option value=''>Choose parent 2</option>
			{#each dropdown_data as person}
				<option value={person.id}>{person.name}</option>
			{/each}
		</select>
		<label for="parent2">Parent 2</label>
	</div>

	<!--marriage dropdown-->
	<div class="input-field col s12">
		<select id="marriage" value={data.marriage.length > 0 ? data.marriage[0].spouse_id : ''}>
			<option value=''>Choose spouse</option>
			{#each dropdown_data as spouse}
				<option value={spouse.id}>{spouse.name}</option>
			{/each}
		</select>
		<label for="marriage">Marriage</label>
	</div>

	<!--children dropdown-->
	<div class="input-field col s12">
		<select multiple id="children">
			<option value='' disabled>Choose children</option>
			{#each dropdown_data as child}
				{#if data.children.length > 0 && children_ids.includes(child.id)}
					<option selected value={child.id}>{child.name}</option>
				{:else}
					<option value={child.id}>{child.name}</option>
				{/if}
			{/each}
		</select>
		<label for="children">Children</label>
	</div>
</div>

<div class="center-align">
	<button type="submit" class="btn indigo darken-1 waves-effect waves-light">
		Submit <i class="material-icons right">send</i>
	</button>
</div>

