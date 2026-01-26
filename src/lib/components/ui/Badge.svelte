<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
		size?: 'sm' | 'md' | 'lg';
		pill?: boolean;
		class?: string;
		children: import('svelte').Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		pill = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<span class="badge {variant} {size} {pill ? 'pill' : ''} {className}">
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: monospace;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border: 1px solid transparent;
	}

	/* Sizes */
	.sm {
		padding: 0.125rem 0.375rem;
		font-size: 0.625rem;
	}

	.md {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}

	.lg {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
	}

	/* Shapes */
	.badge {
		border-radius: 0.25rem;
	}

	.badge.pill {
		border-radius: 9999px;
	}

	/* Variants */
	.default {
		background: var(--color-primary);
		color: var(--color-text-muted);
		border-color: var(--color-border);
	}

	.success {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
		border-color: rgba(34, 197, 94, 0.3);
	}

	.warning {
		background: rgba(234, 179, 8, 0.15);
		color: #eab308;
		border-color: rgba(234, 179, 8, 0.3);
	}

	.danger {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
		border-color: rgba(239, 68, 68, 0.3);
	}

	.info {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
		border-color: rgba(59, 130, 246, 0.3);
	}

	.accent {
		background: var(--color-accent);
		color: white;
		border-color: var(--color-accent);
	}
</style>
