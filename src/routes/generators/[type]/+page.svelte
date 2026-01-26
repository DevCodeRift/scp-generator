<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import NPCGenerator from '$lib/components/generators/NPCGenerator.svelte';
	import SCPGenerator from '$lib/components/generators/SCPGenerator.svelte';
	import ArtifactGenerator from '$lib/components/generators/ArtifactGenerator.svelte';
	import EventRoller from '$lib/components/generators/EventRoller.svelte';

	type GeneratorType = 'npc' | 'scp' | 'artifact' | 'event' | 'location' | 'breach' | 'facility';

	let generatorType = $derived($page.params.type as GeneratorType);

	const typeNames: Record<GeneratorType, string> = {
		npc: 'NPC Generator',
		scp: 'SCP Generator',
		artifact: 'Artifact Generator',
		event: 'Event Roller',
		location: 'Location Generator',
		breach: 'Breach Scenario',
		facility: 'Facility Map'
	};

	const typeDescriptions: Record<GeneratorType, string> = {
		npc: 'Generate random Foundation personnel, D-Class, or MTF operatives',
		scp: 'Create random SCP anomaly concepts with containment details',
		artifact: 'Generate minor anomalous items with effects',
		event: 'Roll random anomalous events and complications',
		location: 'Generate anomalous sites and dimensional spaces',
		breach: 'Build multi-phase containment breach scenarios',
		facility: 'Create procedural facility map layouts'
	};

	const validTypes: GeneratorType[] = ['npc', 'scp', 'artifact', 'event', 'location', 'breach', 'facility'];

	onMount(() => {
		if (!validTypes.includes(generatorType)) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>{typeNames[generatorType] || 'Generator'} | SCP Document Generator</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
		<div class="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-terminal crt-glow text-[var(--color-accent)] hover:opacity-80">
					SCP://DOCGEN
				</a>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">GENERATORS</span>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">{typeNames[generatorType]}</span>
			</div>

			<div class="flex items-center gap-3">
				<a href="/">
					<Button variant="ghost" size="sm">
						Back to Home
					</Button>
				</a>
				<FactionSelector />
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
		<!-- Generator Header -->
		<div class="terminal-window mb-6">
			<div class="terminal-header flex items-center justify-between">
				<span>{typeNames[generatorType]?.toUpperCase()}</span>
				<Badge variant="info">GENERATOR</Badge>
			</div>
			<div class="p-4">
				<p class="text-[var(--color-text-muted)]">
					{typeDescriptions[generatorType]}
				</p>
			</div>
		</div>

		<!-- Generator Content -->
		{#if generatorType === 'npc'}
			<NPCGenerator />
		{:else if generatorType === 'scp'}
			<SCPGenerator />
		{:else if generatorType === 'artifact'}
			<ArtifactGenerator />
		{:else if generatorType === 'event'}
			<EventRoller />
		{:else}
			<!-- Placeholder for other generators -->
			<div class="terminal-window">
				<div class="terminal-header">CONFIGURATION</div>
				<div class="p-8 text-center">
					<div class="text-6xl mb-4 opacity-30">🎲</div>
					<p class="text-[var(--color-text-muted)] mb-4">
						Generator coming soon...
					</p>
					<p class="text-sm text-[var(--color-text-muted)]">
						The {typeNames[generatorType]} is currently under development.
					</p>
				</div>
			</div>
		{/if}

		<!-- Quick Links -->
		<div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
			{#each validTypes.filter(t => t !== generatorType) as type}
				<a
					href="/generators/{type}"
					class="terminal-window p-3 text-center hover:border-[var(--color-accent)] transition-colors"
				>
					<div class="text-xs text-[var(--color-text-muted)]">{typeNames[type]}</div>
				</a>
			{/each}
		</div>
	</main>
</div>
