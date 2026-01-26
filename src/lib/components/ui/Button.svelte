<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = `
		inline-flex items-center justify-center gap-2
		font-mono font-bold uppercase tracking-wide
		border rounded
		transition-all
		cursor-pointer
		disabled:opacity-50 disabled:cursor-not-allowed
	`;

	const variantClasses = {
		primary: `
			bg-[var(--color-accent)] text-[var(--color-background)]
			border-[var(--color-accent)]
			hover:bg-transparent hover:text-[var(--color-accent)] hover:border-glow
		`,
		secondary: `
			bg-transparent text-[var(--color-text)]
			border-[var(--color-border)]
			hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:border-glow
		`,
		danger: `
			bg-[var(--color-danger)] text-white
			border-[var(--color-danger)]
			hover:bg-transparent hover:text-[var(--color-danger)] hover:border-glow
		`,
		ghost: `
			bg-transparent text-[var(--color-text-muted)]
			border-transparent
			hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)]
		`
	};

	const sizeClasses = {
		sm: 'px-3 py-1 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
>
	{@render children()}
</button>
