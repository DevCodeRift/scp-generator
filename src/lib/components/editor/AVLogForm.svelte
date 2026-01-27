<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		MEDIA_TYPE_INFO,
		RECORDING_QUALITY_INFO,
		type AVLog,
		type MediaType,
		type RecordingQuality,
		type TranscriptEntry
	} from '$lib/schemas/avlog';

	let doc = $state<AVLog | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'avlog') {
				doc = d as AVLog;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const mediaTypeOptions = Object.entries(MEDIA_TYPE_INFO).map(([value, info]) => ({
		value,
		label: `${info.icon} ${info.label}`
	}));

	const qualityOptions = Object.entries(RECORDING_QUALITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof AVLog>(field: K, value: AVLog[K]) {
		documentStore.update(d => {
			if (d && d.type === 'avlog') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function addTranscriptEntry() {
		documentStore.update(d => {
			if (d && d.type === 'avlog') {
				const newEntry: TranscriptEntry = {
					id: crypto.randomUUID(),
					timestamp: '',
					speaker: '',
					content: '',
					isRedacted: false
				};
				return { ...d, transcript: [...d.transcript, newEntry] };
			}
			return d;
		});
	}

	function updateTranscriptEntry(index: number, field: keyof TranscriptEntry, value: string | boolean) {
		documentStore.update(d => {
			if (d && d.type === 'avlog') {
				const newTranscript = [...d.transcript];
				newTranscript[index] = { ...newTranscript[index], [field]: value };
				return { ...d, transcript: newTranscript };
			}
			return d;
		});
	}

	function removeTranscriptEntry(index: number) {
		documentStore.update(d => {
			if (d && d.type === 'avlog') {
				return { ...d, transcript: d.transcript.filter((_, i) => i !== index) };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Recording Info -->
		<div class="terminal-window">
			<div class="terminal-header bg-gray-900">RECORDING INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Log Designation"
						value={doc.logDesignation}
						placeholder="AV-LOG-XXXX"
						required
						onchange={(v) => updateField('logDesignation', v)}
					/>
					<Select
						label="Media Type"
						value={doc.mediaType}
						options={mediaTypeOptions}
						onchange={(v) => updateField('mediaType', v as MediaType)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Recording Quality"
						value={doc.recordingQuality}
						options={qualityOptions}
						onchange={(v) => updateField('recordingQuality', v as RecordingQuality)}
					/>
					<Input
						label="Duration"
						value={doc.duration || ''}
						placeholder="00:45:32"
						onchange={(v) => updateField('duration', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- Source -->
		<div class="terminal-window">
			<div class="terminal-header">SOURCE INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Recording Date"
						type="date"
						value={doc.recordingDate || ''}
						onchange={(v) => updateField('recordingDate', v || undefined)}
					/>
					<Input
						label="Location"
						value={doc.location || ''}
						placeholder="Site-XX, Room YY"
						onchange={(v) => updateField('location', v || undefined)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Equipment Used"
						value={doc.equipmentUsed || ''}
						placeholder="Camera model, recording device..."
						onchange={(v) => updateField('equipmentUsed', v || undefined)}
					/>
					<Input
						label="Recovery Information"
						value={doc.recoveryInfo || ''}
						placeholder="How/where recording was found..."
						onchange={(v) => updateField('recoveryInfo', v || undefined)}
					/>
				</div>
			</div>
		</div>

		<!-- Related -->
		<div class="terminal-window">
			<div class="terminal-header">RELATED ITEMS</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Related SCP"
						value={doc.relatedSCP || ''}
						placeholder="SCP-XXXX"
						onchange={(v) => updateField('relatedSCP', v || undefined)}
					/>
					<Input
						label="Related Incident"
						value={doc.relatedIncident || ''}
						placeholder="INC-XXXX"
						onchange={(v) => updateField('relatedIncident', v || undefined)}
					/>
				</div>
				<Input
					label="Participants"
					value={doc.participants || ''}
					placeholder="Dr. Smith, D-1234, Unknown Entity..."
					onchange={(v) => updateField('participants', v || undefined)}
				/>
			</div>
		</div>

		<!-- Pre-transcript notes -->
		<div class="terminal-window">
			<div class="terminal-header">PRE-TRANSCRIPT NOTES</div>
			<div class="p-4">
				<Textarea
					value={doc.preTranscriptNotes || ''}
					placeholder="Context before transcription begins..."
					rows={3}
					onchange={(v) => updateField('preTranscriptNotes', v || undefined)}
				/>
			</div>
		</div>

		<!-- Transcript -->
		<div class="terminal-window">
			<div class="terminal-header flex items-center justify-between">
				<span>TRANSCRIPT</span>
				<button
					type="button"
					onclick={addTranscriptEntry}
					class="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded hover:opacity-80"
				>
					+ Add Line
				</button>
			</div>
			<div class="p-4 space-y-3">
				{#if doc.transcript.length === 0}
					<p class="text-sm text-[var(--color-text-muted)] text-center py-4">
						No transcript entries. Click "Add Line" to add dialogue.
					</p>
				{/if}
				{#each doc.transcript as entry, i}
					<div class="border border-[var(--color-border)] p-3 rounded space-y-2 {entry.isRedacted ? 'bg-gray-900' : ''}">
						<div class="flex items-center gap-2">
							<Input
								value={entry.timestamp}
								placeholder="00:00:00"
								class="w-24"
								onchange={(v) => updateTranscriptEntry(i, 'timestamp', v)}
							/>
							<Input
								value={entry.speaker}
								placeholder="Speaker"
								class="w-32"
								onchange={(v) => updateTranscriptEntry(i, 'speaker', v)}
							/>
							<label class="flex items-center gap-1 text-xs">
								<input
									type="checkbox"
									checked={entry.isRedacted}
									onchange={(e) => updateTranscriptEntry(i, 'isRedacted', (e.target as HTMLInputElement).checked)}
									class="w-3 h-3"
								/>
								[REDACTED]
							</label>
							<button
								type="button"
								onclick={() => removeTranscriptEntry(i)}
								class="ml-auto text-red-500 hover:text-red-400 text-sm"
							>
								×
							</button>
						</div>
						{#if !entry.isRedacted}
							<Textarea
								value={entry.content}
								placeholder="Dialogue or description..."
								rows={2}
								onchange={(v) => updateTranscriptEntry(i, 'content', v)}
							/>
							<Input
								value={entry.notes || ''}
								placeholder="[static], [inaudible], [pause]..."
								class="text-xs"
								onchange={(v) => updateTranscriptEntry(i, 'notes', v)}
							/>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Post-transcript notes -->
		<div class="terminal-window">
			<div class="terminal-header">POST-TRANSCRIPT NOTES</div>
			<div class="p-4">
				<Textarea
					value={doc.postTranscriptNotes || ''}
					placeholder="Notes after transcription ends..."
					rows={3}
					onchange={(v) => updateField('postTranscriptNotes', v || undefined)}
				/>
			</div>
		</div>

		<!-- Analysis -->
		<div class="terminal-window">
			<div class="terminal-header">ANALYSIS</div>
			<div class="p-4 space-y-4">
				<Textarea
					label="Analysis Notes"
					value={doc.analysisNotes || ''}
					placeholder="Researcher analysis of content..."
					rows={4}
					onchange={(v) => updateField('analysisNotes', v || undefined)}
				/>
				<Textarea
					label="Anomalies Detected"
					value={doc.anomaliesDetected || ''}
					placeholder="Audio/visual anomalies noted..."
					rows={3}
					onchange={(v) => updateField('anomaliesDetected', v || undefined)}
				/>
			</div>
		</div>

		<!-- Personnel -->
		<div class="terminal-window">
			<div class="terminal-header">TRANSCRIPTION PERSONNEL</div>
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					label="Transcribed By"
					value={doc.transcribedBy || ''}
					placeholder="Researcher name..."
					onchange={(v) => updateField('transcribedBy', v || undefined)}
				/>
				<Input
					label="Verified By"
					value={doc.verifiedBy || ''}
					placeholder="Supervisor name..."
					onchange={(v) => updateField('verifiedBy', v || undefined)}
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
						checked={doc.showStaticEffects}
						onchange={(e) => updateField('showStaticEffects', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show static/interference effects</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showTimestamps}
						onchange={(e) => updateField('showTimestamps', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show timestamps in transcript</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.showScanlines}
						onchange={(e) => updateField('showScanlines', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Show CRT scanlines overlay</span>
				</label>
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={doc.terminalStyle}
						onchange={(e) => updateField('terminalStyle', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
					<span class="text-sm">Use terminal/monitor styling</span>
				</label>
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
