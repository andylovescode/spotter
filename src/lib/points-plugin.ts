import type { BetterAuthPlugin } from 'better-auth';

export const pointsPlugin = () =>
	({
		id: 'points_plugin',
		schema: {
			user: {
				fields: {
					points: {
						type: 'number',
						required: true,
						unique: false,
						defaultValue: 0
					}
				}
			}
		}
	}) satisfies BetterAuthPlugin;
