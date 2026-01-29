<script lang="ts">
	interface UploadResult {
		jobId: string;
		filename: string;
		duration: number | null;
		resolution: { width: number; height: number } | null;
		fileSize: number;
	}

	interface Props {
		onUploadComplete: (result: UploadResult) => void;
		disabled?: boolean;
	}

	let { onUploadComplete, disabled = false }: Props = $props();

	let isDragging = $state(false);
	let uploading = $state(false);
	let uploadProgress = $state(0);
	let error = $state<string | null>(null);

	const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks

	async function handleFile(file: File) {
		const ext = file.name.split('.').pop()?.toLowerCase();
		const allowed = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
		if (!ext || !allowed.includes(ext)) {
			error = `Unsupported format. Allowed: ${allowed.join(', ')}`;
			return;
		}

		if (file.size > 1024 * 1024 * 1024) {
			error = 'File too large. Maximum size: 1GB';
			return;
		}

		error = null;
		uploading = true;
		uploadProgress = 0;

		try {
			// Step 1: Initialize upload - create job on server
			const initRes = await fetch('/api/video/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename: file.name, fileSize: file.size })
			});

			if (!initRes.ok) {
				const body = await initRes.json().catch(() => null);
				throw new Error(body?.message || `Init failed (${initRes.status})`);
			}

			const { jobId } = await initRes.json();

			// Step 2: Upload file in chunks
			const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

			for (let i = 0; i < totalChunks; i++) {
				const start = i * CHUNK_SIZE;
				const end = Math.min(start + CHUNK_SIZE, file.size);
				const chunk = file.slice(start, end);

				// Use XHR for per-chunk progress tracking
				const chunkResult = await uploadChunk(chunk, jobId, i, totalChunks);

				// Update overall progress
				uploadProgress = Math.round(((i + 1) / totalChunks) * 100);

				// Final chunk returns the full upload result
				if (chunkResult.complete) {
					onUploadComplete({
						jobId: chunkResult.jobId,
						filename: chunkResult.filename,
						duration: chunkResult.duration,
						resolution: chunkResult.resolution,
						fileSize: chunkResult.fileSize
					});
				}
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploading = false;
			uploadProgress = 0;
		}
	}

	function uploadChunk(
		chunk: Blob,
		jobId: string,
		chunkIndex: number,
		totalChunks: number
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.addEventListener('load', () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					try {
						const body = JSON.parse(xhr.responseText);
						reject(new Error(body.message || `Chunk upload failed (${xhr.status})`));
					} catch {
						reject(new Error(`Chunk upload failed (${xhr.status})`));
					}
				}
			});

			xhr.addEventListener('error', () => reject(new Error('Network error during chunk upload')));
			xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

			xhr.open('POST', '/api/video/upload/chunk');
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			xhr.setRequestHeader('X-Job-Id', jobId);
			xhr.setRequestHeader('X-Chunk-Index', String(chunkIndex));
			xhr.setRequestHeader('X-Total-Chunks', String(totalChunks));
			xhr.send(chunk);
		});
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
		input.value = '';
	}
</script>

<div
	class="upload-zone border-2 border-dashed rounded-lg p-12 text-center transition-all
		{isDragging
		? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
		: 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'}
		{disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	role="button"
	tabindex="0"
>
	{#if uploading}
		<div class="space-y-4">
			<div class="text-[var(--color-accent)] font-mono text-lg">
				UPLOADING... {uploadProgress}%
			</div>
			<div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
				<div
					class="bg-[var(--color-accent)] h-full transition-all duration-300 rounded-full"
					style="width: {uploadProgress}%"
				></div>
			</div>
		</div>
	{:else}
		<label class="cursor-pointer block space-y-3">
			<input
				type="file"
				accept=".mp4,.webm,.avi,.mov,.mkv"
				class="hidden"
				onchange={handleInputChange}
				{disabled}
			/>
			<div class="text-5xl text-[var(--color-text-muted)]">&#127909;</div>
			<div class="text-lg font-bold text-[var(--color-text)]">
				Drop a video clip here or click to browse
			</div>
			<div class="text-sm text-[var(--color-text-muted)]">
				Supports MP4, WebM, AVI, MOV, MKV (max 1GB)
			</div>
		</label>
	{/if}

	{#if error}
		<div class="mt-4 text-sm text-red-500 bg-red-500/10 p-3 rounded">
			{error}
		</div>
	{/if}
</div>
