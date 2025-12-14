<script lang="ts">
	import { getLocations } from './query.remote';

	let locations = await getLocations();

	let userLocation = {
		latitude: 37,
		longitude: 70
	};

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
</script>

<div class="flex flex-col gap-8 p-32">
	<h1 class="text-4xl font-medium tracking-tighter">Locations</h1>
	<ul class="flex flex-col gap-4">
		{#each locations as loc}
			<li class="rounded-lg border bg-card p-6 shadow-sm">
				<h2 class="text-xl tracking-tight">{loc.name}</h2>
				<span class="text-sm text-muted-foreground"> {loc.description}</span>
				<span class="text-sm text-foreground"> Lat: {loc.latitude}, Long:{loc.longitude}</span>
				<span class="text-sm text-foreground"> City: {loc.city}</span>
				<span class="text-sm text-foreground">
					Distance from you: {getDistance(
						userLocation.latitude,
						userLocation.longitude,
						loc.latitude,
						loc.longitude
					)} km</span
				>
			</li>
		{/each}
	</ul>
</div>
