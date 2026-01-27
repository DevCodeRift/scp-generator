<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import {
		ARTICLE_TYPE_INFO,
		type NewspaperClipping
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

	let articleTypeInfo = $derived(doc ? ARTICLE_TYPE_INFO[doc.articleType] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="newspaper-container shadow-xl {doc.paperStyle} {doc.showAgedEffect ? 'aged' : ''} {doc.showTornEdges ? 'torn' : ''}"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Torn edge effect -->
		{#if doc.showTornEdges}
			<div class="torn-edge top"></div>
			<div class="torn-edge bottom"></div>
		{/if}

		<!-- Masthead -->
		<div class="masthead">
			<div class="publication-name">{doc.publicationName}</div>
			<div class="publication-info">
				{#if doc.publicationDate}
					<span>{doc.publicationDate}</span>
				{/if}
				{#if doc.edition}
					<span class="separator">|</span>
					<span>{doc.edition}</span>
				{/if}
				{#if doc.pageNumber}
					<span class="separator">|</span>
					<span>Page {doc.pageNumber}</span>
				{/if}
			</div>
		</div>

		<div class="divider-ornate"></div>

		<!-- Article -->
		<article class="article {doc.showHighlighting ? 'highlighted' : ''}">
			<!-- Headline -->
			<h1 class="headline">{doc.headline || 'HEADLINE'}</h1>

			{#if doc.subheadline}
				<h2 class="subheadline">{doc.subheadline}</h2>
			{/if}

			<!-- Byline -->
			{#if doc.byline}
				<div class="byline">{doc.byline}</div>
			{/if}

			<!-- Photo -->
			{#if doc.showPhotoPlaceholder}
				<div class="photo-container">
					<div class="photo-placeholder">
						<div class="photo-icon">📷</div>
						<div class="photo-text">PHOTOGRAPH</div>
					</div>
					{#if doc.photoCaption}
						<div class="photo-caption">{doc.photoCaption}</div>
					{/if}
				</div>
			{/if}

			<!-- Lead -->
			{#if doc.leadParagraph}
				<p class="lead">
					{#if doc.dateline}
						<span class="dateline">{doc.dateline}</span>
					{/if}
					{doc.leadParagraph}
				</p>
			{/if}

			<!-- Pull Quote -->
			{#if doc.pullQuote}
				<blockquote class="pull-quote">
					"{doc.pullQuote}"
				</blockquote>
			{/if}

			<!-- Body -->
			<div class="body-text">
				{#if !doc.leadParagraph && doc.dateline}
					<span class="dateline">{doc.dateline}</span>
				{/if}
				{doc.bodyContent || '[Article content]'}
			</div>
		</article>

		<!-- Clipping mark -->
		{#if doc.showTornEdges}
			<div class="clipping-note">
				✂ CLIPPED FOR RECORDS
			</div>
		{/if}
	</div>
{:else}
	<div class="newspaper-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.newspaper-container {
		background-color: #f5f5f0;
		color: #1a1a1a;
		font-family: 'Times New Roman', 'Georgia', serif;
		padding: 2rem;
		min-width: 500px;
		max-width: 700px;
		position: relative;
	}

	.newspaper-container.aged {
		background-color: #e8dfc8;
		background-image:
			radial-gradient(ellipse at 30% 20%, rgba(139, 90, 43, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 80%, rgba(139, 90, 43, 0.15) 0%, transparent 40%);
	}

	.newspaper-container.vintage {
		font-family: 'Playfair Display', 'Times New Roman', serif;
	}

	.newspaper-container.tabloid {
		font-family: 'Arial', sans-serif;
	}

	.newspaper-container.tabloid .headline {
		font-family: 'Impact', 'Arial Black', sans-serif;
	}

	.newspaper-container.torn {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}

	.torn-edge {
		position: absolute;
		left: 0;
		right: 0;
		height: 20px;
		background: linear-gradient(
			135deg,
			transparent 33.33%,
			#f5f5f0 33.33%,
			#f5f5f0 66.66%,
			transparent 66.66%
		);
		background-size: 20px 100%;
	}

	.newspaper-container.aged .torn-edge {
		background: linear-gradient(
			135deg,
			transparent 33.33%,
			#e8dfc8 33.33%,
			#e8dfc8 66.66%,
			transparent 66.66%
		);
		background-size: 20px 100%;
	}

	.torn-edge.top {
		top: 0;
		transform: rotate(180deg);
	}

	.torn-edge.bottom {
		bottom: 0;
	}

	.masthead {
		text-align: center;
		margin-bottom: 1rem;
	}

	.publication-name {
		font-family: 'Old English Text MT', 'Times New Roman', serif;
		font-size: 2.5rem;
		font-weight: normal;
		line-height: 1.1;
	}

	.newspaper-container.tabloid .publication-name {
		font-family: 'Impact', 'Arial Black', sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.newspaper-container.modern .publication-name {
		font-family: 'Helvetica', 'Arial', sans-serif;
		font-weight: 700;
	}

	.publication-info {
		font-size: 0.75rem;
		color: #666;
		margin-top: 0.5rem;
	}

	.separator {
		margin: 0 0.5rem;
	}

	.divider-ornate {
		height: 3px;
		background: linear-gradient(90deg, transparent, #333, transparent);
		margin: 1rem 0;
	}

	.headline {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.1;
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
	}

	.newspaper-container.tabloid .headline {
		font-size: 2.5rem;
	}

	.subheadline {
		font-size: 1.1rem;
		font-weight: normal;
		font-style: italic;
		color: #444;
		margin: 0 0 1rem 0;
	}

	.byline {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 1rem;
		font-style: italic;
	}

	.photo-container {
		float: right;
		width: 45%;
		margin: 0 0 1rem 1rem;
	}

	.photo-placeholder {
		background: #ddd;
		border: 1px solid #999;
		aspect-ratio: 4/3;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #666;
	}

	.photo-icon {
		font-size: 2rem;
	}

	.photo-text {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.photo-caption {
		font-size: 0.75rem;
		font-style: italic;
		color: #444;
		padding: 0.5rem;
		background: #f0f0f0;
		border: 1px solid #999;
		border-top: none;
	}

	.lead {
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.dateline {
		font-weight: bold;
		text-transform: uppercase;
		font-size: 0.85rem;
	}

	.pull-quote {
		font-size: 1.25rem;
		font-style: italic;
		color: #333;
		border-left: 4px solid #333;
		padding-left: 1rem;
		margin: 1rem 0;
		clear: both;
	}

	.body-text {
		column-count: 2;
		column-gap: 1.5rem;
		column-rule: 1px solid #ccc;
		text-align: justify;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.article.highlighted .headline,
	.article.highlighted .lead {
		background: linear-gradient(180deg, transparent 60%, rgba(255, 255, 0, 0.3) 60%);
	}

	.clipping-note {
		position: absolute;
		bottom: 2.5rem;
		right: 1rem;
		font-size: 0.65rem;
		color: #999;
		transform: rotate(-5deg);
	}
</style>
