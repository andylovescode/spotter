<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		FieldSet,
		Field,
		FieldTitle,
		FieldContent,
		FieldDescription,
		FieldError
	} from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import type { Place } from '$lib/osm-search';
	import { addLocation } from './add.remote';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth.client';

	let place = $state<Place | undefined>();
	let name = $state('');

	const valid = $derived(place !== undefined && !!name);

	async function submit(place: Place) {
		if (!place) return;
		console.log(place);
		console.log(place.lon, Number.parseFloat(place.lon));
		await addLocation({
			name,
			lat: Number.parseFloat(place.lat),
			long: Number.parseFloat(place.lon)
		});
		await goto('/location/list');
	}

	const session = authClient.useSession();
</script>

<div class="flex flex-col gap-8 p-32">
	<h1 class="text-4xl font-medium tracking-tighter">Add a location</h1>
	{#if $session.data}
		<FieldSet class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Field>
				<FieldTitle>Name</FieldTitle>
				<FieldContent>
					<Input placeholder="Franks Place" bind:value={name} />
				</FieldContent>
				<FieldDescription>The name of the spot</FieldDescription>
			</Field>
			<Field>
				<FieldTitle>Location</FieldTitle>
				<FieldContent>
					<LocationInput bind:location={place} />
				</FieldContent>
				<FieldDescription>The location of the spot</FieldDescription>
				{#if !place}
					<FieldError>The location is required.</FieldError>
				{/if}
			</Field>
		</FieldSet>

		<Button class="w-max" onclick={() => submit(place!)} disabled={!valid}>Submit</Button>
	{:else}
		<p>
			You cannot access this page until you <a href="/login" class="font-bold underline">sign in</a>
		</p>
	{/if}
</div>
