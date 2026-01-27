<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		generateArtifact,
		generateArtifacts,
		defaultArtifactConfig
	} from '$lib/generators/engines/artifact-generator';
	import type { GeneratedArtifact, GeneratedContent } from '$lib/generators/types';
	import { generateSeed } from '$lib/generators/core/random';

	// Configuration state
	let includeDrawbacks = $state(true);
	let generateCount = $state(1);

	// Generated results
	let results = $state<GeneratedContent<GeneratedArtifact>[]>([]);
	let isGenerating = $state(false);

	const countOptions = [
		{ value: '1', label: '1 Artifact' },
		{ value: '3', label: '3 Artifacts' },
		{ value: '5', label: '5 Artifacts' },
		{ value: '10', label: '10 Artifacts' }
	];

	function handleGenerate() {
		isGenerating = true;

		setTimeout(() => {
			const config = {
				includeDrawbacks
			};

			const seed = generateSeed();

			if (generateCount === 1) {
				results = [generateArtifact(config, seed)];
			} else {
				results = generateArtifacts(generateCount, config, seed);
			}

			isGenerating = false;
		}, 100);
	}

	function handleClear() {
		results = [];
	}
</script>

<div class="artifact-generator">
	<!-- Configuration Panel -->
	<div class="terminal-window mb-6">
		<div class="terminal-header">CONFIGURATION</div>
		<div class="p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Count"
					value={String(generateCount)}
					options={countOptions}
					onchange={(v) => generateCount = parseInt(v)}
				/>
				<div class="flex items-end pb-1">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={includeDrawbacks}
							class="w-4 h-4 accent-[var(--color-accent)]"
						/>
						<span class="text-sm">Include Drawbacks</span>
					</label>
				</div>
			</div>

			<div class="flex gap-2">
				<Button variant="primary" onclick={handleGenerate} disabled={isGenerating}>
					{isGenerating ? 'Generating...' : 'Generate Artifact'}
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
				{@const artifact = result.data}
				<div class="terminal-window">
					<div class="terminal-header flex items-center justify-between">
						<span>ARTIFACT #{i + 1}</span>
						<Badge variant="accent" size="sm">ANOMALOUS</Badge>
					</div>
					<div class="p-4">
						<!-- Name and Form -->
						<div class="mb-4">
							<h3 class="text-xl font-bold text-[var(--color-accent)] mb-1">
								{artifact.name}
							</h3>
							<p class="text-sm text-[var(--color-text-muted)]">
								A {artifact.material} {artifact.form}
							</p>
						</div>

						<!-- Primary Effect -->
						<div class="mb-4">
							<span class="text-sm font-bold text-[var(--color-text-muted)]">Effect:</span>
							<p class="mt-1 text-sm bg-[var(--color-primary)] p-3 border border-[var(--color-border)]">
								This artifact {artifact.primaryEffect}.
							</p>
						</div>

						<!-- Activation -->
						<div class="mb-4">
							<span class="text-sm font-bold text-[var(--color-text-muted)]">Activation:</span>
							<p class="mt-1 text-sm">
								Activates {artifact.activation}.
							</p>
						</div>

						<!-- Drawback -->
						{#if artifact.drawback}
							<div class="mb-4">
								<span class="text-sm font-bold text-[var(--color-warning)]">Drawback:</span>
								<p class="mt-1 text-sm text-[var(--color-warning)]">
									{artifact.drawback.charAt(0).toUpperCase() + artifact.drawback.slice(1)}.
								</p>
							</div>
						{/if}

						<!-- Origin -->
						{#if artifact.origin}
							<div class="mb-4">
								<span class="text-sm font-bold text-[var(--color-text-muted)]">Origin:</span>
								<p class="mt-1 text-sm text-[var(--color-text-muted)]">
									{artifact.origin.charAt(0).toUpperCase() + artifact.origin.slice(1)}.
								</p>
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
				<div class="text-6xl mb-4 opacity-30">[ ART ]</div>
				<p class="text-[var(--color-text-muted)]">
					Configure options above and click "Generate Artifact" to create random anomalous items.
				</p>
			</div>
		</div>
	{/if}
</div>
