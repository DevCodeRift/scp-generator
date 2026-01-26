import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { open } from 'fs/promises';
import { getJob, updateJob } from '$lib/server/job-manager';
import { probeVideo, extractVideoMeta } from '$lib/server/video-processor';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

/**
 * Receive a single chunk and append it to the job's input file.
 * Body: raw binary chunk (application/octet-stream)
 * Headers: X-Job-Id, X-Chunk-Index, X-Total-Chunks
 * On the final chunk, probes the video and returns metadata.
 */
export const POST: RequestHandler = async ({ request }) => {
	const jobId = request.headers.get('x-job-id');
	const chunkIndex = parseInt(request.headers.get('x-chunk-index') || '0', 10);
	const totalChunks = parseInt(request.headers.get('x-total-chunks') || '1', 10);

	if (!jobId) {
		throw error(400, 'Missing X-Job-Id header');
	}

	const job = getJob(jobId);
	if (!job) {
		throw error(404, 'Job not found');
	}

	if (!request.body) {
		throw error(400, 'No chunk data provided');
	}

	// Read chunk and append to file
	const reader = request.body.getReader();
	let chunkBytes = 0;
	let fh;

	try {
		fh = await open(job.inputPath, 'a');

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunkBytes += value.byteLength;
			await fh.write(value);
		}
	} catch (e) {
		console.error(`[chunk] Error writing chunk ${chunkIndex} for job ${jobId}:`, e);
		throw error(500, 'Failed to write chunk');
	} finally {
		try { await fh?.close(); } catch { /* ignore */ }
	}

	const newSize = (job.fileSize || 0) + chunkBytes;

	// Check total size doesn't exceed limit
	if (newSize > MAX_FILE_SIZE) {
		throw error(400, `File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`);
	}

	updateJob(jobId, { fileSize: newSize });

	const isLast = chunkIndex === totalChunks - 1;

	if (isLast) {
		updateJob(jobId, { status: 'uploaded' });

		// Probe video for metadata
		try {
			const probeData = await probeVideo(job.inputPath);
			const meta = extractVideoMeta(probeData);
			updateJob(jobId, {
				duration: meta.duration,
				resolution: meta.resolution,
				fileSize: meta.fileSize || newSize
			});

			return json({
				complete: true,
				jobId,
				filename: job.filename,
				duration: meta.duration,
				resolution: meta.resolution,
				fileSize: meta.fileSize || newSize
			});
		} catch {
			return json({
				complete: true,
				jobId,
				filename: job.filename,
				fileSize: newSize,
				duration: null,
				resolution: null
			});
		}
	}

	return json({ complete: false, chunkIndex });
};
