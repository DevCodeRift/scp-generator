<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		DIRECTIVE_PRIORITY_INFO,
		ISSUING_AUTHORITY_INFO,
		DIRECTIVE_TYPE_INFO,
		type Directive,
		type DirectivePriority,
		type IssuingAuthority,
		type DirectiveType
	} from '$lib/schemas/directive';

	let doc = $state<Directive | null>(null);

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

	const priorityOptions = Object.entries(DIRECTIVE_PRIORITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const authorityOptions = Object.entries(ISSUING_AUTHORITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const typeOptions = Object.entries(DIRECTIVE_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof Directive>(field: K, value: Directive[K]) {
		documentStore.update(d => {
			if (d && d.type === 'directive') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Directive Identification -->
		<div class="terminal-window">
			<div class="terminal-header bg-black text-white">O5 DIRECTIVE</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Directive Number"
						value={doc.directiveNumber}
						placeholder="O5-DIR-XXXX"
						required
						onchange={(v) => updateField('directiveNumber', v)}
					/>
					<Select
						label="Directive Type"
						value={doc.directiveType}
						options={typeOptions}
						onchange={(v) => updateField('directiveType', v as DirectiveType)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Priority Level"
						value={doc.priority}
						options={priorityOptions}
						onchange={(v) => updateField('priority', v as DirectivePriority)}
					/>
					<Select
						label="Issuing Authority"
						value={doc.issuingAuthority}
						options={authorityOptions}
						onchange={(v) => updateField('issuingAuthority', v as IssuingAuthority)}
					/>
				</div>
				<Input
					label="O5 Designation"
					value={doc.o5Designation || ''}
					placeholder="O5-7, O5 Council (unanimous), etc."
					onchange={(v) => updateField('o5Designation', v || undefined)}
				/>
			</div>
		</div>

		<!-- Dates -->
		<div class="terminal-window">
			<div class="terminal-header">EFFECTIVE DATES</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<Input
					label="Date Issued"
					type="date"
					value={doc.dateIssued || ''}
					onchange={(v) => updateField('dateIssued', v || undefined)}
				/>
				<Input
					label="Effective Date"
					type="date"
					value={doc.effectiveDate || ''}
					onchange={(v) => updateField('effectiveDate', v || undefined)}
				/>
				<Input
					label="Expiration Date"
					type="date"
					value={doc.expirationDate || ''}
					onchange={(v) => updateField('expirationDate', v || undefined)}
				/>
			</div>
		</div>

		<!-- Subject -->
		<div class="terminal-window">
			<div class="terminal-header">SUBJECT</div>
			<div class="p-4 space-y-4">
				<Input
					label="Subject"
					value={doc.subject}
					placeholder="RE: Subject of this directive"
					required
					onchange={(v) => updateField('subject', v)}
				/>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Related SCPs"
						value={doc.relatedSCPs || ''}
						placeholder="SCP-XXXX, SCP-YYYY"
						onchange={(v) => updateField('relatedSCPs', v || undefined)}
					/>
					<Input
						label="Affected Sites"
						value={doc.affectedSites || ''}
						placeholder="Site-XX, All Sites, etc."
						onchange={(v) => updateField('affectedSites', v || undefined)}
					/>
				</div>
				<Input
					label="Affected Personnel"
					value={doc.affectedPersonnel || ''}
					placeholder="All Level 3+, MTF Commanders, etc."
					onchange={(v) => updateField('affectedPersonnel', v || undefined)}
				/>
			</div>
		</div>

		<!-- Content -->
		<div class="terminal-window">
			<div class="terminal-header">DIRECTIVE CONTENT</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Preamble"
					value={doc.preamble || ''}
					placeholder="Context and background for this directive..."
					rows={3}
					onchange={(v) => updateField('preamble', v || undefined)}
				/>
				<Textarea
					label="Directive Content"
					value={doc.directiveContent}
					placeholder="The actual orders/instructions..."
					rows={8}
					required
					onchange={(v) => updateField('directiveContent', v)}
				/>
				<Textarea
					label="Justification"
					value={doc.justification || ''}
					placeholder="Reasoning behind this directive..."
					rows={3}
					onchange={(v) => updateField('justification', v || undefined)}
				/>
			</div>
		</div>

		<!-- Requirements -->
		<div class="terminal-window">
			<div class="terminal-header">COMPLIANCE REQUIREMENTS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Compliance Requirements"
					value={doc.complianceRequirements || ''}
					placeholder="What must be done to comply..."
					rows={3}
					onchange={(v) => updateField('complianceRequirements', v || undefined)}
				/>
				<Textarea
					label="Reporting Requirements"
					value={doc.reportingRequirements || ''}
					placeholder="Required reports and timelines..."
					rows={3}
					onchange={(v) => updateField('reportingRequirements', v || undefined)}
				/>
				<Textarea
					label="Penalties for Non-Compliance"
					value={doc.penalties || ''}
					placeholder="Consequences of failure to comply..."
					rows={2}
					onchange={(v) => updateField('penalties', v || undefined)}
				/>
			</div>
		</div>

		<!-- Signatures -->
		<div class="terminal-window">
			<div class="terminal-header">AUTHORIZATION</div>
			<div class="p-4">
				<Textarea
					label="Signatures"
					value={doc.signatures || ''}
					placeholder="O5-1 - [SIGNATURE]&#10;O5-7 - [SIGNATURE]&#10;..."
					rows={4}
					onchange={(v) => updateField('signatures', v || undefined)}
				/>
			</div>
		</div>

		<!-- Display Options -->
		<div class="terminal-window">
			<div class="terminal-header">DISPLAY OPTIONS</div>
			<div class="p-4 space-y-3">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showSeal}
						onchange={(e) => updateField('showSeal', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show O5 Council seal</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showClassificationBars}
						onchange={(e) => updateField('showClassificationBars', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show classification bars</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showRedactedSections}
						onchange={(e) => updateField('showRedactedSections', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show redacted sections</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
