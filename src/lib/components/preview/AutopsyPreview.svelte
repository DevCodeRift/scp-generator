<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		SUBJECT_TYPE_INFO,
		CAUSE_OF_DEATH_INFO,
		type AutopsyReport
	} from '$lib/schemas/autopsy';

	let doc = $state<AutopsyReport | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'autopsy') {
				doc = d as AutopsyReport;
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
	let subjectTypeInfo = $derived(doc ? SUBJECT_TYPE_INFO[doc.subjectType] : null);
	let causeInfo = $derived(doc ? CAUSE_OF_DEATH_INFO[doc.causeOfDeath] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="autopsy-container shadow-xl {doc.showClinicalStyle ? 'clinical' : ''}"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Biohazard Warning -->
		{#if doc.showWarnings}
			<div class="biohazard-banner">
				<span class="biohazard-icon">☣</span>
				BIOLOGICAL MATERIAL - HANDLE WITH CARE
				<span class="biohazard-icon">☣</span>
			</div>
		{/if}

		<!-- Header -->
		<div class="autopsy-header">
			<div class="header-left">
				<h1>{faction?.name || 'SCP Foundation'}</h1>
				<div class="subtitle">Medical Division - Autopsy Report</div>
			</div>
			<div class="header-right">
				<div class="case-number">{doc.caseNumber}</div>
				<div class="classification">{doc.metadata.classification?.toUpperCase() || 'CLASSIFIED'}</div>
			</div>
		</div>

		<!-- Subject Info Card -->
		<div class="subject-card">
			<div class="subject-grid">
				{#if doc.showDiagram}
					<div class="diagram-placeholder">
						<div class="diagram-outline"></div>
						<div class="diagram-label">SUBJECT DIAGRAM</div>
					</div>
				{/if}
				<div class="subject-info">
					<h2>SUBJECT INFORMATION</h2>
					<table class="info-table">
						<tbody>
							<tr>
								<td>Designation:</td>
								<td><strong>{doc.subjectDesignation}</strong></td>
							</tr>
							<tr>
								<td>Type:</td>
								<td>{subjectTypeInfo?.label || doc.subjectType}</td>
							</tr>
							{#if doc.dateOfDeath}
								<tr>
									<td>Date of Death:</td>
									<td>{doc.dateOfDeath}</td>
								</tr>
							{/if}
							{#if doc.dateOfExamination}
								<tr>
									<td>Examination Date:</td>
									<td>{doc.dateOfExamination}</td>
								</tr>
							{/if}
							{#if doc.locationRecovered}
								<tr>
									<td>Location:</td>
									<td>{doc.locationRecovered}</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
			{#if doc.subjectDescription}
				<div class="description-box">
					<strong>Physical Description:</strong>
					<div class="whitespace-pre-wrap">{doc.subjectDescription}</div>
				</div>
			{/if}
		</div>

		<!-- Related Items -->
		{#if doc.relatedSCP || doc.relatedIncident}
			<div class="related-box">
				{#if doc.relatedSCP}
					<span class="related-item">SCP: {doc.relatedSCP}</span>
				{/if}
				{#if doc.relatedIncident}
					<span class="related-item">Incident: {doc.relatedIncident}</span>
				{/if}
			</div>
		{/if}

		<!-- Examination Sections -->
		{#if doc.externalExamination}
			<div class="exam-section">
				<h3>EXTERNAL EXAMINATION</h3>
				<div class="whitespace-pre-wrap">{doc.externalExamination}</div>
			</div>
		{/if}

		{#if doc.anomalousFeatures}
			<div class="exam-section anomalous">
				<h3>⚠ ANOMALOUS FEATURES</h3>
				<div class="whitespace-pre-wrap">{doc.anomalousFeatures}</div>
			</div>
		{/if}

		{#if doc.internalExamination}
			<div class="exam-section">
				<h3>INTERNAL EXAMINATION</h3>
				<div class="whitespace-pre-wrap">{doc.internalExamination}</div>
			</div>
		{/if}

		{#if doc.tissueAnalysis}
			<div class="exam-section">
				<h3>TISSUE ANALYSIS</h3>
				<div class="whitespace-pre-wrap">{doc.tissueAnalysis}</div>
			</div>
		{/if}

		<!-- Cause of Death -->
		<div class="cod-section">
			<h3>CAUSE OF DEATH</h3>
			<div class="cod-badge" style="background-color: {causeInfo?.color}">
				{causeInfo?.label || doc.causeOfDeath}
			</div>
			{#if doc.causeDetails}
				<div class="whitespace-pre-wrap mt-2">{doc.causeDetails}</div>
			{/if}
		</div>

		{#if doc.toxicologyResults}
			<div class="exam-section">
				<h3>TOXICOLOGY RESULTS</h3>
				<div class="whitespace-pre-wrap">{doc.toxicologyResults}</div>
			</div>
		{/if}

		{#if doc.anomalousFindings}
			<div class="exam-section anomalous">
				<h3>⚠ ANOMALOUS FINDINGS</h3>
				<div class="whitespace-pre-wrap">{doc.anomalousFindings}</div>
			</div>
		{/if}

		<!-- Conclusions -->
		{#if doc.conclusions}
			<div class="exam-section">
				<h3>CONCLUSIONS</h3>
				<div class="whitespace-pre-wrap">{doc.conclusions}</div>
			</div>
		{/if}

		{#if doc.recommendations}
			<div class="exam-section">
				<h3>RECOMMENDATIONS</h3>
				<div class="whitespace-pre-wrap">{doc.recommendations}</div>
			</div>
		{/if}

		<!-- Signature -->
		<div class="signature-section">
			{#if doc.examiner}
				<div class="signature-block">
					<div class="signature-line"></div>
					<div class="signature-name">{doc.examiner}</div>
					<div class="signature-title">Examining Physician</div>
				</div>
			{/if}
			{#if doc.witnesses}
				<div class="witnesses">
					<strong>Witnesses:</strong> {doc.witnesses}
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="autopsy-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.autopsy-container {
		background-color: #fff;
		color: #1a1a1a;
		font-family: 'Arial', sans-serif;
		padding: 2rem;
		min-width: 600px;
		max-width: 800px;
	}

	.autopsy-container.clinical {
		font-family: 'Courier New', monospace;
		background-color: #f9f9f9;
	}

	.biohazard-banner {
		background: linear-gradient(90deg, #ff6600 0%, #cc0000 50%, #ff6600 100%);
		color: white;
		text-align: center;
		padding: 0.5rem;
		font-weight: bold;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		margin: -2rem -2rem 1.5rem -2rem;
	}

	.biohazard-icon {
		margin: 0 0.5rem;
	}

	.autopsy-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 3px double #333;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.header-left h1 {
		font-size: 1.25rem;
		font-weight: bold;
		margin: 0;
	}

	.subtitle {
		font-size: 0.85rem;
		color: #666;
	}

	.header-right {
		text-align: right;
	}

	.case-number {
		font-family: monospace;
		font-size: 1.25rem;
		font-weight: bold;
	}

	.classification {
		font-size: 0.75rem;
		background: #333;
		color: white;
		padding: 0.125rem 0.5rem;
		display: inline-block;
		margin-top: 0.25rem;
	}

	.subject-card {
		background: #f5f5f5;
		border: 1px solid #ccc;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.subject-grid {
		display: flex;
		gap: 1.5rem;
	}

	.diagram-placeholder {
		width: 120px;
		flex-shrink: 0;
		text-align: center;
	}

	.diagram-outline {
		width: 100px;
		height: 150px;
		border: 2px dashed #999;
		margin: 0 auto;
		background: #fff;
	}

	.diagram-label {
		font-size: 0.65rem;
		color: #666;
		margin-top: 0.25rem;
	}

	.subject-info h2 {
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		margin: 0 0 0.75rem 0;
		color: #444;
	}

	.info-table {
		font-size: 0.85rem;
		width: 100%;
	}

	.info-table td {
		padding: 0.25rem 0;
		vertical-align: top;
	}

	.info-table td:first-child {
		width: 40%;
		color: #666;
	}

	.description-box {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #ddd;
		font-size: 0.9rem;
	}

	.related-box {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.related-item {
		background: #e0e0e0;
		padding: 0.25rem 0.75rem;
		font-size: 0.85rem;
		font-family: monospace;
	}

	.exam-section {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: #fafafa;
		border-left: 3px solid #666;
	}

	.exam-section.anomalous {
		background: #fff5f5;
		border-left-color: #cc0000;
	}

	.exam-section h3 {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		margin: 0 0 0.75rem 0;
		color: #333;
	}

	.cod-section {
		background: #f0f0f0;
		border: 2px solid #333;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.cod-section h3 {
		font-size: 0.8rem;
		margin: 0 0 0.75rem 0;
	}

	.cod-badge {
		display: inline-block;
		color: white;
		padding: 0.25rem 1rem;
		font-weight: bold;
	}

	.signature-section {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 2px solid #333;
	}

	.signature-block {
		width: 250px;
	}

	.signature-line {
		border-bottom: 1px solid #333;
		height: 40px;
	}

	.signature-name {
		font-weight: bold;
		margin-top: 0.25rem;
	}

	.signature-title {
		font-size: 0.85rem;
		color: #666;
	}

	.witnesses {
		margin-top: 1rem;
		font-size: 0.85rem;
	}
</style>
