<script lang="ts">
	import { InputGroup, InputGroupInput, InputGroupAddon } from './components/ui/input-group';
	import { Spinner } from './components/ui/spinner';
	import Search from 'phosphor-svelte/lib/MagnifyingGlass';
	import { searchForPlaces, type Place } from './osm-search';
	import { debounce } from './debounce.svelte';
	import { cn } from './utils';

	let query = $state('');
	const debounced = debounce([() => query], () => searchForPlaces(query), 150);

	let { location = $bindable<Place>() } = $props();
</script>

<div class="flex flex-col gap-0">
	<InputGroup>
		<InputGroupAddon>
			<Search />
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
						<li class={cn('w-full px-4 py-2', idx === 0 && 'bg-muted')}>
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
