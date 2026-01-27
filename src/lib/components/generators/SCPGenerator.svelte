<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		generateSCP,
		generateSCPs,
		getObjectClassLabel,
		getCategoryLabel,
		defaultSCPConfig
	} from '$lib/generators/engines/scp-generator';
	import type { ObjectClass, AnomalyCategory, GeneratedSCP, GeneratedContent } from '$lib/generators/types';
	import { generateSeed } from '$lib/generators/core/random';

	// Configuration state
	let selectedObjectClass = $state<ObjectClass | 'random'>('random');
	let selectedCategory = $state<AnomalyCategory | 'random'>('random');
	let complexity = $state<'minimal' | 'standard' | 'detailed'>('standard');
	let includeSecondaryEffects = $state(true);
	let includeOrigin = $state(true);
	let includeSpecialRequirements = $state(true);
	let generateCount = $state(1);

	// Generated results
	let results = $state<GeneratedContent<GeneratedSCP>[]>([]);
	let isGenerating = $state(false);

	const objectClassOptions = [
		{ value: 'random', label: 'Random Class' },
		{ value: 'Safe', label: 'Safe' },
		{ value: 'Euclid', label: 'Euclid' },
		{ value: 'Keter', label: 'Keter' },
		{ value: 'Thaumiel', label: 'Thaumiel' },
		{ value: 'Apollyon', label: 'Apollyon' },
		{ value: 'Archon', label: 'Archon' },
		{ value: 'Neutralized', label: 'Neutralized' }
	];

	const categoryOptions = [
		{ value: 'random', label: 'Random Category' },
		{ value: 'Biological', label: 'Biological' },
		{ value: 'Mechanical', label: 'Mechanical' },
		{ value: 'Spatial', label: 'Spatial' },
		{ value: 'Temporal', label: 'Temporal' },
		{ value: 'Memetic', label: 'Memetic' },
		{ value: 'Cognitohazardous', label: 'Cognitohazardous' },
		{ value: 'Infohazardous', label: 'Infohazardous' },
		{ value: 'Reality-Bending', label: 'Reality-Bending' },
		{ value: 'Extradimensional', label: 'Extradimensional' },
		{ value: 'Spectral', label: 'Spectral' },
		{ value: 'Technological', label: 'Technological' },
		{ value: 'Organic', label: 'Organic' },
		{ value: 'Mineral', label: 'Mineral' },
		{ value: 'Aquatic', label: 'Aquatic' },
		{ value: 'Atmospheric', label: 'Atmospheric' }
	];

	const complexityOptions = [
		{ value: 'minimal', label: 'Minimal' },
		{ value: 'standard', label: 'Standard' },
		{ value: 'detailed', label: 'Detailed' }
	];

	const countOptions = [
		{ value: '1', label: '1 SCP' },
		{ value: '3', label: '3 SCPs' },
		{ value: '5', label: '5 SCPs' }
	];

	function handleGenerate() {
		isGenerating = true;

		// Small delay for visual feedback
		setTimeout(() => {
			const config = {
				objectClass: selectedObjectClass === 'random' ? undefined : selectedObjectClass as ObjectClass,
				category: selectedCategory === 'random' ? undefined : selectedCategory as AnomalyCategory,
				complexity,
				includeSecondaryEffects,
				includeOrigin,
				includeSpecialRequirements
			};

			const seed = generateSeed();

			if (generateCount === 1) {
				results = [generateSCP(config, seed)];
			} else {
				results = generateSCPs(generateCount, config, seed);
			}

			isGenerating = false;
		}, 100);
	}

	function handleClear() {
		results = [];
	}

	function getObjectClassBadgeVariant(objectClass: ObjectClass): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' {
		switch (objectClass) {
			case 'Safe': return 'success';
			case 'Euclid': return 'warning';
			case 'Keter': return 'danger';
			case 'Thaumiel': return 'info';
			case 'Apollyon': return 'danger';
			case 'Archon': return 'accent';
			case 'Neutralized': return 'default';
			default: return 'default';
		}
	}

	function getRiskBadgeVariant(risk: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' {
		switch (risk) {
			case 'Notice': return 'default';
			case 'Caution': return 'info';
			case 'Warning': return 'warning';
			case 'Danger': return 'danger';
			case 'Critical': return 'danger';
			default: return 'default';
		}
	}
