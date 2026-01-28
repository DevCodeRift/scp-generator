<script lang="ts">
	import { parseDatFileFromUpload, getDatDocumentTitle } from '$lib/dat/parser';
	import type { DatDocument } from '$lib/dat/types';

	interface Props {
		onImport: (doc: DatDocument, title: string) => void;
	}

	let { onImport }: Props = $props();

	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let loading = $state(false);

	async function handleFile(file: File) {
		if (!file.name.endsWith('.dat')) {
			error = 'Please select a .dat file';
			return;
		}

		error = null;
		loading = true;

		try {
			const doc = await parseDatFileFromUpload(file);
			const title = getDatDocumentTitle(doc);
			onImport(doc, title);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to parse .dat file';
		} finally {
			loading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
		input.value = '';
	}
</script>

<div
	class="dat-import-zone border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
		{isDragging
		? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
		: 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	role="button"
	tabindex="0"
>
	<label class="cursor-pointer block">
		<input
			type="file"
			accept=".dat"
			class="hidden"
			onchange={handleInputChange}
			disabled={loading}
		/>
		{#if loading}
			<div class="text-[var(--color-accent)] font-mono">
				<span class="animate-pulse">PARSING...</span>
			</div>
		{:else}
			<div class="space-y-2">
				<div class="text-4xl text-[var(--color-text-muted)]">
					&#128194;
				</div>
				<div class="text-sm font-bold text-[var(--color-text)]">
					Drop a .dat file here or click to browse
				</div>
				<div class="text-xs text-[var(--color-text-muted)]">
					Supports Gmod addon .dat template files
				</div>
			</div>
		{/if}
	</label>

	{#if error}
		<div class="mt-4 text-sm text-red-500 bg-red-500/10 p-2 rounded">
			{error}
		</div>
	{/if}
</div>
