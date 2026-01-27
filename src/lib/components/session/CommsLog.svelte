<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import {
		sessionStore,
		type CommQuality,
		type SessionState
	} from '$lib/stores/session';

	let { session } = $props<{ session: SessionState }>();

	// Form state
	let newSender = $state('');
	let newMessage = $state('');
	let newQuality = $state<CommQuality>('clear');

	// UI state
	let autoScroll = $state(true);
	let logContainer: HTMLDivElement;

	const qualityOptions = [
		{ value: 'clear', label: 'Clear' },
		{ value: 'static', label: '[STATIC]' },
		{ value: 'interference', label: '[INTERFERENCE]' },
		{ value: 'signal-lost', label: '[SIGNAL LOST]' }
	];

	const quickSenders = [
		'Command',
		'MTF Lead',
		'Security',
		'Medical',
		'Site Director',
		'Unknown'
	];

	function handleAdd() {
		if (newSender.trim() && newMessage.trim()) {
			sessionStore.addCommsEntry({
				sender: newSender.trim(),
				message: newMessage.trim(),
				quality: newQuality
			});
			newMessage = '';
			// Auto-scroll to bottom
			if (autoScroll && logContainer) {
				setTimeout(() => {
					logContainer.scrollTop = logContainer.scrollHeight;
				}, 50);
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleAdd();
		}
	}

	function handleExport() {
		const text = sessionStore.exportCommsLog();
		if (text) {
			navigator.clipboard.writeText(text);
			// Could show a toast here
		}
	}

	function getQualityClass(quality: CommQuality): string {
		switch (quality) {
			case 'clear': return '';
			case 'static': return 'opacity-70';
			case 'interference': return 'opacity-60 italic';
			case 'signal-lost': return 'opacity-40 line-through';
		}
	}

	function getQualityMarker(quality: CommQuality): string {
		switch (quality) {
			case 'clear': return '';
			case 'static': return ' [STATIC]';
			case 'interference': return ' [INTERFERENCE]';
			case 'signal-lost': return ' [SIGNAL LOST]';
		}
	}
</script>

<div class="terminal-window h-full flex flex-col">
	<div class="terminal-header flex items-center justify-between">
		<span>COMMUNICATIONS LOG</span>
		<div class="flex items-center gap-2">
			<span class="text-xs">{session.commsLog.length} entries</span>
			{#if session.commsLog.length > 0}
				<button
					onclick={handleExport}
					class="text-xs px-2 py-0.5 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded"
					title="Copy to clipboard"
				>
					Export
				</button>
			{/if}
		</div>
	</div>

	<!-- Log Display -->
	<div
		bind:this={logContainer}
		class="flex-1 p-4 overflow-y-auto font-mono text-sm bg-black/30 min-h-[200px] max-h-[300px]"
	>
		{#if session.commsLog.length > 0}
			{#each session.commsLog as entry (entry.id)}
				<div class="mb-2 {getQualityClass(entry.quality)} group hover:bg-[var(--color-primary)]/50 p-1 rounded">
					<span class="text-[var(--color-text-muted)]">[{entry.timestamp}]</span>
					<span class="text-[var(--color-accent)] font-bold">{entry.sender}</span>
					{#if entry.quality !== 'clear'}
						<span class="text-yellow-500">{getQualityMarker(entry.quality)}</span>
					{/if}
					<span>: {entry.message}</span>
					<button
						onclick={() => sessionStore.removeCommsEntry(entry.id)}
						class="ml-2 opacity-0 group-hover:opacity-100 text-red-500 text-xs"
					>
						x
					</button>
				</div>
			{/each}
		{:else}
			<div class="text-center text-[var(--color-text-muted)] py-8">
				<div class="opacity-50">No transmissions logged</div>
				<div class="text-xs mt-1">Add entries below to build the log</div>
			</div>
		{/if}
	</div>

	<!-- Input Area -->
	<div class="p-4 border-t border-[var(--color-border)]">
		<!-- Quick sender buttons -->
		<div class="flex flex-wrap gap-1 mb-3">
			{#each quickSenders as sender}
				<button
					onclick={() => newSender = sender}
					class="px-2 py-0.5 text-xs font-mono bg-[var(--color-primary)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] {newSender === sender ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : ''}"
				>
					{sender}
				</button>
			{/each}
		</div>

		<div class="flex gap-2 mb-2">
			<Input
				value={newSender}
				placeholder="Sender..."
				onchange={(v) => newSender = v}
				class="w-32"
			/>
			<Select
				value={newQuality}
				options={qualityOptions}
				onchange={(v) => newQuality = v as CommQuality}
				class="w-36"
			/>
		</div>

		<div class="flex gap-2">
			<input
				type="text"
				bind:value={newMessage}
				placeholder="Message..."
				onkeydown={handleKeydown}
				class="flex-1 px-3 py-2 bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] font-mono text-sm rounded focus:outline-none focus:border-[var(--color-accent)]"
			/>
			<Button variant="primary" size="md" onclick={handleAdd}>
				Send
			</Button>
		</div>

		<div class="flex items-center justify-between mt-2">
			<label class="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
				<input
					type="checkbox"
					bind:checked={autoScroll}
					class="rounded"
				/>
				Auto-scroll
			</label>
			{#if session.commsLog.length > 0}
				<button
					onclick={() => sessionStore.clearCommsLog()}
					class="text-xs text-red-500 hover:underline"
				>
					Clear Log
				</button>
			{/if}
		</div>
	</div>
</div>
