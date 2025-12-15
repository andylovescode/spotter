import type { BetterAuthClientPlugin } from 'better-auth';
import type { pointsPlugin } from './points-plugin';

type PointsPlugin = typeof pointsPlugin;

export const pointsClientPlugin = () => {
	return {
		id: 'points_plugin',
		$InferServerPlugin: {} as ReturnType<PointsPlugin>
	} satisfies BetterAuthClientPlugin;
};
