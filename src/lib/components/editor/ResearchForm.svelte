<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { documentStore } from '$lib/stores/document';
	import { RESEARCH_DEPARTMENTS, type ResearchReport } from '$lib/schemas/research';
	import { v4 as uuid } from 'uuid';

	// Use $state and sync from store via $effect
	let doc = $state<ResearchReport | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'research') {
				doc = d as ResearchReport;
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

	const clearanceOptions = [
		{ value: '1', label: 'Level 1' },
		{ value: '2', label: 'Level 2' },
		{ value: '3', label: 'Level 3' },
		{ value: '4', label: 'Level 4' },
		{ value: '5', label: 'Level 5' }
	];

	const departmentOptions = [
		{ value: '', label: 'Select Department...' },
		...RESEARCH_DEPARTMENTS.map(d => ({ value: d, label: d }))
	];

	function updateField<K extends keyof ResearchReport>(field: K, value: ResearchReport[K]) {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}

	function updateMetadata<K extends keyof ResearchReport['metadata']>(field: K, value: ResearchReport['metadata'][K]) {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return { ...d, metadata: { ...d.metadata, [field]: value } };
			}
			return d;
		});
	}

	function addTeamMember() {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return { ...d, team: [...d.team, ''] };
			}
			return d;
		});
	}

	function removeTeamMember(index: number) {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return { ...d, team: d.team.filter((_, i) => i !== index) };
			}
			return d;
		});
	}

	function updateTeamMember(index: number, value: string) {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				const newTeam = [...d.team];
				newTeam[index] = value;
				return { ...d, team: newTeam };
			}
			return d;
		});
	}

	function addAppendix() {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return {
					...d,
					appendices: [...d.appendices, { id: uuid(), title: `Appendix ${String.fromCharCode(65 + d.appendices.length)}`, content: '' }]
				};
			}
			return d;
		});
	}

	function removeAppendix(id: string) {
		documentStore.update(d => {
			if (d && d.type === 'research') {
				return { ...d, appendices: d.appendices.filter(a => a.id !== id) };
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
					value={doc.metadata.classification || 'confidential'}
					options={classificationOptions}
					onchange={(v) => updateMetadata('classification', v as any)}
				/>
				<Select
					label="Clearance Level"
					value={doc.metadata.clearanceLevel || '2'}
					options={clearanceOptions}
					onchange={(v) => updateMetadata('clearanceLevel', v as any)}
				/>
			</div>
		</div>

		<!-- Report Header -->
		<div class="terminal-window">
			<div class="terminal-header">REPORT INFORMATION</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Report Number"
						value={doc.reportNumber}
						placeholder="RR-XXXX-XXX"
						required
						onchange={(v) => updateField('reportNumber', v)}
					/>
					<Input
						label="Date"
						type="date"
						value={doc.date}
						required
						onchange={(v) => updateField('date', v)}
					/>
				</div>
				<Input
					label="Title"
					value={doc.title}
					placeholder="Research report title..."
					required
					onchange={(v) => updateField('title', v)}
				/>
				<Select
					label="Department"
					value={doc.department || ''}
					options={departmentOptions}
					onchange={(v) => updateField('department', v)}
				/>
			</div>
		</div>

		<!-- Personnel -->
		<div class="terminal-window">
			<div class="terminal-header">PERSONNEL</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Lead Researcher"
						value={doc.leadResearcher}
						placeholder="Dr. [Name]"
						required
						onchange={(v) => updateField('leadResearcher', v)}
					/>
					<Input
						label="Supervisor"
						value={doc.supervisor || ''}
						placeholder="Site Director [Name]"
						onchange={(v) => updateField('supervisor', v || '')}
					/>
				</div>

				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-bold text-[var(--color-text-muted)] uppercase">Research Team</span>
						<Button variant="ghost" size="sm" onclick={addTeamMember}>+ Add</Button>
					</div>
					{#each doc.team as member, i}
						<div class="flex gap-2 mb-2">
							<Input
								value={member}
								placeholder="Team member name..."
								class="flex-1"
								onchange={(v) => updateTeamMember(i, v)}
							/>
							<Button variant="danger" size="sm" onclick={() => removeTeamMember(i)}>Remove</Button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Content Sections -->
		<div class="terminal-window">
			<div class="terminal-header">ABSTRACT</div>
			<div class="p-4">
				<Textarea
					value={doc.abstract}
					placeholder="Brief summary of the research..."
					rows={4}
					required
					onchange={(v) => updateField('abstract', v)}
				/>
			</div>
		</div>

		<div class="terminal-window">
			<div class="terminal-header">METHODOLOGY</div>
			<div class="p-4">
				<Textarea
					value={doc.methodology || ''}
					placeholder="Research methodology and procedures..."
					rows={6}
					onchange={(v) => updateField('methodology', v || '')}
				/>
			</div>
		</div>

		<div class="terminal-window">
			<div class="terminal-header">FINDINGS</div>
			<div class="p-4">
				<Textarea
					value={doc.findings}
					placeholder="Research findings and observations..."
					rows={8}
					required
					onchange={(v) => updateField('findings', v)}
				/>
			</div>
		</div>

		<div class="terminal-window">
			<div class="terminal-header">CONCLUSIONS</div>
			<div class="p-4">
				<Textarea
					value={doc.conclusions}
					placeholder="Conclusions drawn from the research..."
					rows={6}
					required
					onchange={(v) => updateField('conclusions', v)}
				/>
			</div>
		</div>

		<div class="terminal-window">
			<div class="terminal-header">RECOMMENDATIONS</div>
			<div class="p-4">
				<Textarea
					value={doc.recommendations || ''}
					placeholder="Recommendations for future research or containment..."
					rows={4}
					onchange={(v) => updateField('recommendations', v || '')}
				/>
			</div>
		</div>

		<!-- Appendices -->
		<div class="terminal-window">
			<div class="terminal-header flex items-center justify-between">
				<span>APPENDICES</span>
				<Button variant="ghost" size="sm" onclick={addAppendix}>+ Add Appendix</Button>
			</div>
			<div class="p-4 space-y-4">
				{#if doc.appendices.length === 0}
					<p class="text-[var(--color-text-muted)] text-center py-4">No appendices added.</p>
				{:else}
					{#each doc.appendices as appendix, i (appendix.id)}
						<div class="border border-[var(--color-border)] rounded p-4">
							<div class="flex items-center justify-between mb-3">
								<Input
									label="Title"
									value={appendix.title}
									onchange={(v) => {
										documentStore.update(d => {
											if (d && d.type === 'research') {
												return {
													...d,
													appendices: d.appendices.map(a =>
														a.id === appendix.id ? { ...a, title: v } : a
													)
												};
											}
											return d;
										});
									}}
								/>
								<Button variant="danger" size="sm" onclick={() => removeAppendix(appendix.id)}>Remove</Button>
							</div>
							<Textarea
								value={appendix.content}
								rows={4}
								placeholder="Appendix content..."
								onchange={(v) => {
									documentStore.update(d => {
										if (d && d.type === 'research') {
											return {
												...d,
												appendices: d.appendices.map(a =>
													a.id === appendix.id ? { ...a, content: v } : a
												)
											};
										}
										return d;
									});
								}}
							/>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="terminal-window p-8 text-center">
		<p class="text-[var(--color-text-muted)]">No document loaded</p>
	</div>
{/if}
