import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { location } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const locs = await db.query.location.findFirst({ where: eq(location.id, params.id) });
	return {
		loc: locs,
		id: params.id
	};
};
