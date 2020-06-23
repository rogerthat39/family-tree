<script>
	import { stores } from '@sapper/app';
	const { session } = stores();
	export let segment;
	//display "logout" route on button if logged in, "login" route if not logged in
	$: isLoggedIn = ($session.user != null) ? 'logout' : 'login'
</script>

<div class="navbar-fixed">
	<nav class="light-green">
		<div class="nav-wrapper text-right">
			<ul>
				<li class={segment === undefined ? 'active' : undefined}>
					<a href="." aria-current="{segment === undefined ? 'page' : undefined}">home</a>
				</li>
				<li class={segment === 'profile' ? 'active' : undefined}>
					<a href="profile" rel=prefetch aria-current="{segment === 'profile' ? 'page' : undefined}">profiles</a>
				</li>
				<li class="right">
					<a class="btn indigo darken-2 waves-effect waves-light" href={isLoggedIn}>{isLoggedIn}</a>
				</li>
			</ul>
		</div>
	</nav>
</div>