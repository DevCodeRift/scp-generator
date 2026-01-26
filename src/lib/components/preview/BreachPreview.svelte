<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		BREACH_LEVEL_INFO,
		BREACH_STATUS_INFO,
		RESPONSE_PROTOCOL_INFO,
		type ContainmentBreach
	} from '$lib/schemas/breach';

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

	let doc = $state<ContainmentBreach | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'breach') {
				doc = d as ContainmentBreach;
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
	let breachLevelInfo = $derived(doc ? BREACH_LEVEL_INFO[doc.breachLevel] : null);
	let statusInfo = $derived(doc ? BREACH_STATUS_INFO[doc.status] : null);
	let protocolInfo = $derived(doc ? RESPONSE_PROTOCOL_INFO[doc.responseProtocol] : null);

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
		<!-- Urgent Banner -->
		{#if doc.showUrgentBanner && doc.status === 'active'}
			<div class="bg-red-700 text-white text-center py-3 -mx-8 -mt-8 mb-6 animate-pulse">
				<div class="text-xl font-bold">⚠ ACTIVE CONTAINMENT BREACH ⚠</div>
				<div class="text-sm">IMMEDIATE RESPONSE REQUIRED</div>
			</div>
		{/if}

		<!-- Document Header -->
		<div class="document-header">
			{#if logo}
				<img src={logo} alt="{faction?.name} Logo" class="document-logo" />
			{/if}
			<h1 class="text-xl font-bold">{faction?.name || 'SCP Foundation'}</h1>
			<div class="text-sm text-gray-600 mt-1 uppercase tracking-wider">Containment Breach Report</div>
		</div>

		<!-- Classification Banner -->
		<div class="bg-red-900 text-white text-center py-1 text-sm uppercase tracking-wider mb-4">
			{doc.metadata.classification || 'TOP SECRET'} - PRIORITY ALERT
		</div>

		<!-- Breach Header -->
		<div class="border-4 border-red-700 p-4 mb-4">
			<div class="flex justify-between items-start">
				<div>
					<div class="text-2xl font-bold text-red-800">{doc.breachId}</div>
					<div class="text-xl font-bold">{doc.scpNumber}</div>
					{#if doc.scpClass}
						<div class="text-sm text-gray-600">Classification: {doc.scpClass}</div>
					{/if}
				</div>
				<div class="text-right space-y-1">
					<div
						class="px-3 py-1 text-white text-sm font-bold"
						style="background-color: {breachLevelInfo?.color}"
					>
						LEVEL {breachLevelInfo?.label || doc.breachLevel}
					</div>
					<div
						class="px-3 py-1 text-sm font-bold"
						style="background-color: {statusInfo?.color}; color: white;"
					>
						{statusInfo?.label || doc.status}
					</div>
					<div class="text-xs px-3 py-1 bg-gray-800 text-white">
						{protocolInfo?.label || doc.responseProtocol}
					</div>
				</div>
			</div>
		</div>

		<!-- Date & Location -->
		<div class="document-section">
			<div class="document-section-title">Date & Location</div>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div><strong>Date/Time:</strong> {doc.dateTime || '[TIMESTAMP]'}</div>
				<div><strong>Origin:</strong> {doc.originalContainmentSite || '[SITE]'}</div>
				{#if doc.currentLocation}
					<div><strong>Current Location:</strong> {doc.currentLocation}</div>
				{/if}
				{#if doc.affectedAreas}
					<div><strong>Affected Areas:</strong> {doc.affectedAreas}</div>
				{/if}
			</div>
		</div>

		<!-- Breach Description -->
		<div class="document-section">
			<div class="document-section-title">Breach Description</div>
			<div class="whitespace-pre-wrap leading-relaxed">
				{doc.breachDescription || '[No description provided]'}
			</div>
		</div>

		<!-- Cause -->
		{#if doc.causeOfBreach}
			<div class="document-section">
				<div class="document-section-title">Cause of Breach</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.causeOfBreach}
				</div>
			</div>
		{/if}

		<!-- Anomalous Behavior -->
		{#if doc.anomalousBehavior}
			<div class="document-section">
				<div class="document-section-title">Anomalous Behavior Observed</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.anomalousBehavior}
				</div>
			</div>
		{/if}

		<!-- Response -->
		{#if doc.initialResponse || doc.containmentEfforts}
			<div class="document-section">
				<div class="document-section-title">Response Actions</div>
				{#if doc.initialResponse}
					<div class="mb-2">
						<strong class="text-sm">Initial Response:</strong>
						<div class="whitespace-pre-wrap text-sm">{doc.initialResponse}</div>
					</div>
				{/if}
				{#if doc.containmentEfforts}
					<div>
						<strong class="text-sm">Containment Efforts:</strong>
						<div class="whitespace-pre-wrap text-sm">{doc.containmentEfforts}</div>
					</div>
				{/if}
				{#if doc.respondingUnits}
					<div class="mt-2">
						<strong class="text-sm">Responding Units:</strong> {doc.respondingUnits}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Casualties -->
		{#if doc.showCasualties && (doc.personnelCasualties > 0 || doc.civilianExposure > 0)}
			<div class="document-section">
				<div class="document-section-title bg-red-100 text-red-800 -mx-4 px-4">Casualties</div>
				<div class="grid grid-cols-2 gap-4 text-center">
					<div class="border-2 border-red-600 p-3">
						<div class="text-3xl font-bold text-red-700">{doc.personnelCasualties}</div>
						<div class="text-xs uppercase">Personnel Casualties</div>
					</div>
					<div class="border-2 border-orange-600 p-3">
						<div class="text-3xl font-bold text-orange-700">{doc.civilianExposure}</div>
						<div class="text-xs uppercase">Civilian Exposure</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Recontainment Status -->
		{#if doc.recontainmentStatus || doc.estimatedRecontainment}
			<div class="document-section">
				<div class="document-section-title">Recontainment Status</div>
				{#if doc.recontainmentStatus}
					<div class="whitespace-pre-wrap leading-relaxed text-sm mb-2">
						{doc.recontainmentStatus}
					</div>
				{/if}
				{#if doc.estimatedRecontainment}
					<div class="text-sm">
						<strong>Estimated Completion:</strong> {doc.estimatedRecontainment}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Authorization -->
		{#if doc.reportingOfficer || doc.incidentCommander}
			<div class="mt-6 pt-4 border-t-2 border-gray-600">
				<div class="grid grid-cols-2 gap-4 text-sm">
					{#if doc.reportingOfficer}
						<div>
							<div class="text-xs text-gray-500 uppercase">Reporting Officer</div>
							<div class="font-bold">{doc.reportingOfficer}</div>
						</div>
					{/if}
					{#if doc.incidentCommander}
						<div>
							<div class="text-xs text-gray-500 uppercase">Incident Commander</div>
							<div class="font-bold">{doc.incidentCommander}</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Footer -->
		<div class="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-500 text-center">
			<p class="text-red-600 font-bold">IMMEDIATE DISTRIBUTION TO ALL RELEVANT PERSONNEL</p>
			<p>This document is the property of the {faction?.name || 'SCP Foundation'}.</p>
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
