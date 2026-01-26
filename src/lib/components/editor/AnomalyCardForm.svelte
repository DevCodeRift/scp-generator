<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import { CARD_STYLE_INFO, type AnomalyCard, type CardStyle } from '$lib/schemas/anomaly-card';
	import { OBJECT_CLASS_INFO, type ObjectClass, type DisruptionClass, type RiskClass } from '$lib/schemas/scp';

	let doc = $state<AnomalyCard | null>(null);

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

	const classificationOptions = [
		{ value: 'unrestricted', label: 'Unrestricted' },
		{ value: 'restricted', label: 'Restricted' },
		{ value: 'confidential', label: 'Confidential' },
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const objectClassOptions = Object.entries(OBJECT_CLASS_INFO).map(([value, info]) => ({
		value,
		label: value.charAt(0).toUpperCase() + value.slice(1),
		description: info.description
	}));

	const disruptionOptions = [
		{ value: '', label: 'None' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'vlam', label: 'Vlam' },
		{ value: 'keneq', label: 'Keneq' },
		{ value: 'ekhi', label: 'Ekhi' },
		{ value: 'amida', label: 'Amida' }
	];

	const riskOptions = [
		{ value: '', label: 'None' },
		{ value: 'notice', label: 'Notice' },
		{ value: 'caution', label: 'Caution' },
		{ value: 'warning', label: 'Warning' },
		{ value: 'danger', label: 'Danger' },
		{ value: 'critical', label: 'Critical' }
	];

	const styleOptions = Object.entries(CARD_STYLE_INFO).map(([value, info]) => ({
		value,
		label: info.label,
		description: info.description
	}));

	function updateField<K extends keyof AnomalyCard>(field: K, value: AnomalyCard[K]) {
		documentStore.update(d => {
			if (d && d.type === 'anomaly-card') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof AnomalyCard['metadata']>(field: K, value: AnomalyCard['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'anomaly-card') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Classification -->
		<div class="terminal-window">
			<div class="terminal-header">DOCUMENT CLASSIFICATION</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Classification"
					value={doc.metadata.classification || 'restricted'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
				<Select
					label="Card Style"
					value={doc.cardStyle}
					options={styleOptions}
					onchange={(v) => updateField('cardStyle', v as CardStyle)}
				/>
			</div>
		</div>

		<!-- Core Identification -->
		<div class="terminal-window">
			<div class="terminal-header">ANOMALY IDENTIFICATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Item Number"
						value={doc.itemNumber}
						placeholder="SCP-XXXX"
						required
						onchange={(v) => updateField('itemNumber', v)}
					/>
					<Input
						label="Nickname / Alias"
						value={doc.nickname || ''}
						placeholder="Common name..."
						onchange={(v) => updateField('nickname', v || undefined)}
					/>
				</div>
				<Select
					label="Object Class"
					value={doc.objectClass}
					options={objectClassOptions}
					onchange={(v) => updateField('objectClass', v as ObjectClass)}
				/>
			</div>
		</div>

		<!-- ACS Classification -->
		<div class="terminal-window">
			<div class="terminal-header">ACS CLASSIFICATION (Optional)</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Disruption Class"
						value={doc.disruptionClass || ''}
						options={disruptionOptions}
						onchange={(v) => updateField('disruptionClass', v ? v as DisruptionClass : undefined)}
					/>
					<Select
						label="Risk Class"
						value={doc.riskClass || ''}
						options={riskOptions}
						onchange={(v) => updateField('riskClass', v ? v as RiskClass : undefined)}
					/>
				</div>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showACS}
						onchange={(e) => updateField('showACS', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Display ACS module on card</span>
				</label>
			</div>
		</div>

		<!-- Brief Info -->
		<div class="terminal-window">
			<div class="terminal-header">BRIEF DESCRIPTION</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Brief Description"
					value={doc.briefDescription}
					placeholder="One-paragraph summary of the anomaly..."
					rows={4}
					required
					onchange={(v) => updateField('briefDescription', v)}
				/>
				<Textarea
					label="Primary Hazards"
					value={doc.primaryHazards || ''}
					placeholder="Main hazards and risks..."
					rows={2}
					onchange={(v) => updateField('primaryHazards', v || undefined)}
				/>
			</div>
		</div>

		<!-- Containment Summary -->
		<div class="terminal-window">
			<div class="terminal-header">CONTAINMENT</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Containment Summary"
					value={doc.containmentSummary || ''}
					placeholder="Brief containment requirements..."
					rows={3}
					onchange={(v) => updateField('containmentSummary', v || undefined)}
				/>
				<Textarea
					label="Special Requirements"
					value={doc.specialRequirements || ''}
					placeholder="Special handling or containment notes..."
					rows={2}
					onchange={(v) => updateField('specialRequirements', v || undefined)}
				/>
			</div>
		</div>

		<!-- Quick Reference -->
		<div class="terminal-window">
			<div class="terminal-header">QUICK REFERENCE</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Location"
						value={doc.location || ''}
						placeholder="Current containment location..."
						onchange={(v) => updateField('location', v || undefined)}
					/>
					<Input
						label="Assigned Personnel"
						value={doc.assignedPersonnel || ''}
						placeholder="Primary assigned staff..."
						onchange={(v) => updateField('assignedPersonnel', v || undefined)}
					/>
				</div>
				<Input
					label="Last Incident"
					value={doc.lastIncident || ''}
					placeholder="Date/reference of last incident..."
					onchange={(v) => updateField('lastIncident', v || undefined)}
				/>
			</div>
		</div>

		<!-- Options -->
		<div class="terminal-window">
			<div class="terminal-header">DISPLAY OPTIONS</div>
			<div class="p-4 space-y-3">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showHazards}
						onchange={(e) => updateField('showHazards', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show hazards section</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
