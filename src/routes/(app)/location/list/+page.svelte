<script lang="ts">
	import InfoChip from '$lib/components/InfoChip.svelte';
	import { MapPin, Ruler } from 'phosphor-svelte';
	import { authClient } from '$lib/auth.client';
	import { getAtom } from '$lib/get-atom.svelte';
	import { useGeolocation } from 'runed';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	const session = getAtom(authClient.useSession());
	const currentLocation = useGeolocation();

	function getDistance(userLat: number, userLong: number, lat: number, long: number) {
		const toRad = (x: number) => (x * Math.PI) / 180;
		const earth_radius = 6371; // km
		const deltaLat = toRad(userLat - lat);
		const deltaLong = toRad(userLong - long);
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(toRad(lat)) *
				Math.cos(toRad(userLat)) *
				Math.sin(deltaLong / 2) *
				Math.sin(deltaLong / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earth_radius * c;
	}

	async function getAddress(lat: number, lon: number) {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
		const response = await fetch(url);
		if (!response.ok) {
			return 'unknown address';
		}
		const data = await response.json();
		console.log(data.display_name);
		return data.display_name;
	}
</script>

<div class="flex flex-col gap-8 p-32">
	<h1 class="text-4xl font-medium tracking-tighter">Review Locations</h1>
	<ul class="flex flex-col gap-4">
		{#each data.locations as loc}
			<a href="/location/i-{loc.id}">
				<li class="rounded-lg border bg-card p-6 shadow-sm hover:bg-muted">
					<div class="flex flex-row items-center gap-4">
						<h2 class="text-xl tracking-tight">{loc.name}</h2>
						{#if currentLocation && !currentLocation.error && Number.isFinite(currentLocation.position.coords.latitude) && Number.isFinite(currentLocation.position.coords.longitude)}
							<InfoChip
								value="{getDistance(
									currentLocation.position.coords.latitude,
									currentLocation.position.coords.longitude,
									loc.latitude,
									loc.longitude
								).toFixed(2)}km"
								key="Distance"
							>
								{#snippet icon()}
									<Ruler />
								{/snippet}
							</InfoChip>
							{#await getAddress(loc.latitude, loc.longitude) then address}
								<InfoChip value={address} key="Address">
									{#snippet icon()}
										<MapPin />
									{/snippet}
								</InfoChip>
							{/await}
						{/if}
					</div>
				</li>
			</a>
		{/each}
	</ul>
</div>
