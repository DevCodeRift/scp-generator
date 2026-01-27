<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		generateNPC,
		generateNPCs,
		getRoleLabel,
		getClearanceLabel,
		defaultNPCConfig
	} from '$lib/generators/engines/npc-generator';
	import type { NPCRole, GeneratedNPC, GeneratedContent } from '$lib/generators/types';
	import { generateSeed } from '$lib/generators/core/random';

	// Configuration state
	let selectedRole = $state<NPCRole | 'random'>('random');
	let includeBackground = $state(true);
	let includeQuirks = $state(true);
	let generateCount = $state(1);

	// Generated results
	let results = $state<GeneratedContent<GeneratedNPC>[]>([]);
	let isGenerating = $state(false);

	const roleOptions = [
		{ value: 'random', label: 'Random Role' },
		{ value: 'researcher', label: 'Researcher' },
		{ value: 'mtf', label: 'MTF Operative' },
		{ value: 'security', label: 'Security Personnel' },
		{ value: 'd-class', label: 'D-Class Personnel' },
		{ value: 'administrative', label: 'Administrative Staff' },
		{ value: 'medical', label: 'Medical Staff' }
	];

	const countOptions = [
		{ value: '1', label: '1 NPC' },
		{ value: '3', label: '3 NPCs' },
		{ value: '5', label: '5 NPCs' },
		{ value: '10', label: '10 NPCs' }
	];

	function handleGenerate() {
		isGenerating = true;

		// Small delay for visual feedback
		setTimeout(() => {
			const config = {
				role: selectedRole === 'random' ? undefined : selectedRole as NPCRole,
				includeBackground,
				includeQuirks
			};

			const seed = generateSeed();

			if (generateCount === 1) {
				results = [generateNPC(config, seed)];
			} else {
				results = generateNPCs(generateCount, config, seed);
			}

			isGenerating = false;
		}, 100);
	}

	function handleClear() {
		results = [];
	}

	function getRoleBadgeVariant(role: NPCRole): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' {
		switch (role) {
			case 'researcher': return 'info';
			case 'mtf': return 'danger';
			case 'security': return 'warning';
			case 'd-class': return 'default';
			case 'administrative': return 'default';
			case 'medical': return 'success';
			default: return 'default';
		}
	}

	function getClearanceBadgeVariant(level: number): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' {
		if (level >= 4) return 'danger';
		if (level >= 3) return 'warning';
		if (level >= 2) return 'info';
		return 'default';
	}
</script>

<div class="npc-generator">
	<!-- Configuration Panel -->
	<div class="terminal-window mb-6">
		<div class="terminal-header">CONFIGURATION</div>
		<div class="p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Role"
					value={selectedRole}
					options={roleOptions}
					onchange={(v) => selectedRole = v as NPCRole | 'random'}
				/>
				<Select
					label="Count"
					value={String(generateCount)}
					options={countOptions}
					onchange={(v) => generateCount = parseInt(v)}
				/>
			</div>

			<div class="flex flex-wrap gap-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={includeBackground}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include Background</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={includeQuirks}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include Quirks</span>
				</label>
			</div>

			<div class="flex gap-2">
				<Button variant="primary" onclick={handleGenerate} disabled={isGenerating}>
					{isGenerating ? 'Generating...' : 'Generate NPC'}
				</Button>
				{#if results.length > 0}
					<Button variant="ghost" onclick={handleClear}>
						Clear Results
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Results -->
	{#if results.length > 0}
		<div class="space-y-4">
			{#each results as result, i}
				{@const npc = result.data}
				<div class="terminal-window">
					<div class="terminal-header flex items-center justify-between">
						<span>NPC #{i + 1}</span>
						<div class="flex gap-2">
							<Badge variant={getRoleBadgeVariant(npc.role)} size="sm">
								{getRoleLabel(npc.role)}
							</Badge>
							<Badge variant={getClearanceBadgeVariant(npc.clearanceLevel)} size="sm">
								Level {npc.clearanceLevel}
							</Badge>
						</div>
					</div>
					<div class="p-4">
						<!-- Main Info -->
						<div class="mb-4">
							<h3 class="text-xl font-bold text-[var(--color-accent)] mb-1">
								{npc.designation}
							</h3>
							{#if npc.name !== npc.designation}
								<p class="text-sm text-[var(--color-text-muted)]">
									Name: {npc.name}
								</p>
							{/if}
						</div>

						<!-- Details Grid -->
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
							<div>
								<span class="text-[var(--color-text-muted)]">Department:</span>
								<span class="ml-2">{npc.department}</span>
							</div>
							<div>
								<span class="text-[var(--color-text-muted)]">Site:</span>
								<span class="ml-2">{npc.site}</span>
							</div>
							<div>
								<span class="text-[var(--color-text-muted)]">Clearance:</span>
								<span class="ml-2">{getClearanceLabel(npc.clearanceLevel)}</span>
							</div>
						</div>

						<!-- Specializations -->
						{#if npc.specializations && npc.specializations.length > 0}
							<div class="mb-4">
								<span class="text-sm text-[var(--color-text-muted)]">Specializations:</span>
								<div class="flex flex-wrap gap-2 mt-1">
									{#each npc.specializations as spec}
										<Badge variant="info" size="sm">{spec}</Badge>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Background -->
						{#if npc.background}
							<div class="mb-4">
								<span class="text-sm text-[var(--color-text-muted)]">Background:</span>
								<p class="mt-1 text-sm">{npc.background}</p>
							</div>
						{/if}

						<!-- Quirks -->
						{#if npc.quirks && npc.quirks.length > 0}
							<div>
								<span class="text-sm text-[var(--color-text-muted)]">Quirks:</span>
								<ul class="mt-1 text-sm list-disc list-inside">
									{#each npc.quirks as quirk}
										<li>{quirk}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Seed (for reproduction) -->
						<div class="mt-4 pt-4 border-t border-[var(--color-border)]">
							<span class="text-xs text-[var(--color-text-muted)]">
								Seed: {result.seed}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="terminal-window">
			<div class="p-8 text-center">
				<div class="text-6xl mb-4 opacity-30">👤</div>
				<p class="text-[var(--color-text-muted)]">
					Configure options above and click "Generate NPC" to create random Foundation personnel.
				</p>
			</div>
		</div>
	{/if}
</div>
