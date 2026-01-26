<script lang="ts">
	interface Props {
		jobId: string;
		status: 'processing' | 'complete' | 'error';
		progress: number;
		error?: string | null;
		onDownload: () => void;
		onRetry: () => void;
		onReset: () => void;
	}

	let { jobId, status, progress, error: errorMsg, onDownload, onRetry, onReset }: Props = $props();

	let statusLabel = $derived(
		status === 'processing'
			? progress > 80
				? 'ENCODING...'
				: progress > 0
					? 'APPLYING EFFECTS...'
					: 'INITIALIZING...'
			: status === 'complete'
				? 'PROCESSING COMPLETE'
				: 'PROCESSING FAILED'
	);
</script>

<div class="terminal-window">
	<div class="terminal-header bg-gray-900 flex items-center justify-between">
		<span>PROCESSING STATUS</span>
		<span class="text-xs font-mono text-[var(--color-text-muted)]">JOB: {jobId.slice(0, 8)}</span>
	</div>
	<div class="p-6">
		{#if status === 'processing'}
			<div class="space-y-4">
				<!-- Status text -->
				<div class="text-center">
					<div class="text-[var(--color-accent)] font-mono text-lg animate-pulse">
						{statusLabel}
					</div>
					<div class="text-sm text-[var(--color-text-muted)] mt-1">
						{progress}% complete
					</div>
				</div>

				<!-- Progress bar -->
				<div class="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
					<div
						class="bg-[var(--color-accent)] h-full transition-all duration-500 rounded-full relative overflow-hidden"
						style="width: {progress}%"
					>
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
					</div>
				</div>

				<!-- Terminal-style log -->
				<div class="bg-black/50 rounded p-3 font-mono text-xs text-green-400 space-y-1">
					<div>> Initializing FFmpeg pipeline...</div>
					{#if progress > 10}
						<div>> Loading input video...</div>
					{/if}
					{#if progress > 25}
						<div>> Applying video filter chain...</div>
					{/if}
					{#if progress > 50}
						<div>> Encoding frames... ({progress}%)</div>
					{/if}
					{#if progress > 80}
						<div>> Finalizing output file...</div>
					{/if}
					<div class="animate-pulse">_</div>
				</div>
			</div>
		{:else if status === 'complete'}
			<div class="text-center space-y-4">
				<div class="text-4xl">&#9989;</div>
				<div class="text-lg font-bold text-green-400">Processing Complete</div>
				<div class="text-sm text-[var(--color-text-muted)]">
					Your video has been processed with SCP body camera effects.
				</div>
				<div class="flex gap-3 justify-center">
					<button
						class="px-6 py-2.5 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
						onclick={onDownload}
					>
						Download Video
					</button>
					<button
						class="px-4 py-2.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-primary)] transition-colors"
						onclick={onReset}
					>
						Process Another
					</button>
				</div>
			</div>
		{:else if status === 'error'}
			<div class="text-center space-y-4">
				<div class="text-4xl">&#10060;</div>
				<div class="text-lg font-bold text-red-400">Processing Failed</div>
				{#if errorMsg}
					<div class="text-sm text-red-300 bg-red-500/10 p-3 rounded font-mono">
						{errorMsg}
					</div>
				{/if}
				<div class="flex gap-3 justify-center">
					<button
						class="px-6 py-2.5 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
						onclick={onRetry}
					>
						Retry
					</button>
					<button
						class="px-4 py-2.5 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-primary)] transition-colors"
						onclick={onReset}
					>
						Start Over
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
</style>
