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

<div class="reviews-page">
	{#if !data.location}
		<div class="error-state">
			<h1>Location not found</h1>
			<p>The location you're looking for doesn't exist.</p>
			<Button href="/">Go Home</Button>
		</div>
	{:else}
		<!-- Header Section -->
		<div class="header">
			<div class="title-section">
				<h1>{data.location.name}</h1>
				<p class="coordinates">
					{data.location.latitude.toFixed(4)}, {data.location.longitude.toFixed(4)}
				</p>
			</div>
			<Button href="/location/i-{data.location.id}">Add Review</Button>
		</div>

		<!-- Vibes Overview Section -->
		<div class="vibes-section">
			<h2>Vibes Overview</h2>

			{#if data.totalReviews === 0}
				<div class="empty-vibes">
					<p>No reviews yet. Be the first to review this location!</p>
				</div>
			{:else}
				<div class="top-vibe">
					<span class="vibe-icon">{topVibeData?.icon || '📍'}</span>
					<div class="vibe-info">
						<h3>{topVibeData?.label || data.topVibe}</h3>
						<p>Primary Vibe • {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}</p>
					</div>
				</div>

				<div class="vibe-distribution">
					{#each vibeStats as vibe}
						<div class="vibe-stat">
							<div class="vibe-label">
								<span class="icon">{vibe.icon}</span>
								<span class="label">{vibe.label}</span>
							</div>
							<div class="vibe-bar-container">
								<div class="vibe-bar" style="width: {vibe.percentage}%"></div>
							</div>
							<div class="vibe-count">
								{vibe.count} ({vibe.percentage.toFixed(0)}%)
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Reviews Section -->
		<div class="reviews-section">
			<h2>Reviews ({data.totalReviews})</h2>

			{#if data.reviews.length === 0}
				<div class="empty-reviews">
					<p>No reviews yet.</p>
				</div>
			{:else}
				<div class="reviews-list">
					{#each data.reviews as review (review.id)}
						{@const reviewVibe = findVibe(review.tag)}
						<div class="review-card">
							<div class="review-header">
								<div class="user-info">
									{#if review.userImage}
										<img src={review.userImage} alt={review.userName || 'User'} class="avatar" />
									{:else}
										<div class="avatar-placeholder">
											{(review.userName || 'U').charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="user-name">{review.userName || 'Anonymous'}</span>
								</div>
								<div class="vibe-badge">
									<span class="vibe-icon">{reviewVibe?.icon || '📍'}</span>
									<span class="vibe-label">{reviewVibe?.label || review.tag}</span>
								</div>
							</div>
							<div class="review-content">
								<p>{review.review}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.reviews-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 32px;
	}

	.error-state {
		text-align: center;
		padding: 64px 32px;
	}

	.error-state h1 {
		font-size: 32px;
		font-weight: 600;
		margin-bottom: 16px;
		color: #333;
	}

	.error-state p {
		font-size: 18px;
		color: #666;
		margin-bottom: 24px;
	}

	/* Header */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		margin-bottom: 48px;
		padding-bottom: 24px;
		border-bottom: 2px solid #e0e0e0;
	}

	.title-section h1 {
		font-size: 40px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #333;
	}

	.coordinates {
		font-size: 14px;
		color: #999;
		margin: 0;
	}

	/* Vibes Section */
	.vibes-section {
		background: white;
		border-radius: 12px;
		padding: 32px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.vibes-section h2 {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 24px 0;
		color: #333;
	}

	.empty-vibes {
		text-align: center;
		padding: 32px;
		color: #999;
	}

	.top-vibe {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 24px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		margin-bottom: 32px;
		color: white;
	}

	.top-vibe .vibe-icon {
		font-size: 48px;
		line-height: 1;
	}

	.top-vibe .vibe-info h3 {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 4px 0;
	}

	.top-vibe .vibe-info p {
		margin: 0;
		opacity: 0.9;
		font-size: 14px;
	}

	.vibe-distribution {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.vibe-stat {
		display: grid;
		grid-template-columns: 150px 1fr 100px;
		gap: 16px;
		align-items: center;
	}

	.vibe-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 500;
		color: #333;
	}

	.vibe-label .icon {
		font-size: 20px;
	}

	.vibe-bar-container {
		height: 24px;
		background: #f0f0f0;
		border-radius: 12px;
		overflow: hidden;
	}

	.vibe-bar {
		height: 100%;
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		transition: width 0.3s ease;
	}

	.vibe-count {
		text-align: right;
		font-size: 14px;
		color: #666;
		font-weight: 500;
	}

	/* Reviews Section */
	.reviews-section {
		background: white;
		border-radius: 12px;
		padding: 32px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.reviews-section h2 {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 24px 0;
		color: #333;
	}

	.empty-reviews {
		text-align: center;
		padding: 32px;
		color: #999;
	}

	.reviews-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.review-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 20px;
		transition: all 0.2s;
	}

	.review-card:hover {
		border-color: #667eea;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
		font-size: 18px;
	}

	.user-name {
		font-weight: 500;
		color: #333;
	}

	.vibe-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		background: #f8f8f8;
		border-radius: 20px;
		font-size: 14px;
		color: #666;
	}

	.vibe-badge .vibe-icon {
		font-size: 16px;
	}

	.review-content {
		color: #555;
		line-height: 1.6;
	}

	.review-content p {
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.reviews-page {
			padding: 16px;
		}

		.header {
			flex-direction: column;
			align-items: stretch;
		}

		.title-section h1 {
			font-size: 28px;
		}

		.vibes-section,
		.reviews-section {
			padding: 20px;
		}

		.vibe-stat {
			grid-template-columns: 120px 1fr 80px;
			gap: 12px;
		}

		.vibe-label .label {
			font-size: 14px;
		}

		.top-vibe {
			padding: 16px;
		}

		.top-vibe .vibe-icon {
			font-size: 36px;
		}

		.top-vibe .vibe-info h3 {
			font-size: 20px;
		}
	}
</style>
