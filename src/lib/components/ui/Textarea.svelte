<script lang="ts">
	interface Props {
		value: string;
		label?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		rows?: number;
		id?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value,
		label,
		placeholder = '',
		required = false,
		disabled = false,
		error,
		hint,
		rows = 4,
		id,
		class: className = '',
		onchange
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		onchange?.(target.value);
	}
</script>

<div class="flex flex-col gap-1 {className}">
	{#if label}
		<label for={id} class="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
			{label}
			{#if required}<span class="text-[var(--color-danger)]">*</span>{/if}
		</label>
	{/if}

	<textarea
		{id}
		{value}
		{placeholder}
		{required}
		{disabled}
		{rows}
		oninput={handleInput}
		class="
			w-full px-3 py-2
			bg-[var(--color-primary)]
			border border-[var(--color-border)]
			text-[var(--color-text)]
			font-mono text-sm
			rounded
			resize-y
			transition-all
			placeholder:text-[var(--color-text-muted)]
			focus:outline-none focus:border-[var(--color-accent)] focus:border-glow
			disabled:opacity-50 disabled:cursor-not-allowed
			{error ? 'border-[var(--color-danger)]' : ''}
		"
	></textarea>

	{#if error}
		<span class="text-xs text-[var(--color-danger)]">{error}</span>
	{:else if hint}
		<span class="text-xs text-[var(--color-text-muted)]">{hint}</span>
	{/if}
</div>
