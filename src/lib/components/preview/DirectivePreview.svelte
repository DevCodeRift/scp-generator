<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		DIRECTIVE_PRIORITY_INFO,
		ISSUING_AUTHORITY_INFO,
		DIRECTIVE_TYPE_INFO,
		type Directive
	} from '$lib/schemas/directive';

	let doc = $state<Directive | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'directive') {
				doc = d as Directive;
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
	let priorityInfo = $derived(doc ? DIRECTIVE_PRIORITY_INFO[doc.priority] : null);
	let authorityInfo = $derived(doc ? ISSUING_AUTHORITY_INFO[doc.issuingAuthority] : null);
	let typeInfo = $derived(doc ? DIRECTIVE_TYPE_INFO[doc.directiveType] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="directive-container shadow-xl"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Top Classification Bars -->
		{#if doc.showClassificationBars}
			<div class="class-bar top-bar">
				TOP SECRET - O5 COUNCIL EYES ONLY - TOP SECRET
			</div>
		{/if}

		<!-- Header with Seal -->
		<div class="directive-header">
			{#if doc.showSeal}
				<div class="o5-seal">
					<div class="seal-inner">
						<div class="seal-text">O5</div>
						<div class="seal-subtitle">COUNCIL</div>
					</div>
				</div>
			{/if}
			<div class="header-text">
				<h1>O5 COUNCIL DIRECTIVE</h1>
				<div class="directive-number">{doc.directiveNumber}</div>
			</div>
		</div>

		<!-- Priority Banner -->
		<div class="priority-banner" style="background-color: {priorityInfo?.color}">
			{priorityInfo?.label?.toUpperCase() || doc.priority.toUpperCase()}
		</div>

		<!-- Metadata Grid -->
		<div class="metadata-grid">
			<div class="meta-item">
				<span class="meta-label">TYPE:</span>
				<span class="meta-value">{typeInfo?.label || doc.directiveType}</span>
			</div>
			<div class="meta-item">
				<span class="meta-label">AUTHORITY:</span>
				<span class="meta-value">{doc.o5Designation || authorityInfo?.label || doc.issuingAuthority}</span>
			</div>
			{#if doc.dateIssued}
				<div class="meta-item">
					<span class="meta-label">ISSUED:</span>
					<span class="meta-value">{doc.dateIssued}</span>
				</div>
			{/if}
			{#if doc.effectiveDate}
				<div class="meta-item">
					<span class="meta-label">EFFECTIVE:</span>
					<span class="meta-value">{doc.effectiveDate}</span>
				</div>
			{/if}
		</div>

		<!-- Subject -->
		<div class="subject-section">
			<div class="subject-label">RE:</div>
			<div class="subject-text">{doc.subject}</div>
		</div>

		<!-- Affected Entities -->
		{#if doc.relatedSCPs || doc.affectedSites || doc.affectedPersonnel}
			<div class="affected-section">
				{#if doc.relatedSCPs}
					<div class="affected-item">
						<strong>Related SCPs:</strong> {doc.relatedSCPs}
					</div>
				{/if}
				{#if doc.affectedSites}
					<div class="affected-item">
						<strong>Affected Sites:</strong> {doc.affectedSites}
					</div>
				{/if}
				{#if doc.affectedPersonnel}
					<div class="affected-item">
						<strong>Affected Personnel:</strong> {doc.affectedPersonnel}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Preamble -->
		{#if doc.preamble}
			<div class="content-section preamble">
				<div class="whitespace-pre-wrap">{doc.preamble}</div>
			</div>
		{/if}

		<!-- Main Directive -->
		<div class="content-section directive-content">
			<div class="section-marker">DIRECTIVE</div>
			<div class="whitespace-pre-wrap">{doc.directiveContent}</div>
		</div>

		<!-- Justification -->
		{#if doc.justification && !doc.showRedactedSections}
			<div class="content-section">
				<div class="section-marker">JUSTIFICATION</div>
				<div class="whitespace-pre-wrap">{doc.justification}</div>
			</div>
		{:else if doc.justification && doc.showRedactedSections}
			<div class="content-section redacted">
				<div class="section-marker">JUSTIFICATION</div>
				<div class="redacted-block">[DATA EXPUNGED BY ORDER OF O5 COUNCIL]</div>
			</div>
		{/if}

		<!-- Compliance -->
		{#if doc.complianceRequirements}
			<div class="content-section">
				<div class="section-marker">COMPLIANCE REQUIREMENTS</div>
				<div class="whitespace-pre-wrap">{doc.complianceRequirements}</div>
			</div>
		{/if}

		{#if doc.reportingRequirements}
			<div class="content-section">
				<div class="section-marker">REPORTING REQUIREMENTS</div>
				<div class="whitespace-pre-wrap">{doc.reportingRequirements}</div>
			</div>
		{/if}

		{#if doc.penalties}
			<div class="content-section penalties">
				<div class="section-marker">NON-COMPLIANCE PENALTIES</div>
				<div class="whitespace-pre-wrap">{doc.penalties}</div>
			</div>
		{/if}

		<!-- Signatures -->
		{#if doc.signatures}
			<div class="signatures-section">
				<div class="section-marker">AUTHORIZATION</div>
				<div class="signatures-content whitespace-pre-wrap">{doc.signatures}</div>
			</div>
		{/if}

		<!-- Expiration -->
		{#if doc.expirationDate}
			<div class="expiration-notice">
				This directive expires: {doc.expirationDate}
			</div>
		{/if}

		<!-- Bottom Classification Bars -->
		{#if doc.showClassificationBars}
			<div class="class-bar bottom-bar">
				TOP SECRET - O5 COUNCIL EYES ONLY - TOP SECRET
			</div>
		{/if}
	</div>
{:else}
	<div class="directive-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.directive-container {
		background-color: #1a1a1a;
		color: #e0e0e0;
		font-family: 'Courier Prime', 'Courier New', monospace;
		min-width: 600px;
		max-width: 800px;
	}

	.class-bar {
		background: repeating-linear-gradient(
			45deg,
			#8b0000,
			#8b0000 10px,
			#000 10px,
			#000 20px
		);
		color: white;
		text-align: center;
		padding: 0.5rem;
		font-weight: bold;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
	}

	.top-bar {
		margin-bottom: 0;
	}

	.bottom-bar {
		margin-top: 0;
	}

	.directive-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem;
		background: #0a0a0a;
		border-bottom: 2px solid #333;
	}

	.o5-seal {
		width: 80px;
		height: 80px;
		border: 3px solid #888;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle, #2a2a2a 0%, #0a0a0a 100%);
		flex-shrink: 0;
	}

	.seal-inner {
		text-align: center;
	}

	.seal-text {
		font-size: 1.5rem;
		font-weight: bold;
		color: #ccc;
	}

	.seal-subtitle {
		font-size: 0.5rem;
		letter-spacing: 0.2em;
		color: #888;
	}

	.header-text h1 {
		font-size: 1.25rem;
		letter-spacing: 0.15em;
		margin: 0;
		color: #fff;
	}

	.directive-number {
		font-size: 1.5rem;
		font-weight: bold;
		color: #cc0000;
		margin-top: 0.5rem;
	}

	.priority-banner {
		color: white;
		text-align: center;
		padding: 0.5rem;
		font-weight: bold;
		letter-spacing: 0.2em;
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem 2rem;
		padding: 1rem 2rem;
		background: #0f0f0f;
		border-bottom: 1px solid #333;
	}

	.meta-item {
		font-size: 0.85rem;
	}

	.meta-label {
		color: #888;
		margin-right: 0.5rem;
	}

	.meta-value {
		color: #ccc;
	}

	.subject-section {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #333;
		display: flex;
		gap: 1rem;
		align-items: baseline;
	}

	.subject-label {
		color: #888;
		font-weight: bold;
	}

	.subject-text {
		font-size: 1.1rem;
		font-weight: bold;
		color: #fff;
	}

	.affected-section {
		padding: 1rem 2rem;
		background: #0f0f0f;
		font-size: 0.85rem;
	}

	.affected-item {
		margin-bottom: 0.25rem;
	}

	.content-section {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #222;
	}

	.content-section.preamble {
		color: #aaa;
		font-style: italic;
	}

	.content-section.directive-content {
		background: #111;
	}

	.content-section.penalties {
		background: #1a0a0a;
		border-left: 4px solid #cc0000;
	}

	.content-section.redacted {
		background: #0a0a0a;
	}

	.section-marker {
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		color: #666;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #333;
	}

	.redacted-block {
		background: #000;
		color: #cc0000;
		padding: 1rem;
		text-align: center;
		font-weight: bold;
	}

	.signatures-section {
		padding: 1.5rem 2rem;
		background: #0f0f0f;
	}

	.signatures-content {
		font-family: 'Times New Roman', serif;
		font-style: italic;
		color: #ccc;
	}

	.expiration-notice {
		padding: 1rem 2rem;
		background: #1a1a0a;
		color: #cccc00;
		font-size: 0.85rem;
		text-align: center;
		border-top: 1px solid #333;
	}
</style>
