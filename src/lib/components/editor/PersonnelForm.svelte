<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		PERSONNEL_CLEARANCE_INFO,
		PERSONNEL_STATUS_INFO,
		PERSONNEL_TYPE_INFO,
		type PersonnelFile,
		type PersonnelClearance,
		type PersonnelStatus,
		type PersonnelType
	} from '$lib/schemas/personnel';

	let doc = $state<PersonnelFile | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'personnel') {
				doc = d as PersonnelFile;
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

	const clearanceOptions = Object.entries(PERSONNEL_CLEARANCE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const statusOptions = Object.entries(PERSONNEL_STATUS_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const typeOptions = Object.entries(PERSONNEL_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof PersonnelFile>(field: K, value: PersonnelFile[K]) {
		documentStore.update(d => {
			if (d && d.type === 'personnel') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof PersonnelFile['metadata']>(field: K, value: PersonnelFile['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'personnel') {
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
					value={doc.metadata.classification || 'confidential'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
			</div>
		</div>

		<!-- Identity -->
		<div class="terminal-window">
			<div class="terminal-header">IDENTITY</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Staff ID"
						value={doc.staffId}
						placeholder="SC-XXXXX"
						required
						onchange={(v) => updateField('staffId', v)}
					/>
					<Input
						label="Full Name"
						value={doc.fullName}
						placeholder="Full legal name..."
						required
						onchange={(v) => updateField('fullName', v)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Aliases / Codenames"
						value={doc.aliases || ''}
						placeholder="Known aliases..."
						onchange={(v) => updateField('aliases', v || undefined)}
					/>
					<Input
						label="Date of Birth"
						type="date"
						value={doc.dateOfBirth || ''}
						onchange={(v) => updateField('dateOfBirth', v || undefined)}
					/>
				</div>
				<Input
					label="Nationality"
					value={doc.nationality || ''}
					placeholder="Nationality..."
					onchange={(v) => updateField('nationality', v || undefined)}
				/>
			</div>
		</div>

		<!-- Position -->
		<div class="terminal-window">
			<div class="terminal-header">POSITION & CLEARANCE</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Personnel Type"
						value={doc.personnelType}
						options={typeOptions}
						onchange={(v) => updateField('personnelType', v as PersonnelType)}
					/>
					<Select
						label="Clearance Level"
						value={doc.clearanceLevel}
						options={clearanceOptions}
						onchange={(v) => updateField('clearanceLevel', v as PersonnelClearance)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Department"
						value={doc.department || ''}
						placeholder="Department name..."
						onchange={(v) => updateField('department', v || undefined)}
					/>
					<Input
						label="Site Assignment"
						value={doc.site || ''}
						placeholder="Site-XX"
						onchange={(v) => updateField('site', v || undefined)}
					/>
				</div>
				<Input
					label="Supervisor"
					value={doc.supervisor || ''}
					placeholder="Supervising personnel..."
					onchange={(v) => updateField('supervisor', v || undefined)}
				/>
			</div>
		</div>

		<!-- Status -->
		<div class="terminal-window">
			<div class="terminal-header">STATUS</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Current Status"
					value={doc.status}
					options={statusOptions}
					onchange={(v) => updateField('status', v as PersonnelStatus)}
				/>
				<Input
					label="Date Joined"
					type="date"
					value={doc.dateJoined || ''}
					onchange={(v) => updateField('dateJoined', v || undefined)}
				/>
			</div>
		</div>

		<!-- Background -->
		<div class="terminal-window">
			<div class="terminal-header">BACKGROUND</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Education"
					value={doc.education || ''}
					placeholder="Educational background, degrees, institutions..."
					rows={3}
					onchange={(v) => updateField('education', v || undefined)}
				/>
				<Textarea
					label="Specializations"
					value={doc.specializations || ''}
					placeholder="Areas of expertise, skills, certifications..."
					rows={3}
					onchange={(v) => updateField('specializations', v || undefined)}
				/>
				<Input
					label="Languages"
					value={doc.languages || ''}
					placeholder="English (Native), German (Fluent), etc..."
					onchange={(v) => updateField('languages', v || undefined)}
				/>
				<Textarea
					label="Previous Assignments"
					value={doc.previousAssignments || ''}
					placeholder="List previous assignments and roles..."
					rows={4}
					onchange={(v) => updateField('previousAssignments', v || undefined)}
				/>
			</div>
		</div>

		<!-- Notes -->
		<div class="terminal-window">
			<div class="terminal-header">NOTES & EVALUATIONS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Psychological Profile"
					value={doc.psychProfile || ''}
					placeholder="Psychological evaluation notes..."
					rows={4}
					onchange={(v) => updateField('psychProfile', v || undefined)}
				/>
				<Textarea
					label="Medical Notes"
					value={doc.medicalNotes || ''}
					placeholder="Relevant medical information..."
					rows={3}
					onchange={(v) => updateField('medicalNotes', v || undefined)}
				/>
				<Textarea
					label="Additional Notes"
					value={doc.notes || ''}
					placeholder="Any additional notes or remarks..."
					rows={4}
					onchange={(v) => updateField('notes', v || undefined)}
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
						checked={doc.showPhoto}
						onchange={(e) => updateField('showPhoto', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show photo placeholder</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showRedactedSections}
						onchange={(e) => updateField('showRedactedSections', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show [REDACTED] sections</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
