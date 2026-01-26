<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface Tab {
		id: string;
		label: string;
		icon?: string;
		disabled?: boolean;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		ontabchange: (id: string) => void;
		children?: Snippet;
		class?: string;
	}

	let { tabs, activeTab, ontabchange, children, class: className = '' }: Props = $props();

	function handleTabClick(tab: Tab) {
		if (!tab.disabled) {
			ontabchange(tab.id);
		}
	}

	function handleKeydown(e: KeyboardEvent, tab: Tab) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleTabClick(tab);
		}
	}
</script>

<div class="tabs-container {className}">
	<!-- Tab List -->
	<div class="tab-list" role="tablist">
		{#each tabs as tab}
			<button
				class="tab-button {activeTab === tab.id ? 'active' : ''} {tab.disabled ? 'disabled' : ''}"
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls="tabpanel-{tab.id}"
				tabindex={activeTab === tab.id ? 0 : -1}
				disabled={tab.disabled}
				onclick={() => handleTabClick(tab)}
				onkeydown={(e) => handleKeydown(e, tab)}
			>
				{#if tab.icon}
					<span class="tab-icon">{tab.icon}</span>
				{/if}
				<span class="tab-label">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Panels -->
	{#if children}
		<div class="tab-content">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.tabs-container {
		display: flex;
		flex-direction: column;
	}

	.tab-list {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
		overflow-x: auto;
	}

	.tab-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-text-muted);
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.tab-button:hover:not(.disabled) {
		color: var(--color-text);
		background: var(--color-primary);
	}

	.tab-button.active {
		color: var(--color-accent);
		border-bottom-color: var(--color-accent);
	}

	.tab-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.tab-icon {
		font-size: 1rem;
	}

	.tab-content {
		padding: 1rem 0;
	}
</style>
