<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { documentStore } from '$lib/stores/document';
	import {
		BADGE_CLEARANCE_INFO,
		BADGE_TYPE_INFO,
		BADGE_STYLE_INFO,
		type IDBadge,
		type BadgeClearance,
		type BadgeType,
		type BadgeStyle
	} from '$lib/schemas/id-badge';

	let doc = $state<IDBadge | null>(null);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'id-badge') {
				doc = d as IDBadge;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	const clearanceOptions = Object.entries(BADGE_CLEARANCE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const badgeTypeOptions = Object.entries(BADGE_TYPE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const badgeStyleOptions = Object.entries(BADGE_STYLE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	function updateField<K extends keyof IDBadge>(field: K, value: IDBadge[K]) {
		documentStore.update(d => {
			if (d && d.type === 'id-badge') {
				return { ...d, [field]: value };
			}
			return d;
		});
	}
</script>

{#if doc}
	<div class="space-y-6">
		<!-- Identity -->
		<div class="terminal-window">
			<div class="terminal-header">PERSONNEL IDENTITY</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Full Name"
						value={doc.fullName}
						placeholder="Dr. John Smith"
						onchange={(v: string) => updateField('fullName', v)}
						required
					/>
					<Input
						label="Staff ID"
						value={doc.staffId}
						placeholder="SC-12345"
						onchange={(v: string) => updateField('staffId', v)}
						required
					/>
				</div>
				<Input
					label="Title / Position"
					value={doc.title || ''}
					placeholder="Senior Researcher"
					onchange={(v: string) => updateField('title', v)}
				/>
			</div>
		</div>

		<!-- Assignment -->
		<div class="terminal-window">
			<div class="terminal-header">ASSIGNMENT</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Clearance Level"
						value={doc.clearanceLevel}
						options={clearanceOptions}
						onchange={(v: string) => updateField('clearanceLevel', v as BadgeClearance)}
					/>
					<Select
						label="Badge Type"
						value={doc.badgeType}
						options={badgeTypeOptions}
						onchange={(v: string) => updateField('badgeType', v as BadgeType)}
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Department"
						value={doc.department || ''}
						placeholder="Research Division"
						onchange={(v: string) => updateField('department', v)}
					/>
					<Input
						label="Site Assignment"
						value={doc.site || ''}
						placeholder="Site-19"
						onchange={(v: string) => updateField('site', v)}
					/>
				</div>
			</div>
		</div>

		<!-- Validity -->
		<div class="terminal-window">
			<div class="terminal-header">VALIDITY</div>
			<div class="p-4 space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Issue Date"
						value={doc.issueDate || ''}
						type="date"
						onchange={(v: string) => updateField('issueDate', v)}
					/>
					<Input
						label="Expiry Date"
						value={doc.expiryDate || ''}
						type="date"
						onchange={(v: string) => updateField('expiryDate', v)}
					/>
				</div>
			</div>
		</div>

		<!-- Access Zones -->
		<div class="terminal-window">
			<div class="terminal-header">ACCESS PERMISSIONS</div>
			<div class="p-4 space-y-4">
				<Input
					label="Authorized Access Zones"
					value={doc.accessZones || ''}
					placeholder="Research Labs, Administrative, Light Containment"
					onchange={(v: string) => updateField('accessZones', v)}
					hint="Comma-separated list of authorized zones"
				/>
				<Input
					label="Restrictions"
					value={doc.restrictions || ''}
					placeholder="No Heavy Containment access"
					onchange={(v: string) => updateField('restrictions', v)}
				/>
			</div>
		</div>

		<!-- Photo URL -->
		<div class="terminal-window">
			<div class="terminal-header">PHOTO</div>
			<div class="p-4">
				<Input
					label="Photo URL"
					value={doc.photoUrl || ''}
					placeholder="https://example.com/photo.jpg"
					onchange={(v: string) => updateField('photoUrl', v)}
					hint="Enter a URL to an image for the badge photo"
				/>
			</div>
		</div>

		<!-- Display Options -->
		<div class="terminal-window">
			<div class="terminal-header">DISPLAY OPTIONS</div>
			<div class="p-4 space-y-4">
				<Select
					label="Badge Style"
					value={doc.badgeStyle}
					options={badgeStyleOptions}
					onchange={(v: string) => updateField('badgeStyle', v as BadgeStyle)}
				/>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={doc.showBarcode}
							onchange={(e) => updateField('showBarcode', (e.target as HTMLInputElement).checked)}
							class="w-4 h-4 accent-[var(--color-accent)]"
						/>
						<span class="text-sm">Show Barcode</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={doc.showPhoto}
							onchange={(e) => updateField('showPhoto', (e.target as HTMLInputElement).checked)}
							class="w-4 h-4 accent-[var(--color-accent)]"
						/>
						<span class="text-sm">Show Photo</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={doc.showAccessZones}
							onchange={(e) => updateField('showAccessZones', (e.target as HTMLInputElement).checked)}
							class="w-4 h-4 accent-[var(--color-accent)]"
						/>
						<span class="text-sm">Show Access Zones</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={doc.showExpiry}
							onchange={(e) => updateField('showExpiry', (e.target as HTMLInputElement).checked)}
							class="w-4 h-4 accent-[var(--color-accent)]"
						/>
						<span class="text-sm">Show Expiry</span>
					</label>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center text-[var(--color-text-muted)] py-8">
		Loading document...
	</div>
{/if}
