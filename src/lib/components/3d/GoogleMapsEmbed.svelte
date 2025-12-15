<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocations } from '../get-locations.remote';
	import Spinner from '../ui/spinner/spinner.svelte';
	import Button from '../ui/button/button.svelte';
	import { Eye } from 'phosphor-svelte';

	type Location = {
		id: string;
		name: string;
		latitude: number;
		longitude: number;
	};

	let pointsOfInterest = $state<Location[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let selectedLocation = $state<Location | null>(null);

	// Center coordinates for the map
	const centerCoords = $derived.by(() => {
		if (pointsOfInterest.length === 0) {
			return { lat: 0, lng: 0 };
		}
		const lat =
			pointsOfInterest.reduce((sum, loc) => sum + loc.latitude, 0) / pointsOfInterest.length;
		const lng =
			pointsOfInterest.reduce((sum, loc) => sum + loc.longitude, 0) / pointsOfInterest.length;
		return { lat, lng };
	});

	// Generate Google Maps URL with all markers
	const mapUrl = $derived.by(() => {
		if (selectedLocation) {
			// Show selected location
			return `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&output=embed`;
		}

		// Show all locations or center point
		if (pointsOfInterest.length === 0) {
			return 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1';
		}

		// For multiple locations, center on average and show appropriate zoom
		return `https://www.google.com/maps?q=${centerCoords.lat},${centerCoords.lng}&z=13&output=embed`;
	});

	// Fetch locations on mount
	onMount(async () => {
		try {
			isLoading = true;
			const locations = await getLocations();
			pointsOfInterest = locations;
			error = null;
		} catch (err) {
			console.error('Failed to fetch locations:', err);
			error = err instanceof Error ? err.message : 'Failed to load locations';
		} finally {
			isLoading = false;
		}
	});

	function handleLocationClick(location: Location) {
		selectedLocation = location;
	}

	function handleLocationNavigate(locationId: string) {
		window.location.href = `/location/v-${locationId}`;
	}
</script>

<div class="h-full">
	{#if isLoading}
		<div class="flex h-full w-full items-center justify-center">
			<Spinner />
		</div>
	{:else if error}
		<div>
			<p>⚠️ {error}</p>
		</div>
	{:else}
		<div class="flex h-full w-full flex-row">
			<!-- Map Section -->
			<div class="h-full w-full">
				<iframe
					src={mapUrl}
					width="100%"
					height="100%"
					style="border:0;"
					allowfullscreen=""
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Google Maps"
				></iframe>
			</div>

			<!-- Locations List Section -->
			<div class="flex h-full flex-col gap-4 p-8">
				<h2 class="text-2xl font-medium tracking-tight">Locations ({pointsOfInterest.length})</h2>

				<ul class="flex h-full w-sm flex-col gap-4">
					{#if pointsOfInterest.length === 0}
						<p>No locations found</p>
					{:else}
						{#each pointsOfInterest as location (location.id)}
							<div class="flex flex-row items-center justify-between">
								<h3 class="text-xl font-medium tracking-tight">{location.name}</h3>

								<a href="/location/v-{location.id}">
									<Button><Eye weight="duotone" /> View Reviews</Button>
								</a>
							</div>
						{/each}
					{/if}
				</ul>
			</div>
		</div>
	{/if}
</div>
