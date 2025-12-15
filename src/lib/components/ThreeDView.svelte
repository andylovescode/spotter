<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { useGeolocation, useResizeObserver } from 'runed';
	import { onMount } from 'svelte';
	import ThreeDScene from './ThreeDScene.svelte';
	import { getLocations } from './get-locations.remote';

	type Location = {
		id: string;
		name: string;
		latitude: number;
		longitude: number;
	};

	let canvasContainer = $state<HTMLDivElement>();
	let canvasSize = $state({ width: 0, height: 0 });

	// Get user's geolocation
	const geolocation = useGeolocation({
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000
	});

	// Points of interest from database
	let pointsOfInterest = $state<Location[]>([]);

	// Observe container size
	$effect(() => {
		if (canvasContainer) {
			const observer = useResizeObserver(
				() => canvasContainer,
				(entry) => {
					canvasSize = {
						width: entry.contentRect.width,
						height: entry.contentRect.height
					};
				}
			);

			return () => {
				observer.stop();
			};
		}
	});

	// Fetch locations on mount
	onMount(async () => {
		try {
			const locations = await getLocations();
			pointsOfInterest = locations;
		} catch (error) {
			console.error('Failed to fetch locations:', error);
		}
	});

	// Get current coordinates or default to null
	const currentCoords = $derived(
		geolocation.coords.current
			? {
					latitude: geolocation.coords.current.latitude,
					longitude: geolocation.coords.current.longitude
				}
			: null
	);
</script>

<div bind:this={canvasContainer} class="three-d-view">
	{#if canvasSize.width > 0 && canvasSize.height > 0}
		<Canvas size={canvasSize}>
			<ThreeDScene userLocation={currentCoords} {pointsOfInterest} />
		</Canvas>
	{/if}
</div>

<style>
	.three-d-view {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

</style>