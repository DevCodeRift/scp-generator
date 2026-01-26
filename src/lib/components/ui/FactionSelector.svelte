<script lang="ts">
	import { factionStore, FACTIONS, type Faction } from '$lib/stores/faction';

	let isOpen = $state(false);
	let currentFaction = $derived(FACTIONS.find(f => f.id === $factionStore));

	function selectFaction(faction: Faction) {
		factionStore.set(faction);
		isOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative">
	<button
		type="button"
		class="flex items-center gap-2 px-4 py-2 terminal-window hover:border-glow transition-all cursor-pointer"
		onclick={() => isOpen = !isOpen}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<span class="text-sm text-[var(--color-text-muted)]">FACTION:</span>
		<span class="font-bold text-[var(--color-accent)]">{currentFaction?.shortName || 'Foundation'}</span>
		<svg
			class="w-4 h-4 transition-transform {isOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-72 terminal-window z-50 shadow-lg"
			role="listbox"
		>
			<div class="terminal-header">
				SELECT FACTION
			</div>
			<div class="p-2">
				{#each FACTIONS as faction}
					<button
						type="button"
						class="w-full text-left px-3 py-2 hover:bg-[var(--color-secondary)] rounded transition-colors flex flex-col cursor-pointer {faction.id === $factionStore ? 'bg-[var(--color-secondary)] border-l-2 border-[var(--color-accent)]' : ''}"
						onclick={() => selectFaction(faction.id)}
						role="option"
						aria-selected={faction.id === $factionStore}
					>
						<span class="font-bold text-[var(--color-text)]">{faction.name}</span>
						<span class="text-xs text-[var(--color-text-muted)]">{faction.description}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if isOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 cursor-default"
		onclick={() => isOpen = false}
		aria-label="Close faction selector"
	></button>
{/if}
