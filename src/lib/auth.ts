import { betterAuth } from 'better-auth';
import { db } from './server/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '$env/dynamic/private';
import { pointsPlugin } from './points-plugin';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	trustedOrigins(request) {
		const origin = request.headers.get('Origin');
		if (!origin) {
			return [];
		}
		return [origin];
	},
	plugins: [pointsPlugin()],
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	}
});
