<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import { OBJECT_CLASS_INFO, type SCPDocument } from '$lib/schemas/scp';

	// Import logos
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
	let doc = $state<SCPDocument | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'scp') {
				doc = d as SCPDocument;
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
	let objectClassInfo = $derived(doc ? OBJECT_CLASS_INFO[doc.objectClass] : null);

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
		<!-- Warning Box -->
		{#if doc.showWarningBox && doc.warningMessage}
			<div class="bg-red-900/20 border-2 border-red-600 p-4 mb-6 text-center">
				<div class="text-red-600 font-bold text-lg mb-2">WARNING</div>
				<div class="text-red-800">{doc.warningMessage}</div>
			</div>
		{/if}

		<!-- Document Header -->
		<div class="document-header">
			{#if logo}
				<img src={logo} alt="{faction?.name} Logo" class="document-logo" />
			{/if}
			<h1 class="text-2xl font-bold">{faction?.name || 'SCP Foundation'}</h1>
			<div class="text-sm text-gray-600 mt-1">
				{#if doc.metadata.classification}
					<span class="uppercase">{doc.metadata.classification}</span>
				{/if}
				{#if doc.metadata.clearanceLevel}
					<span class="mx-2">|</span>
					<span>LEVEL {doc.metadata.clearanceLevel} CLEARANCE REQUIRED</span>
				{/if}
			</div>
		</div>

		<!-- Item Number -->
		<div class="text-center mb-6">
			<h2 class="text-3xl font-bold tracking-wide">{doc.itemNumber}</h2>
		</div>

		<!-- Object Class -->
		<div class="document-section">
			<div class="document-section-title">Object Class</div>
			<div class="flex items-center gap-2">
				<span
					class="inline-block w-3 h-3 rounded-full"
					style="background-color: {objectClassInfo?.color || '#888'}"
				></span>
				<span class="font-bold capitalize">{doc.objectClass}</span>
			</div>
		</div>

		<!-- Containment Procedures -->
		<div class="document-section">
			<div class="document-section-title">Special Containment Procedures</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.containmentProcedures || '[No containment procedures specified]'}
			</div>
		</div>

		<!-- Description -->
		<div class="document-section">
			<div class="document-section-title">Description</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.description || '[No description provided]'}
			</div>
		</div>

		<!-- Addenda -->
		{#if doc.addenda.length > 0}
			{#each doc.addenda as addendum, i}
				<div class="document-section">
					<div class="document-section-title">
						{addendum.title}
						{#if addendum.date}
							<span class="font-normal text-gray-600 ml-2">({addendum.date})</span>
						{/if}
					</div>
					<div class="text-xs text-gray-500 uppercase mb-2">
						{addendum.type.replace('-', ' ')}
					</div>
					<div class="whitespace-pre-wrap leading-relaxed">
						{addendum.content || '[No content]'}
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
		/* Override theme colors for document */
		background-color: #f5f5f0;
		color: #1a1a1a;
		font-family: 'Courier Prime', 'Courier New', monospace;
	}
</style>
