import { query } from '$app/server';
import { db } from '$lib/server/db';
import { reviews, location, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getReviewsByLocation = query(async (locationId: string) => {
	// Fetch reviews with user information
	const reviewsData = await db
		.select({
			id: reviews.id,
			review: reviews.review,
			tag: reviews.tag,
			userId: reviews.userId,
			userName: user.name,
			userImage: user.image,
			createdAt: user.createdAt
		})
		.from(reviews)
		.leftJoin(user, eq(reviews.userId, user.id))
		.where(eq(reviews.locationId, locationId));

	return reviewsData;
});

export const getLocationDetails = query(async (locationId: string) => {
	const locationData = await db.query.location.findFirst({
		where: eq(location.id, locationId)
	});

	return locationData;
});

export const getLocationWithReviews = query(async (locationId: string) => {
	const locationData = await getLocationDetails(locationId);
	const reviewsData = await getReviewsByLocation(locationId);

	// Calculate vibe distribution
	const vibeCount: Record<string, number> = {};
	reviewsData.forEach((review) => {
		vibeCount[review.tag] = (vibeCount[review.tag] || 0) + 1;
	});

	// Get the most common vibe
	const vibes = Object.entries(vibeCount).sort((a, b) => b[1] - a[1]);
	const topVibe = vibes[0]?.[0] || 'Unknown';

	return {
		location: locationData,
		reviews: reviewsData,
		vibeCount,
		topVibe,
		totalReviews: reviewsData.length
	};
});
