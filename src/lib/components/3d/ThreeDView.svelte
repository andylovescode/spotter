<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { useGeolocation, useResizeObserver } from 'runed';
	import { onMount } from 'svelte';
	import ThreeDScene from './ThreeDScene.svelte';
	import { getLocations } from '../get-locations.remote';

	type Location = {
		id: string;
		name: string;
		latitude: number;
		longitude: number;
	};

	let canvasContainer = $state<HTMLDivElement>();
	let canvasSize = $state({ width: 0, height: 0 });

	// Get user's geolocation using runed
	const geolocation = useGeolocation({
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000
	});

	// Points of interest from database
	let pointsOfInterest = $state<Location[]>([]);

	// Observe container size to properly size canvas
	$effect(() => {
		if (canvasContainer) {
			const observer = useResizeObserver(
				() => canvasContainer,
				(entries) => {
					if (entries.length > 0) {
						canvasSize = {
							width: entries[0].contentRect.width,
							height: entries[0].contentRect.height
						};
					}
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
		geolocation.position && !geolocation.error && geolocation.position.coords
			? {
					latitude: geolocation.position.coords.latitude,
					longitude: geolocation.position.coords.longitude
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
