<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		EXPLORATION_STATUS_INFO,
		ENVIRONMENT_TYPE_INFO,
		type ExplorationLog
	} from '$lib/schemas/exploration';

	let doc = $state<ExplorationLog | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'exploration') {
				doc = d as ExplorationLog;
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
	let statusInfo = $derived(doc ? EXPLORATION_STATUS_INFO[doc.status] : null);
	let envInfo = $derived(doc ? ENVIRONMENT_TYPE_INFO[doc.environmentType] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="journal-container shadow-xl {doc.showHandwrittenStyle ? 'handwritten' : ''} {doc.showDamageEffects ? 'damaged' : ''}"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Paper texture overlay -->
		{#if doc.showDamageEffects}
			<div class="damage-overlay"></div>
		{/if}

		<!-- Header -->
		<div class="journal-header">
			<div class="flex justify-between items-start">
				<div>
					<div class="text-lg font-bold">{faction?.name || 'SCP Foundation'}</div>
					<div class="text-xs text-gray-600 uppercase">Field Exploration Log</div>
				</div>
				<div class="text-right">
					<div class="font-mono text-lg">{doc.logNumber}</div>
					<div
						class="text-xs px-2 py-0.5 text-white inline-block mt-1"
						style="background-color: {statusInfo?.color}"
					>
						{statusInfo?.label || doc.status}
					</div>
				</div>
			</div>
		</div>

		<!-- Mission Info Box -->
		<div class="info-box">
			<div class="grid grid-cols-2 gap-2 text-sm">
				{#if doc.missionTitle}
					<div class="col-span-2 font-bold text-lg border-b pb-1 mb-1">
						"{doc.missionTitle}"
					</div>
				{/if}
				<div><strong>Environment:</strong> {envInfo?.label || doc.environmentType}</div>
				{#if doc.relatedSCP}
					<div><strong>Related SCP:</strong> {doc.relatedSCP}</div>
				{/if}
				{#if doc.missionDate}
					<div><strong>Date:</strong> {doc.missionDate}</div>
				{/if}
				{#if doc.entryPoint}
					<div><strong>Entry:</strong> {doc.entryPoint}</div>
				{/if}
			</div>
		</div>

		<!-- Team Info -->
		<div class="section">
			<div class="section-title">EXPLORATION TEAM</div>
			<div class="text-sm space-y-1">
				<div><strong>Team:</strong> {doc.teamDesignation}</div>
				{#if doc.teamLeader}
					<div><strong>Leader:</strong> {doc.teamLeader}</div>
				{/if}
				{#if doc.teamMembers}
					<div class="whitespace-pre-wrap"><strong>Members:</strong> {doc.teamMembers}</div>
				{/if}
			</div>
		</div>

		<!-- Objectives -->
		{#if doc.objectives}
			<div class="section">
				<div class="section-title">MISSION OBJECTIVES</div>
				<div class="whitespace-pre-wrap text-sm">{doc.objectives}</div>
			</div>
		{/if}

		<!-- Equipment -->
		{#if doc.equipmentList}
			<div class="section">
				<div class="section-title">EQUIPMENT</div>
				<div class="whitespace-pre-wrap text-sm">{doc.equipmentList}</div>
			</div>
		{/if}

		<!-- Log Entries -->
		{#if doc.waypoints.length > 0}
			<div class="section">
				<div class="section-title">FIELD LOG</div>
				<div class="log-entries">
					{#each doc.waypoints as waypoint, i}
						<div class="log-entry">
							<div class="entry-header">
								{#if doc.showTimestamps && waypoint.timestamp}
									<span class="timestamp">[{waypoint.timestamp}]</span>
								{/if}
								<span class="designation">{waypoint.designation}</span>
							</div>
							<div class="entry-content">
								{waypoint.description}
							</div>
							{#if waypoint.hazards}
								<div class="entry-hazard">
									⚠ HAZARD: {waypoint.hazards}
								</div>
							{/if}
							{#if waypoint.discoveries}
								<div class="entry-discovery">
									★ DISCOVERY: {waypoint.discoveries}
								</div>
							{/if}
							{#if waypoint.personnelStatus}
								<div class="entry-status">
									Personnel: {waypoint.personnelStatus}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Final Notes -->
		{#if doc.finalNotes}
			<div class="section">
				<div class="section-title">MISSION CONCLUSION</div>
				<div class="whitespace-pre-wrap">{doc.finalNotes}</div>
			</div>
		{/if}

		<!-- Recovered Materials -->
		{#if doc.recoveredMaterials}
			<div class="section">
				<div class="section-title">RECOVERED MATERIALS</div>
				<div class="whitespace-pre-wrap text-sm">{doc.recoveredMaterials}</div>
			</div>
		{/if}

		<!-- Recommendations -->
		{#if doc.recommendedActions}
			<div class="section">
				<div class="section-title">RECOMMENDATIONS</div>
				<div class="whitespace-pre-wrap text-sm">{doc.recommendedActions}</div>
			</div>
		{/if}

		<!-- Footer -->
		<div class="journal-footer">
			<p>END OF LOG - {doc.logNumber}</p>
		</div>
	</div>
{:else}
	<div class="journal-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.journal-container {
		background-color: #f5f0e6;
		color: #2a2a2a;
		font-family: 'Courier Prime', 'Courier New', monospace;
		padding: 2rem;
		min-width: 600px;
		max-width: 800px;
		position: relative;
		background-image:
			repeating-linear-gradient(
				transparent,
				transparent 28px,
				#ddd 28px,
				#ddd 29px
			);
	}

	.journal-container.handwritten {
		font-family: 'Caveat', 'Comic Sans MS', cursive;
		font-size: 1.1rem;
	}

	.journal-container.damaged {
		background-color: #e8e0d0;
	}

	.damage-overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 20% 10%, rgba(139, 90, 43, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 90%, rgba(139, 90, 43, 0.15) 0%, transparent 40%);
		pointer-events: none;
	}

	.journal-header {
		border-bottom: 2px solid #444;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.info-box {
		background: rgba(0, 0, 0, 0.05);
		border: 1px solid #999;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.section {
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-weight: bold;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border-bottom: 1px solid #666;
		padding-bottom: 0.25rem;
		margin-bottom: 0.75rem;
		color: #444;
	}

	.log-entries {
		border-left: 3px solid #666;
		padding-left: 1rem;
	}

	.log-entry {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px dashed #ccc;
	}

	.log-entry:last-child {
		border-bottom: none;
	}

	.entry-header {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.timestamp {
		font-family: monospace;
		color: #666;
		margin-right: 0.5rem;
	}

	.designation {
		color: #333;
	}

	.entry-content {
		white-space: pre-wrap;
		margin-bottom: 0.5rem;
	}

	.entry-hazard {
		color: #c00;
		font-weight: bold;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.entry-discovery {
		color: #060;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	.entry-status {
		color: #666;
		font-size: 0.85rem;
		font-style: italic;
		margin-top: 0.25rem;
	}

	.journal-footer {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 2px solid #444;
		text-align: center;
		font-size: 0.85rem;
		color: #666;
	}
</style>
