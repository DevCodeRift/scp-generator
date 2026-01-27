<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		INCIDENT_SEVERITY_INFO,
		INCIDENT_STATUS_INFO,
		INCIDENT_TYPE_INFO,
		type IncidentReport,
		type IncidentSeverity,
		type IncidentStatus,
		type IncidentType
	} from '$lib/schemas/incident';

	let doc = $state<IncidentReport | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'incident') {
				doc = d as IncidentReport;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const classificationOptions = [
		{ value: 'restricted', label: 'Restricted' },
		{ value: 'confidential', label: 'Confidential' },
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const severityOptions = Object.entries(INCIDENT_SEVERITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const statusOptions = Object.entries(INCIDENT_STATUS_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const typeOptions = Object.entries(INCIDENT_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof IncidentReport>(field: K, value: IncidentReport[K]) {
		documentStore.update(d => {
			if (d && d.type === 'incident') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof IncidentReport['metadata']>(field: K, value: IncidentReport['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'incident') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}

	function updateCasualties(field: keyof IncidentReport['casualties'], value: number) {
		documentStore.update(d => {
			if (d && d.type === 'incident') {
				return { ...d, casualties: { ...d.casualties, [field]: value } };
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
					value={doc.metadata.classification || 'secret'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
			</div>
		</div>

		<!-- Incident Identification -->
		<div class="terminal-window">
			<div class="terminal-header">INCIDENT IDENTIFICATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Incident Number"
						value={doc.incidentNumber}
						placeholder="INC-XXXX-XXX"
						required
						onchange={(v) => updateField('incidentNumber', v)}
					/>
					<Select
						label="Incident Type"
						value={doc.incidentType}
						options={typeOptions}
						onchange={(v) => updateField('incidentType', v as IncidentType)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Severity"
						value={doc.severity}
						options={severityOptions}
						onchange={(v) => updateField('severity', v as IncidentSeverity)}
					/>
					<Select
						label="Status"
						value={doc.status}
						options={statusOptions}
						onchange={(v) => updateField('status', v as IncidentStatus)}
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
						label="Date Occurred"
						type="date"
						value={doc.dateOccurred}
						required
						onchange={(v) => updateField('dateOccurred', v)}
					/>
					<Input
						label="Time Occurred"
						type="time"
						value={doc.timeOccurred || ''}
						onchange={(v) => updateField('timeOccurred', v || undefined)}
					/>
				</div>
				<Input
					label="Location"
					value={doc.location}
					placeholder="Site-XX, Sector Y, Room Z..."
					required
					onchange={(v) => updateField('location', v)}
				/>
			</div>
		</div>

		<!-- Related Entities -->
		<div class="terminal-window">
			<div class="terminal-header">RELATED ENTITIES</div>
			<div class="p-4 space-y-4">
				<Input
					label="Related SCP(s)"
					value={doc.relatedSCPs || ''}
					placeholder="SCP-XXX, SCP-YYY..."
					onchange={(v) => updateField('relatedSCPs', v || undefined)}
				/>
				<Textarea
					label="Personnel Involved"
					value={doc.personnelInvolved || ''}
					placeholder="List personnel involved..."
					rows={3}
					onchange={(v) => updateField('personnelInvolved', v || undefined)}
				/>
				<Input
					label="Responding Teams"
					value={doc.respondingTeams || ''}
					placeholder="MTF units, security teams..."
					onchange={(v) => updateField('respondingTeams', v || undefined)}
				/>
			</div>
		</div>

		<!-- Report Content -->
		<div class="terminal-window">
			<div class="terminal-header">INCIDENT DETAILS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Summary"
					value={doc.summary}
					placeholder="Brief summary of the incident..."
					rows={4}
					required
					onchange={(v) => updateField('summary', v)}
				/>
				<Textarea
					label="Timeline"
					value={doc.timeline || ''}
					placeholder="Chronological sequence of events..."
					rows={6}
					onchange={(v) => updateField('timeline', v || undefined)}
				/>
				<Textarea
					label="Containment Actions"
					value={doc.containmentActions || ''}
					placeholder="Actions taken to contain/resolve..."
					rows={4}
					onchange={(v) => updateField('containmentActions', v || undefined)}
				/>
				<Textarea
					label="Damage Assessment"
					value={doc.damage || ''}
					placeholder="Property damage, infrastructure impact..."
					rows={3}
					onchange={(v) => updateField('damage', v || undefined)}
				/>
			</div>
		</div>

		<!-- Casualties -->
		<div class="terminal-window">
			<div class="terminal-header">CASUALTIES</div>
			<div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
				<Input
					label="Fatalities"
					type="number"
					value={String(doc.casualties.fatalities)}
					onchange={(v) => updateCasualties('fatalities', parseInt(v) || 0)}
				/>
				<Input
					label="Injuries"
					type="number"
					value={String(doc.casualties.injuries)}
					onchange={(v) => updateCasualties('injuries', parseInt(v) || 0)}
				/>
				<Input
					label="Missing"
					type="number"
					value={String(doc.casualties.missing)}
					onchange={(v) => updateCasualties('missing', parseInt(v) || 0)}
				/>
				<Input
					label="Amnesticized"
					type="number"
					value={String(doc.casualties.amnesticized)}
					onchange={(v) => updateCasualties('amnesticized', parseInt(v) || 0)}
				/>
			</div>
		</div>

		<!-- Follow-up -->
		<div class="terminal-window">
			<div class="terminal-header">FOLLOW-UP</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Recommendations"
					value={doc.recommendations || ''}
					placeholder="Recommended actions or changes..."
					rows={4}
					onchange={(v) => updateField('recommendations', v || undefined)}
				/>
				<Textarea
					label="Lessons Learned"
					value={doc.lessonsLearned || ''}
					placeholder="Key takeaways from this incident..."
					rows={3}
					onchange={(v) => updateField('lessonsLearned', v || undefined)}
				/>
			</div>
		</div>

		<!-- Authorization -->
		<div class="terminal-window">
			<div class="terminal-header">AUTHORIZATION</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Reported By"
					value={doc.reportedBy || ''}
					placeholder="Name and title..."
					onchange={(v) => updateField('reportedBy', v || undefined)}
				/>
				<Input
					label="Approved By"
					value={doc.approvedBy || ''}
					placeholder="Approving authority..."
					onchange={(v) => updateField('approvedBy', v || undefined)}
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
						checked={doc.showTimeline}
						onchange={(e) => updateField('showTimeline', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show timeline section</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
