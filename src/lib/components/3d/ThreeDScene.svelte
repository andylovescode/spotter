<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Grid, OrbitControls, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	type Location = {
		id: string;
		name: string;
		latitude: number;
		longitude: number;
	};

	type UserLocation = {
		latitude: number;
		longitude: number;
	} | null;

	type Beacon = {
		id: string;
		name: string;
		position: [number, number, number];
		color: string;
		isUser: boolean;
	};

	// Props
	let {
		userLocation,
		pointsOfInterest
	}: { userLocation: UserLocation; pointsOfInterest: Location[] } = $props();

	// State
	let selectedBeacon = $state<Beacon | null>(null);
	let orbitControlsRef = $state<any>(null);
	let cameraRef = $state<THREE.PerspectiveCamera | null>(null);

	// Coordinate conversion - converts lat/lon to 3D space
	// Using a simple equirectangular projection
	const SCALE = 100000; // Scale factor to make distances visible

	function latLonToXZ(
		lat: number,
		lon: number,
		centerLat: number,
		centerLon: number
	): [number, number, number] {
		const x = (lon - centerLon) * SCALE * Math.cos((centerLat * Math.PI) / 180);
		const z = -(lat - centerLat) * SCALE;
		return [x, 0, z];
	}

	// Generate beacons from locations
	const beacons = $derived.by(() => {
		const result: Beacon[] = [];

		// Center point for coordinate conversion
		const centerLat = userLocation?.latitude ?? 0;
		const centerLon = userLocation?.longitude ?? 0;

		// Add user location beacon
		if (userLocation) {
			const [x, y, z] = latLonToXZ(
				userLocation.latitude,
				userLocation.longitude,
				centerLat,
				centerLon
			);
			result.push({
				id: 'user-location',
				name: 'Your Location',
				position: [x, y, z],
				color: '#00ff00',
				isUser: true
			});
		}

		// Add points of interest beacons
		const colors = [
			'#FF6B6B',
			'#4ECDC4',
			'#45B7D1',
			'#96CEB4',
			'#FFEAA7',
			'#DDA0DD',
			'#98D8C8',
			'#F7DC6F',
			'#BB8FCE',
			'#85C1E9',
			'#F8C471',
			'#82E0AA',
			'#F1948A',
			'#76D7C4',
			'#D7BDE2'
		];

		pointsOfInterest.forEach((poi, index) => {
			const [x, y, z] = latLonToXZ(poi.latitude, poi.longitude, centerLat, centerLon);
			result.push({
				id: poi.id,
				name: poi.name,
				position: [x, y, z],
				color: colors[index % colors.length],
				isUser: false
			});
		});

		return result;
	});

	// Initialize interactivity
	onMount(() => {
		interactivity();
	});

	// Update orbit controls target when beacon is selected
	$effect(() => {
		if (orbitControlsRef && selectedBeacon) {
			const [x, y, z] = selectedBeacon.position;
			orbitControlsRef.target.set(x, 0, z);
			orbitControlsRef.update();
		} else if (orbitControlsRef && userLocation && beacons.length > 0) {
			// Default to user location
			const userBeacon = beacons.find((b: Beacon) => b.isUser);
			if (userBeacon) {
				const [x, y, z] = userBeacon.position;
				orbitControlsRef.target.set(x, 0, z);
				orbitControlsRef.update();
			}
		}
	});

	// Handle beacon click
	function handleBeaconClick(beacon: Beacon) {
		selectedBeacon = beacon;
	}

	// Camera position based on selected beacon or user location
	const cameraPosition = $derived.by(() => {
		const target = selectedBeacon || beacons.find((b: Beacon) => b.isUser);
		if (target) {
			const [x, , z] = target.position;
			return [x + 50, 80, z + 50] as [number, number, number];
		}
		return [50, 80, 50] as [number, number, number];
	});
</script>

<!-- Camera -->
<T.PerspectiveCamera bind:ref={cameraRef} makeDefault position={cameraPosition} fov={75} />

<!-- Orbit Controls -->
<OrbitControls
	bind:ref={orbitControlsRef}
	enableDamping
	dampingFactor={0.05}
	autoRotate
	autoRotateSpeed={0.5}
	maxPolarAngle={Math.PI / 2.1}
	minDistance={20}
	maxDistance={500}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[100, 100, 50]} intensity={1} castShadow />
<T.HemisphereLight args={['#87CEEB', '#545454', 0.6]} />

<!-- Infinite Grid -->
<Grid
	position={[0, -0.01, 0]}
	cellColor="#6e6e6e"
	sectionColor="#9d4b4b"
	sectionSize={10}
	fadeDistance={400}
	cellSize={1}
	infiniteGrid={true}
/>

<!-- Ground plane for better visual context -->
<T.Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
	<T.CircleGeometry args={[500, 64]} />
	<T.MeshStandardMaterial color="#1a1a2e" opacity={0.3} transparent />
</T.Mesh>

<!-- Beacons -->
{#each beacons as beacon (beacon.id)}
	{@const [x, y, z] = beacon.position}
	{@const beaconHeight = 50}

	<!-- Beacon cylinder shooting upward -->
	<T.Group position={[x, 0, z]}>
		<!-- Main beacon beam -->
		<T.Mesh
			position={[0, beaconHeight / 2, 0]}
			onclick={() => handleBeaconClick(beacon)}
			onpointerenter={(e) => {
				if (e.object) e.object.scale.set(1.2, 1, 1.2);
			}}
			onpointerleave={(e) => {
				if (e.object) e.object.scale.set(1, 1, 1);
			}}
		>
			<T.CylinderGeometry args={[0.8, 0.8, beaconHeight, 8]} />
			<T.MeshStandardMaterial
				color={beacon.color}
				emissive={beacon.color}
				emissiveIntensity={0.5}
				transparent
				opacity={0.6}
			/>
		</T.Mesh>

		<!-- Base marker -->
		<T.Mesh position={[0, 0.5, 0]}>
			<T.CylinderGeometry args={[2, 2, 1, 16]} />
			<T.MeshStandardMaterial
				color={beacon.color}
				emissive={beacon.color}
				emissiveIntensity={0.3}
			/>
		</T.Mesh>

		<!-- Selection indicator -->
		{#if selectedBeacon?.id === beacon.id}
			<T.Mesh position={[0, 0.1, 0]}>
				<T.RingGeometry args={[3, 4, 32]} />
				<T.MeshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
			</T.Mesh>
		{/if}

		<!-- Pulsing light at the top -->
		<T.PointLight
			position={[0, beaconHeight, 0]}
			color={beacon.color}
			intensity={beacon.isUser ? 2 : 1}
			distance={30}
		/>
	</T.Group>
{/each}

<!-- Display selected beacon info (can be styled/positioned as needed) -->
{#if selectedBeacon}
	<!-- This could be enhanced with HTML overlay or 3D text -->
	<T.Group
		position={[
			selectedBeacon.position[0],
			selectedBeacon.position[2] + 60,
			selectedBeacon.position[2]
		]}
	>
		<!-- Placeholder for beacon info - you can add 3D text or use HTML overlay -->
	</T.Group>
{/if}
