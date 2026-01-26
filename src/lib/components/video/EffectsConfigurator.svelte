<script lang="ts">
	import {
		type VideoEffects,
		defaultVideoEffects,
		VIDEO_EFFECT_PRESETS,
		COLOR_GRADE_INFO,
		OUTPUT_QUALITY_INFO,
		type ColorGrade,
		type OutputQuality
	} from '$lib/schemas/video-effects';

	interface Props {
		effects: VideoEffects;
		onchange: (effects: VideoEffects) => void;
		disabled?: boolean;
	}

	let { effects, onchange, disabled = false }: Props = $props();

	function update<K extends keyof VideoEffects>(key: K, value: VideoEffects[K]) {
		onchange({ ...effects, [key]: value });
	}

	function applyPreset(presetId: string) {
		const preset = VIDEO_EFFECT_PRESETS[presetId];
		if (preset) {
			onchange({ ...defaultVideoEffects, ...preset.effects });
		}
	}

	function resetToDefaults() {
		onchange({ ...defaultVideoEffects });
	}

	const colorGradeOptions = Object.entries(COLOR_GRADE_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));

	const qualityOptions = Object.entries(OUTPUT_QUALITY_INFO).map(([value, info]) => ({
		value,
		label: info.label
	}));
</script>

<div class="space-y-4" class:opacity-50={disabled} class:pointer-events-none={disabled}>
	<!-- Presets -->
	<div class="terminal-window">
		<div class="terminal-header bg-gray-900">PRESETS</div>
		<div class="p-3 flex flex-wrap gap-2">
			{#each Object.entries(VIDEO_EFFECT_PRESETS) as [id, preset]}
				<button
					class="px-3 py-1.5 text-xs font-bold rounded border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
					onclick={() => applyPreset(id)}
				>
					{preset.label}
				</button>
			{/each}
			<button
				class="px-3 py-1.5 text-xs font-bold rounded border border-gray-600 text-gray-400 hover:text-white transition-colors"
				onclick={resetToDefaults}
			>
				Reset Defaults
			</button>
		</div>
	</div>

	<!-- Visual Effects -->
	<div class="terminal-window">
		<div class="terminal-header bg-gray-900">VISUAL EFFECTS</div>
		<div class="p-4 space-y-4">
			<!-- Scanlines -->
			<label class="flex items-center justify-between cursor-pointer">
				<span class="text-sm">CRT Scanlines</span>
				<input
					type="checkbox"
					checked={effects.scanlines}
					onchange={(e) => update('scanlines', (e.target as HTMLInputElement).checked)}
					class="w-4 h-4 accent-[var(--color-accent)]"
				/>
			</label>

			<!-- Vignette -->
			<div class="space-y-1">
				<label class="flex items-center justify-between cursor-pointer">
					<span class="text-sm">Vignette (Dark Edges)</span>
					<input
						type="checkbox"
						checked={effects.vignette}
						onchange={(e) => update('vignette', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
				</label>
				{#if effects.vignette}
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={effects.vignetteIntensity}
						oninput={(e) => update('vignetteIntensity', parseFloat((e.target as HTMLInputElement).value))}
						class="w-full accent-[var(--color-accent)]"
					/>
					<div class="text-xs text-[var(--color-text-muted)] text-right">
						Intensity: {Math.round(effects.vignetteIntensity * 100)}%
					</div>
				{/if}
			</div>

			<!-- Noise -->
			<div class="space-y-1">
				<label class="flex items-center justify-between cursor-pointer">
					<span class="text-sm">Static / Noise</span>
					<input
						type="checkbox"
						checked={effects.noise}
						onchange={(e) => update('noise', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
				</label>
				{#if effects.noise}
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={effects.noiseIntensity}
						oninput={(e) => update('noiseIntensity', parseFloat((e.target as HTMLInputElement).value))}
						class="w-full accent-[var(--color-accent)]"
					/>
					<div class="text-xs text-[var(--color-text-muted)] text-right">
						Intensity: {Math.round(effects.noiseIntensity * 100)}%
					</div>
				{/if}
			</div>

			<!-- Camera Shake -->
			<div class="space-y-1">
				<label class="flex items-center justify-between cursor-pointer">
					<span class="text-sm">Camera Shake</span>
					<input
						type="checkbox"
						checked={effects.cameraShake}
						onchange={(e) => update('cameraShake', (e.target as HTMLInputElement).checked)}
						class="w-4 h-4 accent-[var(--color-accent)]"
					/>
				</label>
				{#if effects.cameraShake}
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={effects.shakeIntensity}
						oninput={(e) => update('shakeIntensity', parseFloat((e.target as HTMLInputElement).value))}
						class="w-full accent-[var(--color-accent)]"
					/>
					<div class="text-xs text-[var(--color-text-muted)] text-right">
						Intensity: {Math.round(effects.shakeIntensity * 100)}%
					</div>
				{/if}
			</div>

			<!-- Color Grade -->
			<div class="space-y-1">
				<label class="text-sm block">Color Grade</label>
				<select
					class="w-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded px-2 py-1.5 font-mono"
					value={effects.colorGrade}
					onchange={(e) => update('colorGrade', (e.target as HTMLSelectElement).value as ColorGrade)}
				>
					{#each colorGradeOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Overlay Text -->
	<div class="terminal-window">
		<div class="terminal-header bg-gray-900">OVERLAY TEXT</div>
		<div class="p-4 space-y-4">
			<!-- Facility ID -->
			<div class="space-y-1">
				<label class="text-sm block">Camera / Facility Label</label>
				<input
					type="text"
					class="w-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded px-2 py-1.5 font-mono"
					value={effects.facilityId}
					oninput={(e) => update('facilityId', (e.target as HTMLInputElement).value)}
					placeholder="CAM-07 // SITE-19"
				/>
			</div>

			<!-- Timestamp -->
			<label class="flex items-center justify-between cursor-pointer">
				<span class="text-sm">Running Timestamp</span>
				<input
					type="checkbox"
					checked={effects.timestamp}
					onchange={(e) => update('timestamp', (e.target as HTMLInputElement).checked)}
					class="w-4 h-4 accent-[var(--color-accent)]"
				/>
			</label>

			<!-- REC Indicator -->
			<label class="flex items-center justify-between cursor-pointer">
				<span class="text-sm">Blinking REC Indicator</span>
				<input
					type="checkbox"
					checked={effects.recIndicator}
					onchange={(e) => update('recIndicator', (e.target as HTMLInputElement).checked)}
					class="w-4 h-4 accent-[var(--color-accent)]"
				/>
			</label>

			<!-- SCP Watermark -->
			<label class="flex items-center justify-between cursor-pointer">
				<span class="text-sm">SCP Foundation Watermark</span>
				<input
					type="checkbox"
					checked={effects.scpWatermark}
					onchange={(e) => update('scpWatermark', (e.target as HTMLInputElement).checked)}
					class="w-4 h-4 accent-[var(--color-accent)]"
				/>
			</label>
		</div>
	</div>

	<!-- Output Quality -->
	<div class="terminal-window">
		<div class="terminal-header bg-gray-900">OUTPUT</div>
		<div class="p-4">
			<label class="text-sm block mb-1">Output Quality</label>
			<select
				class="w-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded px-2 py-1.5 font-mono"
				value={effects.outputQuality}
				onchange={(e) => update('outputQuality', (e.target as HTMLSelectElement).value as OutputQuality)}
			>
				{#each qualityOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
