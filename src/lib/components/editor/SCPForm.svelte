<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { documentStore } from '$lib/stores/document';
	import { OBJECT_CLASS_INFO, type SCPDocument, type Addendum, type AddendumType } from '$lib/schemas/scp';
	import { v4 as uuid } from 'uuid';

	// Use $state and sync from store via $effect
	let doc = $state<SCPDocument | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'scp') {
				doc = d as SCPDocument;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	// Create options for object class select
	const objectClassOptions = Object.entries(OBJECT_CLASS_INFO).map(([value, info]) => ({
		value,
		label: value.charAt(0).toUpperCase() + value.slice(1),
		description: info.description
	}));

	const classificationOptions = [
		{ value: 'unrestricted', label: 'Unrestricted' },
		{ value: 'restricted', label: 'Restricted' },
		{ value: 'confidential', label: 'Confidential' },
		{ value: 'secret', label: 'Secret' },
		{ value: 'top-secret', label: 'Top Secret' }
	];

	const clearanceOptions = [
		{ value: '1', label: 'Level 1' },
		{ value: '2', label: 'Level 2' },
		{ value: '3', label: 'Level 3' },
		{ value: '4', label: 'Level 4' },
		{ value: '5', label: 'Level 5' }
	];

	const addendumTypeOptions = [
		{ value: 'general', label: 'General' },
		{ value: 'incident-report', label: 'Incident Report' },
		{ value: 'experiment-log', label: 'Experiment Log' },
		{ value: 'recovery-log', label: 'Recovery Log' },
		{ value: 'update', label: 'Update' },
		{ value: 'note', label: 'Note' }
	];

	function updateField<K extends keyof SCPDocument>(field: K, value: SCPDocument[K]) {
		documentStore.update(d => {
			if (d && d.type === 'scp') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof SCPDocument['metadata']>(field: K, value: SCPDocument['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'scp') {
				return {
					...d,
					metadata: { ...d.metadata, [field]: value }
				};
			}
			return d;
		});
	}

	function addAddendum() {
		documentStore.update(d => {
			if (d && d.type === 'scp') {
				const newAddendum: Addendum = {
					id: uuid(),
					type: 'general',
					title: `Addendum ${d.itemNumber}-${d.addenda.length + 1}`,
					date: new Date().toISOString().split('T')[0],
					content: ''
				};
				return {
					...d,
					addenda: [...d.addenda, newAddendum]
				};
			}
			return d;
		});
	}

	function removeAddendum(id: string) {
		documentStore.update(d => {
			if (d && d.type === 'scp') {
				return {
					...d,
					addenda: d.addenda.filter(a => a.id !== id)
				};
			}
			return d;
		});
	}

	function updateAddendum(id: string, field: keyof Addendum, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'scp') {
				return {
					...d,
					addenda: d.addenda.map(a =>
						a.id === id ? { ...a, [field]: value } : a
					)
				};
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Header Section -->
		<div class="terminal-window">
			<div class="terminal-header">DOCUMENT CLASSIFICATION</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<Select
					label="Classification"
					value={doc.metadata.classification || 'secret'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
				<Select
					label="Clearance Level"
					value={doc.metadata.clearanceLevel || '3'}
					options={clearanceOptions}
					onchange={(v) => updateMetadata('clearanceLevel', v as any)}
				/>
				<Select
					label="Object Class"
					value={doc.objectClass}
					options={objectClassOptions}
					required
					onchange={(v) => updateField('objectClass', v as any)}
				/>
			</div>
		</div>

		<!-- Item Number -->
		<div class="terminal-window">
			<div class="terminal-header">ITEM DESIGNATION</div>
			<div class="p-4">
				<Input
					label="Item Number"
					value={doc.itemNumber}
					placeholder="SCP-XXXX"
					required
					hint="e.g., SCP-173, SCP-682, SCP-999"
					onchange={(v) => updateField('itemNumber', v)}
				/>
			</div>
		</div>

		<!-- Containment Procedures -->
		<div class="terminal-window">
			<div class="terminal-header">SPECIAL CONTAINMENT PROCEDURES</div>
			<div class="p-4">
				<Textarea
					value={doc.containmentProcedures}
					placeholder="Describe the containment procedures..."
					rows={8}
					required
					hint="Describe how the anomaly is contained"
					onchange={(v) => updateField('containmentProcedures', v)}
				/>
			</div>
		</div>

		<!-- Description -->
		<div class="terminal-window">
			<div class="terminal-header">DESCRIPTION</div>
			<div class="p-4">
				<Textarea
					value={doc.description}
					placeholder="Describe the anomaly..."
					rows={12}
					required
					hint="Describe the anomaly's appearance and properties"
					onchange={(v) => updateField('description', v)}
				/>
			</div>
		</div>

		<!-- Addenda Section -->
		<div class="terminal-window">
			<div class="terminal-header flex items-center justify-between">
				<span>ADDENDA</span>
				<Button variant="ghost" size="sm" onclick={addAddendum}>
					+ Add Addendum
				</Button>
			</div>
			<div class="p-4 space-y-4">
				{#if doc.addenda.length === 0}
					<p class="text-[var(--color-text-muted)] text-center py-4">
						No addenda added. Click "Add Addendum" to include additional information.
					</p>
				{:else}
					{#each doc.addenda as addendum, i (addendum.id)}
						<div class="border border-[var(--color-border)] rounded p-4 space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm font-bold text-[var(--color-accent)]">
									Addendum #{i + 1}
								</span>
								<Button variant="danger" size="sm" onclick={() => removeAddendum(addendum.id)}>
									Remove
								</Button>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
								<Select
									label="Type"
									value={addendum.type}
									options={addendumTypeOptions}
									onchange={(v) => updateAddendum(addendum.id, 'type', v)}
								/>
								<Input
									label="Title"
									value={addendum.title}
									onchange={(v) => updateAddendum(addendum.id, 'title', v)}
								/>
								<Input
									label="Date"
									type="date"
									value={addendum.date || ''}
									onchange={(v) => updateAddendum(addendum.id, 'date', v)}
								/>
							</div>
							<Textarea
								label="Content"
								value={addendum.content}
								rows={6}
								placeholder="Addendum content..."
								onchange={(v) => updateAddendum(addendum.id, 'content', v)}
							/>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Warning Box Options -->
		<div class="terminal-window">
			<div class="terminal-header">DISPLAY OPTIONS</div>
			<div class="p-4 space-y-4">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showWarningBox}
						onchange={(e) => updateField('showWarningBox', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show warning box at top of document</span>
				</label>
				{#if doc.showWarningBox}
					<Input
						label="Warning Message"
						value={doc.warningMessage || ''}
						placeholder="WARNING: This document contains..."
						onchange={(v) => updateField('warningMessage', v)}
					/>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
