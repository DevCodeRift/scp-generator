<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		ARTICLE_TYPE_INFO,
		PAPER_STYLE_INFO,
		type NewspaperClipping,
		type ArticleType,
		type PaperStyle
	} from '$lib/schemas/newspaper';

	let doc = $state<NewspaperClipping | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'newspaper') {
				doc = d as NewspaperClipping;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const articleTypeOptions = Object.entries(ARTICLE_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const paperStyleOptions = Object.entries(PAPER_STYLE_INFO).map(([value, info]) => ({
		value,
		label: `${info.label} - ${info.description}`
	}));

	function updateField<K extends keyof NewspaperClipping>(field: K, value: NewspaperClipping[K]) {
		documentStore.update(d => {
			if (d && d.type === 'newspaper') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Publication Info -->
		<div class="terminal-window">
			<div class="terminal-header">PUBLICATION INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Publication Name"
						value={doc.publicationName}
						placeholder="The Daily Herald"
						required
						onchange={(v) => updateField('publicationName', v)}
					/>
					<Input
						label="Publication Date"
						type="date"
						value={doc.publicationDate || ''}
						onchange={(v) => updateField('publicationDate', v || undefined)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input
						label="Edition"
						value={doc.edition || ''}
						placeholder="Morning Edition"
						onchange={(v) => updateField('edition', v || undefined)}
					/>
					<Input
						label="Page Number"
						value={doc.pageNumber || ''}
						placeholder="A1, B3, etc."
						onchange={(v) => updateField('pageNumber', v || undefined)}
					/>
					<Select
						label="Paper Style"
						value={doc.paperStyle}
						options={paperStyleOptions}
						onchange={(v) => updateField('paperStyle', v as PaperStyle)}
					/>
				</div>
			</div>
		</div>

		<!-- Article Info -->
		<div class="terminal-window">
			<div class="terminal-header">ARTICLE HEADER</div>
			<div class="p-4 space-y-4">
				<Select
					label="Article Type"
					value={doc.articleType}
					options={articleTypeOptions}
					onchange={(v) => updateField('articleType', v as ArticleType)}
				/>
				<Input
					label="Headline"
					value={doc.headline}
					placeholder="MAIN HEADLINE HERE"
					required
					onchange={(v) => updateField('headline', v)}
				/>
				<Input
					label="Subheadline"
					value={doc.subheadline || ''}
					placeholder="Secondary headline or deck..."
					onchange={(v) => updateField('subheadline', v || undefined)}
				/>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Byline (Author)"
						value={doc.byline || ''}
						placeholder="By John Smith, Staff Reporter"
						onchange={(v) => updateField('byline', v || undefined)}
					/>
					<Input
						label="Dateline"
						value={doc.dateline || ''}
						placeholder="NEW YORK -"
						onchange={(v) => updateField('dateline', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- Article Content -->
		<div class="terminal-window">
			<div class="terminal-header">ARTICLE CONTENT</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Lead Paragraph"
					value={doc.leadParagraph || ''}
					placeholder="The opening paragraph that summarizes the story..."
					rows={3}
					onchange={(v) => updateField('leadParagraph', v || undefined)}
				/>
				<Textarea
					label="Body Content"
					value={doc.bodyContent}
					placeholder="The main article text..."
					rows={10}
					required
					onchange={(v) => updateField('bodyContent', v)}
				/>
				<Input
					label="Pull Quote"
					value={doc.pullQuote || ''}
					placeholder="A notable quote to highlight..."
					onchange={(v) => updateField('pullQuote', v || undefined)}
				/>
			</div>
		</div>

		<!-- Photo -->
		<div class="terminal-window">
			<div class="terminal-header">PHOTO</div>
			<div class="p-4 space-y-4">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showPhotoPlaceholder}
						onchange={(e) => updateField('showPhotoPlaceholder', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include photo placeholder</span>
				</label>
				{#if doc.showPhotoPlaceholder}
					<Input
						label="Photo Caption"
						value={doc.photoCaption || ''}
						placeholder="Caption describing the photo..."
						onchange={(v) => updateField('photoCaption', v || undefined)}
					/>
				{/if}
			</div>
		</div>

		<!-- SCP Connection (internal notes) -->
		<div class="terminal-window">
			<div class="terminal-header">FOUNDATION NOTES (Internal Use)</div>
			<div class="p-4 space-y-4">
				<Input
					label="Related SCP"
					value={doc.relatedSCP || ''}
					placeholder="SCP-XXXX"
					onchange={(v) => updateField('relatedSCP', v || undefined)}
				/>
				<Textarea
					label="Cover Story Notes"
					value={doc.coverStoryNotes || ''}
					placeholder="Notes about this cover story, disinformation elements..."
					rows={3}
					onchange={(v) => updateField('coverStoryNotes', v || undefined)}
				/>
			</div>
		</div>

		<!-- Display Options -->
		<div class="terminal-window">
			<div class="terminal-header">DISPLAY OPTIONS</div>
			<div class="p-4 space-y-3">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showAgedEffect}
						onchange={(e) => updateField('showAgedEffect', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Apply aged/yellowed paper effect</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showTornEdges}
						onchange={(e) => updateField('showTornEdges', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show torn/cut edges</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showHighlighting}
						onchange={(e) => updateField('showHighlighting', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show highlighted/circled text effect</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
