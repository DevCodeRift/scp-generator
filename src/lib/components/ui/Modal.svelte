<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, size = 'md', onclose, children, footer }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onclose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && onclose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal -->
		<div class="terminal-window w-full {sizeClasses[size]} mx-4 max-h-[90vh] flex flex-col">
			<!-- Header -->
			<div class="terminal-header flex items-center justify-between">
				<span id="modal-title" class="font-bold">{title}</span>
				<button
					class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
					onclick={onclose}
					aria-label="Close modal"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="p-4 overflow-y-auto flex-1">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="border-t border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Modal entrance animation */
	.terminal-window {
		animation: modalIn 0.15s ease-out;
	}

	@keyframes modalIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
