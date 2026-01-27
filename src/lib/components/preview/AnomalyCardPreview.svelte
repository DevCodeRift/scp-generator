<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import { CARD_STYLE_INFO, type AnomalyCard } from '$lib/schemas/anomaly-card';
	import { OBJECT_CLASS_INFO } from '$lib/schemas/scp';

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

	let doc = $state<AnomalyCard | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'anomaly-card') {
				doc = d as AnomalyCard;
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
	let isWarningStyle = $derived(doc?.cardStyle === 'warning');
	let isCompactStyle = $derived(doc?.cardStyle === 'compact');

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="card-container shadow-xl {isWarningStyle ? 'warning-card' : ''}"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Card Header -->
		<div class="card-header {isWarningStyle ? 'bg-red-700' : 'bg-gray-800'}">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					{#if logo}
						<img src={logo} alt="{faction?.name} Logo" class="w-8 h-8 invert" />
					{/if}
					<span class="font-bold text-white">{faction?.shortName || 'SCP'}</span>
				</div>
				<div class="text-sm text-gray-300 uppercase">{doc.metadata.classification || 'RESTRICTED'}</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="p-4">
			<!-- Item Number & Class -->
			<div class="flex items-start justify-between mb-3">
				<div>
					<div class="text-2xl font-bold">{doc.itemNumber}</div>
					{#if doc.nickname}
						<div class="text-sm text-gray-600 italic">"{doc.nickname}"</div>
					{/if}
				</div>
				<div
					class="px-3 py-1 text-white font-bold text-sm uppercase"
					style="background-color: {objectClassInfo?.color || '#888'}"
				>
					{doc.objectClass}
				</div>
			</div>

			<!-- ACS Module -->
			{#if doc.showACS && (doc.disruptionClass || doc.riskClass)}
				<div class="flex gap-2 mb-3 text-xs">
					{#if doc.disruptionClass}
						<div class="px-2 py-0.5 bg-gray-200 rounded">
							<span class="text-gray-500">DISRUPTION:</span>
							<span class="font-bold uppercase">{doc.disruptionClass}</span>
						</div>
					{/if}
					{#if doc.riskClass}
						<div class="px-2 py-0.5 bg-gray-200 rounded">
							<span class="text-gray-500">RISK:</span>
							<span class="font-bold uppercase">{doc.riskClass}</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Description -->
			<div class="mb-3">
				<div class="text-xs text-gray-500 uppercase mb-1">Description</div>
				<div class="text-sm leading-relaxed {isCompactStyle ? 'line-clamp-3' : ''}">
					{doc.briefDescription || '[No description]'}
				</div>
			</div>

			<!-- Hazards -->
			{#if doc.showHazards && doc.primaryHazards && !isCompactStyle}
				<div class="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-500">
					<div class="text-xs text-yellow-700 uppercase font-bold mb-1">⚠ Hazards</div>
					<div class="text-sm text-yellow-800">{doc.primaryHazards}</div>
				</div>
			{/if}

			<!-- Containment -->
			{#if doc.containmentSummary && !isCompactStyle}
				<div class="mb-3">
					<div class="text-xs text-gray-500 uppercase mb-1">Containment</div>
					<div class="text-sm leading-relaxed">{doc.containmentSummary}</div>
				</div>
			{/if}

			<!-- Special Requirements -->
			{#if doc.specialRequirements && !isCompactStyle}
				<div class="mb-3 p-2 bg-gray-100 text-sm">
					<strong>Special:</strong> {doc.specialRequirements}
				</div>
			{/if}

			<!-- Quick Reference -->
			{#if !isCompactStyle}
				<div class="grid grid-cols-2 gap-2 text-xs border-t pt-3 mt-3">
					{#if doc.location}
						<div><span class="text-gray-500">Location:</span> {doc.location}</div>
					{/if}
					{#if doc.assignedPersonnel}
						<div><span class="text-gray-500">Assigned:</span> {doc.assignedPersonnel}</div>
					{/if}
					{#if doc.lastIncident}
						<div class="col-span-2"><span class="text-gray-500">Last Incident:</span> {doc.lastIncident}</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Card Footer -->
		<div class="card-footer bg-gray-100 text-center text-xs text-gray-500 py-2 border-t">
			{faction?.name || 'SCP Foundation'} - Quick Reference Card
		</div>
	</div>
{:else}
	<div class="card-container text-center py-16">
		<p class="text-gray-500">No card to preview</p>
	</div>
{/if}

<style>
	.card-container {
		background-color: #ffffff;
		color: #1a1a1a;
		font-family: 'Courier Prime', 'Courier New', monospace;
		width: 400px;
		border: 2px solid #333;
		border-radius: 8px;
		overflow: hidden;
	}

	.warning-card {
		border-color: #b91c1c;
		box-shadow: 0 0 0 2px #fecaca;
	}

	.card-header {
		padding: 0.75rem 1rem;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
