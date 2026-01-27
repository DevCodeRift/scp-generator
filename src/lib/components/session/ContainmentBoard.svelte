<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		sessionStore,
		CONTAINMENT_STATUS_LABELS,
		type ContainmentEntry,
		type ContainmentStatus,
		type SessionState
	} from '$lib/stores/session';

	let { session } = $props<{ session: SessionState }>();

	// Form state for adding new SCP
	let showAddForm = $state(false);
	let newDesignation = $state('');
	let newThreatLevel = $state<1 | 2 | 3 | 4 | 5>(3);
	let newLocation = $state('');
	let newNotes = $state('');

	// Edit state
	let editingId = $state<string | null>(null);

	const threatOptions = [
		{ value: '1', label: 'Level 1 - Minimal' },
		{ value: '2', label: 'Level 2 - Low' },
		{ value: '3', label: 'Level 3 - Moderate' },
		{ value: '4', label: 'Level 4 - High' },
		{ value: '5', label: 'Level 5 - Critical' }
	];

	function handleAdd() {
		if (newDesignation.trim()) {
			sessionStore.addContainment({
				designation: newDesignation.trim(),
				status: 'contained',
				threatLevel: newThreatLevel,
				location: newLocation.trim(),
				notes: newNotes.trim()
			});
			resetForm();
		}
	}

	function resetForm() {
		newDesignation = '';
		newThreatLevel = 3;
		newLocation = '';
		newNotes = '';
		showAddForm = false;
	}

	function getStatusBadgeVariant(status: ContainmentStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
		switch (status) {
			case 'contained': return 'success';
			case 'breaching': return 'warning';
			case 'loose': return 'danger';
			case 'neutralized': return 'info';
			case 'unknown': return 'default';
		}
	}

	function getThreatClass(level: number): string {
		switch (level) {
			case 1: return 'text-green-500';
			case 2: return 'text-blue-500';
			case 3: return 'text-yellow-500';
			case 4: return 'text-orange-500';
			case 5: return 'text-red-500';
			default: return 'text-gray-500';
		}
	}

	function cycleStatus(entry: ContainmentEntry) {
		const statuses: ContainmentStatus[] = ['contained', 'breaching', 'loose', 'neutralized', 'unknown'];
		const currentIndex = statuses.indexOf(entry.status);
		const nextStatus = statuses[(currentIndex + 1) % statuses.length];
		sessionStore.setContainmentStatus(entry.id, nextStatus);
	}

	function getStatusLabel(status: ContainmentStatus): string {
		return CONTAINMENT_STATUS_LABELS[status];
	}
</script>

<div class="terminal-window">
	<div class="terminal-header flex items-center justify-between">
		<span>CONTAINMENT BOARD</span>
		<span class="text-xs">
			{session.containment.filter((c: ContainmentEntry) => c.status === 'loose' || c.status === 'breaching').length} Active Threats
		</span>
	</div>
	<div class="p-4">
		<!-- Add Button -->
		{#if !showAddForm}
			<Button variant="secondary" size="sm" onclick={() => showAddForm = true} class="mb-4 w-full">
				+ Add SCP
			</Button>
		{/if}

		<!-- Add Form -->
		{#if showAddForm}
			<div class="p-4 mb-4 border border-[var(--color-border)] rounded bg-[var(--color-primary)]">
				<div class="text-sm font-bold text-[var(--color-text-muted)] mb-3">ADD NEW SCP</div>
				<div class="space-y-3">
					<Input
						value={newDesignation}
						label="Designation"
						placeholder="SCP-XXX"
						onchange={(v) => newDesignation = v}
					/>
					<div class="grid grid-cols-2 gap-3">
						<Select
							label="Threat Level"
							value={String(newThreatLevel)}
							options={threatOptions}
							onchange={(v) => newThreatLevel = parseInt(v) as 1 | 2 | 3 | 4 | 5}
						/>
						<Input
							value={newLocation}
							label="Location"
							placeholder="Cell/Sector..."
							onchange={(v) => newLocation = v}
						/>
					</div>
					<Input
						value={newNotes}
						label="Notes"
						placeholder="Quick notes..."
						onchange={(v) => newNotes = v}
					/>
					<div class="flex gap-2">
						<Button variant="primary" size="sm" onclick={handleAdd}>
							Add
						</Button>
						<Button variant="ghost" size="sm" onclick={resetForm}>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Containment List -->
		{#if session.containment.length > 0}
			<div class="space-y-2">
				{#each session.containment as entry (entry.id)}
					<div class="p-3 border border-[var(--color-border)] rounded bg-[var(--color-primary)] {entry.status === 'loose' ? 'border-red-500 animate-pulse' : entry.status === 'breaching' ? 'border-yellow-500' : ''}">
						<div class="flex items-center justify-between mb-2">
							<div class="flex items-center gap-2">
								<span class="font-bold text-[var(--color-accent)]">{entry.designation}</span>
								<span class="text-xs {getThreatClass(entry.threatLevel)}">
									TL-{entry.threatLevel}
								</span>
							</div>
							<button
								onclick={() => cycleStatus(entry)}
								class="cursor-pointer"
								title="Click to cycle status"
							>
								<Badge variant={getStatusBadgeVariant(entry.status)} size="sm">
									{getStatusLabel(entry.status)}
								</Badge>
							</button>
						</div>

						{#if editingId === entry.id}
							<!-- Edit Mode -->
							<div class="space-y-2 mt-3 pt-3 border-t border-[var(--color-border)]">
								<Input
									value={entry.location}
									label="Location"
									onchange={(v) => sessionStore.updateContainment(entry.id, { location: v })}
								/>
								<Input
									value={entry.notes}
									label="Notes"
									onchange={(v) => sessionStore.updateContainment(entry.id, { notes: v })}
								/>
								<div class="flex gap-2">
									<Button variant="ghost" size="sm" onclick={() => editingId = null}>
										Done
									</Button>
									<Button variant="danger" size="sm" onclick={() => {
										sessionStore.removeContainment(entry.id);
										editingId = null;
									}}>
										Remove
									</Button>
								</div>
							</div>
						{:else}
							<!-- Display Mode -->
							<div class="text-xs text-[var(--color-text-muted)] space-y-1">
								{#if entry.location}
									<div>Location: {entry.location}</div>
								{/if}
								{#if entry.notes}
									<div class="italic">{entry.notes}</div>
								{/if}
							</div>
							<button
								onclick={() => editingId = entry.id}
								class="text-xs text-[var(--color-accent)] hover:underline mt-2"
							>
								Edit
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8 text-[var(--color-text-muted)]">
				<div class="text-4xl mb-2 opacity-30">[ ]</div>
				<div class="text-sm">No SCPs being tracked</div>
				<div class="text-xs">Click "Add SCP" to begin</div>
			</div>
		{/if}
	</div>
</div>
