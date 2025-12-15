import { command } from '$app/server';
import { db } from '$lib/server/db';
import { location } from '$lib/server/db/schema';
import * as v from 'valibot';

export const addLocation = command(
	v.object({
		name: v.string(),
		lat: v.number(),
		long: v.number()
	}),
	async (props: { name: string; lat: number; long: number }) => {
		await db.insert(location).values([
			{
				id: crypto.randomUUID(),
				latitude: props.lat,
				longitude: props.long,
				name: props.name
			}
		]);
	}
);
