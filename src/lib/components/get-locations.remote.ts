import { query } from '$app/server';
import { db } from '$lib/server/db';

export const getLocations = query(async () => {
	return await db.query.location.findMany({});
});
