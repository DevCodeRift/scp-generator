import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob, deleteJob } from '$lib/server/job-manager';
import { createReadStream, existsSync, statSync } from 'fs';
import { Readable } from 'stream';

export const GET: RequestHandler = async ({ params }) => {
	const { jobId } = params;

	if (!jobId) {
		throw error(400, 'Missing jobId');
	}

	const job = getJob(jobId);

	if (!job) {
		throw error(404, 'Job not found');
	}

	if (job.status !== 'complete') {
		throw error(409, `Job is not complete (status: ${job.status})`);
	}

	if (!job.outputPath || !existsSync(job.outputPath)) {
		throw error(500, 'Output file not found');
	}

	const stat = statSync(job.outputPath);
	const filename = job.filename
		? `SCP-BODYCAM-${job.filename.replace(/\.[^.]+$/, '')}.mp4`
		: `SCP-BODYCAM-${jobId.slice(0, 8)}.mp4`;

	// Create a readable stream from the output file
	const nodeStream = createReadStream(job.outputPath);

	// Convert Node.js stream to Web ReadableStream
	const webStream = new ReadableStream({
		start(controller) {
			nodeStream.on('data', (chunk: Buffer) => {
				controller.enqueue(new Uint8Array(chunk));
			});
			nodeStream.on('end', () => {
				controller.close();
				// Schedule cleanup after download completes
				setTimeout(() => deleteJob(jobId), 5000);
			});
			nodeStream.on('error', (err) => {
				controller.error(err);
			});
		},
		cancel() {
			nodeStream.destroy();
		}
	});

	return new Response(webStream, {
		headers: {
			'Content-Type': 'video/mp4',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Content-Length': String(stat.size)
		}
	});
};
