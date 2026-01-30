<script lang="ts">
	import { onMount, tick } from 'svelte';
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
	import { downloadDatFile } from '$lib/dat/serializer';
	import type { DatElement, DatElementType } from '$lib/dat/types';

	// UI State
	let showTemplateModal = $state(false);
	let showTemplateGallery = $state(true); // Show gallery by default
	let editingElementIndex = $state<number | null>(null);
	let editingContent = $state('');
	let contextMenu = $state<{ x: number; y: number; elementIndex: number } | null>(null);
	let fileInput: HTMLInputElement;
	let documentTitle = $state('Untitled Document');
	let isTitleEditing = $state(false);
	let titleInput: HTMLInputElement;
	let lastSaved = $state<Date | null>(null);
	let hoveredInsertIndex = $state<number | null>(null);
	let isLoadingTemplate = $state(false);

	// Auto-save key
	const AUTOSAVE_KEY = 'dat-editor-autosave';

	// Sync title with document
	$effect(() => {
		if ($datEditorStore.document?.fields.title) {
			documentTitle = $datEditorStore.document.fields.title;
		}
	});

	// Auto-save effect
	$effect(() => {
		if (browser && $datEditorStore.document && $datEditorStore.isDirty) {
			const timeout = setTimeout(() => {
				localStorage.setItem(AUTOSAVE_KEY, JSON.stringify($datEditorStore.document));
				lastSaved = new Date();
			}, 2000);
			return () => clearTimeout(timeout);
		}
	});

	onMount(() => {
		// Try to restore autosaved document
		const saved = localStorage.getItem(AUTOSAVE_KEY);
		if (saved) {
			try {
				const doc = JSON.parse(saved);
				datEditorStore.loadDocument(doc);
				lastSaved = new Date();
				showTemplateGallery = false; // Hide gallery if we have a saved doc
			} catch {
				datEditorStore.newDocument();
				showTemplateGallery = true;
			}
		} else {
			datEditorStore.newDocument();
			showTemplateGallery = true; // Show gallery for new users
		}
	});

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		// Don't intercept when editing
		if (editingElementIndex !== null) {
			if (e.key === 'Escape') {
				finishEditing();
			}
			return;
		}

		if (e.ctrlKey || e.metaKey) {
			switch (e.key.toLowerCase()) {
				case 'z':
					e.preventDefault();
					e.shiftKey ? datEditorStore.redo() : datEditorStore.undo();
					break;
				case 'y':
					e.preventDefault();
					datEditorStore.redo();
					break;
				case 's':
					e.preventDefault();
					handleSave();
					break;
				case 'd':
					e.preventDefault();
					if ($datEditorStore.selectedElementIndex !== null) {
						datEditorStore.copyElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex);
						datEditorStore.pasteElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex);
					}
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

		if (e.key === 'Delete' || e.key === 'Backspace') {
			if ($datEditorStore.selectedElementIndex !== null) {
				e.preventDefault();
				datEditorStore.deleteElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex);
			}
		}

		if (e.key === 'Escape') {
			datEditorStore.selectElement(null);
			contextMenu = null;
		}

		// Arrow key navigation
		if (e.key === 'ArrowUp' && $datEditorStore.selectedElementIndex !== null && $datEditorStore.selectedElementIndex > 0) {
			e.preventDefault();
			datEditorStore.selectElement($datEditorStore.selectedElementIndex - 1);
		}
		if (e.key === 'ArrowDown' && $datEditorStore.selectedElementIndex !== null && $currentPage && $datEditorStore.selectedElementIndex < $currentPage.elements.length - 1) {
			e.preventDefault();
			datEditorStore.selectElement($datEditorStore.selectedElementIndex + 1);
		}

		// Enter to start editing
		if (e.key === 'Enter' && $datEditorStore.selectedElementIndex !== null) {
			e.preventDefault();
			startEditing($datEditorStore.selectedElementIndex);
		}
	}

	// Click outside to deselect
	function handleDocumentClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.element-wrapper') && !target.closest('.context-menu') && !target.closest('.properties-panel')) {
			datEditorStore.selectElement(null);
		}
		if (!target.closest('.context-menu')) {
			contextMenu = null;
		}
	}

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
				showTemplateGallery = false;
			} catch (err) {
				alert(`Failed to open: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
		if ($datEditorStore.isDirty && !confirm('Discard unsaved changes?')) return;
		datEditorStore.newDocument();
		localStorage.removeItem(AUTOSAVE_KEY);
		showTemplateGallery = false;
	}

	async function handleLoadTemplate(id: string) {
		isLoadingTemplate = true;
		try {
			const doc = await loadPresetTemplate(id);
			datEditorStore.loadDocument(doc);
			showTemplateModal = false;
			showTemplateGallery = false;
		} catch (err) {
			alert(`Failed to load template: ${err instanceof Error ? err.message : 'Unknown error'}`);
		} finally {
			isLoadingTemplate = false;
		}
	}

	// Title editing
	async function startTitleEdit() {
		isTitleEditing = true;
		await tick();
		titleInput?.select();
	}

	function finishTitleEdit() {
		isTitleEditing = false;
		datEditorStore.updateFields({ title: documentTitle });
	}

	// Inline editing
	async function startEditing(index: number) {
		const element = $currentPage?.elements[index];
		if (!element || element.type === 'line' || element.type === 'dottedline' || element.type === 'signature') return;

		editingElementIndex = index;
		if (element.type === 'checkbox') {
			editingContent = element.args.text;
		} else if (element.type === 'image') {
			editingContent = element.args.url;
		} else {
			editingContent = element.content;
		}
		await tick();
		const textarea = document.querySelector('.inline-editor') as HTMLTextAreaElement;
		textarea?.focus();
		textarea?.select();
	}

	function finishEditing() {
		if (editingElementIndex === null) return;

		const element = $currentPage?.elements[editingElementIndex];
		if (element) {
			if (element.type === 'checkbox') {
				datEditorStore.updateElement($datEditorStore.selectedPageIndex, editingElementIndex, {
					args: { text: editingContent }
				} as any);
			} else if (element.type === 'image') {
				datEditorStore.updateElement($datEditorStore.selectedPageIndex, editingElementIndex, {
					args: { url: editingContent }
				} as any);
			} else {
				datEditorStore.updateElement($datEditorStore.selectedPageIndex, editingElementIndex, {
					content: editingContent
				});
			}
		}
		editingElementIndex = null;
	}

	// Context menu
	function handleContextMenu(e: MouseEvent, index: number) {
		e.preventDefault();
		datEditorStore.selectElement(index);
		contextMenu = { x: e.clientX, y: e.clientY, elementIndex: index };
	}

	// Insert element
	function insertElement(type: DatElementType, afterIndex?: number) {
		datEditorStore.addElement(type, afterIndex);
		hoveredInsertIndex = null;
	}

	// Element type info
	const typeLabels: Record<DatElementType, string> = {
		header: 'Title',
		header2: 'Heading',
		header3: 'Subheading',
		paragraph: 'Normal text',
		smalltext: 'Small text',
		line: 'Horizontal line',
		dottedline: 'Dotted line',
		image: 'Image',
		signature: 'Signature box',
		checkbox: 'Checkbox'
	};
</script>

<svelte:window onkeydown={handleKeydown} />
<svelte:document onclick={handleDocumentClick} />
<input type="file" accept=".dat" bind:this={fileInput} onchange={handleFileSelect} class="hidden" />

<svelte:head>
	<title>{documentTitle} - DAT Editor</title>
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono&display=swap" rel="stylesheet">
</svelte:head>

<div class="h-screen flex flex-col bg-[#f8f9fa] font-[Roboto,sans-serif] text-[#202124] overflow-hidden">
	<!-- Google Docs Style Header -->
	<header class="bg-white border-b border-[#dadce0] px-3 py-2">
		<div class="flex items-center gap-2">
			<!-- Doc Icon -->
			<a href="/" class="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] rounded-full" title="Home">
				<svg viewBox="0 0 24 24" class="w-6 h-6" fill="#4285f4">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
				</svg>
			</a>

			<!-- Document Title -->
			<div class="flex-1">
				<div class="flex items-center gap-2">
					{#if isTitleEditing}
						<input
							bind:this={titleInput}
							bind:value={documentTitle}
							onblur={finishTitleEdit}
							onkeydown={(e) => e.key === 'Enter' && finishTitleEdit()}
							class="text-lg font-normal px-2 py-1 border border-[#1a73e8] rounded outline-none"
						/>
					{:else}
						<button
							onclick={startTitleEdit}
							class="text-lg font-normal px-2 py-1 hover:bg-[#f1f3f4] rounded truncate max-w-md"
						>
							{documentTitle || 'Untitled document'}
						</button>
					{/if}
					{#if $datEditorStore.isDirty}
						<span class="text-xs text-[#5f6368]">Editing...</span>
					{:else if lastSaved}
						<span class="text-xs text-[#5f6368]">Saved</span>
					{/if}
				</div>

				<!-- Menu Bar -->
				<div class="flex items-center gap-1 mt-1 text-sm">
					<div class="relative group">
						<button class="px-2 py-1 hover:bg-[#f1f3f4] rounded">File</button>
						<div class="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-lg hidden group-hover:block z-50 min-w-[200px] py-2">
							<button onclick={handleNew} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex justify-between">
								<span>New</span><span class="text-[#5f6368] text-xs">Ctrl+Alt+N</span>
							</button>
							<button onclick={handleOpen} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4]">Open</button>
							<button onclick={() => showTemplateModal = true} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4]">Open template</button>
							<div class="border-t border-[#dadce0] my-1"></div>
							<button onclick={handleSave} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex justify-between">
								<span>Download</span><span class="text-[#5f6368] text-xs">Ctrl+S</span>
							</button>
						</div>
					</div>
					<div class="relative group">
						<button class="px-2 py-1 hover:bg-[#f1f3f4] rounded">Edit</button>
						<div class="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-lg hidden group-hover:block z-50 min-w-[200px] py-2">
							<button onclick={() => datEditorStore.undo()} disabled={!$canUndo} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] disabled:opacity-40 flex justify-between">
								<span>Undo</span><span class="text-[#5f6368] text-xs">Ctrl+Z</span>
							</button>
							<button onclick={() => datEditorStore.redo()} disabled={!$canRedo} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] disabled:opacity-40 flex justify-between">
								<span>Redo</span><span class="text-[#5f6368] text-xs">Ctrl+Y</span>
							</button>
							<div class="border-t border-[#dadce0] my-1"></div>
							<button onclick={() => $datEditorStore.selectedElementIndex !== null && datEditorStore.copyElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex)} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex justify-between">
								<span>Copy</span><span class="text-[#5f6368] text-xs">Ctrl+C</span>
							</button>
							<button onclick={() => datEditorStore.pasteElement($datEditorStore.selectedPageIndex)} disabled={!$datEditorStore.clipboard} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] disabled:opacity-40 flex justify-between">
								<span>Paste</span><span class="text-[#5f6368] text-xs">Ctrl+V</span>
							</button>
						</div>
					</div>
					<div class="relative group">
						<button class="px-2 py-1 hover:bg-[#f1f3f4] rounded">Insert</button>
						<div class="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-lg hidden group-hover:block z-50 min-w-[200px] py-2">
							{#each Object.entries(typeLabels) as [type, label]}
								<button onclick={() => insertElement(type as DatElementType, $datEditorStore.selectedElementIndex ?? undefined)} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4]">
									{label}
								</button>
							{/each}
							<div class="border-t border-[#dadce0] my-1"></div>
							<button onclick={() => datEditorStore.addPage()} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4]">
								Page break
							</button>
						</div>
					</div>
					<div class="relative group">
						<button class="px-2 py-1 hover:bg-[#f1f3f4] rounded">View</button>
						<div class="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-lg hidden group-hover:block z-50 min-w-[200px] py-2">
							<div class="px-4 py-2 text-[#5f6368] text-xs">Page {$datEditorStore.selectedPageIndex + 1} of {$datEditorStore.document?.pages.length || 0}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right side actions -->
			<button onclick={handleSave} class="px-6 py-2 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] font-medium text-sm">
				Download
			</button>
		</div>
	</header>

	<!-- Toolbar -->
	<div class="bg-[#edf2fa] border-b border-[#dadce0] px-4 py-1 flex items-center gap-1">
		<!-- Undo/Redo -->
		<button onclick={() => datEditorStore.undo()} disabled={!$canUndo} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded disabled:opacity-30" title="Undo (Ctrl+Z)">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#444746"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
		</button>
		<button onclick={() => datEditorStore.redo()} disabled={!$canRedo} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded disabled:opacity-30" title="Redo (Ctrl+Y)">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#444746"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
		</button>

		<div class="w-px h-6 bg-[#dadce0] mx-2"></div>

		<!-- Element type dropdown -->
		<div class="relative group">
			<button class="h-8 px-3 flex items-center gap-2 hover:bg-[#d3e3fd] rounded text-sm min-w-[120px]">
				<span>{$currentElement ? typeLabels[$currentElement.type] : 'Normal text'}</span>
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#444746"><path d="M7 10l5 5 5-5z"/></svg>
			</button>
			<div class="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-lg hidden group-hover:block z-50 min-w-[180px] py-2">
				{#each Object.entries(typeLabels) as [type, label]}
					<button
						onclick={() => {
							if ($datEditorStore.selectedElementIndex !== null) {
								datEditorStore.updateElement($datEditorStore.selectedPageIndex, $datEditorStore.selectedElementIndex, { type } as any);
							}
						}}
						class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] {$currentElement?.type === type ? 'bg-[#e8f0fe]' : ''}"
					>
						{label}
					</button>
				{/each}
			</div>
		</div>

		<div class="w-px h-6 bg-[#dadce0] mx-2"></div>

		<!-- Quick insert buttons -->
		<button onclick={() => insertElement('header', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded font-bold text-lg" title="Insert Title">T</button>
		<button onclick={() => insertElement('paragraph', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded text-sm" title="Insert Paragraph">¶</button>
		<button onclick={() => insertElement('line', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded" title="Insert Line">—</button>
		<button onclick={() => insertElement('checkbox', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded" title="Insert Checkbox">☐</button>
		<button onclick={() => insertElement('signature', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded text-sm" title="Insert Signature">✍</button>
		<button onclick={() => insertElement('image', $datEditorStore.selectedElementIndex ?? undefined)} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded" title="Insert Image">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#444746"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
		</button>

		<div class="w-px h-6 bg-[#dadce0] mx-2"></div>

		<!-- Page controls -->
		<span class="text-sm text-[#5f6368]">Page {$datEditorStore.selectedPageIndex + 1}/{$datEditorStore.document?.pages.length || 0}</span>
		<button onclick={() => datEditorStore.selectPage(Math.max(0, $datEditorStore.selectedPageIndex - 1))} disabled={$datEditorStore.selectedPageIndex === 0} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded disabled:opacity-30" title="Previous page">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#444746"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
		</button>
		<button onclick={() => datEditorStore.selectPage(Math.min(($datEditorStore.document?.pages.length || 1) - 1, $datEditorStore.selectedPageIndex + 1))} disabled={$datEditorStore.selectedPageIndex >= ($datEditorStore.document?.pages.length || 1) - 1} class="w-8 h-8 flex items-center justify-center hover:bg-[#d3e3fd] rounded disabled:opacity-30" title="Next page">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#444746"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
		</button>
		<button onclick={() => datEditorStore.addPage()} class="h-8 px-3 flex items-center gap-1 hover:bg-[#d3e3fd] rounded text-sm" title="Add page">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#444746"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
			<span>Add page</span>
		</button>
	</div>

	<!-- Main Editor Area -->
	<div class="flex-1 overflow-auto bg-[#f8f9fa]" style="background-image: linear-gradient(#e5e5e5 1px, transparent 1px); background-size: 100% 20px;">
		<!-- Template Gallery -->
		{#if showTemplateGallery}
			<div class="max-w-[1000px] mx-auto py-8 px-4">
				<!-- Gallery Header -->
				<div class="bg-gradient-to-r from-[#1a73e8] to-[#4285f4] rounded-xl p-8 mb-8 text-white">
					<h1 class="text-3xl font-medium mb-2">Start a new document</h1>
					<p class="text-white/80">Choose a template or start from scratch</p>
				</div>

				<!-- Quick Actions -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<button
						onclick={handleNew}
						class="bg-white border-2 border-dashed border-[#dadce0] rounded-lg p-6 hover:border-[#1a73e8] hover:bg-[#e8f0fe] transition-all flex flex-col items-center gap-3 group"
					>
						<div class="w-16 h-20 bg-white border border-[#dadce0] rounded shadow-sm flex items-center justify-center group-hover:border-[#1a73e8]">
							<svg class="w-8 h-8 text-[#1a73e8]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
						</div>
						<span class="font-medium text-[#202124]">Blank document</span>
					</button>

					<button
						onclick={handleOpen}
						class="bg-white border border-[#dadce0] rounded-lg p-6 hover:border-[#1a73e8] hover:bg-[#e8f0fe] transition-all flex flex-col items-center gap-3 group"
					>
						<div class="w-16 h-20 bg-[#f1f3f4] border border-[#dadce0] rounded shadow-sm flex items-center justify-center group-hover:border-[#1a73e8]">
							<svg class="w-8 h-8 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" transform="rotate(180 12 12)"/></svg>
						</div>
						<span class="font-medium text-[#202124]">Open .dat file</span>
					</button>
				</div>

				<!-- Template Section -->
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-medium text-[#202124]">Templates</h2>
					<button
						onclick={() => showTemplateGallery = false}
						class="text-sm text-[#1a73e8] hover:underline"
					>
						Skip to editor →
					</button>
				</div>

				<!-- Template Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each PRESET_TEMPLATES as template}
						<button
							onclick={() => handleLoadTemplate(template.id)}
							disabled={isLoadingTemplate}
							class="bg-white border border-[#dadce0] rounded-lg overflow-hidden hover:border-[#1a73e8] hover:shadow-lg transition-all text-left group disabled:opacity-50"
						>
							<!-- Template Preview -->
							<div class="h-40 bg-gradient-to-br from-[#f8f9fa] to-[#e8eaed] p-4 border-b border-[#dadce0] flex items-center justify-center">
								<div class="w-24 h-32 bg-white rounded shadow-md p-2 text-[4px] text-[#5f6368] leading-tight overflow-hidden">
									<div class="font-bold text-[6px] text-[#202124] mb-1 truncate">{template.name}</div>
									<div class="h-px bg-[#dadce0] mb-1"></div>
									<div class="space-y-0.5">
										<div class="h-1 bg-[#e8eaed] rounded w-full"></div>
										<div class="h-1 bg-[#e8eaed] rounded w-3/4"></div>
										<div class="h-1 bg-[#e8eaed] rounded w-5/6"></div>
										<div class="h-1 bg-[#e8eaed] rounded w-2/3"></div>
									</div>
								</div>
							</div>
							<!-- Template Info -->
							<div class="p-4">
								<div class="font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors">{template.name}</div>
								<div class="text-sm text-[#5f6368] mt-1">{template.description}</div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Continue editing hint -->
				{#if lastSaved}
					<div class="mt-8 p-4 bg-[#e8f0fe] rounded-lg flex items-center justify-between">
						<div>
							<div class="font-medium text-[#202124]">Continue editing</div>
							<div class="text-sm text-[#5f6368]">You have an unsaved document from your last session</div>
						</div>
						<button
							onclick={() => showTemplateGallery = false}
							class="px-4 py-2 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] font-medium"
						>
							Continue
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Document Editor -->
			<div class="max-w-[850px] mx-auto py-8">
			{#each $datEditorStore.document?.pages || [] as page, pageIndex}
				<!-- Page -->
				<div
					class="bg-white shadow-md mb-8 relative"
					style="min-height: 1100px; padding: 72px 72px;"
					onclick={() => datEditorStore.selectPage(pageIndex)}
				>
					<!-- Page number -->
					<div class="absolute top-2 right-4 text-xs text-[#5f6368]">Page {pageIndex + 1}</div>

					<!-- Elements - always show all pages -->
					{#each page.elements as element, elementIndex}
						<!-- Insert button above (only on selected page) -->
						{#if pageIndex === $datEditorStore.selectedPageIndex}
							<div
								class="relative h-0"
								onmouseenter={() => hoveredInsertIndex = elementIndex}
								onmouseleave={() => hoveredInsertIndex = null}
							>
								{#if hoveredInsertIndex === elementIndex}
									<div class="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
										<button
											onclick={(e) => { e.stopPropagation(); insertElement('paragraph', elementIndex - 1); }}
											class="w-6 h-6 bg-[#1a73e8] text-white rounded-full flex items-center justify-center text-lg shadow hover:bg-[#1557b0]"
											title="Insert element here"
										>+</button>
									</div>
								{/if}
							</div>
						{/if}

						<div
							class="element-wrapper relative group"
							onclick={() => { datEditorStore.selectPage(pageIndex); datEditorStore.selectElement(elementIndex); }}
							ondblclick={() => { datEditorStore.selectPage(pageIndex); startEditing(elementIndex); }}
							oncontextmenu={(e) => { datEditorStore.selectPage(pageIndex); handleContextMenu(e, elementIndex); }}
						>
							<!-- Selection indicator -->
							{#if pageIndex === $datEditorStore.selectedPageIndex && $datEditorStore.selectedElementIndex === elementIndex}
								<div class="absolute -left-4 top-0 bottom-0 w-1 bg-[#1a73e8] rounded"></div>
							{/if}

							<!-- Element content -->
							<div class="py-1 px-1 rounded {pageIndex === $datEditorStore.selectedPageIndex && $datEditorStore.selectedElementIndex === elementIndex ? 'bg-[#e8f0fe]' : 'hover:bg-[#f1f3f4]'} cursor-text">
								{#if pageIndex === $datEditorStore.selectedPageIndex && editingElementIndex === elementIndex}
									<!-- Inline editor -->
									{#if element.type === 'image'}
										<input
											type="text"
											class="inline-editor w-full p-2 border border-[#1a73e8] rounded outline-none text-sm"
											placeholder="Enter image URL..."
											bind:value={editingContent}
											onblur={finishEditing}
											onkeydown={(e) => e.key === 'Enter' && finishEditing()}
										/>
									{:else}
										<textarea
											class="inline-editor w-full p-2 border border-[#1a73e8] rounded outline-none resize-none overflow-hidden
												{element.type === 'header' ? 'text-2xl font-bold' : ''}
												{element.type === 'header2' ? 'text-xl font-semibold' : ''}
												{element.type === 'header3' ? 'text-lg font-medium' : ''}
												{element.type === 'smalltext' ? 'text-sm' : ''}"
											bind:value={editingContent}
											onblur={finishEditing}
											onkeydown={(e) => { if (e.key === 'Escape') finishEditing(); }}
											oninput={(e) => {
												const target = e.target as HTMLTextAreaElement;
												target.style.height = 'auto';
												target.style.height = target.scrollHeight + 'px';
											}}
											style="min-height: 1.5em;"
										></textarea>
									{/if}
								{:else}
									<!-- Display mode -->
									{#if element.type === 'header'}
										<h1 class="text-2xl font-bold text-[#202124]">{element.content || 'Click to add title'}</h1>
									{:else if element.type === 'header2'}
										<h2 class="text-xl font-semibold text-[#202124]">{element.content || 'Click to add heading'}</h2>
									{:else if element.type === 'header3'}
										<h3 class="text-lg font-medium text-[#202124]">{element.content || 'Click to add subheading'}</h3>
									{:else if element.type === 'paragraph'}
										<p class="text-[#202124] whitespace-pre-wrap">{element.content || 'Click to add text'}</p>
									{:else if element.type === 'smalltext'}
										<p class="text-sm text-[#5f6368] whitespace-pre-wrap">{element.content || 'Click to add small text'}</p>
									{:else if element.type === 'line'}
										<hr class="border-t-2 border-[#202124] my-4">
									{:else if element.type === 'dottedline'}
										<hr class="border-t-2 border-dotted border-[#5f6368] my-4">
									{:else if element.type === 'signature'}
										<div class="border-2 border-dashed border-[#dadce0] p-6 text-center text-[#5f6368] italic my-2">
											[Signature Box]
										</div>
									{:else if element.type === 'checkbox'}
										<label class="flex items-center gap-3 py-1">
											<input
												type="checkbox"
												checked={element.params.toggle}
												onchange={(e) => datEditorStore.updateElement(pageIndex, elementIndex, { params: { ...element.params, toggle: (e.target as HTMLInputElement).checked } } as any)}
												class="w-5 h-5"
											/>
											<span class="text-[#202124]">{element.args.text || 'Checkbox label'}</span>
										</label>
									{:else if element.type === 'image'}
										{#if element.args.url}
											<img src={element.args.url} alt="" class="max-w-full mx-auto" style="max-width: {element.params.scale * 100}%">
										{:else}
											<div class="border-2 border-dashed border-[#dadce0] p-8 text-center text-[#5f6368]">
												Double-click to add image URL
											</div>
										{/if}
									{/if}
								{/if}
							</div>

							<!-- Quick actions on hover -->
							<div class="absolute -right-10 top-0 hidden group-hover:flex flex-col gap-1">
								<button
									onclick={(e) => { e.stopPropagation(); datEditorStore.deleteElement(pageIndex, elementIndex); }}
									class="w-7 h-7 flex items-center justify-center bg-white border border-[#dadce0] rounded shadow-sm hover:bg-[#fce8e6]"
									title="Delete"
								>
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#c5221f"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
								</button>
							</div>
						</div>
					{/each}

					<!-- Insert at end (only on selected page) -->
					{#if pageIndex === $datEditorStore.selectedPageIndex}
						<div class="mt-4 flex justify-center">
							<button
								onclick={() => insertElement('paragraph')}
								class="px-4 py-2 text-[#1a73e8] hover:bg-[#e8f0fe] rounded flex items-center gap-2 text-sm"
							>
								<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
								Add element
							</button>
						</div>
					{/if}

					<!-- Empty page message -->
					{#if page.elements.length === 0}
						<div class="text-center text-[#5f6368] py-16">
							<p class="mb-4">This page is empty</p>
							<button
								onclick={() => { datEditorStore.selectPage(pageIndex); insertElement('paragraph'); }}
								class="px-4 py-2 bg-[#1a73e8] text-white rounded hover:bg-[#1557b0]"
							>
								Add Element
							</button>
						</div>
					{/if}
				</div>
			{/each}

			<!-- Add new page button -->
			<div class="flex justify-center mb-8">
				<button
					onclick={() => datEditorStore.addPage()}
					class="px-6 py-3 bg-white border border-[#dadce0] rounded-lg shadow-sm hover:shadow-md flex items-center gap-2 text-[#1a73e8]"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
					Add new page
				</button>
			</div>
		</div>
		{/if}
	</div>
</div>

<!-- Context Menu -->
{#if contextMenu}
	<div
		class="context-menu fixed bg-white border border-[#dadce0] rounded-lg shadow-lg py-2 z-50 min-w-[180px]"
		style="left: {contextMenu.x}px; top: {contextMenu.y}px;"
	>
		<button onclick={() => { startEditing(contextMenu!.elementIndex); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] text-sm">Edit</button>
		<button onclick={() => { datEditorStore.copyElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] text-sm">Copy</button>
		<button onclick={() => { datEditorStore.copyElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex); datEditorStore.pasteElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] text-sm">Duplicate</button>
		<div class="border-t border-[#dadce0] my-1"></div>
		<button onclick={() => { if (contextMenu!.elementIndex > 0) datEditorStore.moveElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex, contextMenu!.elementIndex - 1); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] text-sm">Move up</button>
		<button onclick={() => { if ($currentPage && contextMenu!.elementIndex < $currentPage.elements.length - 1) datEditorStore.moveElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex, contextMenu!.elementIndex + 1); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] text-sm">Move down</button>
		<div class="border-t border-[#dadce0] my-1"></div>
		<button onclick={() => { datEditorStore.deleteElement($datEditorStore.selectedPageIndex, contextMenu!.elementIndex); contextMenu = null; }} class="w-full text-left px-4 py-2 hover:bg-[#fce8e6] text-sm text-[#c5221f]">Delete</button>
	</div>
{/if}

<!-- Template Modal -->
{#if showTemplateModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick={() => showTemplateModal = false}>
		<div class="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-hidden" onclick={(e) => e.stopPropagation()}>
			<div class="p-6 border-b border-[#dadce0] flex justify-between items-center">
				<h2 class="text-xl font-medium">Choose a template</h2>
				<button onclick={() => showTemplateModal = false} class="w-8 h-8 flex items-center justify-center hover:bg-[#f1f3f4] rounded-full">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="#5f6368"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
				</button>
			</div>
			<div class="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-2 gap-4">
				{#each PRESET_TEMPLATES as template}
					<button
						onclick={() => handleLoadTemplate(template.id)}
						class="text-left p-4 border border-[#dadce0] rounded-lg hover:border-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
					>
						<div class="font-medium text-[#202124]">{template.name}</div>
						<div class="text-sm text-[#5f6368] mt-1">{template.description}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
