import { command, form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { reviews } from '$lib/server/db/schema';
import { vibes } from '$lib/vibes';
import { error } from '@sveltejs/kit';
import { getRequest } from '@sveltejs/kit/node';
import * as v from 'valibot';

export const submitReview = command(
	v.object({
		locationId: v.string(),
		description: v.string(),
		vibe: v.union(vibes.map((vi) => v.literal(vi.id)))
	}),
	async (input) => {
		const session = await auth.api.getSession({ headers: getRequestEvent().request.headers });
		if (!session) error(401);

		await db.insert(reviews).values([
			{
				id: crypto.randomUUID(),
				locationId: input.locationId,
				review: input.description,
				tag: input.vibe,
				userId: session.user.id
			}
		]);
	}
);
