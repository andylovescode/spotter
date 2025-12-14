<script lang="ts">
	import { authClient } from '$lib/auth.client';
	const session = authClient.useSession();
</script>

<h1 class="text-2xl font-bold">
	Hello, {$session.data?.user.name}
</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
