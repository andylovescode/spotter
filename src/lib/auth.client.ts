import { createAuthClient } from 'better-auth/svelte';
import { pointsClientPlugin } from './points-plugin-client';
export const authClient = createAuthClient({
	plugins: [pointsClientPlugin()]
});
