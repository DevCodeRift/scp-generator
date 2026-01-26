<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import type { ResearchReport } from '$lib/schemas/research';

	import foundationLogo from '$lib/assets/logos/foundation.svg';
	import chaosInsurgencyLogo from '$lib/assets/logos/chaos-insurgency.svg';
	import gocLogo from '$lib/assets/logos/goc.svg';
	import serpentsHandLogo from '$lib/assets/logos/serpents-hand.svg';
	import mcdLogo from '$lib/assets/logos/mcd.svg';
	import brokenGodLogo from '$lib/assets/logos/broken-god.svg';
	import wondertainmentLogo from '$lib/assets/logos/wondertainment.svg';

	const logos: Record<string, string> = {
		'foundation': foundationLogo,
		'chaos-insurgency': chaosInsurgencyLogo,
		'goc': gocLogo,
		'serpents-hand': serpentsHandLogo,
		'mcd': mcdLogo,
		'broken-god': brokenGodLogo,
		'wondertainment': wondertainmentLogo
	};

	// Use $state with $effect to sync from stores
	let doc = $state<ResearchReport | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'research') {
				doc = d as ResearchReport;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	$effect(() => {
		const unsub = factionStore.subscribe(f => {
			currentFaction = f;
		});
		return unsub;
	});

	let faction = $derived(FACTIONS.find(f => f.id === currentFaction));
	let logo = $derived(logos[currentFaction] || null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="document-container shadow-xl"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Document Header -->
		<div class="document-header">
			{#if logo}
				<img src={logo} alt="{faction?.name} Logo" class="document-logo" />
			{/if}
			<h1 class="text-xl font-bold">{faction?.name || 'SCP Foundation'}</h1>
			<div class="text-lg font-bold mt-2">RESEARCH REPORT</div>
			<div class="text-sm text-gray-600 mt-1">
				{#if doc.metadata.classification}
					<span class="uppercase">{doc.metadata.classification}</span>
				{/if}
			</div>
		</div>

		<!-- Report Info -->
		<div class="mb-6 text-sm">
			<div class="grid grid-cols-2 gap-2">
				<div><strong>Report #:</strong> {doc.reportNumber || '[NOT ASSIGNED]'}</div>
				<div><strong>Date:</strong> {doc.date || '[DATE]'}</div>
				<div><strong>Department:</strong> {doc.department || 'N/A'}</div>
				<div><strong>Lead Researcher:</strong> {doc.leadResearcher || '[NAME]'}</div>
			</div>
			{#if doc.team.length > 0}
				<div class="mt-2"><strong>Research Team:</strong> {doc.team.join(', ')}</div>
			{/if}
			{#if doc.supervisor}
				<div><strong>Supervisor:</strong> {doc.supervisor}</div>
			{/if}
		</div>

		<!-- Title -->
		<div class="text-center mb-6">
			<h2 class="text-xl font-bold">{doc.title || '[UNTITLED REPORT]'}</h2>
		</div>

		<!-- Abstract -->
		<div class="document-section">
			<div class="document-section-title">Abstract</div>
			<div class="whitespace-pre-wrap leading-relaxed italic">
				{doc.abstract || '[No abstract provided]'}
			</div>
		</div>

		<!-- Methodology -->
		{#if doc.methodology}
			<div class="document-section">
				<div class="document-section-title">Methodology</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.methodology}
				</div>
			</div>
		{/if}

		<!-- Findings -->
		<div class="document-section">
			<div class="document-section-title">Findings</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.findings || '[No findings documented]'}
			</div>
		</div>

		<!-- Conclusions -->
		<div class="document-section">
			<div class="document-section-title">Conclusions</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.conclusions || '[No conclusions provided]'}
			</div>
		</div>

		<!-- Recommendations -->
		{#if doc.recommendations}
			<div class="document-section">
				<div class="document-section-title">Recommendations</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.recommendations}
				</div>
			</div>
		{/if}

		<!-- Appendices -->
		{#if doc.appendices.length > 0}
			{#each doc.appendices as appendix}
				<div class="document-section">
					<div class="document-section-title">{appendix.title}</div>
					<div class="whitespace-pre-wrap leading-relaxed">
						{appendix.content || '[No content]'}
					</div>
				</div>
			{/each}
		{/if}

		<!-- Footer -->
		<div class="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-500 text-center">
			<p>This document is the property of the {faction?.name || 'SCP Foundation'}.</p>
			<p>Unauthorized access or distribution is strictly prohibited.</p>
		</div>
	</div>
{:else}
	<div class="document-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.document-container {
		background-color: #f5f5f0;
		color: #1a1a1a;
		font-family: 'Courier Prime', 'Courier New', monospace;
	}
</style>
