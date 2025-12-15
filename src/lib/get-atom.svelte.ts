import type { ReadableAtom } from 'better-auth/svelte';

export function getAtom<T>(atom: ReadableAtom<T>): () => T {
	let value = $state(atom.get());

	$effect(() => {
		const subscription = atom.subscribe((val) => {
			value = val;
		});

		return subscription;
	});

	return () => value;
}
