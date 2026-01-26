<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import { LETTER_TYPE_INFO, COMMON_SITES, type Letter, type LetterType } from '$lib/schemas/letter';

	// Use $state and sync from store via $effect
	let doc = $state<Letter | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'letter') {
				doc = d as Letter;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const classificationOptions = [
		{ value: 'unrestricted', label: 'Unrestricted' },
		{ value: 'restricted', label: 'Restricted' },
		{ value: 'confidential', label: 'Confidential' },
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const letterTypeOptions = Object.entries(LETTER_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label,
		description: info.description
	}));

	const siteOptions = [
		{ value: '', label: 'Select Site...' },
		...COMMON_SITES.map(s => ({ value: s, label: s }))
	];

	function updateField<K extends keyof Letter>(field: K, value: Letter[K]) {
		documentStore.update(d => {
			if (d && d.type === 'letter') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof Letter['metadata']>(field: K, value: Letter['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'letter') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}

	function updateFrom<K extends keyof Letter['from']>(field: K, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'letter') {
				return { ...d, from: { ...d.from, [field]: value } };
			}
			return d;
		});
	}

	function updateTo<K extends keyof Letter['to']>(field: K, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'letter') {
				return { ...d, to: { ...d.to, [field]: value } };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Classification -->
		<div class="terminal-window">
			<div class="terminal-header">DOCUMENT CLASSIFICATION</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Select
					label="Classification"
					value={doc.metadata.classification || 'restricted'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
				<Select
					label="Letter Type"
					value={doc.letterType}
					options={letterTypeOptions}
					onchange={(v) => updateField('letterType', v as LetterType)}
				/>
			</div>
		</div>

		<!-- Header Info -->
		<div class="terminal-window">
			<div class="terminal-header">LETTER HEADER</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Date"
						type="date"
						value={doc.date}
						required
						onchange={(v) => updateField('date', v)}
					/>
					<Input
						label="Subject"
						value={doc.subject}
						placeholder="RE: Subject of correspondence"
						required
						onchange={(v) => updateField('subject', v)}
					/>
				</div>
			</div>
		</div>

		<!-- From -->
		<div class="terminal-window">
			<div class="terminal-header">FROM</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Name"
						value={doc.from.name}
						placeholder="Dr. [Name]"
						required
						onchange={(v) => updateFrom('name', v)}
					/>
					<Input
						label="Title"
						value={doc.from.title || ''}
						placeholder="Site Director, Head Researcher, etc."
						onchange={(v) => updateFrom('title', v || '')}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Department"
						value={doc.from.department || ''}
						placeholder="Department name..."
						onchange={(v) => updateFrom('department', v || '')}
					/>
					<Select
						label="Site"
						value={doc.from.site || ''}
						options={siteOptions}
						onchange={(v) => updateFrom('site', v)}
					/>
				</div>
			</div>
		</div>

		<!-- To -->
		<div class="terminal-window">
			<div class="terminal-header">TO</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Name"
						value={doc.to.name}
						placeholder="Recipient name..."
						required
						onchange={(v) => updateTo('name', v)}
					/>
					<Input
						label="Title"
						value={doc.to.title || ''}
						placeholder="Recipient title..."
						onchange={(v) => updateTo('title', v || '')}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Department"
						value={doc.to.department || ''}
						placeholder="Department name..."
						onchange={(v) => updateTo('department', v || '')}
					/>
					<Select
						label="Site"
						value={doc.to.site || ''}
						options={siteOptions}
						onchange={(v) => updateTo('site', v)}
					/>
				</div>
			</div>
		</div>

		<!-- Body -->
		<div class="terminal-window">
			<div class="terminal-header">MESSAGE BODY</div>
			<div class="p-4">
				<Textarea
					value={doc.body}
					placeholder="Write your message here..."
					rows={12}
					required
					onchange={(v) => updateField('body', v)}
				/>
			</div>
		</div>

		<!-- Options -->
		<div class="terminal-window">
			<div class="terminal-header">OPTIONS</div>
			<div class="p-4 space-y-3">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.includeSignature}
						onchange={(e) => updateField('includeSignature', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include signature line</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.includeStamp}
						onchange={(e) => updateField('includeStamp', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Include official stamp</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
