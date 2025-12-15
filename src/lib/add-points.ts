import { eq } from 'drizzle-orm';
import { db } from './server/db';
import { user } from './server/db/auth';

export async function addPoints(userId: string, amount: number) {
	// 1. Get the current points of the user
	const points = (
		await db.query.user.findFirst({
			where: eq(user.id, userId)
		})
	)?.points;

	if (points === undefined) {
		throw new Error('User not found');
	}

	// 2. Add the specified amount to the current points
	const newPoints = points + amount;

	// 3. Update the user's points in the auth client
	db.update(user)
		.set({
			points: newPoints
		})
		.where(eq(user.id, userId));
}
