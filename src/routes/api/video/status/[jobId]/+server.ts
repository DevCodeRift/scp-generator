import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob } from '$lib/server/job-manager';

export const GET: RequestHandler = async ({ params }) => {
	const { jobId } = params;

	if (!jobId) {
		throw error(400, 'Missing jobId');
	}

	const job = getJob(jobId);

	if (!job) {
		throw error(404, 'Job not found');
	}

	return json({
		jobId: job.id,
		status: job.status,
		progress: job.progress,
		error: job.error || null
	});
};
