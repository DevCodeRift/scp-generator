<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		MISSION_PRIORITY_INFO,
		MISSION_STATUS_INFO,
		MISSION_TYPE_INFO,
		type MissionBriefing
	} from '$lib/schemas/mission';

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

	let doc = $state<MissionBriefing | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'mission') {
				doc = d as MissionBriefing;
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
	let priorityInfo = $derived(doc ? MISSION_PRIORITY_INFO[doc.priority] : null);
	let statusInfo = $derived(doc ? MISSION_STATUS_INFO[doc.status] : null);
	let typeInfo = $derived(doc ? MISSION_TYPE_INFO[doc.missionType] : null);

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
			<div class="text-sm text-gray-600 mt-1 uppercase tracking-wider">Mission Briefing</div>
		</div>

		<!-- Classification Banner -->
		<div class="bg-gray-800 text-white text-center py-1 text-sm uppercase tracking-wider mb-4">
			{doc.metadata.classification || 'SECRET'} - NEED TO KNOW BASIS
		</div>

		<!-- Mission Header -->
		<div class="border-2 border-gray-600 p-4 mb-4">
			<div class="flex justify-between items-start">
				<div>
					<div class="text-2xl font-bold tracking-wider">{doc.missionCode}</div>
					{#if doc.missionName}
						<div class="text-lg text-gray-700">"{doc.missionName}"</div>
					{/if}
					<div class="text-sm text-gray-600 mt-1">{typeInfo?.label || doc.missionType}</div>
				</div>
				<div class="text-right space-y-1">
					<div
						class="px-3 py-1 text-white text-sm font-bold inline-block"
						style="background-color: {priorityInfo?.color}"
					>
						{priorityInfo?.label || doc.priority}
					</div>
					<div
						class="px-3 py-1 text-white text-sm font-bold inline-block"
						style="background-color: {statusInfo?.color}"
					>
						{statusInfo?.label || doc.status}
					</div>
				</div>
			</div>
		</div>

		<!-- Assignment -->
		<div class="document-section">
			<div class="document-section-title">Assignment</div>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div><strong>Team:</strong> {doc.assignedTeam}</div>
				{#if doc.teamLeader}
					<div><strong>Leader:</strong> {doc.teamLeader}</div>
				{/if}
				{#if doc.dateIssued}
					<div><strong>Issued:</strong> {doc.dateIssued}</div>
				{/if}
				{#if doc.deploymentDate}
					<div><strong>Deployment:</strong> {doc.deploymentDate}</div>
				{/if}
				{#if doc.expectedDuration}
					<div><strong>Duration:</strong> {doc.expectedDuration}</div>
				{/if}
			</div>
		</div>

		<!-- Team Roster -->
		{#if doc.showTeamRoster && doc.teamMembers.length > 0}
			<div class="document-section">
				<div class="document-section-title">Team Roster</div>
				<table class="w-full text-sm border-collapse">
					<thead>
						<tr class="border-b border-gray-400">
							<th class="text-left py-1">Callsign</th>
							<th class="text-left py-1">Role</th>
						</tr>
					</thead>
					<tbody>
						{#each doc.teamMembers as member}
							<tr class="border-b border-gray-200">
								<td class="py-1 font-bold">{member.callsign}</td>
								<td class="py-1">{member.role}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Location -->
		<div class="document-section">
			<div class="document-section-title">Area of Operations</div>
			<div class="text-sm space-y-1">
				<div><strong>Operation Area:</strong> {doc.operationArea || '[CLASSIFIED]'}</div>
				{#if doc.insertionPoint}
					<div><strong>Insertion:</strong> {doc.insertionPoint}</div>
				{/if}
				{#if doc.extractionPoint}
					<div><strong>Extraction:</strong> {doc.extractionPoint}</div>
				{/if}
			</div>
		</div>

		<!-- Objectives -->
		<div class="document-section">
			<div class="document-section-title">Primary Objective</div>
			<div class="whitespace-pre-wrap leading-relaxed p-3 bg-gray-100 border-l-4 border-gray-800">
				{doc.objective || '[No objective specified]'}
			</div>
		</div>

		{#if doc.secondaryObjectives}
			<div class="document-section">
				<div class="document-section-title">Secondary Objectives</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.secondaryObjectives}
				</div>
			</div>
		{/if}

		<!-- Intel -->
		{#if doc.backgroundIntel}
			<div class="document-section">
				<div class="document-section-title">Background Intelligence</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.backgroundIntel}
				</div>
			</div>
		{/if}

		<!-- Threat Assessment -->
		{#if doc.showThreatLevel && doc.threatAssessment}
			<div class="document-section">
				<div class="document-section-title bg-red-100 text-red-800 -mx-4 px-4">⚠ Threat Assessment</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.threatAssessment}
				</div>
			</div>
		{/if}

		<!-- Equipment -->
		{#if doc.authorizedEquipment}
			<div class="document-section">
				<div class="document-section-title">Authorized Equipment</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.authorizedEquipment}
				</div>
			</div>
		{/if}

		<!-- Rules of Engagement -->
		{#if doc.rulesOfEngagement}
			<div class="document-section">
				<div class="document-section-title">Rules of Engagement</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.rulesOfEngagement}
				</div>
			</div>
		{/if}

		<!-- Contingency -->
		{#if doc.contingencyProtocols}
			<div class="document-section">
				<div class="document-section-title">Contingency Protocols</div>
				<div class="whitespace-pre-wrap leading-relaxed text-sm">
					{doc.contingencyProtocols}
				</div>
			</div>
		{/if}

		<!-- Related SCPs -->
		{#if doc.relatedSCPs}
			<div class="document-section">
				<div class="document-section-title">Related Anomalies</div>
				<div class="text-sm">{doc.relatedSCPs}</div>
			</div>
		{/if}

		<!-- Authorization -->
		{#if doc.authorizedBy}
			<div class="mt-6 pt-4 border-t-2 border-gray-600">
				<div class="text-sm">
					<div class="text-xs text-gray-500 uppercase">Authorized By</div>
					<div class="font-bold">{doc.authorizedBy}</div>
				</div>
			</div>
		{/if}

		<!-- Footer -->
		<div class="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-500 text-center">
			<p>DESTROY AFTER READING - DO NOT COPY</p>
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
