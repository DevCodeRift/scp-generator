import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { createJob, updateJob, getTempDir } from '$lib/server/job-manager';
import { probeVideo, extractVideoMeta } from '$lib/server/video-processor';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('video');

		if (!file || !(file instanceof File)) {
			throw error(400, 'No video file provided');
		}

		// Validate file type
		const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
		if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
			throw error(400, `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
		}

		// Ensure temp directory exists
		const tempDir = getTempDir();
		if (!existsSync(tempDir)) {
			await mkdir(tempDir, { recursive: true });
		}

		// Create job and save file
		const job = createJob(file.name);
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(job.inputPath, buffer);

		// Update job status
		updateJob(job.id, { status: 'uploaded', fileSize: file.size });

		// Probe video for metadata
		try {
			const probeData = await probeVideo(job.inputPath);
			const meta = extractVideoMeta(probeData);
			updateJob(job.id, {
				duration: meta.duration,
				resolution: meta.resolution,
				fileSize: meta.fileSize || file.size
			});

			return json({
				jobId: job.id,
				filename: file.name,
				duration: meta.duration,
				resolution: meta.resolution,
				fileSize: meta.fileSize || file.size
			});
		} catch {
			// If probe fails, still return job (user can try processing)
			return json({
				jobId: job.id,
				filename: file.name,
				fileSize: file.size,
				duration: null,
				resolution: null
			});
		}
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		console.error('[upload] Error:', e);
		throw error(500, 'Upload failed');
	}
};
