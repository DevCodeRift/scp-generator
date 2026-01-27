<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		generateEvent,
		generateEvents,
		getSeverityLabel,
		defaultEventConfig
	} from '$lib/generators/engines/event-roller';
	import type { GeneratedEvent, GeneratedContent, EventSeverity } from '$lib/generators/types';
	import { generateSeed } from '$lib/generators/core/random';

	// Configuration state
	let selectedSeverity = $state<EventSeverity | 'random'>('random');
	let generateCount = $state(1);

	// Generated results
	let results = $state<GeneratedContent<GeneratedEvent>[]>([]);
	let isGenerating = $state(false);

	const severityOptions = [
		{ value: 'random', label: 'Random Severity' },
		{ value: 'minor', label: 'Minor' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'major', label: 'Major' },
		{ value: 'critical', label: 'Critical' }
	];

	const countOptions = [
		{ value: '1', label: '1 Event' },
		{ value: '3', label: '3 Events' },
		{ value: '5', label: '5 Events' }
	];

	function handleGenerate() {
		isGenerating = true;

		setTimeout(() => {
			const config = {
				severity: selectedSeverity === 'random' ? undefined : selectedSeverity as EventSeverity
			};

			const seed = generateSeed();

			if (generateCount === 1) {
				results = [generateEvent(config, seed)];
			} else {
				results = generateEvents(generateCount, config, seed);
			}

			isGenerating = false;
		}, 100);
	}

	function handleClear() {
		results = [];
	}

	function getSeverityBadgeVariant(severity: EventSeverity): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' {
		switch (severity) {
			case 'minor': return 'info';
			case 'moderate': return 'warning';
			case 'major': return 'danger';
			case 'critical': return 'danger';
			default: return 'default';
		}
	}
</script>

<div class="event-roller">
	<!-- Configuration Panel -->
	<div class="terminal-window mb-6">
		<div class="terminal-header">CONFIGURATION</div>
		<div class="p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Severity"
					value={selectedSeverity}
					options={severityOptions}
					onchange={(v) => selectedSeverity = v as EventSeverity | 'random'}
				/>
				<Select
					label="Count"
					value={String(generateCount)}
					options={countOptions}
					onchange={(v) => generateCount = parseInt(v)}
				/>
			</div>

			<div class="flex gap-2">
				<Button variant="primary" onclick={handleGenerate} disabled={isGenerating}>
					{isGenerating ? 'Rolling...' : 'Roll Event'}
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
				{@const event = result.data}
				<div class="terminal-window {event.severity === 'critical' ? 'border-red-500' : ''}">
					<div class="terminal-header flex items-center justify-between {event.severity === 'critical' ? 'bg-red-900/50' : ''}">
						<span class="flex items-center gap-2">
							{#if event.severity === 'critical'}
								<span class="animate-pulse">!!</span>
							{/if}
							EVENT #{i + 1}
						</span>
						<div class="flex gap-2">
							<Badge variant={getSeverityBadgeVariant(event.severity)} size="sm">
								{getSeverityLabel(event.severity)}
							</Badge>
							<Badge variant="info" size="sm">
								{event.eventType}
							</Badge>
						</div>
					</div>
					<div class="p-4">
						<!-- Title -->
						<div class="mb-4">
							<h3 class="text-xl font-bold text-[var(--color-accent)]">
								{event.title}
							</h3>
						</div>

						<!-- Description -->
						<div class="mb-4">
							<span class="text-sm font-bold text-[var(--color-text-muted)]">SITUATION:</span>
							<p class="mt-1 text-sm bg-[var(--color-primary)] p-3 border border-[var(--color-border)]">
								{event.description}
							</p>
						</div>

						<!-- Immediate Effects -->
						<div class="mb-4">
							<span class="text-sm font-bold text-[var(--color-text-muted)]">IMMEDIATE EFFECTS:</span>
							<ul class="mt-1 text-sm list-disc list-inside space-y-1">
								{#each event.immediateEffects as effect}
									<li>{effect}</li>
								{/each}
							</ul>
						</div>

						<!-- Complications -->
						{#if event.complications && event.complications.length > 0}
							<div class="mb-4">
								<span class="text-sm font-bold text-[var(--color-warning)]">COMPLICATIONS:</span>
								<ul class="mt-1 text-sm list-disc list-inside space-y-1 text-[var(--color-warning)]">
									{#each event.complications as complication}
										<li>{complication}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Suggested Response -->
						{#if event.suggestedResponse}
							<div class="mb-4">
								<span class="text-sm font-bold text-[var(--color-success)]">SUGGESTED RESPONSE:</span>
								<p class="mt-1 text-sm text-[var(--color-success)]">
									{event.suggestedResponse}
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
				<div class="text-6xl mb-4 opacity-30">[ EVT ]</div>
				<p class="text-[var(--color-text-muted)]">
					Configure options above and click "Roll Event" to generate random anomalous events.
				</p>
			</div>
		</div>
	{/if}
</div>
