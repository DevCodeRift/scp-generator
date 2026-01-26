<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import { factionStore, FACTIONS } from '$lib/stores/faction';

	// All document types organized by category
	const categories = [
		{
			id: 'personnel',
			name: 'Personnel & Identity',
			description: 'ID cards, staff files, and personnel documents',
			color: '#3b82f6',
			items: [
				{ id: 'id-badge', name: 'ID Badge', description: 'Access cards with clearance levels' },
				{ id: 'personnel', name: 'Personnel File', description: 'Staff records and background' },
				{ id: 'letter', name: 'Letter / Memo', description: 'Internal correspondence' },
				{ id: 'directive', name: 'O5 Directive', description: 'High-level classified orders' }
			]
		},
		{
			id: 'containment',
			name: 'SCP & Containment',
			description: 'Anomaly documentation and breach reports',
			color: '#ef4444',
			items: [
				{ id: 'scp', name: 'SCP Entry', description: 'Standard containment documents' },
				{ id: 'anomaly-card', name: 'Anomaly Card', description: 'Quick reference cards' },
				{ id: 'breach', name: 'Containment Breach', description: 'Emergency breach reports' }
			]
		},
		{
			id: 'operations',
			name: 'Operations & Reports',
			description: 'Field operations and research documentation',
			color: '#f59e0b',
			items: [
				{ id: 'incident', name: 'Incident Report', description: 'Document anomalous events' },
				{ id: 'mission', name: 'Mission Briefing', description: 'MTF operation briefings' },
				{ id: 'research', name: 'Research Report', description: 'Scientific findings' },
				{ id: 'exploration', name: 'Exploration Log', description: 'Field journal entries' }
			]
		},
		{
			id: 'logs',
			name: 'Logs & Transcripts',
			description: 'Interviews, recordings, and media',
			color: '#10b981',
			items: [
				{ id: 'interview', name: 'Interview Log', description: 'Dialogue transcripts' },
				{ id: 'avlog', name: 'Audio/Video Log', description: 'Surveillance transcripts' },
				{ id: 'autopsy', name: 'Autopsy Report', description: 'Medical examination reports' },
				{ id: 'newspaper', name: 'Newspaper Clipping', description: 'Cover story articles' }
			]
		}
	];

	const generators = [
		{ id: 'npc', name: 'NPC Generator', description: 'Random personnel' },
		{ id: 'scp', name: 'SCP Generator', description: 'Anomaly concepts' },
		{ id: 'artifact', name: 'Artifact Generator', description: 'Anomalous items' },
		{ id: 'event', name: 'Event Roller', description: 'Random events' }
	];

	const tools = [
		{ href: '/templates', name: 'DAT Templates', description: 'Import & view Gmod .dat files' },
		{ href: '/video', name: 'Body Cam Processor', description: 'Add SCP effects to video clips' }
	];

	let currentFaction = $derived(FACTIONS.find(f => f.id === $factionStore));
	let activeCategory = $state<string | null>(null);
</script>

