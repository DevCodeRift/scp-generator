<script lang="ts">
	import type { DatDocument, DatElement } from '$lib/dat/types';

	interface Props {
		document: DatDocument;
		scale?: number;
	}

	let { document: doc, scale = 1 }: Props = $props();

	function isImageElement(el: DatElement): el is Extract<DatElement, { type: 'image' }> {
		return el.type === 'image';
	}

	function isSignatureElement(el: DatElement): el is Extract<DatElement, { type: 'signature' }> {
		return el.type === 'signature';
	}

	function isCheckboxElement(el: DatElement): el is Extract<DatElement, { type: 'checkbox' }> {
		return el.type === 'checkbox';
	}
</script>

<div
	class="dat-preview"
	style="transform: scale({scale}); transform-origin: top center;"
	id="document-preview"
>
	{#each doc.pages as page, pageIndex}
		<div class="dat-page" class:not-first={pageIndex > 0}>
			<!-- Page number -->
			<div class="page-number">Page {pageIndex + 1} of {doc.pages.length}</div>

			{#each page.elements as element}
				{#if element.type === 'header'}
					<h1 class="dat-header">{element.content}</h1>
				{:else if element.type === 'header2'}
					<h2 class="dat-header2">{element.content}</h2>
				{:else if element.type === 'header3'}
					<h3 class="dat-header3">{element.content}</h3>
				{:else if element.type === 'line'}
					<hr class="dat-line" />
				{:else if element.type === 'dottedline'}
					<hr class="dat-dottedline" />
				{:else if element.type === 'paragraph'}
					<p class="dat-paragraph">{element.content}</p>
				{:else if element.type === 'smalltext'}
					<p class="dat-smalltext">{element.content}</p>
				{:else if isImageElement(element)}
					<div
						class="dat-image-wrapper"
						style="text-align: {element.params.align <= 0.33 ? 'left' : element.params.align >= 0.66 ? 'right' : 'center'}"
					>
						<img
							src={element.args.url}
							alt="Document image"
							class="dat-image"
							style="max-width: {element.params.scale * 100}%"
							crossorigin="anonymous"
						/>
					</div>
				{:else if isSignatureElement(element)}
					<div class="dat-signature">
						<div class="signature-line"></div>
						<div class="signature-label">Signature</div>
					</div>
				{:else if isCheckboxElement(element)}
					<label class="dat-checkbox" class:right-align={element.params.rightAlign}>
						<input type="checkbox" checked={element.params.toggle} disabled />
						<span>{element.args.text}</span>
					</label>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.dat-preview {
		font-family: 'Courier Prime', 'Courier New', monospace;
		color: #1a1a1a;
		max-width: 700px;
	}

	.dat-page {
		background: #f5f5f0;
		padding: 2rem 2.5rem;
		border: 1px solid #d0d0c8;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		position: relative;
	}

	.dat-page.not-first {
		margin-top: 1.5rem;
		border-top: 3px solid #b0b0a8;
	}

	.page-number {
		position: absolute;
		bottom: 0.5rem;
		right: 1rem;
		font-size: 0.65rem;
		color: #999;
	}

	.dat-header {
		font-size: 1.3rem;
		font-weight: bold;
		text-align: center;
		margin: 0.5rem 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: pre-wrap;
	}

	.dat-header2 {
		font-size: 1.1rem;
		font-weight: bold;
		margin: 0.5rem 0;
		white-space: pre-wrap;
	}

	.dat-header3 {
		font-size: 0.95rem;
		font-weight: bold;
		margin: 0.4rem 0;
		white-space: pre-wrap;
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
		margin: 0.3rem 0;
		white-space: pre-wrap;
		line-height: 1.4;
	}

	.dat-smalltext {
		font-size: 0.75rem;
		margin: 0.2rem 0;
		white-space: pre-wrap;
		line-height: 1.5;
		color: #333;
	}

	.dat-image-wrapper {
		margin: 0.75rem 0;
	}

	.dat-image {
		display: inline-block;
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
		margin: 0.3rem 0;
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
	}
</style>
