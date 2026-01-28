import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob, updateJob } from '$lib/server/job-manager';
import { processVideo } from '$lib/server/video-processor';
import { VideoEffectsSchema } from '$lib/schemas/video-effects';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { jobId, effects: rawEffects } = body;

		if (!jobId || typeof jobId !== 'string') {
			throw error(400, 'Missing or invalid jobId');
		}

		// Validate effects
		const parseResult = VideoEffectsSchema.safeParse(rawEffects);
		if (!parseResult.success) {
			const issues = parseResult.error.issues
				.map((i) => `${i.path.join('.')}: ${i.message}`)
				.join('; ');
			throw error(400, `Invalid effects configuration: ${issues}`);
		}

		const effects = parseResult.data;
		const job = getJob(jobId);

		if (!job) {
			throw error(404, 'Job not found');
		}

		if (job.status !== 'uploaded') {
			throw error(409, `Job is in state '${job.status}', expected 'uploaded'`);
		}

		if (!job.outputPath) {
			throw error(500, 'Job has no output path configured');
		}

		// Update status and kick off processing (async, don't await)
		updateJob(jobId, { status: 'processing', progress: 0 });

		processVideo(jobId, job.inputPath, job.outputPath, effects).catch((err) => {
			console.error(`[process] Job ${jobId} failed:`, err);
			updateJob(jobId, { status: 'error', error: err.message });
		});

		return json({
			jobId,
			status: 'processing'
		});
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		console.error('[process] Error:', e);
		throw error(500, 'Processing failed to start');
	}
};
