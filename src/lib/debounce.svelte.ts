export function debounce<T>(deps: (() => unknown)[], value: () => T, dur: number): () => T {
	let internalValue = $state(value());
	let timeout = 0;

	$effect(() => {
		for (const dep of deps) {
			dep();
		}

		clearTimeout(timeout);

		timeout = setTimeout(() => {
			internalValue = value();
		}, dur) as unknown as number;
	});

	return () => internalValue;
}
