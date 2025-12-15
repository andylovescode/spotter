import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { location, reviews, user } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	// Fetch location details
	const locationData = await db.query.location.findFirst({
		where: eq(location.id, params.id)
	});

	if (!locationData) {
		return {
			location: null,
			reviews: [],
			vibeCount: {},
			topVibe: 'Unknown',
			totalReviews: 0
		};
	}

	// Fetch reviews with user information
	const reviewsData = await db
		.select({
			id: reviews.id,
			review: reviews.review,
			tag: reviews.tag,
			userId: reviews.userId,
			userName: user.name,
			userImage: user.image
		})
		.from(reviews)
		.leftJoin(user, eq(reviews.userId, user.id))
		.where(eq(reviews.locationId, params.id));

	// Calculate vibe distribution
	const vibeCount: Record<string, number> = {};
	reviewsData.forEach((review) => {
		vibeCount[review.tag] = (vibeCount[review.tag] || 0) + 1;
	});

	// Get the most common vibes sorted by count
	const vibes = Object.entries(vibeCount).sort((a, b) => b[1] - a[1]);
	const topVibe = vibes[0]?.[0] || 'Unknown';

	return {
		location: locationData,
		reviews: reviewsData,
		vibeCount,
		topVibe,
		totalReviews: reviewsData.length
	};
};
