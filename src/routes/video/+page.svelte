<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import VideoUpload from '$lib/components/video/VideoUpload.svelte';
	import EffectsConfigurator from '$lib/components/video/EffectsConfigurator.svelte';
	import ProcessingStatus from '$lib/components/video/ProcessingStatus.svelte';
	import { defaultVideoEffects, type VideoEffects } from '$lib/schemas/video-effects';

	type Step = 'upload' | 'configure' | 'processing';

	let step = $state<Step>('upload');
	let jobId = $state<string | null>(null);
	let uploadInfo = $state<{
		filename: string;
		duration: number | null;
		resolution: { width: number; height: number } | null;
		fileSize: number;
	} | null>(null);
	let effects = $state<VideoEffects>({ ...defaultVideoEffects });
	let processingStatus = $state<'processing' | 'complete' | 'error'>('processing');
	let processingProgress = $state(0);
	let processingError = $state<string | null>(null);
	let pollTimer = $state<ReturnType<typeof setInterval> | null>(null);

	function handleUploadComplete(result: {
		jobId: string;
		filename: string;
		duration: number | null;
		resolution: { width: number; height: number } | null;
		fileSize: number;
	}) {
		jobId = result.jobId;
		uploadInfo = {
			filename: result.filename,
			duration: result.duration,
			resolution: result.resolution,
			fileSize: result.fileSize
		};
		step = 'configure';
	}

	async function startProcessing() {
		if (!jobId) return;

		step = 'processing';
		processingStatus = 'processing';
		processingProgress = 0;
		processingError = null;

		try {
			const res = await fetch('/api/video/process', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ jobId, effects })
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({ message: 'Failed to start processing' }));
				throw new Error(body.message || `Server error (${res.status})`);
			}

			// Start polling for status
			startPolling();
		} catch (e) {
			processingStatus = 'error';
			processingError = e instanceof Error ? e.message : 'Failed to start processing';
		}
	}

	function startPolling() {
		stopPolling();
		pollTimer = setInterval(async () => {
			if (!jobId) return;

			try {
				const res = await fetch(`/api/video/status/${jobId}`);
				if (!res.ok) return;

				const data = await res.json();
				processingProgress = data.progress || 0;

				if (data.status === 'complete') {
					processingStatus = 'complete';
					stopPolling();
				} else if (data.status === 'error') {
					processingStatus = 'error';
					processingError = data.error || 'Unknown processing error';
					stopPolling();
				}
			} catch {
				// Ignore polling errors, will retry next interval
			}
		}, 1000);
	}

	function stopPolling() {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	}

	function handleDownload() {
		if (!jobId) return;
		window.location.href = `/api/video/download/${jobId}`;
	}

	function handleRetry() {
		step = 'configure';
		processingStatus = 'processing';
		processingProgress = 0;
		processingError = null;
	}

	function handleReset() {
		stopPolling();
		step = 'upload';
		jobId = null;
		uploadInfo = null;
		effects = { ...defaultVideoEffects };
		processingStatus = 'processing';
		processingProgress = 0;
		processingError = null;
	}

	function formatDuration(seconds: number | null): string {
		if (!seconds) return 'Unknown';
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function formatSize(bytes: number): string {
		if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
		if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
</script>

<svelte:head>
	<title>Body Cam Processor | SCP Document Generator</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--color-background)]">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
		<div class="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-terminal crt-glow text-[var(--color-accent)] hover:opacity-80">
					SCP://DOCGEN
				</a>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">Body Cam Processor</span>
			</div>
			<FactionSelector />
		</div>
	</header>

	<main class="flex-1">
		<div class="max-w-[1400px] mx-auto px-4 py-6">
			<!-- Step indicator -->
			<div class="flex items-center gap-2 mb-6 text-sm font-mono">
				<span class="px-3 py-1 rounded {step === 'upload' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}">
					1. UPLOAD
				</span>
				<span class="text-[var(--color-text-muted)]">&gt;</span>
				<span class="px-3 py-1 rounded {step === 'configure' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}">
					2. CONFIGURE
				</span>
				<span class="text-[var(--color-text-muted)]">&gt;</span>
				<span class="px-3 py-1 rounded {step === 'processing' ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}">
					3. PROCESS
				</span>
			</div>

			{#if step === 'upload'}
				<!-- Step 1: Upload -->
				<div class="max-w-2xl mx-auto space-y-6">
					<div class="text-center space-y-2">
						<h1 class="text-2xl font-bold crt-glow">
							<span class="text-[var(--color-accent)]">&gt;</span> SCP Body Camera Effect Processor
						</h1>
						<p class="text-[var(--color-text-muted)]">
							Upload a video clip from Gmod to apply authentic SCP surveillance camera effects.
						</p>
					</div>
					<VideoUpload onUploadComplete={handleUploadComplete} />
				</div>

			{:else if step === 'configure'}
				<!-- Step 2: Configure Effects -->
				<div class="grid lg:grid-cols-[1fr_350px] gap-6">
					<!-- Left: Video info + process button -->
					<div class="space-y-6">
						<!-- Upload info -->
						{#if uploadInfo}
							<div class="terminal-window">
								<div class="terminal-header bg-gray-900">UPLOADED VIDEO</div>
								<div class="p-4">
									<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<div class="text-xs text-[var(--color-text-muted)]">FILENAME</div>
											<div class="font-mono truncate" title={uploadInfo.filename}>{uploadInfo.filename}</div>
										</div>
										<div>
											<div class="text-xs text-[var(--color-text-muted)]">DURATION</div>
											<div class="font-mono">{formatDuration(uploadInfo.duration)}</div>
										</div>
										<div>
											<div class="text-xs text-[var(--color-text-muted)]">RESOLUTION</div>
											<div class="font-mono">
												{uploadInfo.resolution
													? `${uploadInfo.resolution.width}x${uploadInfo.resolution.height}`
													: 'Unknown'}
											</div>
										</div>
										<div>
											<div class="text-xs text-[var(--color-text-muted)]">SIZE</div>
											<div class="font-mono">{formatSize(uploadInfo.fileSize)}</div>
										</div>
									</div>
								</div>
							</div>
						{/if}

						<!-- Effect Summary & Process -->
						<div class="terminal-window">
							<div class="terminal-header bg-gray-900">EFFECT SUMMARY</div>
							<div class="p-4 space-y-3">
								<div class="grid grid-cols-2 gap-2 text-sm">
									<div class="flex items-center gap-2">
										<span class={effects.scanlines ? 'text-green-400' : 'text-gray-600'}>{effects.scanlines ? 'ON' : 'OFF'}</span>
										<span>Scanlines</span>
									</div>
									<div class="flex items-center gap-2">
										<span class={effects.vignette ? 'text-green-400' : 'text-gray-600'}>{effects.vignette ? 'ON' : 'OFF'}</span>
										<span>Vignette</span>
									</div>
									<div class="flex items-center gap-2">
										<span class={effects.noise ? 'text-green-400' : 'text-gray-600'}>{effects.noise ? 'ON' : 'OFF'}</span>
										<span>Noise ({Math.round(effects.noiseIntensity * 100)}%)</span>
									</div>
									<div class="flex items-center gap-2">
										<span class={effects.cameraShake ? 'text-green-400' : 'text-gray-600'}>{effects.cameraShake ? 'ON' : 'OFF'}</span>
										<span>Camera Shake</span>
									</div>
									<div class="flex items-center gap-2">
										<span class={effects.timestamp ? 'text-green-400' : 'text-gray-600'}>{effects.timestamp ? 'ON' : 'OFF'}</span>
										<span>Timestamp</span>
									</div>
									<div class="flex items-center gap-2">
										<span class={effects.recIndicator ? 'text-green-400' : 'text-gray-600'}>{effects.recIndicator ? 'ON' : 'OFF'}</span>
										<span>REC Indicator</span>
									</div>
								</div>
								<div class="text-sm text-[var(--color-text-muted)]">
									Color: {effects.colorGrade} | Label: {effects.facilityId}
								</div>
								<div class="flex gap-3 pt-2">
									<button
										class="flex-1 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg"
										onclick={startProcessing}
									>
										Process Video
									</button>
									<button
										class="px-4 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-primary)] transition-colors"
										onclick={handleReset}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Effects Configurator -->
					<div>
						<EffectsConfigurator {effects} onchange={(e) => (effects = e)} />
					</div>
				</div>

			{:else if step === 'processing'}
				<!-- Step 3: Processing -->
				<div class="max-w-xl mx-auto">
					{#if jobId}
						<ProcessingStatus
							{jobId}
							status={processingStatus}
							progress={processingProgress}
							error={processingError}
							onDownload={handleDownload}
							onRetry={handleRetry}
							onReset={handleReset}
						/>
					{/if}
				</div>
			{/if}
		</div>
	</main>
</div>
