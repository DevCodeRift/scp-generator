<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import type { InterviewLog } from '$lib/schemas/interview';

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
	let doc = $state<InterviewLog | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'interview') {
				doc = d as InterviewLog;
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

	function formatParticipant(p: { name: string; designation?: string }) {
		if (p.designation) {
			return `${p.designation} ${p.name}`;
		}
		return p.name;
	}
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
			<div class="text-lg font-bold mt-2">INTERVIEW LOG</div>
			<div class="text-sm text-gray-600 mt-1">
				{#if doc.metadata.classification}
					<span class="uppercase">{doc.metadata.classification}</span>
				{/if}
			</div>
		</div>

		<!-- Log Info -->
		<div class="mb-6 text-sm border border-gray-400 p-3">
			<div class="grid grid-cols-2 gap-2">
				<div><strong>Log #:</strong> {doc.logNumber || '[NOT ASSIGNED]'}</div>
				<div><strong>Date:</strong> {doc.date || '[DATE]'}{doc.time ? ` at ${doc.time}` : ''}</div>
				{#if doc.location}
					<div class="col-span-2"><strong>Location:</strong> {doc.location}</div>
				{/if}
			</div>
			<hr class="my-2 border-gray-300" />
			<div><strong>Interviewer:</strong> {formatParticipant(doc.interviewer)}</div>
			<div><strong>Interviewee:</strong> {formatParticipant(doc.interviewee)}</div>
			{#if doc.observers.length > 0}
				<div><strong>Observers:</strong> {doc.observers.join(', ')}</div>
			{/if}
		</div>

		<!-- Foreword -->
		{#if doc.foreword}
			<div class="document-section">
				<div class="document-section-title">Foreword</div>
				<div class="whitespace-pre-wrap leading-relaxed italic text-gray-700">
					{doc.foreword}
				</div>
			</div>
		{/if}

		<!-- Begin Log marker -->
		<div class="text-center text-sm text-gray-600 my-4">
			<span class="px-4 py-1 border border-gray-400">&lt;BEGIN LOG&gt;</span>
		</div>

		<!-- Transcript -->
		<div class="space-y-3">
			{#if doc.entries.length === 0}
				<p class="text-gray-500 text-center italic">[No transcript entries]</p>
			{:else}
				{#each doc.entries as entry}
					{#if entry.isAction}
						<div class="text-center text-gray-600 italic">
							[{entry.content}]
						</div>
					{:else}
						<div class="flex gap-2">
							<div class="font-bold min-w-[120px]">{entry.speaker}:</div>
							<div class="flex-1 whitespace-pre-wrap">{entry.content}</div>
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<!-- End Log marker -->
		<div class="text-center text-sm text-gray-600 my-4">
			<span class="px-4 py-1 border border-gray-400">&lt;END LOG&gt;</span>
		</div>

		<!-- Afterword -->
		{#if doc.afterword}
			<div class="document-section">
				<div class="document-section-title">Closing Notes</div>
				<div class="whitespace-pre-wrap leading-relaxed italic text-gray-700">
					{doc.afterword}
				</div>
			</div>
		{/if}

		<!-- Notes -->
		{#if doc.notes}
			<div class="document-section">
				<div class="document-section-title">Additional Notes</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.notes}
				</div>
			</div>
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
