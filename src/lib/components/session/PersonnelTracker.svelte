<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		sessionStore,
		PERSONNEL_STATUS_LABELS,
		type PersonnelEntry,
		type PersonnelStatus,
		type SessionState
	} from '$lib/stores/session';
	import { rollQuickNPC } from '$lib/generators/data/quick-rolls';

	let { session } = $props<{ session: SessionState }>();

	// Form state
	let showAddForm = $state(false);
	let newName = $state('');
	let newRole = $state('');
	let newLocation = $state('');
	let newNotes = $state('');

	// Edit state
	let editingId = $state<string | null>(null);

	const roleOptions = [
		{ value: 'Researcher', label: 'Researcher' },
		{ value: 'Security', label: 'Security' },
		{ value: 'D-Class', label: 'D-Class' },
		{ value: 'MTF', label: 'MTF Operative' },
		{ value: 'Medical', label: 'Medical' },
		{ value: 'Administrative', label: 'Administrative' },
		{ value: 'Technician', label: 'Technician' },
		{ value: 'Other', label: 'Other' }
	];

	function handleAdd() {
		if (newName.trim() && newRole) {
			sessionStore.addPersonnel({
				name: newName.trim(),
				role: newRole,
				status: 'active',
				location: newLocation.trim(),
				notes: newNotes.trim()
			});
			resetForm();
		}
	}

	function handleQuickAdd() {
		const npc = rollQuickNPC();
		sessionStore.addPersonnel({
			name: npc.name,
			role: npc.role,
			status: 'active',
			location: '',
			notes: npc.trait
		});
	}

	function resetForm() {
		newName = '';
		newRole = '';
		newLocation = '';
		newNotes = '';
		showAddForm = false;
	}

	function getStatusBadgeVariant(status: PersonnelStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
		switch (status) {
			case 'active': return 'success';
			case 'injured': return 'warning';
			case 'kia': return 'danger';
			case 'mia': return 'info';
			case 'compromised': return 'danger';
		}
	}

	function cycleStatus(entry: PersonnelEntry) {
		const statuses: PersonnelStatus[] = ['active', 'injured', 'mia', 'kia', 'compromised'];
		const currentIndex = statuses.indexOf(entry.status);
		const nextStatus = statuses[(currentIndex + 1) % statuses.length];
		sessionStore.setPersonnelStatus(entry.id, nextStatus);
	}

	function getStatusLabel(status: PersonnelStatus): string {
		return PERSONNEL_STATUS_LABELS[status];
	}
</script>

<div class="terminal-window">
	<div class="terminal-header flex items-center justify-between">
		<span>PERSONNEL TRACKER</span>
		<span class="text-xs">
			{session.personnel.filter((p: PersonnelEntry) => p.status === 'active').length}/{session.personnel.length} Active
		</span>
	</div>
	<div class="p-4">
		<!-- Add Buttons -->
		{#if !showAddForm}
			<div class="flex gap-2 mb-4">
				<Button variant="secondary" size="sm" onclick={() => showAddForm = true} class="flex-1">
					+ Add Personnel
				</Button>
				<button
					onclick={handleQuickAdd}
					title="Generate random NPC"
					class="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wide bg-transparent text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)] rounded transition-all"
				>
					Quick NPC
				</button>
			</div>
		{/if}

		<!-- Add Form -->
		{#if showAddForm}
			<div class="p-4 mb-4 border border-[var(--color-border)] rounded bg-[var(--color-primary)]">
				<div class="text-sm font-bold text-[var(--color-text-muted)] mb-3">ADD PERSONNEL</div>
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<Input
							value={newName}
							label="Name"
							placeholder="Dr. Smith..."
							onchange={(v) => newName = v}
						/>
						<Select
							label="Role"
							value={newRole}
							options={[{ value: '', label: 'Select...' }, ...roleOptions]}
							onchange={(v) => newRole = v}
						/>
					</div>
					<Input
						value={newLocation}
						label="Location"
						placeholder="Sector/Room..."
						onchange={(v) => newLocation = v}
					/>
					<Input
						value={newNotes}
						label="Notes/Trait"
						placeholder="Distinguishing feature or note..."
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

		<!-- Personnel List -->
		{#if session.personnel.length > 0}
			<div class="space-y-2 max-h-[400px] overflow-y-auto">
				{#each session.personnel as person (person.id)}
					<div class="p-3 border border-[var(--color-border)] rounded bg-[var(--color-primary)] {person.status === 'kia' ? 'opacity-50' : ''} {person.status === 'compromised' ? 'border-red-500' : ''}">
						<div class="flex items-center justify-between mb-1">
							<div class="flex items-center gap-2">
								<span class="font-bold {person.status === 'kia' ? 'line-through' : ''}">{person.name}</span>
								<span class="text-xs text-[var(--color-text-muted)]">{person.role}</span>
							</div>
							<button
								onclick={() => cycleStatus(person)}
								class="cursor-pointer"
								title="Click to cycle status"
							>
								<Badge variant={getStatusBadgeVariant(person.status)} size="sm">
									{getStatusLabel(person.status)}
								</Badge>
							</button>
						</div>

						{#if editingId === person.id}
							<!-- Edit Mode -->
							<div class="space-y-2 mt-3 pt-3 border-t border-[var(--color-border)]">
								<Input
									value={person.location}
									label="Location"
									onchange={(v) => sessionStore.updatePersonnel(person.id, { location: v })}
								/>
								<Input
									value={person.notes}
									label="Notes"
									onchange={(v) => sessionStore.updatePersonnel(person.id, { notes: v })}
								/>
								<div class="flex gap-2">
									<Button variant="ghost" size="sm" onclick={() => editingId = null}>
										Done
									</Button>
									<Button variant="danger" size="sm" onclick={() => {
										sessionStore.removePersonnel(person.id);
										editingId = null;
									}}>
										Remove
									</Button>
								</div>
							</div>
						{:else}
							<!-- Display Mode -->
							<div class="text-xs text-[var(--color-text-muted)]">
								{#if person.location}
									<span>@ {person.location}</span>
								{/if}
								{#if person.notes}
									<span class="italic"> - {person.notes}</span>
								{/if}
							</div>
							<button
								onclick={() => editingId = person.id}
								class="text-xs text-[var(--color-accent)] hover:underline mt-1"
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
				<div class="text-sm">No personnel being tracked</div>
				<div class="text-xs">Click "Add Personnel" or "Quick NPC"</div>
			</div>
		{/if}
	</div>
</div>
