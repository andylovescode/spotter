<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface Props {
		value: string;
		key: string;
		icon: Snippet;
	}
	const { icon, key, value }: Props = $props();
</script>

<div
	class="flex w-max max-w-full min-w-0 flex-row items-center justify-center gap-2 rounded-full border bg-card p-1 pr-3 text-sm text-muted-foreground"
>
	<div class="w-max rounded-full bg-muted p-1 *:[svg]:size-4">
		{@render icon()}
	</div>
	<span>{key}: </span>
	<span class="overflow-hidden font-medium tracking-tight text-nowrap text-foreground">{value}</span
	>
</div>
