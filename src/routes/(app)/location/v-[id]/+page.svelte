<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { vibes } from '$lib/vibes';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	function findVibe(vibeId: string) {
		return vibes.find((v) => v.id === vibeId);
	}

	const topVibeData = $derived(findVibe(data.topVibe));
</script>

<div class="flex flex-col gap-8 p-32">
	{#if !data.location}
		<h1 class="text-3xl font-medium tracking-tighter">Location not found</h1>
		<p class="text-sm text-muted-foreground">The location you're looking for doesn't exist.</p>
		<a href="/"><Button>Go Home</Button></a>
	{:else}
		<h1 class="text-3xl font-medium tracking-tighter">{data.location.name}</h1>

		{#if topVibeData}
			<p class="text-muted-foreground">
				<span>Most users think that this has a</span>
				<span class="font-medium text-foreground">
					{topVibeData.icon}
					{topVibeData.label}
				</span>
				<span>vibe, based on {data.totalReviews} review{data.totalReviews === 1 ? '' : 's'}.</span>
			</p>
		{/if}

		{#if data.reviews && data.reviews.length > 0}
			<div class="flex flex-col gap-6">
				<h2 class="text-xl font-semibold tracking-tight">Recent Reviews</h2>
				<ul class="flex flex-col gap-4">
					{#each data.reviews as review (review.id)}
						<li
							class="flex flex-col gap-2 rounded-lg border border-border bg-background p-5 shadow-sm"
						>
							<div class="flex items-center gap-2 text-sm text-muted-foreground">
								{findVibe(review.tag)?.icon ?? '📍'}
								{findVibe(review.tag)?.label ?? review.tag}
							</div>
							{#if review.review}
								<p class="text-base text-foreground">{review.review}</p>
							{/if}
							<div class="mt-1 flex items-center gap-2">
								<span class="text-xs text-muted-foreground">
									by {review.userName ?? 'Anonymous'}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="text-muted-foreground italic">No reviews yet. Be the first to leave one!</div>
		{/if}
	{/if}
</div>
