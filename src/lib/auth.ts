import { betterAuth } from "better-auth";
import { db } from "./server/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "$env/dynamic/private";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite"
	}),
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	}
});
