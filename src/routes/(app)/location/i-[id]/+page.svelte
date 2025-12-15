<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldContent, FieldDescription, FieldSet } from '$lib/components/ui/field';
	import FieldTitle from '$lib/components/ui/field/field-title.svelte';
	import { InputGroup, InputGroupTextarea } from '$lib/components/ui/input-group';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { vibes, type VibeID } from '$lib/vibes';
	import type { PageServerData } from './$types';
	import { submitReview } from './submit-review.remote';

	const { data }: { data: PageServerData } = $props();

	let text = $state('');
	let vibe = $state<VibeID | undefined>();

	function findVibe(vibe: string) {
		return vibes.find((v) => v.id === vibe);
	}

	const vibeMeta = $derived(findVibe(vibe ?? ''));
	const triggerContent = $derived(
		vibeMeta ? `${vibeMeta.icon} ${vibeMeta.label}` : 'Select a vibe'
	);

	const canSubmit = $derived(text.trim() !== '' && vibe !== undefined);

	async function submit() {
		await submitReview({
			description: text,
			vibe,
			locationId: data.id
		});
		goto('/');
	}
</script>

<div class="flex flex-col gap-8 p-32">
	<h1 class="text-4xl font-medium tracking-tighter">Review {data.loc.name}</h1>

	<FieldSet>
		<Field>
			<FieldTitle>Description</FieldTitle>
			<FieldContent>
				<InputGroup>
					<InputGroupTextarea placeholder="This place is great if you like..." bind:value={text}
					></InputGroupTextarea>
				</InputGroup></FieldContent
			>
			<FieldDescription>What you think this place is like</FieldDescription>
		</Field>

		<Field>
			<FieldTitle>Vibes</FieldTitle>
			<FieldContent>
				<Select bind:value={vibe} type="single">
					<SelectTrigger class="min-w-2xs">
						{triggerContent}
					</SelectTrigger>
					<SelectContent>
						{#each vibes as vibe}
							<SelectItem value={vibe.id}>
								{vibe.icon}
								{vibe.label}
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</FieldContent>
			<FieldDescription
				>We need this so that people can understand what vibe this place has.</FieldDescription
			>
		</Field>
	</FieldSet>

	<Button disabled={!canSubmit} class="ml-auto" onclick={submit}>Submit</Button>
</div>
