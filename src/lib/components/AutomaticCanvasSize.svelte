<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';

	const threlte = useThrelte();

	useTask(() => {
		const size = threlte.canvas.getBoundingClientRect();

		threlte.renderer.setSize(size.width, size.height);
	});
</script>
