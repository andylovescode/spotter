<script lang="ts">
	import SidebarLink from '$lib/components/SidebarLink.svelte';
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroupLabel,
		SidebarInset,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarProvider
	} from '$lib/components/ui/sidebar';
	import SidebarGroupContent from '$lib/components/ui/sidebar/sidebar-group-content.svelte';
	import SidebarGroup from '$lib/components/ui/sidebar/sidebar-group.svelte';
	import { Chat, Coin, House, MapPinPlus, SignIn, SignOut, Sparkle } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';
	import { authClient } from '$lib/auth.client';
	import { getAtom } from '$lib/get-atom.svelte';
	import InfoChip from '$lib/components/InfoChip.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	const { children }: { children: Snippet } = $props();
	const session = getAtom(authClient.useSession());
	async function signOut() {
		await authClient.signOut();
		window.location.href = '/';
	}
</script>

<SidebarProvider>
	<Sidebar variant="inset">
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Quick Links</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarLink href="/">
						<House />
						Home
					</SidebarLink>
					<SidebarLink href="/location/create">
						<MapPinPlus />
						Add Location
					</SidebarLink>
					<SidebarLink href="/location/list">
						<Chat />
						Review Locations
					</SidebarLink>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<SidebarMenuItem>
				{#if session().data?.user}
					<SidebarMenuButton class="h-max">
						<DropdownMenu onclick={signOut}>
							<DropdownMenuTrigger class="w-full">
								<div class="flex w-full flex-row items-center justify-between gap-3">
									<div class="flex flex-row items-center gap-2">
										<img
											src={session().data?.user.image}
											alt="User Avatar"
											class="size-5 rounded-full"
										/>
										<span class="w-full overflow-hidden font-medium text-nowrap"
											>{session().data?.user.name}</span
										>
									</div>
									<InfoChip key="Points" value={session().data?.user.points.toString() ?? ''}>
										{#snippet icon()}
											<Coin />
										{/snippet}
									</InfoChip>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onclick={signOut}>
									<SignOut weight="duotone" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuButton>
				{:else}
					<SidebarMenuButton onclick={() => (window.location.href = '/login')}>
						<SignIn weight="duotone" />
						Sign In
					</SidebarMenuButton>
				{/if}
			</SidebarMenuItem>
		</SidebarFooter>
	</Sidebar>
	<SidebarInset class="relative">
		{@render children()}
	</SidebarInset>
</SidebarProvider>
