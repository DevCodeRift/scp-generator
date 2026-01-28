import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mkdir, unlink, open } from 'fs/promises';
import { existsSync } from 'fs';
import { createJob, updateJob, getTempDir } from '$lib/server/job-manager';
import { probeVideo, extractVideoMeta } from '$lib/server/video-processor';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];

export const POST: RequestHandler = async ({ request }) => {
	const rawFilename = request.headers.get('x-filename') || 'upload.mp4';
	const filename = decodeURIComponent(rawFilename);
	const contentLength = parseInt(request.headers.get('content-length') || '0', 10);

	// Validate extension
	const ext = '.' + (filename.split('.').pop()?.toLowerCase() || '');
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		throw error(400, `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
	}

	// Early reject based on content-length header
	if (contentLength > MAX_FILE_SIZE) {
		throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	if (!request.body) {
		throw error(400, 'No file data provided');
	}

	// Ensure temp directory exists
	const tempDir = getTempDir();
	if (!existsSync(tempDir)) {
		await mkdir(tempDir, { recursive: true });
	}

	// Create job
	const job = createJob(filename);

	// Stream request body to disk using Web ReadableStream reader directly.
	// This avoids Readable.fromWeb() conversion issues and memory buffering.
	let bytesWritten = 0;
	const reader = request.body.getReader();
	let fh;

	try {
		fh = await open(job.inputPath, 'w');

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			bytesWritten += value.byteLength;
			if (bytesWritten > MAX_FILE_SIZE) {
				throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
			}

			await fh.write(value);
		}
	} catch (e) {
		// Clean up partial file on failure
		try { await fh?.close(); } catch { /* ignore */ }
		try { if (existsSync(job.inputPath)) await unlink(job.inputPath); } catch { /* ignore */ }

		if (e instanceof Error && e.message.includes('maximum size')) {
			throw error(400, e.message);
		}
		console.error('[upload] Stream error:', e);
		throw error(500, 'Upload failed - connection interrupted');
	} finally {
		try { await fh?.close(); } catch { /* ignore */ }
	}

	updateJob(job.id, { status: 'uploaded', fileSize: bytesWritten });

	// Probe video for metadata
	try {
		const probeData = await probeVideo(job.inputPath);
		const meta = extractVideoMeta(probeData);
		updateJob(job.id, {
			duration: meta.duration,
			resolution: meta.resolution,
			fileSize: meta.fileSize || bytesWritten
		});

		return json({
			jobId: job.id,
			filename,
			duration: meta.duration,
			resolution: meta.resolution,
			fileSize: meta.fileSize || bytesWritten
		});
	} catch {
		// If probe fails, still return job (user can try processing)
		return json({
			jobId: job.id,
			filename,
			fileSize: bytesWritten,
			duration: null,
			resolution: null
		});
	}
};
