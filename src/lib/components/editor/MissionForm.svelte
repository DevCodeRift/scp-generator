<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		MISSION_PRIORITY_INFO,
		MISSION_STATUS_INFO,
		MISSION_TYPE_INFO,
		type MissionBriefing,
		type MissionPriority,
		type MissionStatus,
		type MissionType,
		type TeamMember
	} from '$lib/schemas/mission';

	let doc = $state<MissionBriefing | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'mission') {
				doc = d as MissionBriefing;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const classificationOptions = [
		{ value: 'confidential', label: 'Confidential' },
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const priorityOptions = Object.entries(MISSION_PRIORITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const statusOptions = Object.entries(MISSION_STATUS_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const typeOptions = Object.entries(MISSION_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof MissionBriefing>(field: K, value: MissionBriefing[K]) {
		documentStore.update(d => {
			if (d && d.type === 'mission') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof MissionBriefing['metadata']>(field: K, value: MissionBriefing['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'mission') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}

	function addTeamMember() {
		documentStore.update(d => {
			if (d && d.type === 'mission') {
				return { ...d, teamMembers: [...d.teamMembers, { callsign: '', role: '' }] };
			}
			return d;
		});
	}

	function updateTeamMember(index: number, field: keyof TeamMember, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'mission') {
				const newMembers = [...d.teamMembers];
				newMembers[index] = { ...newMembers[index], [field]: value };
				return { ...d, teamMembers: newMembers };
			}
			return d;
		});
	}

	function removeTeamMember(index: number) {
		documentStore.update(d => {
			if (d && d.type === 'mission') {
				const newMembers = d.teamMembers.filter((_, i) => i !== index);
				return { ...d, teamMembers: newMembers };
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

		<!-- Mission Identification -->
		<div class="terminal-window">
			<div class="terminal-header">MISSION IDENTIFICATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Mission Code"
						value={doc.missionCode}
						placeholder="OP-XXXX-XXX"
						required
						onchange={(v) => updateField('missionCode', v)}
					/>
					<Input
						label="Mission Name"
						value={doc.missionName || ''}
						placeholder="Operation codename..."
						onchange={(v) => updateField('missionName', v || undefined)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Select
						label="Mission Type"
						value={doc.missionType}
						options={typeOptions}
						onchange={(v) => updateField('missionType', v as MissionType)}
					/>
					<Select
						label="Priority"
						value={doc.priority}
						options={priorityOptions}
						onchange={(v) => updateField('priority', v as MissionPriority)}
					/>
					<Select
						label="Status"
						value={doc.status}
						options={statusOptions}
						onchange={(v) => updateField('status', v as MissionStatus)}
					/>
				</div>
			</div>
		</div>

		<!-- Assignment -->
		<div class="terminal-window">
			<div class="terminal-header">ASSIGNMENT</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Assigned Team"
						value={doc.assignedTeam}
						placeholder="MTF Alpha-1, etc..."
						required
						onchange={(v) => updateField('assignedTeam', v)}
					/>
					<Input
						label="Team Leader"
						value={doc.teamLeader || ''}
						placeholder="Commanding officer..."
						onchange={(v) => updateField('teamLeader', v || undefined)}
					/>
				</div>

				<!-- Team Roster -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">Team Roster</span>
						<button
							type="button"
							onclick={addTeamMember}
							class="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded hover:opacity-80"
						>
							+ Add Member
						</button>
					</div>
					{#each doc.teamMembers as member, i}
						<div class="grid grid-cols-[1fr,1fr,auto] gap-2">
							<Input
								value={member.callsign}
								placeholder="Callsign"
								onchange={(v) => updateTeamMember(i, 'callsign', v)}
							/>
							<Input
								value={member.role}
								placeholder="Role"
								onchange={(v) => updateTeamMember(i, 'role', v)}
							/>
							<button
								type="button"
								onclick={() => removeTeamMember(i)}
								class="px-2 text-red-500 hover:text-red-400"
							>
								×
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Timing -->
		<div class="terminal-window">
			<div class="terminal-header">TIMING</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<Input
					label="Date Issued"
					type="date"
					value={doc.dateIssued || ''}
					onchange={(v) => updateField('dateIssued', v || undefined)}
				/>
				<Input
					label="Deployment Date"
					type="date"
					value={doc.deploymentDate || ''}
					onchange={(v) => updateField('deploymentDate', v || undefined)}
				/>
				<Input
					label="Expected Duration"
					value={doc.expectedDuration || ''}
					placeholder="e.g., 48 hours"
					onchange={(v) => updateField('expectedDuration', v || undefined)}
				/>
			</div>
		</div>

		<!-- Location -->
		<div class="terminal-window">
			<div class="terminal-header">LOCATION</div>
			<div class="p-4 space-y-4">
				<Input
					label="Operation Area"
					value={doc.operationArea}
					placeholder="General area of operations..."
					required
					onchange={(v) => updateField('operationArea', v)}
				/>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Insertion Point"
						value={doc.insertionPoint || ''}
						placeholder="Entry point..."
						onchange={(v) => updateField('insertionPoint', v || undefined)}
					/>
					<Input
						label="Extraction Point"
						value={doc.extractionPoint || ''}
						placeholder="Exit point..."
						onchange={(v) => updateField('extractionPoint', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- Mission Details -->
		<div class="terminal-window">
			<div class="terminal-header">MISSION DETAILS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Primary Objective"
					value={doc.objective}
					placeholder="Main mission objective..."
					rows={3}
					required
					onchange={(v) => updateField('objective', v)}
				/>
				<Textarea
					label="Secondary Objectives"
					value={doc.secondaryObjectives || ''}
					placeholder="Additional objectives..."
					rows={3}
					onchange={(v) => updateField('secondaryObjectives', v || undefined)}
				/>
				<Textarea
					label="Background Intel"
					value={doc.backgroundIntel || ''}
					placeholder="Relevant intelligence..."
					rows={4}
					onchange={(v) => updateField('backgroundIntel', v || undefined)}
				/>
				<Textarea
					label="Threat Assessment"
					value={doc.threatAssessment || ''}
					placeholder="Expected threats and dangers..."
					rows={4}
					onchange={(v) => updateField('threatAssessment', v || undefined)}
				/>
			</div>
		</div>

		<!-- Equipment & Rules -->
		<div class="terminal-window">
			<div class="terminal-header">EQUIPMENT & PROTOCOLS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Authorized Equipment"
					value={doc.authorizedEquipment || ''}
					placeholder="List authorized equipment and weaponry..."
					rows={4}
					onchange={(v) => updateField('authorizedEquipment', v || undefined)}
				/>
				<Textarea
					label="Rules of Engagement"
					value={doc.rulesOfEngagement || ''}
					placeholder="Combat and engagement protocols..."
					rows={3}
					onchange={(v) => updateField('rulesOfEngagement', v || undefined)}
				/>
				<Textarea
					label="Contingency Protocols"
					value={doc.contingencyProtocols || ''}
					placeholder="Fallback plans and emergency procedures..."
					rows={3}
					onchange={(v) => updateField('contingencyProtocols', v || undefined)}
				/>
			</div>
		</div>

		<!-- Related -->
		<div class="terminal-window">
			<div class="terminal-header">RELATED INFORMATION</div>
			<div class="p-4 space-y-4">
				<Input
					label="Related SCP(s)"
					value={doc.relatedSCPs || ''}
					placeholder="SCP-XXX, SCP-YYY..."
					onchange={(v) => updateField('relatedSCPs', v || undefined)}
				/>
				<Input
					label="Authorized By"
					value={doc.authorizedBy || ''}
					placeholder="Authorizing authority..."
					onchange={(v) => updateField('authorizedBy', v || undefined)}
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
						checked={doc.showTeamRoster}
						onchange={(e) => updateField('showTeamRoster', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show team roster</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showThreatLevel}
						onchange={(e) => updateField('showThreatLevel', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show threat assessment</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
