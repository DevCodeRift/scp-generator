<script lang="ts">
	import type { DatDocument, DatElement, DatPage } from '$lib/dat/types';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		document: DatDocument;
		scale?: number;
		onUpdate?: (doc: DatDocument) => void;
	}

	let { document: doc = $bindable(), scale = 1, onUpdate }: Props = $props();

	// Element type labels for the toolbar
	const elementTypes = [
		{ type: 'header', label: 'H1', title: 'Header 1' },
		{ type: 'header2', label: 'H2', title: 'Header 2' },
		{ type: 'header3', label: 'H3', title: 'Header 3' },
		{ type: 'paragraph', label: 'P', title: 'Paragraph' },
		{ type: 'smalltext', label: 'Sm', title: 'Small Text' },
		{ type: 'line', label: '—', title: 'Line' },
		{ type: 'dottedline', label: '···', title: 'Dotted Line' },
		{ type: 'signature', label: 'Sig', title: 'Signature' },
		{ type: 'checkbox', label: '☑', title: 'Checkbox' }
	] as const;

	let selectedPageIndex = $state(0);
	let selectedElementIndex = $state<number | null>(null);

	function isImageElement(el: DatElement): el is Extract<DatElement, { type: 'image' }> {
		return el.type === 'image';
	}

	function isSignatureElement(el: DatElement): el is Extract<DatElement, { type: 'signature' }> {
		return el.type === 'signature';
	}

	function isCheckboxElement(el: DatElement): el is Extract<DatElement, { type: 'checkbox' }> {
		return el.type === 'checkbox';
	}

	function updateElement(pageIndex: number, elementIndex: number, content: string) {
		const newPages = [...doc.pages];
		const element = newPages[pageIndex].elements[elementIndex];

		if (element.type === 'checkbox') {
			// For checkboxes, update the args.text field
			newPages[pageIndex].elements[elementIndex] = {
				...element,
				args: { ...element.args, text: content }
			};
		} else {
			// For other elements, update the content field
			newPages[pageIndex].elements[elementIndex] = {
				...element,
				content
			};
		}

		doc = { ...doc, pages: newPages };
		onUpdate?.(doc);
	}

	function addElement(type: string, afterIndex?: number) {
		const newPages = [...doc.pages];
		let newElement: DatElement;

		switch (type) {
			case 'signature':
				newElement = {
					type: 'signature',
					content: '',
					uid: Date.now()
				};
				break;
			case 'checkbox':
				newElement = {
					type: 'checkbox',
					content: '',
					params: { toggle: false, rightAlign: false },
					args: { text: 'New checkbox' }
				};
				break;
			case 'line':
			case 'dottedline':
				newElement = { type, content: '' } as DatElement;
				break;
			default:
				newElement = { type, content: 'New text' } as DatElement;
		}

		const insertIndex = afterIndex !== undefined ? afterIndex + 1 : newPages[selectedPageIndex].elements.length;
		newPages[selectedPageIndex].elements.splice(insertIndex, 0, newElement);

		doc = { ...doc, pages: newPages };
		selectedElementIndex = insertIndex;
		onUpdate?.(doc);
	}

	function deleteElement(pageIndex: number, elementIndex: number) {
		const newPages = [...doc.pages];
		newPages[pageIndex].elements.splice(elementIndex, 1);
		doc = { ...doc, pages: newPages };
		selectedElementIndex = null;
		onUpdate?.(doc);
	}

	function moveElement(pageIndex: number, elementIndex: number, direction: 'up' | 'down') {
		const newPages = [...doc.pages];
		const elements = newPages[pageIndex].elements;
		const newIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;

		if (newIndex < 0 || newIndex >= elements.length) return;

		[elements[elementIndex], elements[newIndex]] = [elements[newIndex], elements[elementIndex]];
		doc = { ...doc, pages: newPages };
		selectedElementIndex = newIndex;
		onUpdate?.(doc);
	}

	function addPage() {
		const newPages = [...doc.pages, { elements: [], effects: [] }];
		doc = { ...doc, pages: newPages };
		selectedPageIndex = newPages.length - 1;
		onUpdate?.(doc);
	}

	function deletePage(pageIndex: number) {
		if (doc.pages.length <= 1) return;
		const newPages = doc.pages.filter((_, i) => i !== pageIndex);
		doc = { ...doc, pages: newPages };
		if (selectedPageIndex >= newPages.length) {
			selectedPageIndex = newPages.length - 1;
		}
		onUpdate?.(doc);
	}

	function toggleCheckbox(pageIndex: number, elementIndex: number) {
		const newPages = [...doc.pages];
		const element = newPages[pageIndex].elements[elementIndex];
		if (element.type === 'checkbox') {
			newPages[pageIndex].elements[elementIndex] = {
				...element,
				params: { ...element.params, toggle: !element.params.toggle }
			};
			doc = { ...doc, pages: newPages };
			onUpdate?.(doc);
		}
	}
