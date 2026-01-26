<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		INCIDENT_SEVERITY_INFO,
		INCIDENT_STATUS_INFO,
		INCIDENT_TYPE_INFO,
		type IncidentReport
	} from '$lib/schemas/incident';

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

	let doc = $state<IncidentReport | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'incident') {
				doc = d as IncidentReport;
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
	let severityInfo = $derived(doc ? INCIDENT_SEVERITY_INFO[doc.severity] : null);
	let statusInfo = $derived(doc ? INCIDENT_STATUS_INFO[doc.status] : null);
	let typeInfo = $derived(doc ? INCIDENT_TYPE_INFO[doc.incidentType] : null);
	let totalCasualties = $derived(doc ?
		doc.casualties.fatalities + doc.casualties.injuries + doc.casualties.missing : 0);

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
			<div class="text-sm text-gray-600 mt-1 uppercase tracking-wider">Incident Report</div>
		</div>

		<!-- Classification Banner -->
		<div class="bg-gray-800 text-white text-center py-1 text-sm uppercase tracking-wider mb-4">
			{doc.metadata.classification || 'SECRET'}
		</div>

		<!-- Incident Header -->
		<div class="border-2 border-gray-600 p-4 mb-4">
			<div class="flex justify-between items-start">
				<div>
					<div class="text-2xl font-bold">{doc.incidentNumber}</div>
					<div class="text-sm text-gray-600">{typeInfo?.label || doc.incidentType}</div>
				</div>
				<div class="text-right">
					<div class="flex items-center gap-2 justify-end">
						<span class="text-sm">Severity:</span>
						<span
							class="px-2 py-0.5 text-white text-sm font-bold"
							style="background-color: {severityInfo?.color}"
						>
							{severityInfo?.label || doc.severity}
						</span>
					</div>
					<div class="flex items-center gap-2 justify-end mt-1">
						<span class="text-sm">Status:</span>
						<span
							class="px-2 py-0.5 text-white text-sm font-bold"
							style="background-color: {statusInfo?.color}"
						>
							{statusInfo?.label || doc.status}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Date & Location -->
		<div class="document-section">
			<div class="document-section-title">Date & Location</div>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div><strong>Date:</strong> {doc.dateOccurred || '[DATE]'}</div>
				{#if doc.timeOccurred}
					<div><strong>Time:</strong> {doc.timeOccurred}</div>
				{/if}
				<div class="col-span-2"><strong>Location:</strong> {doc.location || '[LOCATION]'}</div>
			</div>
		</div>

		<!-- Related Entities -->
		{#if doc.relatedSCPs || doc.personnelInvolved || doc.respondingTeams}
			<div class="document-section">
				<div class="document-section-title">Related Entities</div>
				<div class="space-y-1 text-sm">
					{#if doc.relatedSCPs}
						<div><strong>Related SCP(s):</strong> {doc.relatedSCPs}</div>
					{/if}
					{#if doc.personnelInvolved}
						<div><strong>Personnel:</strong> {doc.personnelInvolved}</div>
					{/if}
					{#if doc.respondingTeams}
						<div><strong>Responding:</strong> {doc.respondingTeams}</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Summary -->
		<div class="document-section">
			<div class="document-section-title">Summary</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.summary || '[No summary provided]'}
			</div>
		</div>

		<!-- Timeline -->
		{#if doc.showTimeline && doc.timeline}
			<div class="document-section">
				<div class="document-section-title">Timeline</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.timeline}
				</div>
			</div>
		{/if}

		<!-- Containment Actions -->
		{#if doc.containmentActions}
			<div class="document-section">
				<div class="document-section-title">Containment Actions</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.containmentActions}
				</div>
			</div>
		{/if}

		<!-- Damage Assessment -->
		{#if doc.damage}
			<div class="document-section">
				<div class="document-section-title">Damage Assessment</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.damage}
				</div>
			</div>
		{/if}

		<!-- Casualties -->
		{#if doc.showCasualties && totalCasualties > 0}
			<div class="document-section">
				<div class="document-section-title">Casualties</div>
				<div class="grid grid-cols-4 gap-4 text-center">
					<div class="border border-gray-400 p-2">
						<div class="text-2xl font-bold text-red-700">{doc.casualties.fatalities}</div>
						<div class="text-xs uppercase">Fatalities</div>
					</div>
					<div class="border border-gray-400 p-2">
						<div class="text-2xl font-bold text-orange-600">{doc.casualties.injuries}</div>
						<div class="text-xs uppercase">Injuries</div>
					</div>
					<div class="border border-gray-400 p-2">
						<div class="text-2xl font-bold text-yellow-600">{doc.casualties.missing}</div>
						<div class="text-xs uppercase">Missing</div>
					</div>
					<div class="border border-gray-400 p-2">
						<div class="text-2xl font-bold text-gray-600">{doc.casualties.amnesticized}</div>
						<div class="text-xs uppercase">Amnesticized</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Recommendations -->
		{#if doc.recommendations}
			<div class="document-section">
				<div class="document-section-title">Recommendations</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.recommendations}
				</div>
			</div>
		{/if}

		<!-- Lessons Learned -->
		{#if doc.lessonsLearned}
			<div class="document-section">
				<div class="document-section-title">Lessons Learned</div>
				<div class="whitespace-pre-wrap leading-relaxed">
					{doc.lessonsLearned}
				</div>
			</div>
		{/if}

		<!-- Authorization -->
		{#if doc.reportedBy || doc.approvedBy}
			<div class="mt-6 pt-4 border-t border-gray-400">
				<div class="grid grid-cols-2 gap-4 text-sm">
					{#if doc.reportedBy}
						<div>
							<div class="text-xs text-gray-500 uppercase">Reported By</div>
							<div class="font-bold">{doc.reportedBy}</div>
						</div>
					{/if}
					{#if doc.approvedBy}
						<div>
							<div class="text-xs text-gray-500 uppercase">Approved By</div>
							<div class="font-bold">{doc.approvedBy}</div>
						</div>
					{/if}
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
