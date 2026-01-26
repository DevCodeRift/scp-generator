import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { createJob, getTempDir } from '$lib/server/job-manager';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];

/**
 * Initialize a chunked upload. Creates a job and an empty file to receive chunks.
 * Body: JSON { filename, fileSize }
 * Returns: { jobId }
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const filename: string = body.filename || 'upload.mp4';
	const fileSize: number = body.fileSize || 0;

	// Validate extension
	const ext = '.' + (filename.split('.').pop()?.toLowerCase() || '');
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		throw error(400, `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
	}

	// Validate total file size
	if (fileSize > MAX_FILE_SIZE) {
		throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`);
	}

	// Ensure temp directory exists
	const tempDir = getTempDir();
	if (!existsSync(tempDir)) {
		await mkdir(tempDir, { recursive: true });
	}

	// Create job and empty input file
	const job = createJob(filename);
	await writeFile(job.inputPath, Buffer.alloc(0));

	return json({ jobId: job.id });
};