</script>

<!-- Toolbar -->
<div class="dat-toolbar">
	<div class="toolbar-section">
		<span class="toolbar-label">Add:</span>
		{#each elementTypes as et}
			<button
				class="toolbar-btn"
				title={et.title}
				onclick={() => addElement(et.type, selectedElementIndex ?? undefined)}
			>
				{et.label}
			</button>
		{/each}
	</div>
	<div class="toolbar-section">
		<button class="toolbar-btn" title="Add Page" onclick={addPage}>+ Page</button>
	</div>
</div>

<!-- Editor -->
<div
	class="dat-editor"
	style="transform: scale({scale}); transform-origin: top center;"
>
	{#each doc.pages as page, pageIndex}
		<div
			class="dat-page"
			class:not-first={pageIndex > 0}
			class:selected={selectedPageIndex === pageIndex}
			role="button"
			tabindex="0"
			onclick={() => selectedPageIndex = pageIndex}
			onkeydown={(e) => e.key === 'Enter' && (selectedPageIndex = pageIndex)}
		>
			<!-- Page header -->
			<div class="page-header">
				<span class="page-label">Page {pageIndex + 1}</span>
				{#if doc.pages.length > 1}
					<button class="page-delete" onclick={() => deletePage(pageIndex)} title="Delete page">×</button>
				{/if}
			</div>

			{#each page.elements as element, elementIndex}
				<div
					class="element-wrapper"
					class:selected={selectedPageIndex === pageIndex && selectedElementIndex === elementIndex}
					role="button"
					tabindex="0"
					onclick={(e) => { e.stopPropagation(); selectedPageIndex = pageIndex; selectedElementIndex = elementIndex; }}
					onkeydown={(e) => e.key === 'Enter' && (selectedElementIndex = elementIndex)}
				>
					<!-- Element controls -->
					{#if selectedPageIndex === pageIndex && selectedElementIndex === elementIndex}
						<div class="element-controls">
							<button onclick={() => moveElement(pageIndex, elementIndex, 'up')} title="Move up">↑</button>
							<button onclick={() => moveElement(pageIndex, elementIndex, 'down')} title="Move down">↓</button>
							<button class="delete" onclick={() => deleteElement(pageIndex, elementIndex)} title="Delete">×</button>
						</div>
					{/if}

					{#if element.type === 'header'}
						<input
							type="text"
							class="dat-header editable"
							value={element.content}
							oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
							placeholder="Header text..."
						/>
					{:else if element.type === 'header2'}
						<input
							type="text"
							class="dat-header2 editable"
							value={element.content}
							oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
							placeholder="Header 2 text..."
						/>
					{:else if element.type === 'header3'}
						<input
							type="text"
							class="dat-header3 editable"
							value={element.content}
							oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
							placeholder="Header 3 text..."
						/>
					{:else if element.type === 'line'}
						<hr class="dat-line" />
					{:else if element.type === 'dottedline'}
						<hr class="dat-dottedline" />
					{:else if element.type === 'paragraph'}
						<textarea
							class="dat-paragraph editable"
							value={element.content}
							oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
							placeholder="Paragraph text..."
							rows="3"
						></textarea>
					{:else if element.type === 'smalltext'}
						<textarea
							class="dat-smalltext editable"
							value={element.content}
							oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
							placeholder="Small text..."
							rows="2"
						></textarea>
					{:else if isImageElement(element)}
						<div class="dat-image-wrapper">
							<input
								type="text"
								class="image-url-input"
								value={element.args.url}
								placeholder="Image URL..."
							/>
							{#if element.args.url}
								<img src={element.args.url} alt="Document image" class="dat-image" crossorigin="anonymous" />
							{/if}
						</div>
					{:else if isSignatureElement(element)}
						<div class="dat-signature">
							<div class="signature-line"></div>
							<div class="signature-label">Signature</div>
						</div>
					{:else if isCheckboxElement(element)}
						<label class="dat-checkbox" class:right-align={element.params.rightAlign}>
							<input
								type="checkbox"
								checked={element.params.toggle}
								onchange={() => toggleCheckbox(pageIndex, elementIndex)}
							/>
							<input
								type="text"
								class="checkbox-text editable"
								value={element.args.text}
								oninput={(e) => updateElement(pageIndex, elementIndex, e.currentTarget.value)}
								placeholder="Checkbox label..."
							/>
						</label>
					{/if}
				</div>
			{/each}

			{#if page.elements.length === 0}
				<div class="empty-page">
					<p>Empty page - use toolbar to add elements</p>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.dat-toolbar {
		display: flex;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 4px;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		position: sticky;
		top: 110px;
		z-index: 20;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.toolbar-section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.toolbar-label {
		font-size: 0.75rem;
		color: #888;
		text-transform: uppercase;
	}

	.toolbar-btn {
		padding: 0.25rem 0.5rem;
		background: #333;
		border: 1px solid #444;
		color: #fff;
		font-size: 0.75rem;
		border-radius: 3px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.toolbar-btn:hover {
		background: #444;
		border-color: #666;
	}

	.dat-editor {
		font-family: 'Courier Prime', 'Courier New', monospace;
		color: #1a1a1a;
	}

	.dat-page {
		background: #f5f5f0;
		padding: 2rem 2.5rem;
		border: 2px solid #d0d0c8;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		position: relative;
		cursor: pointer;
	}

	.dat-page.selected {
		border-color: #4a9eff;
	}

	.dat-page.not-first {
		margin-top: 1.5rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed #ccc;
	}

	.page-label {
		font-size: 0.7rem;
		color: #888;
		text-transform: uppercase;
	}

	.page-delete {
		background: #ff4444;
		border: none;
		color: white;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 14px;
		line-height: 1;
	}

	.element-wrapper {
		position: relative;
		padding: 2px;
		margin: 2px 0;
		border: 1px solid transparent;
		border-radius: 2px;
	}

	.element-wrapper:hover {
		border-color: #ccc;
	}

	.element-wrapper.selected {
		border-color: #4a9eff;
		background: rgba(74, 158, 255, 0.05);
	}

	.element-controls {
		position: absolute;
		right: -30px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.element-controls button {
		width: 22px;
		height: 22px;
		border: 1px solid #ccc;
		background: #fff;
		border-radius: 3px;
		cursor: pointer;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.element-controls button:hover {
		background: #f0f0f0;
	}

	.element-controls button.delete {
		background: #ff4444;
		border-color: #ff4444;
		color: white;
	}

	.editable {
		background: transparent;
		border: 1px dashed transparent;
		width: 100%;
		font-family: inherit;
		resize: vertical;
	}

	.editable:hover {
		border-color: #aaa;
	}

	.editable:focus {
		outline: none;
		border-color: #4a9eff;
		background: rgba(255, 255, 255, 0.5);
	}

	.dat-header {
		font-size: 1.3rem;
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.dat-header2 {
		font-size: 1.1rem;
		font-weight: bold;
	}

	.dat-header3 {
		font-size: 0.95rem;
		font-weight: bold;
	}

	.dat-line {
		border: none;
		border-top: 1px solid #1a1a1a;
		margin: 0.5rem 0;
	}

	.dat-dottedline {
		border: none;
		border-top: 1px dotted #999;
		margin: 0.3rem 0;
	}

	.dat-paragraph {
		font-size: 0.9rem;
		line-height: 1.4;
		min-height: 60px;
	}

	.dat-smalltext {
		font-size: 0.75rem;
		line-height: 1.5;
		color: #333;
		min-height: 40px;
	}

	.dat-image-wrapper {
		margin: 0.75rem 0;
	}

	.image-url-input {
		width: 100%;
		padding: 0.25rem;
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
		border: 1px solid #ccc;
	}

	.dat-image {
		display: block;
		max-width: 100%;
		border: 1px solid #ccc;
	}

	.dat-signature {
		margin: 0.75rem 0;
		padding: 1rem;
		border: 1px solid #aaa;
		background: #fafaf5;
	}

	.signature-line {
		border-bottom: 1px solid #333;
		width: 60%;
		margin: 1.5rem auto 0.25rem;
	}

	.signature-label {
		text-align: center;
		font-size: 0.7rem;
		color: #888;
	}

	.dat-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.dat-checkbox.right-align {
		flex-direction: row-reverse;
		justify-content: flex-end;
	}

	.dat-checkbox input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: #333;
		cursor: pointer;
	}

	.checkbox-text {
		flex: 1;
		font-size: 0.85rem;
	}

	.empty-page {
		text-align: center;
		padding: 2rem;
		color: #888;
		font-style: italic;
	}
</style>
