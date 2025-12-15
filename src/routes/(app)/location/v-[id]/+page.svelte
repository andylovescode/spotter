<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { vibes } from '$lib/vibes';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	function findVibe(vibeId: string) {
		return vibes.find((v) => v.id === vibeId);
	}

	// Calculate percentage for each vibe
	const vibeStats = $derived(
		Object.entries(data.vibeCount)
			.map(([vibeId, count]) => {
				const vibe = findVibe(vibeId);
				return {
					id: vibeId,
					label: vibe?.label || vibeId,
					icon: vibe?.icon || '📍',
					count,
					percentage: data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0
				};
			})
			.sort((a, b) => b.count - a.count)
	);

	const topVibeData = $derived(findVibe(data.topVibe));
</script>

<div class="mx-auto max-w-[1600px] p-4 md:p-8 lg:p-12">
	{#if !data.location}
		<div class="px-8 py-16 text-center">
			<h1 class="mb-4 text-3xl font-semibold text-foreground">Location not found</h1>
			<p class="mb-6 text-lg text-muted-foreground">
				The location you're looking for doesn't exist.
			</p>
			<Button href="/">Go Home</Button>
		</div>
	{:else}
		<!-- Header Section -->
		<div
			class="mb-12 flex flex-col items-stretch justify-between gap-6 border-b-2 border-border pb-6 md:flex-row md:items-start"
		>
			<div>
				<h1 class="mb-2 text-3xl font-semibold text-foreground md:text-5xl">
					{data.location.name}
				</h1>
				<p class="text-sm text-muted-foreground">
					{data.location.latitude.toFixed(4)}, {data.location.longitude.toFixed(4)}
				</p>
			</div>
			<Button href="/location/i-{data.location.id}">Add Review</Button>
		</div>

		<!-- Vibes Overview Section -->
		<div class="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm md:p-10">
			<h2 class="mb-8 text-3xl font-semibold text-foreground">Vibes Overview</h2>

			{#if data.totalReviews === 0}
				<div class="py-12 text-center text-muted-foreground">
					<p class="text-lg">No reviews yet. Be the first to review this location!</p>
				</div>
			{:else}
				<div
					class="mb-10 flex items-center gap-6 rounded-xl bg-primary p-6 text-primary-foreground md:p-8"
				>
					<span class="text-5xl leading-none md:text-6xl">{topVibeData?.icon || '📍'}</span>
					<div>
						<h3 class="mb-1 text-2xl font-semibold md:text-3xl">
							{topVibeData?.label || data.topVibe}
						</h3>
						<p class="text-sm opacity-90 md:text-base">
							Primary Vibe • {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
						</p>
					</div>
				</div>

				<div class="flex flex-col gap-5">
					{#each vibeStats as vibe}
						<div
							class="grid grid-cols-[140px_1fr_100px] items-center gap-4 md:grid-cols-[200px_1fr_120px] md:gap-6"
						>
							<div class="flex items-center gap-3 font-medium text-foreground">
								<span class="text-2xl">{vibe.icon}</span>
								<span class="text-base md:text-lg">{vibe.label}</span>
							</div>
							<div class="h-8 overflow-hidden rounded-full bg-secondary">
								<div
									class="h-full rounded-full bg-primary transition-all duration-300"
									style="width: {vibe.percentage}%"
								></div>
							</div>
							<div class="text-right text-base font-medium text-foreground">
								{vibe.count}
								<span class="text-muted-foreground">({vibe.percentage.toFixed(0)}%)</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Reviews Section -->
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm md:p-10">
			<h2 class="mb-8 text-3xl font-semibold text-foreground">Reviews ({data.totalReviews})</h2>

			{#if data.reviews.length === 0}
				<div class="py-12 text-center text-muted-foreground">
					<p class="text-lg">No reviews yet.</p>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					{#each data.reviews as review (review.id)}
						{@const reviewVibe = findVibe(review.tag)}
						<div
							class="rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary hover:shadow-md"
						>
							<div class="mb-4 flex items-center justify-between gap-4">
								<div class="flex items-center gap-3">
									{#if review.userImage}
										<img
											src={review.userImage}
											alt={review.userName || 'User'}
											class="h-12 w-12 rounded-full object-cover"
										/>
									{:else}
										<div
											class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
										>
											{(review.userName || 'U').charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="text-lg font-semibold text-foreground"
										>{review.userName || 'Anonymous'}</span
									>
								</div>
								<div
									class="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground"
								>
									<span class="text-lg">{reviewVibe?.icon || '📍'}</span>
									<span class="font-medium">{reviewVibe?.label || review.tag}</span>
								</div>
							</div>
							<div class="leading-relaxed text-foreground">
								<p class="text-base">{review.review}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
