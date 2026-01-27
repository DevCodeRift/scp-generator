<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		BREACH_LEVEL_INFO,
		BREACH_STATUS_INFO,
		RESPONSE_PROTOCOL_INFO,
		type ContainmentBreach,
		type BreachLevel,
		type BreachStatus,
		type ResponseProtocol
	} from '$lib/schemas/breach';
	import { OBJECT_CLASS_INFO } from '$lib/schemas/scp';

	let doc = $state<ContainmentBreach | null>(null);

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

	const classificationOptions = [
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const breachLevelOptions = Object.entries(BREACH_LEVEL_INFO).map(([value, info]) => ({
		value,
		label: `${info.label} - ${info.description}`
	}));

	const statusOptions = Object.entries(BREACH_STATUS_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const protocolOptions = Object.entries(RESPONSE_PROTOCOL_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const scpClassOptions = Object.entries(OBJECT_CLASS_INFO).map(([value, info]) => ({
		value,
		label: value.charAt(0).toUpperCase() + value.slice(1)
	}));

	function updateField<K extends keyof ContainmentBreach>(field: K, value: ContainmentBreach[K]) {
		documentStore.update(d => {
			if (d && d.type === 'breach') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof ContainmentBreach['metadata']>(field: K, value: ContainmentBreach['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'breach') {
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
					value={doc.metadata.classification || 'top-secret'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
			</div>
		</div>

		<!-- Breach Identification -->
		<div class="terminal-window">
			<div class="terminal-header bg-red-900 text-white">⚠ BREACH IDENTIFICATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Breach ID"
						value={doc.breachId}
						placeholder="CB-XXXX-XXX"
						required
						onchange={(v) => updateField('breachId', v)}
					/>
					<Input
						label="SCP Number"
						value={doc.scpNumber}
						placeholder="SCP-XXXX"
						required
						onchange={(v) => updateField('scpNumber', v)}
					/>
				</div>
				<Select
					label="SCP Classification"
					value={doc.scpClass || 'euclid'}
					options={scpClassOptions}
					onchange={(v) => updateField('scpClass', v)}
				/>
			</div>
		</div>

		<!-- Severity -->
		<div class="terminal-window">
			<div class="terminal-header">SEVERITY & STATUS</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Select
						label="Breach Level"
						value={doc.breachLevel}
						options={breachLevelOptions}
						onchange={(v) => updateField('breachLevel', v as BreachLevel)}
					/>
					<Select
						label="Status"
						value={doc.status}
						options={statusOptions}
						onchange={(v) => updateField('status', v as BreachStatus)}
					/>
					<Select
						label="Response Protocol"
						value={doc.responseProtocol}
						options={protocolOptions}
						onchange={(v) => updateField('responseProtocol', v as ResponseProtocol)}
					/>
				</div>
			</div>
		</div>

		<!-- When & Where -->
		<div class="terminal-window">
			<div class="terminal-header">DATE & LOCATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Date/Time of Breach"
						type="datetime-local"
						value={doc.dateTime}
						required
						onchange={(v) => updateField('dateTime', v)}
					/>
					<Input
						label="Original Containment Site"
						value={doc.originalContainmentSite}
						placeholder="Site-XX, Cell Y"
						required
						onchange={(v) => updateField('originalContainmentSite', v)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Current Location"
						value={doc.currentLocation || ''}
						placeholder="Last known location..."
						onchange={(v) => updateField('currentLocation', v || undefined)}
					/>
					<Input
						label="Affected Areas"
						value={doc.affectedAreas || ''}
						placeholder="Areas impacted by breach..."
						onchange={(v) => updateField('affectedAreas', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- What Happened -->
		<div class="terminal-window">
			<div class="terminal-header">BREACH DETAILS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Breach Description"
					value={doc.breachDescription}
					placeholder="Describe how the breach occurred..."
					rows={4}
					required
					onchange={(v) => updateField('breachDescription', v)}
				/>
				<Textarea
					label="Cause of Breach"
					value={doc.causeOfBreach || ''}
					placeholder="Root cause analysis..."
					rows={3}
					onchange={(v) => updateField('causeOfBreach', v || undefined)}
				/>
				<Textarea
					label="Anomalous Behavior"
					value={doc.anomalousBehavior || ''}
					placeholder="Unusual behavior exhibited..."
					rows={3}
					onchange={(v) => updateField('anomalousBehavior', v || undefined)}
				/>
			</div>
		</div>

		<!-- Response -->
		<div class="terminal-window">
			<div class="terminal-header">RESPONSE</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Initial Response"
					value={doc.initialResponse || ''}
					placeholder="Immediate actions taken..."
					rows={3}
					onchange={(v) => updateField('initialResponse', v || undefined)}
				/>
				<Textarea
					label="Containment Efforts"
					value={doc.containmentEfforts || ''}
					placeholder="Ongoing containment measures..."
					rows={4}
					onchange={(v) => updateField('containmentEfforts', v || undefined)}
				/>
				<Input
					label="Responding Units"
					value={doc.respondingUnits || ''}
					placeholder="MTF units, security teams..."
					onchange={(v) => updateField('respondingUnits', v || undefined)}
				/>
			</div>
		</div>

		<!-- Casualties -->
		<div class="terminal-window">
			<div class="terminal-header">CASUALTIES</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Personnel Casualties"
					type="number"
					value={String(doc.personnelCasualties)}
					onchange={(v) => updateField('personnelCasualties', parseInt(v) || 0)}
				/>
				<Input
					label="Civilian Exposure"
					type="number"
					value={String(doc.civilianExposure)}
					onchange={(v) => updateField('civilianExposure', parseInt(v) || 0)}
				/>
			</div>
		</div>

		<!-- Status -->
		<div class="terminal-window">
			<div class="terminal-header">RECONTAINMENT STATUS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Recontainment Status"
					value={doc.recontainmentStatus || ''}
					placeholder="Current progress on recontainment..."
					rows={3}
					onchange={(v) => updateField('recontainmentStatus', v || undefined)}
				/>
				<Input
					label="Estimated Recontainment"
					value={doc.estimatedRecontainment || ''}
					placeholder="Expected timeframe..."
					onchange={(v) => updateField('estimatedRecontainment', v || undefined)}
				/>
			</div>
		</div>

		<!-- Authorization -->
		<div class="terminal-window">
			<div class="terminal-header">AUTHORIZATION</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Reporting Officer"
					value={doc.reportingOfficer || ''}
					placeholder="Name and title..."
					onchange={(v) => updateField('reportingOfficer', v || undefined)}
				/>
				<Input
					label="Incident Commander"
					value={doc.incidentCommander || ''}
					placeholder="On-scene commander..."
					onchange={(v) => updateField('incidentCommander', v || undefined)}
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
						checked={doc.showCasualties}
						onchange={(e) => updateField('showCasualties', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show casualties section</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showUrgentBanner}
						onchange={(e) => updateField('showUrgentBanner', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show urgent warning banner</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