<div class="min-h-screen flex flex-col bg-[var(--color-background)]">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="text-2xl font-terminal crt-glow text-[var(--color-accent)]">
					SCP://DOCGEN
				</div>
				<div class="hidden md:flex items-center gap-2 text-xs text-[var(--color-text-muted)] border-l border-[var(--color-border)] pl-4">
					<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
					<span>SYSTEM ONLINE</span>
				</div>
			</div>
			<FactionSelector />
		</div>
	</header>

	<main class="flex-1">
		<div class="max-w-7xl mx-auto px-6 py-8">
			<!-- Quick Stats Bar -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-[var(--color-accent)]">15</div>
					<div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Document Types</div>
				</div>
				<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-[var(--color-accent)]">4</div>
					<div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Generators</div>
				</div>
				<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
					<div class="text-3xl font-bold text-[var(--color-accent)]">8</div>
					<div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Factions</div>
				</div>
				<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
					<div class="text-2xl font-bold text-[var(--color-text)]">{currentFaction?.shortName || 'SCP'}</div>
					<div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Active Faction</div>
				</div>
			</div>

			<div class="grid lg:grid-cols-[1fr_300px] gap-8">
				<!-- Main Document Categories -->
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-bold flex items-center gap-2">
							<span class="text-[var(--color-accent)]">//</span> Document Templates
						</h2>
						<span class="text-xs text-[var(--color-text-muted)]">Click to expand categories</span>
					</div>

					{#each categories as category}
						<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
							<!-- Category Header -->
							<button
								class="w-full p-4 flex items-center justify-between hover:bg-[var(--color-primary)] transition-colors text-left"
								onclick={() => activeCategory = activeCategory === category.id ? null : category.id}
							>
								<div class="flex items-center gap-4">
									<div
										class="w-1 h-12 rounded-full"
										style="background-color: {category.color}"
									></div>
									<div>
										<h3 class="font-bold text-lg">{category.name}</h3>
										<p class="text-sm text-[var(--color-text-muted)]">{category.description}</p>
									</div>
								</div>
								<div class="flex items-center gap-3">
									<span class="text-xs bg-[var(--color-primary)] px-2 py-1 rounded">
										{category.items.length} docs
									</span>
									<span class="text-[var(--color-text-muted)] text-xl transition-transform" class:rotate-180={activeCategory === category.id}>
										&#9662;
									</span>
								</div>
							</button>

							<!-- Category Items -->
							{#if activeCategory === category.id}
								<div class="border-t border-[var(--color-border)] bg-[var(--color-primary)]/50">
									<div class="grid sm:grid-cols-2 gap-2 p-4">
										{#each category.items as item}
											<a
												href="/editor/{item.id}"
												class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-accent)] transition-all group"
											>
												<div
													class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
													style="background-color: {category.color}"
												>
													{item.name.substring(0, 2).toUpperCase()}
												</div>
												<div class="min-w-0">
													<div class="font-bold group-hover:text-[var(--color-accent)] transition-colors truncate">
														{item.name}
													</div>
													<div class="text-xs text-[var(--color-text-muted)] truncate">
														{item.description}
													</div>
												</div>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Quick Access -->
					<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
						<h3 class="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
							<span class="text-[var(--color-accent)]">//</span> Quick Access
						</h3>
						<div class="space-y-2">
							<a href="/editor/id-badge" class="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-primary)] transition-colors group">
								<span class="text-[var(--color-accent)] font-mono text-sm">[01]</span>
								<span class="group-hover:text-[var(--color-accent)]">ID Badge</span>
							</a>
							<a href="/editor/personnel" class="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-primary)] transition-colors group">
								<span class="text-[var(--color-accent)] font-mono text-sm">[02]</span>
								<span class="group-hover:text-[var(--color-accent)]">Personnel File</span>
							</a>
							<a href="/editor/scp" class="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-primary)] transition-colors group">
								<span class="text-[var(--color-accent)] font-mono text-sm">[03]</span>
								<span class="group-hover:text-[var(--color-accent)]">SCP Entry</span>
							</a>
							<a href="/editor/letter" class="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-primary)] transition-colors group">
								<span class="text-[var(--color-accent)] font-mono text-sm">[04]</span>
								<span class="group-hover:text-[var(--color-accent)]">Letter / Memo</span>
							</a>
						</div>
					</div>

					<!-- Generators -->
					<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
						<h3 class="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
							<span class="text-[var(--color-accent)]">//</span> Generators
						</h3>
						<div class="space-y-2">
							{#each generators as gen}
								<a
									href="/generators/{gen.id}"
									class="flex items-center justify-between p-2 rounded hover:bg-[var(--color-primary)] transition-colors group"
								>
									<span class="group-hover:text-[var(--color-accent)]">{gen.name}</span>
									<span class="text-xs text-[var(--color-text-muted)]">{gen.description}</span>
								</a>
							{/each}
						</div>
					</div>

					<!-- Tools -->
					<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
						<h3 class="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
							<span class="text-[var(--color-accent)]">//</span> Tools
						</h3>
						<div class="space-y-2">
							{#each tools as tool}
								<a
									href={tool.href}
									class="flex items-center justify-between p-2 rounded hover:bg-[var(--color-primary)] transition-colors group"
								>
									<span class="group-hover:text-[var(--color-accent)]">{tool.name}</span>
									<span class="text-xs text-[var(--color-text-muted)]">{tool.description}</span>
								</a>
							{/each}
						</div>
					</div>

					<!-- Current Faction Info -->
					<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
						<h3 class="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
							<span class="text-[var(--color-accent)]">//</span> Active Faction
						</h3>
						<div class="text-center py-4">
							<div class="text-xl font-bold text-[var(--color-accent)] mb-1">
								{currentFaction?.name || 'SCP Foundation'}
							</div>
							<div class="text-sm text-[var(--color-text-muted)]">
								{currentFaction?.description || 'Secure. Contain. Protect.'}
							</div>
						</div>
					</div>

					<!-- Info -->
					<div class="text-xs text-[var(--color-text-muted)] text-center space-y-1">
						<p>All documents are for creative/RP purposes only.</p>
						<p>SCP content is licensed under CC BY-SA 3.0.</p>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-3">
		<div class="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
			<span class="font-mono">SCP://DOCGEN v1.0.0</span>
			<span>Document formatting tool for SCP roleplay</span>
		</div>
	</footer>
</div>

<style>
	.rotate-180 {
		transform: rotate(180deg);
	}
</style>
