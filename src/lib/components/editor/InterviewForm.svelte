<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		INTERVIEWER_DESIGNATIONS,
		INTERVIEWEE_DESIGNATIONS,
		type InterviewLog,
		type InterviewEntry
	} from '$lib/schemas/interview';
	import { v4 as uuid } from 'uuid';

	// Use $state and sync from store via $effect
	let doc = $state<InterviewLog | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'interview') {
				doc = d as InterviewLog;
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

	const interviewerDesignationOptions = [
		{ value: '', label: 'Select...' },
		...INTERVIEWER_DESIGNATIONS.map(d => ({ value: d, label: d }))
	];

	const intervieweeDesignationOptions = [
		{ value: '', label: 'Select...' },
		...INTERVIEWEE_DESIGNATIONS.map(d => ({ value: d, label: d }))
	];

	function updateField<K extends keyof InterviewLog>(field: K, value: InterviewLog[K]) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof InterviewLog['metadata']>(field: K, value: InterviewLog['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}

	function updateInterviewer<K extends keyof InterviewLog['interviewer']>(field: K, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return { ...d, interviewer: { ...d.interviewer, [field]: value } };
			}
			return d;
		});
	}

	function updateInterviewee<K extends keyof InterviewLog['interviewee']>(field: K, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return { ...d, interviewee: { ...d.interviewee, [field]: value } };
			}
			return d;
		});
	}

	function addEntry(isAction: boolean = false) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				const lastEntry = d.entries[d.entries.length - 1];
				const newEntry: InterviewEntry = {
					id: uuid(),
					speaker: isAction ? '' : (lastEntry?.speaker === d.interviewer.name ? d.interviewee.name : d.interviewer.name),
					designation: '',
					content: '',
					isAction
				};
				return { ...d, entries: [...d.entries, newEntry] };
			}
			return d;
		});
	}

	function removeEntry(id: string) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return { ...d, entries: d.entries.filter(e => e.id !== id) };
			}
			return d;
		});
	}

	function updateEntry(id: string, field: keyof InterviewEntry, value: string | boolean) {
		documentStore.update(d => {
			if (d && d.type === 'interview') {
				return {
					...d,
					entries: d.entries.map(e => e.id === id ? { ...e, [field]: value } : e)
				};
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
			<div class="p-4">
				<Select
					label="Classification"
					value={doc.metadata.classification || 'confidential'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
			</div>
		</div>

		<!-- Log Header -->
		<div class="terminal-window">
			<div class="terminal-header">LOG INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input
						label="Log Number"
						value={doc.logNumber}
						placeholder="Interview-XXXX-X"
						required
						onchange={(v) => updateField('logNumber', v)}
					/>
					<Input
						label="Date"
						type="date"
						value={doc.date}
						required
						onchange={(v) => updateField('date', v)}
					/>
					<Input
						label="Time"
						type="time"
						value={doc.time || ''}
						onchange={(v) => updateField('time', v || '')}
					/>
				</div>
				<Input
					label="Location"
					value={doc.location || ''}
					placeholder="Site-XX, Interview Room X"
					onchange={(v) => updateField('location', v || '')}
				/>
			</div>
		</div>

		<!-- Participants -->
		<div class="terminal-window">
			<div class="terminal-header">PARTICIPANTS</div>
			<div class="p-4 space-y-4">
				<div class="border border-[var(--color-border)] rounded p-3">
					<span class="text-xs text-[var(--color-text-muted)] uppercase mb-2 block">Interviewer</span>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Input
							label="Name"
							value={doc.interviewer.name}
							placeholder="Name..."
							required
							onchange={(v) => updateInterviewer('name', v)}
						/>
						<Select
							label="Designation"
							value={doc.interviewer.designation || ''}
							options={interviewerDesignationOptions}
							onchange={(v) => updateInterviewer('designation', v)}
						/>
					</div>
				</div>

				<div class="border border-[var(--color-border)] rounded p-3">
					<span class="text-xs text-[var(--color-text-muted)] uppercase mb-2 block">Interviewee</span>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Input
							label="Name"
							value={doc.interviewee.name}
							placeholder="Name or designation..."
							required
							onchange={(v) => updateInterviewee('name', v)}
						/>
						<Select
							label="Designation"
							value={doc.interviewee.designation || ''}
							options={intervieweeDesignationOptions}
							onchange={(v) => updateInterviewee('designation', v)}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Foreword -->
		<div class="terminal-window">
			<div class="terminal-header">FOREWORD (Optional)</div>
			<div class="p-4">
				<Textarea
					value={doc.foreword || ''}
					placeholder="Context or notes before the interview begins..."
					rows={3}
					onchange={(v) => updateField('foreword', v || '')}
				/>
			</div>
		</div>

		<!-- Transcript -->
		<div class="terminal-window">
			<div class="terminal-header flex items-center justify-between">
				<span>TRANSCRIPT</span>
				<div class="flex gap-2">
					<Button variant="ghost" size="sm" onclick={() => addEntry(false)}>+ Add Line</Button>
					<Button variant="ghost" size="sm" onclick={() => addEntry(true)}>+ Add Action</Button>
				</div>
			</div>
			<div class="p-4 space-y-3">
				{#if doc.entries.length === 0}
					<p class="text-[var(--color-text-muted)] text-center py-4">
						No transcript entries. Click "Add Line" to begin the interview.
					</p>
				{:else}
					{#each doc.entries as entry, i (entry.id)}
						<div class="border border-[var(--color-border)] rounded p-3 {entry.isAction ? 'bg-[var(--color-secondary)]/50' : ''}">
							<div class="flex items-start gap-3">
								<span class="text-xs text-[var(--color-text-muted)] mt-2 w-6">{i + 1}.</span>
								<div class="flex-1 space-y-2">
									{#if entry.isAction}
										<span class="text-xs text-[var(--color-accent)] uppercase">Stage Direction</span>
										<Textarea
											value={entry.content}
											placeholder="[Pause], [Subject becomes agitated], etc."
											rows={2}
											onchange={(v) => updateEntry(entry.id, 'content', v)}
										/>
									{:else}
										<div class="grid grid-cols-2 gap-2">
											<Input
												label="Speaker"
												value={entry.speaker}
												placeholder="Speaker name..."
												onchange={(v) => updateEntry(entry.id, 'speaker', v)}
											/>
											<div class="flex gap-2">
												<button
													type="button"
													class="mt-6 px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-secondary)]"
													onclick={() => updateEntry(entry.id, 'speaker', doc?.interviewer.name || '')}
												>
													Interviewer
												</button>
												<button
													type="button"
													class="mt-6 px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-secondary)]"
													onclick={() => updateEntry(entry.id, 'speaker', doc?.interviewee.name || '')}
												>
													Interviewee
												</button>
											</div>
										</div>
										<Textarea
											value={entry.content}
											placeholder="Dialogue..."
											rows={2}
											onchange={(v) => updateEntry(entry.id, 'content', v)}
										/>
									{/if}
								</div>
								<Button variant="danger" size="sm" onclick={() => removeEntry(entry.id)}>
									X
								</Button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Afterword -->
		<div class="terminal-window">
			<div class="terminal-header">CLOSING NOTES (Optional)</div>
			<div class="p-4">
				<Textarea
					value={doc.afterword || ''}
					placeholder="Notes after the interview concludes..."
					rows={3}
					onchange={(v) => updateField('afterword', v || '')}
				/>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
