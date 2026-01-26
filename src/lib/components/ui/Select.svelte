<script lang="ts">
	interface Option {
		value: string;
		label: string;
		description?: string;
	}

	interface Props {
		value: string;
		options: Option[];
		label?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		id?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value,
		options,
		label,
		required = false,
		disabled = false,
		error,
		hint,
		id,
		class: className = '',
		onchange
	}: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
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

	<select
		{id}
		{value}
		{required}
		{disabled}
		onchange={handleChange}
		class="
			w-full px-3 py-2
			bg-[var(--color-primary)]
			border border-[var(--color-border)]
			text-[var(--color-text)]
			font-mono text-sm
			rounded
			transition-all
			cursor-pointer
			focus:outline-none focus:border-[var(--color-accent)] focus:border-glow
			disabled:opacity-50 disabled:cursor-not-allowed
			{error ? 'border-[var(--color-danger)]' : ''}
		"
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	{#if error}
		<span class="text-xs text-[var(--color-danger)]">{error}</span>
	{:else if hint}
		<span class="text-xs text-[var(--color-text-muted)]">{hint}</span>
	{/if}
</div>
