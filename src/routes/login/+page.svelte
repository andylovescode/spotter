<script>
	import { authClient } from '$lib/auth.client';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="fixed inset-0 flex p-4">
	<div class="flex w-full flex-row rounded-2xl border bg-card shadow-lg dark:shadow-black/25">
		<div class="flex h-full w-full flex-col items-center justify-center gap-4">
			<h1 class="text-4xl font-medium tracking-tighter">Sign in</h1>
			<p class="text-muted-foreground italic">Don't worry, we don't sell your data.</p>
		</div>
		<div
			class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-purple-600 p-16 dark:border dark:bg-muted"
		>
			<div class="flex w-full max-w-sm flex-col gap-4">
				<div class="flex w-full flex-row items-center justify-center gap-3">
					<div class="h-0 w-full border-b border-border"></div>
					<div class="text-xs text-muted-foreground uppercase">options</div>
					<div class="h-0 w-full border-b border-border"></div>
				</div>
				<Button
					onclick={() => {
						authClient.signIn.social({
							provider: 'discord'
						});
					}}>Sign in with Discord</Button
				>
			</div>
		</div>
	</div>
</div>
