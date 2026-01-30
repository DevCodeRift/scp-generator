<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		datEditorStore,
		currentPage,
		currentElement,
		canUndo,
		canRedo
	} from '$lib/stores/dat-editor';
	import { PRESET_TEMPLATES, loadPresetTemplate } from '$lib/dat/presets';
	import { parseDatFileFromUpload } from '$lib/dat/parser';
	import { serializeDatDocument, downloadDatFile } from '$lib/dat/serializer';
	import type { DatElement, DatElementType } from '$lib/dat/types';

	// Editor state
	let showTemplateModal = $state(false);
	let showFieldsPanel = $state(false);
	let showSettingsPanel = $state(false);
	let isSaving = $state(false);
	let zoom = $state(100);
	let fileInput: HTMLInputElement;

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			switch (e.key.toLowerCase()) {
				case 'z':
					e.preventDefault();
					if (e.shiftKey) {
						datEditorStore.redo();
					} else {
						datEditorStore.undo();
					}
					break;
				case 'y':
					e.preventDefault();
					datEditorStore.redo();
					break;
				case 's':
					e.preventDefault();
					handleSave();
					break;
				case 'c':
					if ($datEditorStore.selectedElementIndex !== null) {
						datEditorStore.copyElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex);
					}
					break;
				case 'v':
					if ($datEditorStore.clipboard) {
						e.preventDefault();
						datEditorStore.pasteElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex ?? undefined);
					}
					break;
			}
		}
		if (e.key === 'Delete' && $datEditorStore.selectedElementIndex !== null) {
			datEditorStore.deleteElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex);
		}
		if (e.key === 'Escape') {
			datEditorStore.selectElement(null);
			showTemplateModal = false;
			showFieldsPanel = false;
			showSettingsPanel = false;
		}
	}

	onMount(() => {
		// Start with a new document
		datEditorStore.newDocument();
	});

	// File operations
	async function handleOpen() {
		fileInput?.click();
	}

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			try {
				const doc = await parseDatFileFromUpload(file);
				datEditorStore.loadDocument(doc);
			} catch (err) {
				alert(`Failed to open file: ${err instanceof Error ? err.message : 'Unknown error'}`);
			}
		}
		input.value = '';
	}

	function handleSave() {
		const doc = datEditorStore.getDocument();
		if (doc) {
			downloadDatFile(doc, `${doc.fields.title || 'document'}.dat`);
			datEditorStore.markSaved();
		}
	}

	function handleNew() {
		if ($datEditorStore.isDirty) {
			if (!confirm('You have unsaved changes. Create a new document anyway?')) return;
		}
		datEditorStore.newDocument();
	}

	async function handleLoadTemplate(id: string) {
		try {
			const doc = await loadPresetTemplate(id);
			datEditorStore.loadDocument(doc);
			showTemplateModal = false;
		} catch (err) {
			alert(`Failed to load template: ${err instanceof Error ? err.message : 'Unknown error'}`);
		}
	}

	// Element type labels
	const elementTypeLabels: Record<DatElementType, string> = {
		header: 'Header 1',
		header2: 'Header 2',
		header3: 'Header 3',
		paragraph: 'Paragraph',
		smalltext: 'Small Text',
		line: 'Line',
		dottedline: 'Dotted Line',
		image: 'Image',
		signature: 'Signature',
		checkbox: 'Checkbox'
	};

	// Element icons
	const elementIcons: Record<DatElementType, string> = {
		header: 'H1',
		header2: 'H2',
		header3: 'H3',
		paragraph: 'P',
		smalltext: 'Sm',
		line: '—',
		dottedline: '···',
		image: '🖼',
		signature: '✍',
		checkbox: '☐'
	};

	function getElementPreview(el: DatElement): string {
		if (el.type === 'line') return '────────────────────';
		if (el.type === 'dottedline') return '· · · · · · · · · · · · · · · ·';
		if (el.type === 'checkbox') return `☐ ${el.args.text}`;
		if (el.type === 'signature') return '[Signature Box]';
		if (el.type === 'image') return el.args.url ? `[Image: ${el.args.url.substring(0, 30)}...]` : '[Empty Image]';
		return el.content || '[Empty]';
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<input type="file" accept=".dat" bind:this={fileInput} onchange={handleFileSelect} class="hidden" />

<svelte:head>
	<title>DAT Editor | SCP Document Generator</title>
</svelte:head>

<div class="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
	<!-- Top Menu Bar -->
	<div class="bg-[#2d2d2d] border-b border-[#404040] px-2 py-1 flex items-center gap-1 text-sm">
		<a href="/" class="px-3 py-1 hover:bg-[#404040] rounded text-[var(--color-accent)] font-bold">
			SCP://DOCGEN
		</a>
		<span class="text-[#666] mx-2">|</span>

		<!-- File Menu -->
		<div class="relative group">
			<button class="px-3 py-1 hover:bg-[#404040] rounded">File</button>
			<div class="absolute top-full left-0 mt-1 bg-[#2d2d2d] border border-[#404040] rounded shadow-xl hidden group-hover:block z-50 min-w-[200px]">
				<button onclick={handleNew} class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center justify-between">
					<span>New</span>
					<span class="text-xs text-[#888]">Ctrl+N</span>
				</button>
				<button onclick={handleOpen} class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center justify-between">
					<span>Open...</span>
					<span class="text-xs text-[#888]">Ctrl+O</span>
				</button>
				<button onclick={() => showTemplateModal = true} class="w-full text-left px-4 py-2 hover:bg-[#404040]">
					Open Template...
				</button>
				<div class="border-t border-[#404040] my-1"></div>
				<button onclick={handleSave} class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center justify-between">
					<span>Save</span>
					<span class="text-xs text-[#888]">Ctrl+S</span>
				</button>
			</div>
		</div>

		<!-- Edit Menu -->
		<div class="relative group">
			<button class="px-3 py-1 hover:bg-[#404040] rounded">Edit</button>
			<div class="absolute top-full left-0 mt-1 bg-[#2d2d2d] border border-[#404040] rounded shadow-xl hidden group-hover:block z-50 min-w-[200px]">
				<button onclick={() => datEditorStore.undo()} disabled={!$canUndo} class="w-full text-left px-4 py-2 hover:bg-[#404040] disabled:opacity-50 flex items-center justify-between">
					<span>Undo</span>
					<span class="text-xs text-[#888]">Ctrl+Z</span>
				</button>
				<button onclick={() => datEditorStore.redo()} disabled={!$canRedo} class="w-full text-left px-4 py-2 hover:bg-[#404040] disabled:opacity-50 flex items-center justify-between">
					<span>Redo</span>
					<span class="text-xs text-[#888]">Ctrl+Y</span>
				</button>
			</div>
		</div>

		<!-- Insert Menu -->
		<div class="relative group">
			<button class="px-3 py-1 hover:bg-[#404040] rounded">Insert</button>
			<div class="absolute top-full left-0 mt-1 bg-[#2d2d2d] border border-[#404040] rounded shadow-xl hidden group-hover:block z-50 min-w-[200px]">
				{#each Object.entries(elementTypeLabels) as [type, label]}
					<button
						onclick={() => datEditorStore.addElement(type as DatElementType, $datEditorStore.selectedElementIndex ?? undefined)}
						class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center gap-3"
					>
						<span class="w-6 text-center font-mono text-xs">{elementIcons[type as DatElementType]}</span>
						<span>{label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- View Menu -->
		<div class="relative group">
			<button class="px-3 py-1 hover:bg-[#404040] rounded">View</button>
			<div class="absolute top-full left-0 mt-1 bg-[#2d2d2d] border border-[#404040] rounded shadow-xl hidden group-hover:block z-50 min-w-[200px]">
				<button onclick={() => showFieldsPanel = !showFieldsPanel} class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center gap-2">
					<span class="w-4">{showFieldsPanel ? '✓' : ''}</span>
					<span>Document Fields</span>
				</button>
				<button onclick={() => showSettingsPanel = !showSettingsPanel} class="w-full text-left px-4 py-2 hover:bg-[#404040] flex items-center gap-2">
					<span class="w-4">{showSettingsPanel ? '✓' : ''}</span>
					<span>Document Settings</span>
				</button>
				<div class="border-t border-[#404040] my-1"></div>
				<div class="px-4 py-2 text-[#888] text-xs">Zoom</div>
				<button onclick={() => zoom = 50} class="w-full text-left px-4 py-2 hover:bg-[#404040]">50%</button>
				<button onclick={() => zoom = 75} class="w-full text-left px-4 py-2 hover:bg-[#404040]">75%</button>
				<button onclick={() => zoom = 100} class="w-full text-left px-4 py-2 hover:bg-[#404040]">100%</button>
				<button onclick={() => zoom = 125} class="w-full text-left px-4 py-2 hover:bg-[#404040]">125%</button>
				<button onclick={() => zoom = 150} class="w-full text-left px-4 py-2 hover:bg-[#404040]">150%</button>
			</div>
		</div>

		<div class="flex-1"></div>

		<!-- Document title -->
		<div class="text-center">
			<span class="text-[#888]">{$datEditorStore.document?.fields.title || 'Untitled'}</span>
			{#if $datEditorStore.isDirty}
				<span class="text-[#ff6b6b] ml-1">●</span>
			{/if}
		</div>

		<div class="flex-1"></div>

		<!-- Zoom control -->
		<div class="flex items-center gap-2 text-xs">
			<button onclick={() => zoom = Math.max(25, zoom - 25)} class="px-2 py-1 hover:bg-[#404040] rounded">-</button>
			<span class="w-12 text-center">{zoom}%</span>
			<button onclick={() => zoom = Math.min(200, zoom + 25)} class="px-2 py-1 hover:bg-[#404040] rounded">+</button>
		</div>
	</div>

	<!-- Toolbar -->
	<div class="bg-[#333] border-b border-[#404040] px-4 py-2 flex items-center gap-2 flex-wrap">
		<!-- Quick Add Elements -->
		<div class="flex items-center gap-1 border-r border-[#555] pr-3 mr-2">
			<span class="text-xs text-[#888] mr-2">Add:</span>
			{#each ['header', 'header2', 'header3', 'paragraph', 'smalltext', 'line', 'dottedline', 'signature', 'checkbox'] as type}
				<button
					onclick={() => datEditorStore.addElement(type as DatElementType, $datEditorStore.selectedElementIndex ?? undefined)}
					class="w-8 h-8 flex items-center justify-center hover:bg-[#555] rounded text-xs font-mono"
					title={elementTypeLabels[type as DatElementType]}
				>
					{elementIcons[type as DatElementType]}
				</button>
			{/each}
		</div>

		<!-- Undo/Redo -->
		<div class="flex items-center gap-1 border-r border-[#555] pr-3 mr-2">
			<button
				onclick={() => datEditorStore.undo()}
				disabled={!$canUndo}
				class="w-8 h-8 flex items-center justify-center hover:bg-[#555] rounded disabled:opacity-30"
				title="Undo (Ctrl+Z)"
			>
				↶
			</button>
			<button
				onclick={() => datEditorStore.redo()}
				disabled={!$canRedo}
				class="w-8 h-8 flex items-center justify-center hover:bg-[#555] rounded disabled:opacity-30"
				title="Redo (Ctrl+Y)"
			>
				↷
			</button>
		</div>

		<!-- Page controls -->
		<div class="flex items-center gap-1">
			<span class="text-xs text-[#888] mr-2">Page:</span>
			<button
				onclick={() => datEditorStore.addPage()}
				class="px-3 h-8 flex items-center justify-center hover:bg-[#555] rounded text-xs"
				title="Add Page"
			>
				+ Add Page
			</button>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Pages Sidebar -->
		<div class="w-48 bg-[#252525] border-r border-[#404040] flex flex-col">
			<div class="p-2 border-b border-[#404040] text-xs font-bold text-[#888] uppercase">
				Pages ({$datEditorStore.document?.pages.length || 0})
			</div>
			<div class="flex-1 overflow-y-auto p-2 space-y-2">
				{#if $datEditorStore.document}
					{#each $datEditorStore.document.pages as page, i}
						<div
							role="button"
							tabindex="0"
							onclick={() => datEditorStore.selectPage(i)}
							onkeydown={(e) => e.key === 'Enter' && datEditorStore.selectPage(i)}
							class="w-full aspect-[8.5/11] bg-white rounded shadow relative group cursor-pointer
								{$datEditorStore.selectedPageIndex === i ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-[#555]'}"
						>
							<div class="absolute inset-0 p-2 overflow-hidden text-[4px] text-black text-left leading-tight">
								{#each page.elements.slice(0, 8) as el}
									<div class="truncate opacity-70">
										{#if el.type === 'header'}
											<strong>{el.content}</strong>
										{:else if el.type === 'line'}
											<hr class="border-black">
										{:else}
											{el.content}
										{/if}
									</div>
								{/each}
							</div>
							<div class="absolute bottom-1 left-1 text-[8px] bg-black/70 text-white px-1 rounded">
								{i + 1}
							</div>
							<!-- Page actions -->
							<div class="absolute top-1 right-1 hidden group-hover:flex gap-1">
								<button
									onclick={(e) => { e.stopPropagation(); datEditorStore.duplicatePage(i); }}
									class="w-4 h-4 bg-blue-500 rounded text-[8px] flex items-center justify-center"
									title="Duplicate"
								>⧉</button>
								{#if $datEditorStore.document && $datEditorStore.document.pages.length > 1}
									<button
										onclick={(e) => { e.stopPropagation(); datEditorStore.deletePage(i); }}
										class="w-4 h-4 bg-red-500 rounded text-[8px] flex items-center justify-center"
										title="Delete"
									>×</button>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Document Canvas -->
		<div class="flex-1 bg-[#1a1a1a] overflow-auto p-8">
			<div
				class="mx-auto bg-white text-black shadow-2xl"
				style="width: {(8.5 * 96 * zoom) / 100}px; min-height: {(11 * 96 * zoom) / 100}px; transform-origin: top center;"
			>
				{#if $currentPage}
					<div class="p-8" style="font-size: {14 * zoom / 100}px;">
						{#each $currentPage.elements as element, i}
							<button
								onclick={() => datEditorStore.selectElement(i)}
								class="w-full text-left mb-2 p-2 -mx-2 rounded transition-colors cursor-text
									{$datEditorStore.selectedElementIndex === i ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'}"
							>
								{#if element.type === 'header'}
									<h1 class="text-2xl font-bold">{element.content || 'Header'}</h1>
								{:else if element.type === 'header2'}
									<h2 class="text-xl font-bold">{element.content || 'Header 2'}</h2>
								{:else if element.type === 'header3'}
									<h3 class="text-lg font-bold">{element.content || 'Header 3'}</h3>
								{:else if element.type === 'paragraph'}
									<p class="whitespace-pre-wrap">{element.content || 'Paragraph text...'}</p>
								{:else if element.type === 'smalltext'}
									<p class="text-sm whitespace-pre-wrap">{element.content || 'Small text...'}</p>
								{:else if element.type === 'line'}
									<hr class="border-t-2 border-black my-2">
								{:else if element.type === 'dottedline'}
									<hr class="border-t-2 border-dotted border-black my-2">
								{:else if element.type === 'signature'}
									<div class="border-2 border-dashed border-gray-400 p-4 text-center text-gray-500 italic">
										[Signature Box]
									</div>
								{:else if element.type === 'checkbox'}
									<label class="flex items-center gap-2">
										<input type="checkbox" checked={element.params.toggle} disabled class="w-4 h-4">
										<span>{element.args.text}</span>
									</label>
								{:else if element.type === 'image'}
									<div class="text-center">
										{#if element.args.url}
											<img src={element.args.url} alt="Document image" class="max-w-full mx-auto" style="max-width: {element.params.scale * 100}%">
										{:else}
											<div class="border-2 border-dashed border-gray-400 p-8 text-gray-500">
												[Image Placeholder]
											</div>
										{/if}
									</div>
								{/if}
							</button>
						{/each}

						{#if $currentPage.elements.length === 0}
							<div class="text-center text-gray-400 py-16">
								<p class="mb-4">This page is empty</p>
								<button
									onclick={() => datEditorStore.addElement('paragraph')}
									class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Add Element
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Properties Panel -->
		<div class="w-72 bg-[#252525] border-l border-[#404040] flex flex-col">
			<div class="p-3 border-b border-[#404040] text-xs font-bold text-[#888] uppercase">
				Properties
			</div>
			<div class="flex-1 overflow-y-auto">
				{#if $currentElement}
					<div class="p-4 space-y-4">
						<div>
							<label class="block text-xs text-[#888] mb-1">Element Type</label>
							<select
								class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
								value={$currentElement.type}
								onchange={(e) => {
									const newType = (e.target as HTMLSelectElement).value as DatElementType;
									datEditorStore.updateElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex!, { type: newType } as any);
								}}
							>
								{#each Object.entries(elementTypeLabels) as [type, label]}
									<option value={type}>{label}</option>
								{/each}
							</select>
						</div>

						{#if $currentElement.type !== 'line' && $currentElement.type !== 'dottedline' && $currentElement.type !== 'signature'}
							<div>
								<label class="block text-xs text-[#888] mb-1">Content</label>
								{#if $currentElement.type === 'checkbox'}
									<input
										type="text"
										class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
										value={$currentElement.args.text}
										oninput={(e) => datEditorStore.updateElement(
											$datEditorStore.selectedPageIndex,
											$datEditorStore.selectedElementIndex!,
											{ args: { text: (e.target as HTMLInputElement).value } } as any
										)}
									/>
								{:else if $currentElement.type === 'image'}
									<input
										type="text"
										placeholder="Image URL"
										class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
										value={$currentElement.args.url}
										oninput={(e) => datEditorStore.updateElement(
											$datEditorStore.selectedPageIndex,
											$datEditorStore.selectedElementIndex!,
											{ args: { url: (e.target as HTMLInputElement).value } } as any
										)}
									/>
								{:else}
									<textarea
										class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm min-h-[100px] resize-y"
										value={$currentElement.content}
										oninput={(e) => datEditorStore.updateElement(
											$datEditorStore.selectedPageIndex,
											$datEditorStore.selectedElementIndex!,
											{ content: (e.target as HTMLTextAreaElement).value }
										)}
									></textarea>
								{/if}
							</div>
						{/if}

						{#if $currentElement.type === 'checkbox'}
							<div>
								<label class="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={$currentElement.params.toggle}
										onchange={(e) => datEditorStore.updateElement(
											$datEditorStore.selectedPageIndex,
											$datEditorStore.selectedElementIndex!,
											{ params: { ...$currentElement.params, toggle: (e.target as HTMLInputElement).checked } } as any
										)}
									/>
									<span>Checked by default</span>
								</label>
							</div>
						{/if}

						{#if $currentElement.type === 'image'}
							<div>
								<label class="block text-xs text-[#888] mb-1">Scale ({Math.round($currentElement.params.scale * 100)}%)</label>
								<input
									type="range"
									min="0.1"
									max="1"
									step="0.05"
									class="w-full"
									value={$currentElement.params.scale}
									oninput={(e) => datEditorStore.updateElement(
										$datEditorStore.selectedPageIndex,
										$datEditorStore.selectedElementIndex!,
										{ params: { ...$currentElement.params, scale: parseFloat((e.target as HTMLInputElement).value) } } as any
									)}
								/>
							</div>
						{/if}

						<!-- Element Actions -->
						<div class="pt-4 border-t border-[#404040] space-y-2">
							<div class="flex gap-2">
								<button
									onclick={() => {
										if ($datEditorStore.selectedElementIndex! > 0) {
											datEditorStore.moveElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex!, $datEditorStore.selectedElementIndex! - 1);
											datEditorStore.selectElement($datEditorStore.selectedElementIndex! - 1);
										}
									}}
									disabled={$datEditorStore.selectedElementIndex === 0}
									class="flex-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded text-sm disabled:opacity-30"
								>
									↑ Move Up
								</button>
								<button
									onclick={() => {
										const maxIndex = ($currentPage?.elements.length || 1) - 1;
										if ($datEditorStore.selectedElementIndex! < maxIndex) {
											datEditorStore.moveElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex!, $datEditorStore.selectedElementIndex! + 1);
											datEditorStore.selectElement($datEditorStore.selectedElementIndex! + 1);
										}
									}}
									disabled={$datEditorStore.selectedElementIndex === ($currentPage?.elements.length || 1) - 1}
									class="flex-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded text-sm disabled:opacity-30"
								>
									↓ Move Down
								</button>
							</div>
							<div class="flex gap-2">
								<button
									onclick={() => datEditorStore.copyElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex!)}
									class="flex-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded text-sm"
								>
									Copy
								</button>
								<button
									onclick={() => datEditorStore.deleteElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex!)}
									class="flex-1 px-3 py-2 bg-red-900/50 hover:bg-red-800 rounded text-sm"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="p-4 text-center text-[#666]">
						<p class="mb-2">No element selected</p>
						<p class="text-xs">Click an element on the page to edit its properties</p>
					</div>
				{/if}
			</div>

			<!-- Document Fields Panel -->
			{#if showFieldsPanel}
				<div class="border-t border-[#404040]">
					<div class="p-3 bg-[#2a2a2a] text-xs font-bold text-[#888] uppercase flex justify-between items-center">
						<span>Document Fields</span>
						<button onclick={() => showFieldsPanel = false} class="hover:text-white">×</button>
					</div>
					<div class="p-4 space-y-3">
						{#if $datEditorStore.document}
							<div>
								<label class="block text-xs text-[#888] mb-1">Title</label>
								<input
									type="text"
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.fields.title || ''}
									oninput={(e) => datEditorStore.updateFields({ title: (e.target as HTMLInputElement).value })}
								/>
							</div>
							<div>
								<label class="block text-xs text-[#888] mb-1">Authorized</label>
								<input
									type="text"
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.fields.authorized || ''}
									oninput={(e) => datEditorStore.updateFields({ authorized: (e.target as HTMLInputElement).value })}
								/>
							</div>
							<div>
								<label class="block text-xs text-[#888] mb-1">Participating</label>
								<input
									type="text"
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.fields.participating || ''}
									oninput={(e) => datEditorStore.updateFields({ participating: (e.target as HTMLInputElement).value })}
								/>
							</div>
							<div>
								<label class="block text-xs text-[#888] mb-1">Subjects</label>
								<input
									type="text"
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.fields.subjects || ''}
									oninput={(e) => datEditorStore.updateFields({ subjects: (e.target as HTMLInputElement).value })}
								/>
							</div>
							<div>
								<label class="block text-xs text-[#888] mb-1">Conducted</label>
								<input
									type="text"
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.fields.conducted || ''}
									oninput={(e) => datEditorStore.updateFields({ conducted: (e.target as HTMLInputElement).value })}
								/>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Document Settings Panel -->
			{#if showSettingsPanel}
				<div class="border-t border-[#404040]">
					<div class="p-3 bg-[#2a2a2a] text-xs font-bold text-[#888] uppercase flex justify-between items-center">
						<span>Document Settings</span>
						<button onclick={() => showSettingsPanel = false} class="hover:text-white">×</button>
					</div>
					<div class="p-4 space-y-3">
						{#if $datEditorStore.document}
							<div>
								<label class="block text-xs text-[#888] mb-1">Document Type</label>
								<select
									class="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-sm"
									value={$datEditorStore.document.type}
									onchange={(e) => datEditorStore.updateDocument(doc => {
										doc.type = (e.target as HTMLSelectElement).value as any;
										return doc;
									})}
								>
									<option value="foundation_research_study">Research Study</option>
									<option value="foundation_report">Report</option>
								</select>
							</div>
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={$datEditorStore.document.settings.noCheckboxWhenStickied}
									onchange={(e) => datEditorStore.updateSettings({ noCheckboxWhenStickied: (e.target as HTMLInputElement).checked })}
								/>
								<span>Hide checkboxes when stickied</span>
							</label>
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={$datEditorStore.document.settings.singleSign}
									onchange={(e) => datEditorStore.updateSettings({ singleSign: (e.target as HTMLInputElement).checked })}
								/>
								<span>Single signature only</span>
							</label>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Status Bar -->
	<div class="bg-[#007acc] text-white text-xs px-4 py-1 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<span>Page {$datEditorStore.selectedPageIndex + 1} of {$datEditorStore.document?.pages.length || 0}</span>
			<span>{$currentPage?.elements.length || 0} elements</span>
		</div>
		<div class="flex items-center gap-4">
			{#if $datEditorStore.isDirty}
				<span class="text-yellow-300">Unsaved changes</span>
			{:else}
				<span>All changes saved</span>
			{/if}
			<span>Zoom: {zoom}%</span>
		</div>
	</div>
</div>

<!-- Template Modal -->
{#if showTemplateModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onclick={() => showTemplateModal = false}>
		<div class="bg-[#2d2d2d] rounded-lg shadow-2xl w-[600px] max-h-[80vh] overflow-hidden" onclick={(e) => e.stopPropagation()}>
			<div class="p-4 border-b border-[#404040] flex justify-between items-center">
				<h2 class="text-lg font-bold">Open Template</h2>
				<button onclick={() => showTemplateModal = false} class="text-xl hover:text-red-400">×</button>
			</div>
			<div class="p-4 overflow-y-auto max-h-[60vh]">
				<div class="grid gap-3">
					{#each PRESET_TEMPLATES as template}
						<button
							onclick={() => handleLoadTemplate(template.id)}
							class="w-full text-left p-4 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
						>
							<div class="font-bold">{template.name}</div>
							<div class="text-sm text-[#888]">{template.description}</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Hide scrollbar but keep functionality */
	:global(.overflow-y-auto) {
		scrollbar-width: thin;
		scrollbar-color: #555 transparent;
	}
	:global(.overflow-y-auto::-webkit-scrollbar) {
		width: 8px;
	}
	:global(.overflow-y-auto::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(.overflow-y-auto::-webkit-scrollbar-thumb) {
		background: #555;
		border-radius: 4px;
	}
</style>
