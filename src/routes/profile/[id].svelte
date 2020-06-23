<script context="module">
	export async function preload(page, {user}) {
		if(user == null) {
			return this.redirect(302, '/login')
		} else {
			const res = await this.fetch(`profile/${page.params.id}.json`);
			const data = await res.json();

			if (res.status === 200) {
				return { data: data };
			} else {
				this.error(res.status, data.message);
			}
		}
	}
</script>

<script>
	import Header from '../../components/ProfileHeader.svelte'
	import EventsSection from '../../components/ProfileEvents.svelte'
	import RelationshipsSection from '../../components/ProfileRelationships.svelte'
	import ActionButton from '../../components/ActionButton.svelte'
	export let data
</script>

<style>
	#main {
		max-width: 75em;
		margin: 0 auto;
	}
	@media(min-width: 602px) {
		#info {
			display: flex;
		}
		info > div {
			flex: 1;
		}
	}
</style>

<svelte:head>
	<title>{data.name} - Profile</title>
</svelte:head>

<div id="main" class="container grey lighten-3">
	<Header {data}/>
	<div id="info" class="row">
		<EventsSection {data}/>
		<RelationshipsSection {data}/>
	</div>
	<ActionButton/>     
</div>