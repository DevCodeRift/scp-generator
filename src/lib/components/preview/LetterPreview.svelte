<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import { LETTER_TYPE_INFO, type Letter } from '$lib/schemas/letter';

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
	let doc = $state<Letter | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'letter') {
				doc = d as Letter;
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
	let letterTypeLabel = $derived(doc ? LETTER_TYPE_INFO[doc.letterType]?.label : '');

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();

	function formatPerson(person: { name: string; title?: string; department?: string; site?: string }) {
		const parts = [person.name];
		if (person.title) parts.push(person.title);
		if (person.department) parts.push(person.department);
		if (person.site) parts.push(person.site);
		return parts.join(', ');
	}
</script>

{#if doc}
	<div
		class="document-container shadow-xl"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Letterhead -->
		<div class="document-header">
			{#if logo}
				<img src={logo} alt="{faction?.name} Logo" class="document-logo" />
			{/if}
			<h1 class="text-xl font-bold">{faction?.name || 'SCP Foundation'}</h1>
			<div class="text-sm text-gray-600 mt-1 uppercase">{letterTypeLabel}</div>
		</div>

		<!-- Classification Banner -->
		{#if doc.metadata.classification && doc.metadata.classification !== 'unrestricted'}
			<div class="bg-gray-800 text-white text-center py-1 text-sm uppercase tracking-wider mb-4">
				{doc.metadata.classification}
			</div>
		{/if}

		<!-- Letter Header -->
		<div class="mb-6 text-sm space-y-1">
			<div><strong>Date:</strong> {doc.date || '[DATE]'}</div>
			<div><strong>From:</strong> {formatPerson(doc.from)}</div>
			<div><strong>To:</strong> {formatPerson(doc.to)}</div>
			{#if doc.cc.length > 0}
				<div><strong>CC:</strong> {doc.cc.join(', ')}</div>
			{/if}
			<div class="mt-2"><strong>RE:</strong> {doc.subject || '[SUBJECT]'}</div>
		</div>

		<hr class="border-gray-400 mb-6" />

		<!-- Body -->
		<div class="whitespace-pre-wrap leading-relaxed mb-8">
			{doc.body || '[Message body]'}
		</div>

		<!-- Signature -->
		{#if doc.includeSignature}
			<div class="mt-8">
				<div class="border-t border-gray-400 w-48 pt-2">
					<div class="font-bold">{doc.from.name}</div>
					{#if doc.from.title}
						<div class="text-sm text-gray-600">{doc.from.title}</div>
					{/if}
					{#if doc.from.department}
						<div class="text-sm text-gray-600">{doc.from.department}</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Official Stamp -->
		{#if doc.includeStamp}
			<div class="mt-6 flex justify-end">
				<div class="border-2 border-red-800 rounded-full w-24 h-24 flex items-center justify-center text-center text-red-800 text-xs font-bold transform rotate-[-15deg]">
					OFFICIAL<br/>
					{faction?.shortName || 'SCP'}<br/>
					APPROVED
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
