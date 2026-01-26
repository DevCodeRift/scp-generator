<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		SUBJECT_TYPE_INFO,
		CAUSE_OF_DEATH_INFO,
		type AutopsyReport,
		type SubjectType,
		type CauseOfDeath
	} from '$lib/schemas/autopsy';

	let doc = $state<AutopsyReport | null>(null);

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

	const subjectTypeOptions = Object.entries(SUBJECT_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const causeOfDeathOptions = Object.entries(CAUSE_OF_DEATH_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof AutopsyReport>(field: K, value: AutopsyReport[K]) {
		documentStore.update(d => {
			if (d && d.type === 'autopsy') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Case Info -->
		<div class="terminal-window">
			<div class="terminal-header bg-gray-800">CASE INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Case Number"
						value={doc.caseNumber}
						placeholder="AUT-XXXX"
						required
						onchange={(v) => updateField('caseNumber', v)}
					/>
					<Input
						label="Related SCP"
						value={doc.relatedSCP || ''}
						placeholder="SCP-XXXX"
						onchange={(v) => updateField('relatedSCP', v || undefined)}
					/>
				</div>
				<Input
					label="Related Incident"
					value={doc.relatedIncident || ''}
					placeholder="INC-XXXX"
					onchange={(v) => updateField('relatedIncident', v || undefined)}
				/>
			</div>
		</div>

		<!-- Subject Info -->
		<div class="terminal-window">
			<div class="terminal-header bg-gray-800">SUBJECT INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Subject Type"
						value={doc.subjectType}
						options={subjectTypeOptions}
						onchange={(v) => updateField('subjectType', v as SubjectType)}
					/>
					<Input
						label="Subject Designation"
						value={doc.subjectDesignation}
						placeholder="D-XXXX, Entity-A, etc."
						required
						onchange={(v) => updateField('subjectDesignation', v)}
					/>
				</div>
				<Textarea
					label="Subject Description"
					value={doc.subjectDescription || ''}
					placeholder="Physical description, age, identifying features..."
					rows={3}
					onchange={(v) => updateField('subjectDescription', v || undefined)}
				/>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input
						label="Date of Death"
						type="date"
						value={doc.dateOfDeath || ''}
						onchange={(v) => updateField('dateOfDeath', v || undefined)}
					/>
					<Input
						label="Date of Examination"
						type="date"
						value={doc.dateOfExamination || ''}
						onchange={(v) => updateField('dateOfExamination', v || undefined)}
					/>
					<Input
						label="Location Recovered"
						value={doc.locationRecovered || ''}
						placeholder="Where body was found..."
						onchange={(v) => updateField('locationRecovered', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- Physical Examination -->
		<div class="terminal-window">
			<div class="terminal-header bg-gray-800">PHYSICAL EXAMINATION</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="External Examination"
					value={doc.externalExamination || ''}
					placeholder="External physical condition, wounds, marks..."
					rows={4}
					onchange={(v) => updateField('externalExamination', v || undefined)}
				/>
				<Textarea
					label="Anomalous Features"
					value={doc.anomalousFeatures || ''}
					placeholder="Any anomalous physical characteristics..."
					rows={3}
					onchange={(v) => updateField('anomalousFeatures', v || undefined)}
				/>
				<Textarea
					label="Internal Examination"
					value={doc.internalExamination || ''}
					placeholder="Organ condition, internal injuries..."
					rows={4}
					onchange={(v) => updateField('internalExamination', v || undefined)}
				/>
				<Textarea
					label="Tissue Analysis"
					value={doc.tissueAnalysis || ''}
					placeholder="Cellular/molecular findings..."
					rows={3}
					onchange={(v) => updateField('tissueAnalysis', v || undefined)}
				/>
			</div>
		</div>

		<!-- Cause of Death -->
		<div class="terminal-window">
			<div class="terminal-header bg-red-900 text-white">CAUSE OF DEATH</div>
			<div class="p-4 space-y-4">
				<Select
					label="Primary Cause"
					value={doc.causeOfDeath}
					options={causeOfDeathOptions}
					onchange={(v) => updateField('causeOfDeath', v as CauseOfDeath)}
				/>
				<Textarea
					label="Detailed Cause of Death"
					value={doc.causeDetails || ''}
					placeholder="Detailed explanation of cause of death..."
					rows={4}
					onchange={(v) => updateField('causeDetails', v || undefined)}
				/>
				<Textarea
					label="Toxicology Results"
					value={doc.toxicologyResults || ''}
					placeholder="Chemical analysis, foreign substances..."
					rows={3}
					onchange={(v) => updateField('toxicologyResults', v || undefined)}
				/>
				<Textarea
					label="Anomalous Findings"
					value={doc.anomalousFindings || ''}
					placeholder="Any anomalous factors contributing to death..."
					rows={3}
					onchange={(v) => updateField('anomalousFindings', v || undefined)}
				/>
			</div>
		</div>

		<!-- Conclusions -->
		<div class="terminal-window">
			<div class="terminal-header bg-gray-800">CONCLUSIONS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Conclusions"
					value={doc.conclusions || ''}
					placeholder="Final conclusions from examination..."
					rows={4}
					onchange={(v) => updateField('conclusions', v || undefined)}
				/>
				<Textarea
					label="Recommendations"
					value={doc.recommendations || ''}
					placeholder="Recommendations for containment, further study..."
					rows={3}
					onchange={(v) => updateField('recommendations', v || undefined)}
				/>
			</div>
		</div>

		<!-- Examiner -->
		<div class="terminal-window">
			<div class="terminal-header">EXAMINATION PERSONNEL</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Examining Physician"
					value={doc.examiner || ''}
					placeholder="Dr. [Name]"
					onchange={(v) => updateField('examiner', v || undefined)}
				/>
				<Input
					label="Witnesses"
					value={doc.witnesses || ''}
					placeholder="Additional personnel present..."
					onchange={(v) => updateField('witnesses', v || undefined)}
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
						checked={doc.showDiagram}
						onchange={(e) => updateField('showDiagram', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show body diagram placeholder</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showClinicalStyle}
						onchange={(e) => updateField('showClinicalStyle', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Use clinical/medical styling</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showWarnings}
						onchange={(e) => updateField('showWarnings', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show biohazard warnings</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