</script>

<div class="scp-generator">
	<!-- Configuration Panel -->
	<div class="terminal-window mb-6">
		<div class="terminal-header">CONFIGURATION</div>
		<div class="p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Object Class"
					value={selectedObjectClass}
					options={objectClassOptions}
					onchange={(v) => selectedObjectClass = v as ObjectClass | 'random'}
				/>
				<Select
					label="Anomaly Category"
					value={selectedCategory}
					options={categoryOptions}
					onchange={(v) => selectedCategory = v as AnomalyCategory | 'random'}
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Detail Level"
					value={complexity}
					options={complexityOptions}
					onchange={(v) => complexity = v as 'minimal' | 'standard' | 'detailed'}
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
						bind:checked={includeSecondaryEffects}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Secondary Effects</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={includeOrigin}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include Origin</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={includeSpecialRequirements}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Special Requirements</span>
				</label>
			</div>

			<div class="flex gap-2">
				<Button variant="primary" onclick={handleGenerate} disabled={isGenerating}>
					{isGenerating ? 'Generating...' : 'Generate SCP'}
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
				{@const scp = result.data}
				<div class="terminal-window">
					<div class="terminal-header flex items-center justify-between">
						<span class="text-[var(--color-accent)] font-bold">{scp.itemNumber}</span>
						<div class="flex gap-2">
							<Badge variant={getObjectClassBadgeVariant(scp.objectClass)} size="sm">
								{scp.objectClass}
							</Badge>
							<Badge variant="info" size="sm">
								{scp.category}
							</Badge>
						</div>
					</div>
					<div class="p-4">
						<!-- Classification Grid -->
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
							<div>
								<span class="text-[var(--color-text-muted)]">Object Class:</span>
								<span class="ml-2 font-bold">{scp.objectClass}</span>
							</div>
							<div>
								<span class="text-[var(--color-text-muted)]">Disruption:</span>
								<span class="ml-2">{scp.disruptionClass}</span>
							</div>
							<div>
								<span class="text-[var(--color-text-muted)]">Risk:</span>
								<Badge variant={getRiskBadgeVariant(scp.riskClass)} size="sm">
									{scp.riskClass}
								</Badge>
							</div>
							<div>
								<span class="text-[var(--color-text-muted)]">Site:</span>
								<span class="ml-2">{scp.containmentSite}</span>
							</div>
						</div>

						<!-- Containment Procedures -->
						<div class="mb-4">
							<h4 class="text-sm font-bold text-[var(--color-accent)] mb-2">
								SPECIAL CONTAINMENT PROCEDURES:
							</h4>
							<div class="text-sm space-y-2 bg-[var(--color-primary)] p-3 border border-[var(--color-border)]">
								{#each scp.containmentProcedures as procedure}
									<p>{procedure}</p>
								{/each}
							</div>
						</div>

						<!-- Description -->
						<div class="mb-4">
							<h4 class="text-sm font-bold text-[var(--color-accent)] mb-2">
								DESCRIPTION:
							</h4>
							<div class="text-sm bg-[var(--color-primary)] p-3 border border-[var(--color-border)]">
								<p>{scp.description}</p>
							</div>
						</div>

						<!-- Additional Notes -->
						{#if scp.additionalNotes && scp.additionalNotes.length > 0}
							<div class="mb-4">
								<h4 class="text-sm font-bold text-[var(--color-accent)] mb-2">
									ADDITIONAL NOTES:
								</h4>
								<ul class="text-sm list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
									{#each scp.additionalNotes as note}
										<li>{note}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Seed -->
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
				<div class="text-6xl mb-4 opacity-30">[ SCP ]</div>
				<p class="text-[var(--color-text-muted)]">
					Configure options above and click "Generate SCP" to create random anomaly concepts.
				</p>
			</div>
		</div>
	{/if}
</div>
