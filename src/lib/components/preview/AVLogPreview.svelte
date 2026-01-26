<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		MEDIA_TYPE_INFO,
		RECORDING_QUALITY_INFO,
		type AVLog
	} from '$lib/schemas/avlog';

	let doc = $state<AVLog | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'avlog') {
				doc = d as AVLog;
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
	let mediaInfo = $derived(doc ? MEDIA_TYPE_INFO[doc.mediaType] : null);
	let qualityInfo = $derived(doc ? RECORDING_QUALITY_INFO[doc.recordingQuality] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="avlog-container shadow-xl {doc.terminalStyle ? 'terminal-mode' : ''}"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Scanlines overlay -->
		{#if doc.showScanlines}
			<div class="scanlines-overlay"></div>
		{/if}

		<!-- Static effect (at edges for degraded quality) -->
		{#if doc.showStaticEffects && doc.recordingQuality !== 'clear'}
			<div class="static-overlay {doc.recordingQuality}"></div>
		{/if}

		<!-- Header Bar -->
		<div class="header-bar">
			<div class="recording-indicator">
				<span class="rec-dot"></span>
				<span class="rec-text">REC</span>
			</div>
			<div class="log-designation">{doc.logDesignation}</div>
			<div class="media-type">{mediaInfo?.icon} {mediaInfo?.label}</div>
		</div>

		<!-- Info Bar -->
		<div class="info-bar">
			<div class="info-item">
				<span class="info-label">QUALITY:</span>
				<span class="quality-badge" style="color: {qualityInfo?.color}">{qualityInfo?.label}</span>
			</div>
			{#if doc.duration}
				<div class="info-item">
					<span class="info-label">DURATION:</span>
					<span>{doc.duration}</span>
				</div>
			{/if}
			{#if doc.recordingDate}
				<div class="info-item">
					<span class="info-label">DATE:</span>
					<span>{doc.recordingDate}</span>
				</div>
			{/if}
		</div>

		<!-- Source Info -->
		<div class="source-section">
			<div class="section-header">SOURCE INFORMATION</div>
			<div class="source-grid">
				{#if doc.location}
					<div><span class="label">Location:</span> {doc.location}</div>
				{/if}
				{#if doc.equipmentUsed}
					<div><span class="label">Equipment:</span> {doc.equipmentUsed}</div>
				{/if}
				{#if doc.recoveryInfo}
					<div class="col-span-2"><span class="label">Recovery:</span> {doc.recoveryInfo}</div>
				{/if}
				{#if doc.relatedSCP}
					<div><span class="label">Related SCP:</span> {doc.relatedSCP}</div>
				{/if}
				{#if doc.relatedIncident}
					<div><span class="label">Incident:</span> {doc.relatedIncident}</div>
				{/if}
			</div>
			{#if doc.participants}
				<div class="participants">
					<span class="label">Participants:</span> {doc.participants}
				</div>
			{/if}
		</div>

		<!-- Pre-transcript notes -->
		{#if doc.preTranscriptNotes}
			<div class="notes-section">
				<div class="notes-content">[{doc.preTranscriptNotes}]</div>
			</div>
		{/if}

		<!-- Transcript -->
		<div class="transcript-section">
			<div class="section-header">TRANSCRIPT</div>
			<div class="transcript-entries">
				{#if doc.transcript.length === 0}
					<div class="no-entries">[NO TRANSCRIPT DATA]</div>
				{/if}
				{#each doc.transcript as entry}
					<div class="transcript-entry {entry.isRedacted ? 'redacted' : ''}">
						{#if doc.showTimestamps && entry.timestamp}
							<span class="entry-timestamp">[{entry.timestamp}]</span>
						{/if}
						<span class="entry-speaker">{entry.speaker}:</span>
						{#if entry.isRedacted}
							<span class="entry-content redacted-text">[REDACTED]</span>
						{:else}
							<span class="entry-content">{entry.content}</span>
							{#if entry.notes}
								<span class="entry-notes">{entry.notes}</span>
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Post-transcript notes -->
		{#if doc.postTranscriptNotes}
			<div class="notes-section">
				<div class="notes-content">[{doc.postTranscriptNotes}]</div>
			</div>
		{/if}

		<!-- Analysis -->
		{#if doc.analysisNotes || doc.anomaliesDetected}
			<div class="analysis-section">
				<div class="section-header">ANALYSIS</div>
				{#if doc.analysisNotes}
					<div class="analysis-content">
						<div class="analysis-label">Notes:</div>
						<div class="whitespace-pre-wrap">{doc.analysisNotes}</div>
					</div>
				{/if}
				{#if doc.anomaliesDetected}
					<div class="analysis-content anomaly">
						<div class="analysis-label">⚠ Anomalies Detected:</div>
						<div class="whitespace-pre-wrap">{doc.anomaliesDetected}</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Footer -->
		<div class="footer-bar">
			{#if doc.transcribedBy}
				<span>Transcribed by: {doc.transcribedBy}</span>
			{/if}
			{#if doc.verifiedBy}
				<span>Verified by: {doc.verifiedBy}</span>
			{/if}
			<span class="org-tag">{faction?.name || 'SCP Foundation'}</span>
		</div>
	</div>
{:else}
	<div class="avlog-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.avlog-container {
		background-color: #0a0a0a;
		color: #00ff00;
		font-family: 'Courier New', monospace;
		min-width: 600px;
		max-width: 800px;
		position: relative;
		overflow: hidden;
	}

	.avlog-container.terminal-mode {
		background-color: #001100;
		color: #00ff00;
		text-shadow: 0 0 5px #00ff00;
	}

	.scanlines-overlay {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		z-index: 10;
	}

	.static-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 5;
	}

	.static-overlay.degraded {
		background:
			radial-gradient(ellipse at 0% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 30%),
			radial-gradient(ellipse at 100% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 30%);
	}

	.static-overlay.heavily-degraded,
	.static-overlay.corrupted {
		background:
			radial-gradient(ellipse at 0% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
			radial-gradient(ellipse at 100% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
			repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
	}

	.header-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #111;
		border-bottom: 1px solid #333;
	}

	.recording-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.rec-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #ff0000;
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	.rec-text {
		color: #ff0000;
		font-weight: bold;
		font-size: 0.85rem;
	}

	.log-designation {
		font-size: 1.1rem;
		font-weight: bold;
	}

	.media-type {
		font-size: 0.85rem;
		color: #888;
	}

	.info-bar {
		display: flex;
		gap: 2rem;
		padding: 0.5rem 1rem;
		background: #0a0a0a;
		border-bottom: 1px solid #222;
		font-size: 0.8rem;
	}

	.info-label {
		color: #666;
		margin-right: 0.25rem;
	}

	.quality-badge {
		font-weight: bold;
	}

	.source-section {
		padding: 1rem;
		border-bottom: 1px solid #222;
	}

	.section-header {
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: #888;
		margin-bottom: 0.75rem;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid #333;
	}

	.source-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem;
		font-size: 0.85rem;
	}

	.label {
		color: #888;
	}

	.participants {
		margin-top: 0.5rem;
		font-size: 0.85rem;
	}

	.notes-section {
		padding: 0.75rem 1rem;
		background: #0f0f0f;
		font-style: italic;
		color: #888;
		font-size: 0.85rem;
	}

	.transcript-section {
		padding: 1rem;
		min-height: 200px;
	}

	.transcript-entries {
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.no-entries {
		color: #666;
		text-align: center;
		padding: 2rem;
	}

	.transcript-entry {
		margin-bottom: 0.75rem;
	}

	.transcript-entry.redacted {
		opacity: 0.7;
	}

	.entry-timestamp {
		color: #666;
		font-size: 0.8rem;
		margin-right: 0.5rem;
	}

	.entry-speaker {
		color: #00ccff;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.entry-content {
		color: #00ff00;
	}

	.entry-content.redacted-text {
		background: #330000;
		color: #ff0000;
		padding: 0 0.5rem;
	}

	.entry-notes {
		color: #666;
		font-style: italic;
		margin-left: 0.5rem;
	}

	.analysis-section {
		padding: 1rem;
		background: #0f0f0f;
		border-top: 1px solid #333;
	}

	.analysis-content {
		margin-top: 0.75rem;
		font-size: 0.85rem;
	}

	.analysis-content.anomaly {
		color: #ffcc00;
	}

	.analysis-label {
		color: #888;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.footer-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		background: #111;
		border-top: 1px solid #333;
		font-size: 0.75rem;
		color: #666;
	}

	.org-tag {
		color: #888;
	}
</style>
