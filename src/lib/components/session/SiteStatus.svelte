<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import {
		sessionStore,
		ALERT_LEVELS,
		type AlertLevel,
		type SessionState
	} from '$lib/stores/session';

	let { session } = $props<{ session: SessionState }>();

	let newZone = $state('');

	const alertOptions = Object.entries(ALERT_LEVELS).map(([value, data]) => ({
		value,
		label: `${data.label} - ${data.description}`
	}));

	const powerOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'fluctuating', label: 'Fluctuating' },
		{ value: 'backup', label: 'Backup Power' },
		{ value: 'offline', label: 'OFFLINE' }
	];

	const commsOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'interference', label: 'Interference' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'offline', label: 'OFFLINE' }
	];

	function handleAddZone() {
		if (newZone.trim()) {
			sessionStore.addLockdownZone(newZone.trim());
			newZone = '';
		}
	}

	function getAlertClass(level: AlertLevel): string {
		switch (level) {
			case 'green': return 'bg-green-500/20 border-green-500 text-green-400';
			case 'yellow': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
			case 'red': return 'bg-red-500/20 border-red-500 text-red-400 animate-pulse';
			case 'black': return 'bg-gray-900 border-gray-600 text-gray-300';
		}
	}

	function getStatusClass(status: string): string {
		if (status === 'offline') return 'text-red-500';
		if (status === 'normal') return 'text-green-500';
		return 'text-yellow-500';
	}

	function getAlertLabel(level: AlertLevel): string {
		return ALERT_LEVELS[level].label;
	}

	function getAlertDescription(level: AlertLevel): string {
		return ALERT_LEVELS[level].description;
	}
</script>

<div class="terminal-window">
	<div class="terminal-header flex items-center justify-between">
		<span>SITE STATUS</span>
		<span class="text-xs opacity-60">{session.siteName}</span>
	</div>
	<div class="p-4 space-y-4">
		<!-- Alert Level Display -->
		<div class="p-4 border-2 {getAlertClass(session.alertLevel)} rounded text-center">
			<div class="text-xs uppercase tracking-widest mb-1">Current Alert Level</div>
			<div class="text-3xl font-bold tracking-wider">
				{getAlertLabel(session.alertLevel)}
			</div>
			<div class="text-sm opacity-80">{getAlertDescription(session.alertLevel)}</div>
		</div>

		<!-- Alert Level Selector -->
		<Select
			label="Set Alert Level"
			value={session.alertLevel}
			options={alertOptions}
			onchange={(v) => sessionStore.setAlertLevel(v as AlertLevel)}
		/>

		<!-- System Status Row -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Select
					label="Power Status"
					value={session.powerStatus}
					options={powerOptions}
					onchange={(v) => sessionStore.setPowerStatus(v as typeof session.powerStatus)}
				/>
				<div class="mt-1 text-xs {getStatusClass(session.powerStatus)} uppercase font-bold">
					{session.powerStatus}
				</div>
			</div>
			<div>
				<Select
					label="Comms Status"
					value={session.commsStatus}
					options={commsOptions}
					onchange={(v) => sessionStore.setCommsStatus(v as typeof session.commsStatus)}
				/>
				<div class="mt-1 text-xs {getStatusClass(session.commsStatus)} uppercase font-bold">
					{session.commsStatus}
				</div>
			</div>
		</div>

		<!-- Lockdown Zones -->
		<div>
			<div class="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
				Lockdown Zones
			</div>

			{#if session.lockdownZones.length > 0}
				<div class="flex flex-wrap gap-2 mb-3">
					{#each session.lockdownZones as zone}
						<button
							onclick={() => sessionStore.removeLockdownZone(zone)}
							class="px-2 py-1 text-xs font-mono bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/40 transition-colors"
							title="Click to remove"
						>
							{zone} <span class="ml-1 opacity-60">x</span>
						</button>
					{/each}
				</div>
			{:else}
				<div class="text-xs text-[var(--color-text-muted)] mb-3 italic">
					No zones in lockdown
				</div>
			{/if}

			<div class="flex gap-2">
				<Input
					value={newZone}
					placeholder="Sector/Zone name..."
					onchange={(v) => newZone = v}
					class="flex-1"
				/>
				<Button variant="secondary" size="sm" onclick={handleAddZone}>
					Add Zone
				</Button>
			</div>
		</div>
	</div>
</div>
