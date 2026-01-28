import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

export type JobStatus = 'uploading' | 'uploaded' | 'processing' | 'complete' | 'error' | 'expired';

export interface VideoJob {
	id: string;
	status: JobStatus;
	inputPath: string;
	outputPath?: string;
	progress: number; // 0-100
	error?: string;
	createdAt: number;
	filename?: string;
	duration?: number;
	resolution?: { width: number; height: number };
	fileSize?: number;
}

const jobs = new Map<string, VideoJob>();

const TEMP_DIR = process.env.VIDEO_TEMP_DIR || '/tmp/video-processing';
const JOB_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Create a new video processing job.
 */
export function createJob(originalFilename: string): VideoJob {
	const id = randomUUID();
	const ext = originalFilename.split('.').pop() || 'mp4';
	const inputPath = `${TEMP_DIR}/${id}-input.${ext}`;
	const outputPath = `${TEMP_DIR}/${id}-output.mp4`;

	const job: VideoJob = {
		id,
		status: 'uploading',
		inputPath,
		outputPath,
		progress: 0,
		createdAt: Date.now(),
		filename: originalFilename
	};

	jobs.set(id, job);
	return job;
}

/**
 * Get a job by ID.
 */
export function getJob(id: string): VideoJob | undefined {
	return jobs.get(id);
}

/**
 * Update a job's properties.
 */
export function updateJob(id: string, updates: Partial<VideoJob>): VideoJob | undefined {
	const job = jobs.get(id);
	if (!job) return undefined;

	const updated = { ...job, ...updates };
	jobs.set(id, updated);
	return updated;
}

/**
 * Delete a job and clean up its temp files.
 */
export async function deleteJob(id: string): Promise<void> {
	const job = jobs.get(id);
	if (!job) return;

	// Clean up temp files
	try {
		if (existsSync(job.inputPath)) await unlink(job.inputPath);
	} catch { /* ignore */ }
	try {
		if (job.outputPath && existsSync(job.outputPath)) await unlink(job.outputPath);
	} catch { /* ignore */ }

	jobs.delete(id);
}

/**
 * Clean up expired jobs and their temp files.
 */
async function cleanupExpiredJobs(): Promise<void> {
	const now = Date.now();
	const expiredIds: string[] = [];

	for (const [id, job] of jobs) {
		if (now - job.createdAt > JOB_EXPIRY_MS) {
			expiredIds.push(id);
		}
	}

	for (const id of expiredIds) {
		await deleteJob(id);
	}

	if (expiredIds.length > 0) {
		console.log(`[job-manager] Cleaned up ${expiredIds.length} expired jobs`);
	}
}

/**
 * Get the temp directory path.
 */
export function getTempDir(): string {
	return TEMP_DIR;
}

// Start periodic cleanup
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

export function startCleanup(): void {
	if (cleanupTimer) return;
	cleanupTimer = setInterval(cleanupExpiredJobs, CLEANUP_INTERVAL_MS);
	// Don't prevent process exit
	if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
		cleanupTimer.unref();
	}
}

export function stopCleanup(): void {
	if (cleanupTimer) {
		clearInterval(cleanupTimer);
		cleanupTimer = null;
	}
}

// Auto-start cleanup
startCleanup();
