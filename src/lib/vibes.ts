export const vibes = [
	{ id: 'gaming', label: 'Gaming', icon: '🎮' },
	{ id: 'sports', label: 'Sports', icon: '⚽' },
	{ id: 'academic', label: 'Academic', icon: '🎓' },
	{ id: 'fitness', label: 'Fitness', icon: '🏋️' },
	{ id: 'food', label: 'Food', icon: '🍽️' },
	{ id: 'creativity', label: 'Creativity', icon: '🎨' },
	{ id: 'tech', label: 'Tech', icon: '💻' }
] as const;
export type VibeID = (typeof vibes)[number]['id'];
