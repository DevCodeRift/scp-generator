<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SCPForm from '$lib/components/editor/SCPForm.svelte';
	import ResearchForm from '$lib/components/editor/ResearchForm.svelte';
	import LetterForm from '$lib/components/editor/LetterForm.svelte';
	import InterviewForm from '$lib/components/editor/InterviewForm.svelte';
	import PersonnelForm from '$lib/components/editor/PersonnelForm.svelte';
	import IncidentForm from '$lib/components/editor/IncidentForm.svelte';
	import MissionForm from '$lib/components/editor/MissionForm.svelte';
	import BreachForm from '$lib/components/editor/BreachForm.svelte';
	import AnomalyCardForm from '$lib/components/editor/AnomalyCardForm.svelte';
	import SCPPreview from '$lib/components/preview/SCPPreview.svelte';
	import ResearchPreview from '$lib/components/preview/ResearchPreview.svelte';
	import LetterPreview from '$lib/components/preview/LetterPreview.svelte';
	import InterviewPreview from '$lib/components/preview/InterviewPreview.svelte';
	import PersonnelPreview from '$lib/components/preview/PersonnelPreview.svelte';
	import IncidentPreview from '$lib/components/preview/IncidentPreview.svelte';
	import MissionPreview from '$lib/components/preview/MissionPreview.svelte';
	import BreachPreview from '$lib/components/preview/BreachPreview.svelte';
	import AnomalyCardPreview from '$lib/components/preview/AnomalyCardPreview.svelte';
	import { documentStore, type DocumentType } from '$lib/stores/document';
	import { factionStore } from '$lib/stores/faction';

	let docType = $derived($page.params.type as DocumentType);
	let showPreview = $state(true);
	let previewScale = $state(0.75);
	let isExporting = $state(false);
	let isFullscreen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isFullscreen) {
			isFullscreen = false;
		}
	}

	const typeNames: Record<string, string> = {
		scp: 'SCP Entry',
		research: 'Research Report',
		letter: 'Letter / Memo',
		interview: 'Interview Log',
		personnel: 'Personnel File',
		incident: 'Incident Report',
		mission: 'Mission Briefing',
		breach: 'Containment Breach',
		'anomaly-card': 'Anomaly Card'
	};

	const validTypes = ['scp', 'research', 'letter', 'interview', 'personnel', 'incident', 'mission', 'breach', 'anomaly-card'];

	onMount(() => {
		// Validate document type
		if (!validTypes.includes(docType)) {
			goto('/');
			return;
		}

		// Try to load from localStorage or init new document
		if (!documentStore.load(docType)) {
			documentStore.initDocument(docType);
		}

		// Update faction in document when store changes
		const unsubFaction = factionStore.subscribe(faction => {
			documentStore.update(doc => {
				if (doc) {
					return {
						...doc,
						metadata: { ...doc.metadata, faction }
					};
				}
				return doc;
			});
		});

		// Autosave on changes
		const unsubDoc = documentStore.subscribe(() => {
			documentStore.save();
		});

		return () => {
			unsubFaction();
			unsubDoc();
		};
	});

	async function handleExport() {
		if (!browser) return;

		isExporting = true;
		const originalScale = previewScale;

		try {
			// Set to full scale for accurate capture
			previewScale = 1;

			// Wait for DOM to update and fonts to load
			await new Promise(resolve => setTimeout(resolve, 100));
			await document.fonts.ready;

			const previewElement = document.getElementById('document-preview');
			if (!previewElement) {
				alert('No document to export');
				return;
			}

			// Dynamic import of html2pdf
			const html2pdf = (await import('html2pdf.js')).default;

			const opt = {
				margin: 10,
				filename: `${docType}-document.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: {
					scale: 2,
					useCORS: true,
					logging: false
				},
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};

			await html2pdf().set(opt).from(previewElement).save();
		} catch (error) {
			console.error('Export failed:', error);
			alert('Export failed. Please try again.');
		} finally {
			// Restore original scale
			previewScale = originalScale;
			isExporting = false;
		}
	}

	async function handleExportImage() {
		if (!browser) return;

		isExporting = true;
		const originalScale = previewScale;

		try {
			// Set to full scale for accurate capture
			previewScale = 1;

			// Wait for DOM to update and fonts to load
			await new Promise(resolve => setTimeout(resolve, 150));
			await document.fonts.ready;

			const previewElement = document.getElementById('document-preview');
			if (!previewElement) {
				alert('No document to export');
				return;
			}

			// Use modern-screenshot for better CSS support
			const { domToPng } = await import('modern-screenshot');

			const dataUrl = await domToPng(previewElement, {
				scale: 2,
				backgroundColor: '#f5f5f0',
				style: {
					transform: 'none'
				}
			});

			// Download the image
			const link = document.createElement('a');
			link.download = `${docType}-document.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Export failed:', error);
			alert('Export failed. Please try again.');
		} finally {
			// Restore original scale
			previewScale = originalScale;
			isExporting = false;
		}
	}

	function handleNewDocument() {
		if (confirm('Start a new document? Current changes will be saved.')) {
			documentStore.initDocument(docType);
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{typeNames[docType] || 'Editor'} | SCP Document Generator</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
		<div class="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-terminal crt-glow text-[var(--color-accent)] hover:opacity-80">
					SCP://DOCGEN
				</a>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">{typeNames[docType]}</span>
			</div>

			<div class="flex items-center gap-3">
				<Button variant="ghost" size="sm" onclick={handleNewDocument}>
					New
				</Button>
				<Button variant="ghost" size="sm" onclick={() => showPreview = !showPreview}>
					{showPreview ? 'Hide' : 'Show'} Preview
				</Button>
				<FactionSelector />
				<Button variant="ghost" size="sm" onclick={handleExportImage} disabled={isExporting}>
					{isExporting ? 'Exporting...' : 'Export PNG'}
				</Button>
				<Button variant="primary" size="sm" onclick={handleExport} disabled={isExporting}>
					{isExporting ? 'Exporting...' : 'Export PDF'}
				</Button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex">
		<!-- Editor Panel -->
		<div class="flex-1 overflow-y-auto p-4 {showPreview ? 'max-w-2xl' : 'max-w-4xl mx-auto'}">
			<div class="mb-4">
				<h1 class="text-xl font-bold crt-glow">
					<span class="text-[var(--color-accent)]">&gt;</span> {typeNames[docType]} Editor
				</h1>
				<p class="text-sm text-[var(--color-text-muted)] mt-1">
					Fill in the fields below. Changes are saved automatically.
				</p>
			</div>

			{#if docType === 'scp'}
				<SCPForm />
			{:else if docType === 'research'}
				<ResearchForm />
			{:else if docType === 'letter'}
				<LetterForm />
			{:else if docType === 'interview'}
				<InterviewForm />
			{:else if docType === 'personnel'}
				<PersonnelForm />
			{:else if docType === 'incident'}
				<IncidentForm />
			{:else if docType === 'mission'}
				<MissionForm />
			{:else if docType === 'breach'}
				<BreachForm />
			{:else if docType === 'anomaly-card'}
				<AnomalyCardForm />
			{/if}
		</div>

		<!-- Preview Panel -->
		{#if showPreview}
			<div class="w-1/2 border-l border-[var(--color-border)] bg-gray-800 overflow-y-auto">
				<div class="sticky top-0 bg-gray-900 border-b border-gray-700 p-2 flex items-center justify-between z-10">
					<span class="text-xs text-gray-400 uppercase tracking-wide">Document Preview</span>
					<div class="flex items-center gap-2">
						<button
							class="text-xs text-gray-400 hover:text-white px-2 py-1"
							onclick={() => previewScale = Math.max(0.5, previewScale - 0.1)}
						>
							-
						</button>
						<span class="text-xs text-gray-400 w-12 text-center">
							{Math.round(previewScale * 100)}%
						</span>
						<button
							class="text-xs text-gray-400 hover:text-white px-2 py-1"
							onclick={() => previewScale = Math.min(1.5, previewScale + 0.1)}
						>
							+
						</button>
						<button
							class="text-xs text-gray-400 hover:text-white px-2 py-1 ml-2 border border-gray-600 rounded"
							onclick={() => isFullscreen = true}
							title="Fullscreen (for screenshots)"
						>
							Fullscreen
						</button>
					</div>
				</div>
				<div class="p-4">
					{#if docType === 'scp'}
						<SCPPreview scale={previewScale} />
					{:else if docType === 'research'}
						<ResearchPreview scale={previewScale} />
					{:else if docType === 'letter'}
						<LetterPreview scale={previewScale} />
					{:else if docType === 'interview'}
						<InterviewPreview scale={previewScale} />
					{:else if docType === 'personnel'}
						<PersonnelPreview scale={previewScale} />
					{:else if docType === 'incident'}
						<IncidentPreview scale={previewScale} />
					{:else if docType === 'mission'}
						<MissionPreview scale={previewScale} />
					{:else if docType === 'breach'}
						<BreachPreview scale={previewScale} />
					{:else if docType === 'anomaly-card'}
						<AnomalyCardPreview scale={previewScale} />
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Fullscreen Preview Overlay -->
{#if isFullscreen}
	<div class="fixed inset-0 z-50 bg-gray-900 overflow-auto">
		<!-- Close button -->
		<button
			class="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
			onclick={() => isFullscreen = false}
		>
			<span>Close</span>
			<span class="text-xs text-gray-400">(ESC)</span>
		</button>

		<!-- Centered document -->
		<div class="min-h-screen flex items-start justify-center py-8 px-4">
			{#if docType === 'scp'}
				<SCPPreview scale={1} />
			{:else if docType === 'research'}
				<ResearchPreview scale={1} />
			{:else if docType === 'letter'}
				<LetterPreview scale={1} />
			{:else if docType === 'interview'}
				<InterviewPreview scale={1} />
			{:else if docType === 'personnel'}
				<PersonnelPreview scale={1} />
			{:else if docType === 'incident'}
				<IncidentPreview scale={1} />
			{:else if docType === 'mission'}
				<MissionPreview scale={1} />
			{:else if docType === 'breach'}
				<BreachPreview scale={1} />
			{:else if docType === 'anomaly-card'}
				<AnomalyCardPreview scale={1} />
			{/if}
		</div>
	</div>
{/if}
