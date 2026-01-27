<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import { factionStore, FACTIONS } from '$lib/stores/faction';

	// Personnel & Identity Documents - Most used for RP
	const personnelDocuments = [
		{
			id: 'id-badge',
			name: 'ID Badge',
			description: 'Personnel ID cards with clearance level, photo, and access zones',
			icon: '[ BADGE ]'
		},
		{
			id: 'personnel',
			name: 'Personnel File',
			description: 'Staff records with clearance levels, department, and background',
			icon: '[ ID ]'
		},
		{
			id: 'letter',
			name: 'Letter / Memo',
			description: 'Internal correspondence, notices, directives, and formal letters',
			icon: '[ MSG ]'
		},
		{
			id: 'directive',
			name: 'O5 Directive',
			description: 'High-level classified orders from the O5 Council',
			icon: '[ O5 ]'
		}
	];

	// SCP & Containment Documents
	const scpDocuments = [
		{
			id: 'scp',
			name: 'SCP Entry',
			description: 'Standard containment document with Object Class and procedures',
			icon: '[ SCP ]'
		},
		{
			id: 'anomaly-card',
			name: 'Anomaly Card',
			description: 'Quick reference cards for SCP entries',
			icon: '[ QR ]'
		},
		{
			id: 'breach',
			name: 'Containment Breach',
			description: 'Emergency breach reports with severity and response protocols',
			icon: '[ !! ]'
		}
	];

	// Operations & Reports
	const operationalDocuments = [
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
			id: 'research',
			name: 'Research Report',
			description: 'Scientific findings, methodology, and conclusions',
			icon: '[ DOC ]'
		},
		{
			id: 'exploration',
			name: 'Exploration Log',
			description: 'Field journal entries with waypoints and discoveries',
			icon: '[ EXP ]'
		}
	];

	// Logs & Transcripts
	const logDocuments = [
		{
			id: 'interview',
			name: 'Interview Log',
			description: 'Dialogue transcripts with proper formatting',
			icon: '[ LOG ]'
		},
		{
			id: 'avlog',
			name: 'Audio/Video Log',
			description: 'Surveillance transcripts with terminal aesthetics',
			icon: '[ A/V ]'
		},
		{
			id: 'autopsy',
			name: 'Autopsy Report',
			description: 'Medical examination reports with clinical styling',
			icon: '[ MED ]'
		},
		{
			id: 'newspaper',
			name: 'Newspaper Clipping',
			description: 'Cover story articles with vintage paper styling',
			icon: '[ NEWS ]'
		}
	];

	// Content Generators
	const generators = [
		{
			id: 'npc',
			name: 'NPC Generator',
			description: 'Generate random Foundation personnel and D-Class',
			icon: '[ NPC ]'
		},
		{
			id: 'scp',
			name: 'SCP Generator',
			description: 'Create random SCP anomaly concepts',
			icon: '[ RNG ]'
		},
		{
			id: 'artifact',
			name: 'Artifact Generator',
			description: 'Generate minor anomalous items',
			icon: '[ ART ]'
		},
		{
			id: 'event',
			name: 'Event Roller',
			description: 'Roll random anomalous events',
			icon: '[ EVT ]'
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

		<!-- Personnel & Identity Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> Personnel & Identity
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each personnelDocuments as docType}
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

		<!-- SCP & Containment Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> SCP & Containment
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each scpDocuments as docType}
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

		<!-- Operations & Reports Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> Operations & Reports
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each operationalDocuments as docType}
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

		<!-- Logs & Transcripts Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> Logs & Transcripts
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each logDocuments as docType}
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

		<!-- Content Generators Section -->
		<div class="mb-6">
			<h2 class="text-sm font-bold uppercase text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
				<span class="text-[var(--color-accent)]">&gt;</span> Content Generators
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each generators as gen}
					<a
						href="/generators/{gen.id}"
						class="terminal-window group hover:border-[var(--color-accent)] hover:border-glow transition-all block"
					>
						<div class="p-4">
							<div class="flex items-start gap-3">
								<div class="font-mono text-xl text-[var(--color-accent)] group-hover:crt-glow">
									{gen.icon}
								</div>
								<div class="flex-1">
									<h3 class="font-bold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
										{gen.name}
									</h3>
									<p class="text-xs text-[var(--color-text-muted)]">
										{gen.description}
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
