<script lang="ts">
	import { InputGroup, InputGroupInput, InputGroupAddon } from '$lib/components/ui/input-group';
	import { Spinner } from '$lib/components/ui/spinner';
	import Search from 'phosphor-svelte/lib/MagnifyingGlass';
	import { searchForPlaces, type Place } from '$lib/osm-search';
	import { debounce } from '$lib/debounce.svelte';
	import { cn } from '$lib/utils';
	import { MapPin } from 'phosphor-svelte';

	let query = $state('');
	const debounced = debounce([() => query], () => searchForPlaces(query), 300);

	let { location = $bindable<Place>() } = $props();
</script>

<div class="flex flex-col gap-0">
	<InputGroup>
		<InputGroupAddon>
			<MapPin />
		</InputGroupAddon>
		<InputGroupInput
			placeholder="Search..."
			bind:value={query}
			onkeydown={async (ev) => {
				if (ev.code === 'Enter') {
					const firstItem = (await debounced())[0];
					if (firstItem) {
						query = firstItem.display_name;
						location = firstItem;
					}
				}
			}}
		></InputGroupInput>

		<InputGroupAddon align="inline-end">
			{#await debounced()}
				<Spinner />
			{:then items}
				<span class="font-medium">{items.length}</span>
			{/await}
		</InputGroupAddon>
	</InputGroup>
	{#if location?.display_name !== query}
		{#await debounced() then items}
			<div class="align-end flex h-0 w-full">
				<ol class="z-50 mt-2 h-max max-w-2xs overflow-hidden rounded-sm border bg-card shadow-sm">
					{#each items as item, idx}
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<li
							class={cn('w-full cursor-pointer px-4 py-2 hover:bg-muted', idx === 0 && 'bg-muted')}
							onclick={() => {
								query = item.display_name;
								location = item;
							}}
						>
							<span class="w-full text-nowrap text-ellipsis">
								{item.display_name}
							</span>
						</li>
					{/each}
				</ol>
			</div>
		{/await}
	{/if}
</div>
