<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		isExporting: boolean;
		onExportPNG: (options: ExportSettings) => void;
		onExportPDF: (options: ExportSettings) => void;
		onExportDAT?: () => void;
	}

	export interface ExportSettings {
		scale: number;
		format: 'a4' | 'letter' | 'fit';
		transparent: boolean;
	}

	let { isExporting, onExportPNG, onExportPDF, onExportDAT }: Props = $props();

	let showDropdown = $state(false);
	let scale = $state(2);
	let format = $state<'a4' | 'letter' | 'fit'>('fit');
	let transparent = $state(false);

	function handleExportPNG() {
		onExportPNG({ scale, format, transparent });
		showDropdown = false;
	}

	function handleExportPDF() {
		onExportPDF({ scale, format, transparent: false });
		showDropdown = false;
	}

	function handleExportDAT() {
		if (onExportDAT) {
			onExportDAT();
			showDropdown = false;
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.export-dropdown-container')) {
			showDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="export-dropdown-container relative">
	<Button
		variant="primary"
		size="sm"
		onclick={() => showDropdown = !showDropdown}
		disabled={isExporting}
	>
		{isExporting ? 'Exporting...' : 'Export ▼'}
	</Button>

	{#if showDropdown}
		<div class="absolute right-0 top-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 w-64 p-4">
			<div class="text-xs font-bold uppercase text-[var(--color-text-muted)] mb-3">Export Settings</div>

			<!-- Scale/Quality -->
			<div class="mb-3">
				<label class="text-xs text-[var(--color-text-muted)] block mb-1">
					Quality
					<select
						class="w-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded px-2 py-1.5 font-mono mt-1"
						bind:value={scale}
					>
						<option value={1}>1x (Standard)</option>
						<option value={2}>2x (High Quality)</option>
						<option value={3}>3x (Very High)</option>
						<option value={4}>4x (Maximum)</option>
					</select>
				</label>
			</div>

			<!-- Format/Size -->
			<div class="mb-3">
				<label class="text-xs text-[var(--color-text-muted)] block mb-1">
					Page Size (PDF only)
					<select
						class="w-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded px-2 py-1.5 font-mono mt-1"
						bind:value={format}
					>
						<option value="fit">Fit to Content</option>
						<option value="a4">A4 Paper</option>
						<option value="letter">US Letter</option>
					</select>
				</label>
			</div>

			<!-- Transparent Background (PNG only) -->
			<div class="mb-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={transparent}
						class="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-accent)]"
					/>
					<span class="text-sm text-[var(--color-text)]">Transparent background (PNG)</span>
				</label>
			</div>

			<!-- Export Buttons -->
			<div class="flex gap-2">
				<button
					class="flex-1 bg-[var(--color-accent)] text-white text-sm font-bold py-2 px-3 rounded hover:opacity-90 transition-opacity"
					onclick={handleExportPNG}
					disabled={isExporting}
				>
					PNG
				</button>
				<button
					class="flex-1 bg-gray-600 text-white text-sm font-bold py-2 px-3 rounded hover:opacity-90 transition-opacity"
					onclick={handleExportPDF}
					disabled={isExporting}
				>
					PDF
				</button>
				{#if onExportDAT}
					<button
						class="flex-1 bg-amber-700 text-white text-sm font-bold py-2 px-3 rounded hover:opacity-90 transition-opacity"
						onclick={handleExportDAT}
						disabled={isExporting}
					>
						DAT
					</button>
				{/if}
			</div>

			<div class="mt-3 text-xs text-[var(--color-text-muted)] text-center">
				Higher quality = larger file size
			</div>
		</div>
	{/if}
</div>
