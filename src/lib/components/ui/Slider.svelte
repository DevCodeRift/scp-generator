<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		hint?: string;
		showValue?: boolean;
		valueFormat?: (value: number) => string;
		disabled?: boolean;
		class?: string;
		onchange: (value: number) => void;
	}

	let {
		value,
		min = 0,
		max = 100,
		step = 1,
		label,
		hint,
		showValue = true,
		valueFormat = (v) => String(v),
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	let id = $state(crypto.randomUUID());

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange(Number(target.value));
	}

	// Calculate percentage for custom styling
	let percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="slider-container {className}">
	{#if label}
		<div class="slider-header">
			<label for={id} class="slider-label">
				{label}
			</label>
			{#if showValue}
				<span class="slider-value">{valueFormat(value)}</span>
			{/if}
		</div>
	{/if}

	<div class="slider-wrapper">
		<input
			type="range"
			{id}
			{value}
			{min}
			{max}
			{step}
			{disabled}
			class="slider-input"
			style="--percentage: {percentage}%"
			oninput={handleInput}
		/>
	</div>

	{#if hint}
		<p class="slider-hint">{hint}</p>
	{/if}
</div>

<style>
	.slider-container {
		width: 100%;
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.slider-label {
		font-size: 0.875rem;
		color: var(--color-text);
	}

	.slider-value {
		font-size: 0.875rem;
		font-family: monospace;
		color: var(--color-accent);
		background: var(--color-primary);
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
	}

	.slider-wrapper {
		position: relative;
	}

	.slider-input {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		background: var(--color-primary);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		outline: none;
		cursor: pointer;
	}

	.slider-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Track fill */
	.slider-input {
		background: linear-gradient(
			to right,
			var(--color-accent) 0%,
			var(--color-accent) var(--percentage),
			var(--color-primary) var(--percentage),
			var(--color-primary) 100%
		);
	}

	/* Webkit thumb */
	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: var(--color-accent);
		border: 2px solid var(--color-background);
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.slider-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	.slider-input:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 3px var(--color-glow);
	}

	/* Firefox thumb */
	.slider-input::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: var(--color-accent);
		border: 2px solid var(--color-background);
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.slider-input::-moz-range-thumb:hover {
		transform: scale(1.1);
	}

	.slider-input:focus::-moz-range-thumb {
		box-shadow: 0 0 0 3px var(--color-glow);
	}

	.slider-hint {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin-top: 0.25rem;
	}
</style>
