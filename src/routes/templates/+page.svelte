<script lang="ts">
	import DatImport from '$lib/components/ui/DatImport.svelte';
	import DatPreview from '$lib/components/preview/DatPreview.svelte';
	import DatEditor from '$lib/components/editor/DatEditor.svelte';
	import { getDatDocumentTitle, getDatDocumentStats } from '$lib/dat/parser';
	import { downloadDatFile } from '$lib/dat/serializer';
	import { PRESET_TEMPLATES, loadPresetTemplate } from '$lib/dat/presets';
	import type { DatDocument } from '$lib/dat/types';
	import Button from '$lib/components/ui/Button.svelte';
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';

	let importedDocs = $state<Array<{ doc: DatDocument; title: string }>>([]);
	let selectedDocIndex = $state<number | null>(null);
	let previewScale = $state(0.8);
	let loadingPreset = $state<string | null>(null);
	let presetError = $state<string | null>(null);
	let editMode = $state(false);

	// Derived selected document
	let selectedDoc = $derived(selectedDocIndex !== null ? importedDocs[selectedDocIndex]?.doc : null);

	function handleImport(doc: DatDocument, title: string) {
		importedDocs = [...importedDocs, { doc, title }];
		selectedDocIndex = importedDocs.length - 1;
	}

	function handleDocUpdate(updatedDoc: DatDocument) {
		if (selectedDocIndex !== null) {
			importedDocs[selectedDocIndex] = {
				...importedDocs[selectedDocIndex],
				doc: updatedDoc
			};
		}
	}

	async function handleLoadPreset(id: string) {
		loadingPreset = id;
		presetError = null;
		try {
			const doc = await loadPresetTemplate(id);
			const title = getDatDocumentTitle(doc);
			handleImport(doc, title);
		} catch (e) {
			presetError = e instanceof Error ? e.message : 'Failed to load preset';
		} finally {
			loadingPreset = null;
		}
	}

	function handleRemove(index: number) {
		importedDocs = importedDocs.filter((_, i) => i !== index);
		if (selectedDocIndex === index) {
			selectedDocIndex = importedDocs.length > 0 ? 0 : null;
		} else if (selectedDocIndex !== null && selectedDocIndex > index) {
			selectedDocIndex--;
		}
	}

	function handleDownload(doc: DatDocument) {
		const title = getDatDocumentTitle(doc);
		downloadDatFile(doc, `${title}.dat`);
	}

	function formatDate(date: Date | null): string {
		if (!date) return 'Unknown';
		return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>DAT Templates | SCP Document Generator</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--color-background)]">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
		<div class="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-terminal crt-glow text-[var(--color-accent)] hover:opacity-80">
					SCP://DOCGEN
				</a>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">DAT Templates</span>
			</div>
			<FactionSelector />
		</div>
	</header>

	<main class="flex-1">
		{#if editMode && selectedDoc && selectedDocIndex !== null}
			<!-- Full-width Edit Mode (Google Docs style) -->
			<div class="edit-mode-container">
				<!-- Sticky Toolbar -->
				<div class="edit-toolbar">
					<div class="edit-toolbar-inner">
						<div class="flex items-center gap-4">
							<button
								class="text-sm px-3 py-1.5 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center gap-2"
								onclick={() => (editMode = false)}
							>
								<span>&larr;</span> Back to Templates
							</button>
							<span class="text-sm text-gray-400 font-medium">
								{getDatDocumentTitle(selectedDoc)}
							</span>
						</div>
						<div class="flex items-center gap-3">
							<Button
								variant="ghost"
								size="sm"
								onclick={() => selectedDoc && handleDownload(selectedDoc)}
							>
								Download .dat
							</Button>
						</div>
					</div>
				</div>

				<!-- Editor Content -->
				<div class="edit-content">
					<DatEditor
						bind:document={importedDocs[selectedDocIndex].doc}
						scale={1}
						onUpdate={handleDocUpdate}
					/>
				</div>
			</div>
		{:else}
			<!-- Normal two-column layout -->
			<div class="max-w-[1800px] mx-auto px-4 py-6">
				<div class="grid lg:grid-cols-[1fr_1fr] gap-6">
					<!-- Left: Import & List -->
					<div class="space-y-6">
					<!-- Preset Templates -->
					<div class="terminal-window">
						<div class="terminal-header bg-gray-900">PRESET TEMPLATES</div>
						<div class="p-4">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{#each PRESET_TEMPLATES as preset}
									<button
										class="text-left p-3 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all disabled:opacity-50 disabled:cursor-wait"
										onclick={() => handleLoadPreset(preset.id)}
										disabled={loadingPreset !== null}
									>
										<div class="font-bold text-sm text-[var(--color-text)]">
											{#if loadingPreset === preset.id}
												<span class="animate-pulse">Loading...</span>
											{:else}
												{preset.name}
											{/if}
										</div>
										<div class="text-xs text-[var(--color-text-muted)] mt-0.5">
											{preset.description}
										</div>
									</button>
								{/each}
							</div>
							{#if presetError}
								<div class="mt-3 text-sm text-red-500 bg-red-500/10 p-2 rounded">
									{presetError}
								</div>
							{/if}
						</div>
					</div>

					<!-- Import Zone -->
					<div class="terminal-window">
						<div class="terminal-header bg-gray-900">IMPORT .DAT TEMPLATE</div>
						<div class="p-4">
							<DatImport onImport={handleImport} />
						</div>
					</div>

					<!-- Imported Templates List -->
					{#if importedDocs.length > 0}
						<div class="terminal-window">
							<div class="terminal-header bg-gray-900">
								LOADED TEMPLATES ({importedDocs.length})
							</div>
							<div class="divide-y divide-[var(--color-border)]">
								{#each importedDocs as { doc, title }, i}
									{@const stats = getDatDocumentStats(doc)}
									<div
										class="p-4 flex items-center justify-between hover:bg-[var(--color-primary)] cursor-pointer transition-colors
											{selectedDocIndex === i ? 'bg-[var(--color-accent)]/10 border-l-2 border-l-[var(--color-accent)]' : ''}"
										role="button"
										tabindex="0"
										onclick={() => (selectedDocIndex = i)}
										onkeydown={(e) => e.key === 'Enter' && (selectedDocIndex = i)}
									>
										<div>
											<div class="font-bold text-sm">{title}</div>
											<div class="text-xs text-[var(--color-text-muted)] mt-1 space-x-3">
												<span>{stats.pages} pages</span>
												<span>{stats.totalElements} elements</span>
												{#if stats.signatures > 0}
													<span>{stats.signatures} signatures</span>
												{/if}
												{#if stats.images > 0}
													<span>{stats.images} images</span>
												{/if}
												{#if stats.checkboxes > 0}
													<span>{stats.checkboxes} checkboxes</span>
												{/if}
											</div>
											<div class="text-xs text-[var(--color-text-muted)] mt-0.5">
												Type: {doc.type} | Created: {formatDate(stats.date)}
											</div>
										</div>
										<div class="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onclick={(e) => {
													e.stopPropagation();
													handleDownload(doc);
												}}
											>
												Save
											</Button>
											<button
												class="text-red-500 hover:text-red-400 text-sm px-2"
												onclick={(e) => {
													e.stopPropagation();
													handleRemove(i);
												}}
											>
												x
											</button>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Info -->
					<div class="text-xs text-[var(--color-text-muted)] space-y-1 p-4">
						<p>DAT files are JSON-formatted document templates used by Gmod SCP RP addons.</p>
						<p>Import .dat files to view their structure, or export app documents to .dat format from the editor.</p>
					</div>
				</div>

				<!-- Right: Preview/Editor -->
				<div class="space-y-4">
					{#if selectedDoc && selectedDocIndex !== null}
						<div class="sticky top-16">
							<!-- Controls -->
							<div class="bg-gray-900 border border-gray-700 rounded-t-lg p-2 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<span class="text-xs text-gray-400 uppercase tracking-wide">
										{editMode ? 'Edit Mode' : 'Preview'}
									</span>
									<button
										class="text-xs px-2 py-1 rounded transition-colors {editMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
										onclick={() => (editMode = !editMode)}
									>
										{editMode ? 'Preview' : 'Edit'}
									</button>
								</div>
								<div class="flex items-center gap-2">
									{#if !editMode}
										<button
											class="text-xs text-gray-400 hover:text-white px-2 py-1"
											onclick={() => (previewScale = Math.max(0.4, previewScale - 0.1))}
										>
											-
										</button>
										<span class="text-xs text-gray-400 w-12 text-center">
											{Math.round(previewScale * 100)}%
										</span>
										<button
											class="text-xs text-gray-400 hover:text-white px-2 py-1"
											onclick={() => (previewScale = Math.min(1.2, previewScale + 0.1))}
										>
											+
										</button>
									{/if}
									<Button
										variant="ghost"
										size="sm"
										onclick={() => selectedDoc && handleDownload(selectedDoc)}
									>
										Download .dat
									</Button>
								</div>
							</div>
							<!-- Content -->
							<div class="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-4 overflow-auto max-h-[80vh]">
								{#if editMode}
									<DatEditor
										bind:document={importedDocs[selectedDocIndex].doc}
										scale={0.9}
										onUpdate={handleDocUpdate}
									/>
								{:else}
									<DatPreview document={selectedDoc} scale={previewScale} />
								{/if}
							</div>
						</div>
					{:else}
						<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-16 text-center">
							<div class="text-4xl text-[var(--color-text-muted)] mb-4">&#128196;</div>
							<p class="text-[var(--color-text-muted)]">Import a .dat file to preview it here</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
		{/if}
	</main>
</div>

<style>
	.edit-mode-container {
		min-height: calc(100vh - 60px);
		background: #1a1a1a;
	}

	.edit-toolbar {
		position: sticky;
		top: 60px;
		z-index: 30;
		background: #111;
		border-bottom: 1px solid #333;
		padding: 0.75rem 0;
	}

	.edit-toolbar-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.edit-content {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	/* Override DatEditor styles for full-width mode */
	.edit-content :global(.dat-editor) {
		max-width: 100%;
	}

	.edit-content :global(.dat-page) {
		padding: 3rem;
	}

	.edit-content :global(.element-controls) {
		right: -40px;
	}
</style>
