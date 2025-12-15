<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
	import { IconContext } from 'phosphor-svelte';
	import { page } from '$app/state';

	const {
		children,
		href
	}: {
		children: Snippet;
		href: string;
	} = $props();

	const isOnPage = $derived(page.url.href === new URL(href, page.url.href).href);
</script>

<a {href}>
	<SidebarMenuItem>
		<SidebarMenuButton>
			<IconContext
				values={{
					weight: isOnPage ? 'fill' : 'duotone'
				}}
			>
				{@render children()}
			</IconContext>
		</SidebarMenuButton>
	</SidebarMenuItem>
</a>
