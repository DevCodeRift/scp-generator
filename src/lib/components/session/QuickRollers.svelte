<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import {
		rollComplication,
		rollDiscovery,
		rollResponse,
		rollSound,
		rollQuickNPC
	} from '$lib/generators/data/quick-rolls';

	interface RollResult {
		type: string;
		text: string;
		timestamp: string;
	}

	let results = $state<RollResult[]>([]);
	let isRolling = $state(false);

	function addResult(type: string, text: string) {
		const timestamp = new Date().toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		results = [{ type, text, timestamp }, ...results].slice(0, 10); // Keep last 10
	}

	function handleRoll(type: string, rollFn: () => string | { name: string; role: string; trait: string }) {
		isRolling = true;
		setTimeout(() => {
			const result = rollFn();
			if (typeof result === 'string') {
				addResult(type, result);
			} else {
				// NPC result
				addResult(type, `${result.name} (${result.role}) - ${result.trait}`);
			}
			isRolling = false;
		}, 100);
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'COMPLICATION': return 'text-red-400';
			case 'DISCOVERY': return 'text-blue-400';
			case 'RESPONSE': return 'text-green-400';
			case 'SOUND': return 'text-yellow-400';
			case 'NPC': return 'text-purple-400';
			default: return 'text-[var(--color-text)]';
		}
	}

	function getTypeBg(type: string): string {
		switch (type) {
			case 'COMPLICATION': return 'bg-red-500/10 border-red-500/30';
			case 'DISCOVERY': return 'bg-blue-500/10 border-blue-500/30';
			case 'RESPONSE': return 'bg-green-500/10 border-green-500/30';
			case 'SOUND': return 'bg-yellow-500/10 border-yellow-500/30';
			case 'NPC': return 'bg-purple-500/10 border-purple-500/30';
			default: return 'bg-[var(--color-primary)] border-[var(--color-border)]';
		}
	}

	function clearResults() {
		results = [];
	}
</script>

<div class="terminal-window">
	<div class="terminal-header flex items-center justify-between">
		<span>QUICK ROLLERS</span>
		{#if results.length > 0}
			<button
				onclick={clearResults}
				class="text-xs opacity-60 hover:opacity-100"
			>
				Clear
			</button>
		{/if}
	</div>
	<div class="p-4">
		<!-- Roll Buttons -->
		<div class="grid grid-cols-2 gap-2 mb-4">
			<button
				onclick={() => handleRoll('COMPLICATION', rollComplication)}
				disabled={isRolling}
				class="p-3 text-sm font-bold uppercase tracking-wide bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
			>
				What Goes Wrong?
			</button>
			<button
				onclick={() => handleRoll('DISCOVERY', rollDiscovery)}
				disabled={isRolling}
				class="p-3 text-sm font-bold uppercase tracking-wide bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
			>
				What Do They Find?
			</button>
			<button
				onclick={() => handleRoll('RESPONSE', rollResponse)}
				disabled={isRolling}
				class="p-3 text-sm font-bold uppercase tracking-wide bg-green-500/20 border border-green-500/50 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
			>
				Foundation Response
			</button>
			<button
				onclick={() => handleRoll('SOUND', rollSound)}
				disabled={isRolling}
				class="p-3 text-sm font-bold uppercase tracking-wide bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
			>
				What Do They Hear?
			</button>
		</div>

		<button
			onclick={() => handleRoll('NPC', rollQuickNPC)}
			disabled={isRolling}
			class="w-full p-3 text-sm font-bold uppercase tracking-wide bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded hover:bg-purple-500/30 transition-colors disabled:opacity-50 mb-4"
		>
			Who Shows Up?
		</button>

		<!-- Results Display -->
		{#if results.length > 0}
			<div class="space-y-2 max-h-[250px] overflow-y-auto">
				{#each results as result, i}
					<div class="p-3 border rounded {getTypeBg(result.type)} {i === 0 ? 'animate-pulse' : ''}">
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs font-bold {getTypeColor(result.type)}">{result.type}</span>
							<span class="text-xs text-[var(--color-text-muted)]">{result.timestamp}</span>
						</div>
						<div class="text-sm">{result.text}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-6 text-[var(--color-text-muted)]">
				<div class="text-3xl mb-2 opacity-30">?</div>
				<div class="text-sm">Click a button to roll</div>
			</div>
		{/if}
	</div>
</div>
