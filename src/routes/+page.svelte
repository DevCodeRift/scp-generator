<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import { factionStore, FACTIONS } from '$lib/stores/faction';

	const coreDocuments = [
		{
			id: 'scp',
			name: 'SCP Entry',
			description: 'Standard containment document with Object Class, procedures, and description',
			icon: '[ SCP ]'
		},
		{
			id: 'research',
			name: 'Research Report',
			description: 'Scientific findings, methodology, and conclusions',
			icon: '[ DOC ]'
		},
		{
			id: 'letter',
			name: 'Letter / Memo',
			description: 'Internal correspondence, notices, and formal letters',
			icon: '[ MSG ]'
		},
		{
			id: 'interview',
			name: 'Interview Log',
			description: 'Dialogue transcripts with proper formatting',
			icon: '[ LOG ]'
		}
	];

	const gmToolkitDocuments = [
		{
			id: 'personnel',
			name: 'Personnel File',
			description: 'Character sheets for staff, agents, and D-Class personnel',
			icon: '[ ID ]'
		},
		{
			id: 'incident',
			name: 'Incident Report',
			description: 'Document anomalous events, breaches, and security incidents',
			icon: '[ INC ]'
		},
		{
			id: 'mission',
			name: 'Mission Briefing',
			description: 'MTF operation briefings with objectives and team rosters',
			icon: '[ OPS ]'
		},
		{
			id: 'breach',
			name: 'Containment Breach',
			description: 'Emergency breach reports with severity and response protocols',
			icon: '[ !! ]'
		},
		{
			id: 'anomaly-card',
			name: 'Anomaly Card',
			description: 'Quick reference cards for SCP entries',
			icon: '[ QR ]'
		}
	];

	let currentFaction = $derived(FACTIONS.find(f => f.id === $factionStore));
</script>

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
		<div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="text-2xl font-terminal crt-glow text-[var(--color-accent)]">
					SCP://DOCGEN
				</div>
				<span class="text-xs text-[var(--color-text-muted)] hidden sm:inline">
					v1.0.0 // CLASSIFIED
				</span>
			</div>
			<FactionSelector />
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
		<!-- Welcome Section -->
		<div class="terminal-window mb-8">
			<div class="terminal-header flex items-center gap-2">
				<span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
				<span class="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
				<span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
				<span class="ml-2">TERMINAL // {currentFaction?.name.toUpperCase() || 'SCP FOUNDATION'}</span>
			</div>
			<div class="p-6">
				<div class="font-terminal text-xl mb-4 crt-glow">
					<span class="text-[var(--color-accent)]">&gt;</span> DOCUMENT GENERATION SYSTEM
				</div>
				<p class="text-[var(--color-text-muted)] mb-4">
					Generate authentic-looking documents for the <span class="text-[var(--color-accent)]">{currentFaction?.name || 'SCP Foundation'}</span>.
					Select a document type below to begin.
				</p>
				<div class="text-xs text-[var(--color-text-muted)] font-mono">
					STATUS: OPERATIONAL | CLEARANCE: LEVEL 4 | SESSION: ACTIVE
				</div>
			</div>
		</div>

		<!-- Core Documents Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> Core Documents
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each coreDocuments as docType}
					<a
						href="/editor/{docType.id}"
						class="terminal-window group hover:border-[var(--color-accent)] hover:border-glow transition-all block"
					>
						<div class="p-6">
							<div class="flex items-start gap-4">
								<div class="font-mono text-2xl text-[var(--color-accent)] group-hover:crt-glow">
									{docType.icon}
								</div>
								<div class="flex-1">
									<h3 class="text-lg font-bold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
										{docType.name}
									</h3>
									<p class="text-sm text-[var(--color-text-muted)]">
										{docType.description}
									</p>
								</div>
								<div class="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- GM Toolkit Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> GM Toolkit
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each gmToolkitDocuments as docType}
					<a
						href="/editor/{docType.id}"
						class="terminal-window group hover:border-[var(--color-accent)] hover:border-glow transition-all block"
					>
						<div class="p-4">
							<div class="flex items-start gap-3">
								<div class="font-mono text-xl text-[var(--color-accent)] group-hover:crt-glow">
									{docType.icon}
								</div>
								<div class="flex-1">
									<h3 class="font-bold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
										{docType.name}
									</h3>
									<p class="text-xs text-[var(--color-text-muted)]">
										{docType.description}
									</p>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Info Footer -->
		<div class="mt-8 text-center text-xs text-[var(--color-text-muted)]">
			<p>All generated documents are for creative/entertainment purposes only.</p>
			<p class="mt-1">SCP Foundation and related content is licensed under CC BY-SA 3.0.</p>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4">
		<div class="max-w-6xl mx-auto px-4 text-center text-xs text-[var(--color-text-muted)]">
			<span class="font-mono">SCP://DOCGEN</span> //
			Document formatting tool for the SCP creative writing community
		</div>
	</footer>
</div>
