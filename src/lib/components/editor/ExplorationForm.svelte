<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		EXPLORATION_STATUS_INFO,
		ENVIRONMENT_TYPE_INFO,
		type ExplorationLog,
		type ExplorationStatus,
		type EnvironmentType,
		type Waypoint
	} from '$lib/schemas/exploration';

	let doc = $state<ExplorationLog | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'exploration') {
				doc = d as ExplorationLog;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const statusOptions = Object.entries(EXPLORATION_STATUS_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const environmentOptions = Object.entries(ENVIRONMENT_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof ExplorationLog>(field: K, value: ExplorationLog[K]) {
		documentStore.update(d => {
			if (d && d.type === 'exploration') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function addWaypoint() {
		documentStore.update(d => {
			if (d && d.type === 'exploration') {
				const newWaypoint: Waypoint = {
					id: crypto.randomUUID(),
					timestamp: '',
					designation: `WP-${d.waypoints.length + 1}`,
					description: ''
				};
				return { ...d, waypoints: [...d.waypoints, newWaypoint] };
			}
			return d;
		});
	}

	function updateWaypoint(index: number, field: keyof Waypoint, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'exploration') {
				const newWaypoints = [...d.waypoints];
				newWaypoints[index] = { ...newWaypoints[index], [field]: value };
				return { ...d, waypoints: newWaypoints };
			}
			return d;
		});
	}

	function removeWaypoint(index: number) {
		documentStore.update(d => {
			if (d && d.type === 'exploration') {
				return { ...d, waypoints: d.waypoints.filter((_, i) => i !== index) };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Mission Info -->
		<div class="terminal-window">
			<div class="terminal-header">EXPLORATION MISSION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Log Number"
						value={doc.logNumber}
						placeholder="EXPL-XXXX"
						required
						onchange={(v) => updateField('logNumber', v)}
					/>
					<Input
						label="Mission Title"
						value={doc.missionTitle || ''}
						placeholder="Codename or title..."
						onchange={(v) => updateField('missionTitle', v || undefined)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Environment Type"
						value={doc.environmentType}
						options={environmentOptions}
						onchange={(v) => updateField('environmentType', v as EnvironmentType)}
					/>
					<Select
						label="Mission Status"
						value={doc.status}
						options={statusOptions}
						onchange={(v) => updateField('status', v as ExplorationStatus)}
					/>
				</div>
				<Input
					label="Related SCP"
					value={doc.relatedSCP || ''}
					placeholder="SCP-XXXX"
					onchange={(v) => updateField('relatedSCP', v || undefined)}
				/>
			</div>
		</div>

		<!-- Team -->
		<div class="terminal-window">
			<div class="terminal-header">EXPLORATION TEAM</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Team Designation"
						value={doc.teamDesignation}
						placeholder="MTF-XX, Research Team Alpha..."
						required
						onchange={(v) => updateField('teamDesignation', v)}
					/>
					<Input
						label="Team Leader"
						value={doc.teamLeader || ''}
						placeholder="Commander/Lead researcher..."
						onchange={(v) => updateField('teamLeader', v || undefined)}
					/>
				</div>
				<Textarea
					label="Team Members"
					value={doc.teamMembers || ''}
					placeholder="List team members and roles..."
					rows={3}
					onchange={(v) => updateField('teamMembers', v || undefined)}
				/>
				<Textarea
					label="Equipment"
					value={doc.equipmentList || ''}
					placeholder="Standard issue, specialized equipment..."
					rows={3}
					onchange={(v) => updateField('equipmentList', v || undefined)}
				/>
			</div>
		</div>

		<!-- Mission Details -->
		<div class="terminal-window">
			<div class="terminal-header">MISSION DETAILS</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Mission Date"
						type="date"
						value={doc.missionDate || ''}
						onchange={(v) => updateField('missionDate', v || undefined)}
					/>
					<Input
						label="Entry Point"
						value={doc.entryPoint || ''}
						placeholder="Entry location/portal..."
						onchange={(v) => updateField('entryPoint', v || undefined)}
					/>
				</div>
				<Textarea
					label="Mission Objectives"
					value={doc.objectives || ''}
					placeholder="Primary and secondary objectives..."
					rows={3}
					onchange={(v) => updateField('objectives', v || undefined)}
				/>
			</div>
		</div>

		<!-- Waypoints / Log Entries -->
		<div class="terminal-window">
			<div class="terminal-header flex items-center justify-between">
				<span>FIELD LOG ENTRIES</span>
				<button
					type="button"
					onclick={addWaypoint}
					class="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded hover:opacity-80"
				>
					+ Add Entry
				</button>
			</div>
			<div class="p-4 space-y-4">
				{#if doc.waypoints.length === 0}
					<p class="text-sm text-[var(--color-text-muted)] text-center py-4">
						No log entries yet. Click "Add Entry" to record observations.
					</p>
				{/if}
				{#each doc.waypoints as waypoint, i}
					<div class="border border-[var(--color-border)] p-4 rounded space-y-3">
						<div class="flex justify-between items-start">
							<span class="font-mono text-[var(--color-accent)]">Entry #{i + 1}</span>
							<button
								type="button"
								onclick={() => removeWaypoint(i)}
								class="text-red-500 hover:text-red-400 text-sm"
							>
								Remove
							</button>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<Input
								label="Timestamp"
								value={waypoint.timestamp}
								placeholder="T+00:00:00"
								onchange={(v) => updateWaypoint(i, 'timestamp', v)}
							/>
							<Input
								label="Designation"
								value={waypoint.designation}
								placeholder="WP-1, Landmark A..."
								onchange={(v) => updateWaypoint(i, 'designation', v)}
							/>
						</div>
						<Textarea
							label="Observations"
							value={waypoint.description}
							placeholder="Describe observations, environment, events..."
							rows={3}
							onchange={(v) => updateWaypoint(i, 'description', v)}
						/>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Textarea
								label="Hazards Noted"
								value={waypoint.hazards || ''}
								placeholder="Any dangers encountered..."
								rows={2}
								onchange={(v) => updateWaypoint(i, 'hazards', v)}
							/>
							<Textarea
								label="Discoveries"
								value={waypoint.discoveries || ''}
								placeholder="Items, entities, phenomena..."
								rows={2}
								onchange={(v) => updateWaypoint(i, 'discoveries', v)}
							/>
						</div>
						<Input
							label="Personnel Status"
							value={waypoint.personnelStatus || ''}
							placeholder="Team status at this point..."
							onchange={(v) => updateWaypoint(i, 'personnelStatus', v)}
						/>
					</div>
				{/each}
			</div>
		</div>

		<!-- Outcome -->
		<div class="terminal-window">
			<div class="terminal-header">MISSION OUTCOME</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Final Notes"
					value={doc.finalNotes || ''}
					placeholder="Summary of mission outcome..."
					rows={4}
					onchange={(v) => updateField('finalNotes', v || undefined)}
				/>
				<Textarea
					label="Recovered Materials"
					value={doc.recoveredMaterials || ''}
					placeholder="Items, samples, data recovered..."
					rows={3}
					onchange={(v) => updateField('recoveredMaterials', v || undefined)}
				/>
				<Textarea
					label="Recommended Actions"
					value={doc.recommendedActions || ''}
					placeholder="Recommendations for follow-up..."
					rows={3}
					onchange={(v) => updateField('recommendedActions', v || undefined)}
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
						checked={doc.showHandwrittenStyle}
						onchange={(e) => updateField('showHandwrittenStyle', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Use handwritten/field journal style</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showDamageEffects}
						onchange={(e) => updateField('showDamageEffects', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show damage/wear effects</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showTimestamps}
						onchange={(e) => updateField('showTimestamps', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show timestamps on entries</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
