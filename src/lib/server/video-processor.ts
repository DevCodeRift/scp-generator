import ffmpeg from 'fluent-ffmpeg';
import type { VideoEffects } from '$lib/schemas/video-effects';
import { OUTPUT_QUALITY_INFO } from '$lib/schemas/video-effects';
import { updateJob } from './job-manager';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

// Use DejaVu Mono in Docker (Alpine), fall back to Courier for local dev
const DOCKER_FONT = '/usr/share/fonts/dejavu/DejaVuSansMono.ttf';
const fontSpec = existsSync(DOCKER_FONT)
	? `fontfile=${DOCKER_FONT}`
	: 'font=Courier';

/**
 * Probe a video file to get metadata (duration, resolution, etc.).
 */
export function probeVideo(inputPath: string): Promise<ffmpeg.FfprobeData> {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(inputPath, (err, data) => {
			if (err) reject(new Error(`Failed to probe video: ${err.message}`));
			else resolve(data);
		});
	});
}

/**
 * Extract video metadata from probe data.
 */
export function extractVideoMeta(probeData: ffmpeg.FfprobeData) {
	const videoStream = probeData.streams.find((s) => s.codec_type === 'video');
	return {
		duration: probeData.format.duration || 0,
		resolution: {
			width: videoStream?.width || 0,
			height: videoStream?.height || 0
		},
		fileSize: probeData.format.size || 0
	};
}

/**
 * Build the FFmpeg video filter string from VideoEffects config.
 */
export function buildFilterChain(effects: VideoEffects): string {
	const filters: string[] = [];

	// 1. Noise
	if (effects.noise) {
		const strength = Math.round(effects.noiseIntensity * 60);
		filters.push(`noise=alls=${strength}:allf=t`);
	}

	// 2. Color grading
	switch (effects.colorGrade) {
		case 'green':
			filters.push('colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3:0');
			break;
		case 'gray':
			filters.push('colorchannelmixer=.33:.33:.33:0:.33:.33:.33:0:.33:.33:.33:0');
			break;
		case 'blue':
			filters.push('colorchannelmixer=.2:.2:.4:0:.2:.2:.4:0:.2:.2:.6:0');
			break;
		case 'sepia':
			filters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131:0');
			break;
		case 'none':
			break;
	}

	// 3. Vignette
	if (effects.vignette) {
		const angle = (effects.vignetteIntensity * Math.PI) / 2;
		filters.push(`vignette=angle=${angle.toFixed(4)}`);
	}

	// 4. Camera shake
	if (effects.cameraShake) {
		const amp = Math.round(effects.shakeIntensity * 20) + 2;
		filters.push(`crop=iw-${amp * 2}:ih-${amp * 2}:${amp}*sin(t*10):${amp}*cos(t*8)`);
	}

	// 5. Scanlines (darken every other line using geq)
	if (effects.scanlines) {
		filters.push("geq=lum='if(mod(Y\\,2)\\,lum(X\\,Y)*0.85\\,lum(X\\,Y))':cb='cb(X\\,Y)':cr='cr(X\\,Y)'");
	}

	// 6. Facility ID
	if (effects.facilityId) {
		const escapedText = effects.facilityId.replace(/'/g, "\\'").replace(/:/g, '\\:');
		filters.push(
			`drawtext=text='${escapedText}':x=20:y=20:fontsize=18:fontcolor=white@0.7:${fontSpec}:borderw=1:bordercolor=black@0.5`
		);
	}

	// 7. Timestamp
	if (effects.timestamp) {
		filters.push(
			`drawtext=text='%{pts\\:hms}':x=w-200:y=20:fontsize=18:fontcolor=white@0.7:${fontSpec}:borderw=1:bordercolor=black@0.5`
		);
	}

	// 8. REC indicator
	if (effects.recIndicator) {
		filters.push(
			`drawtext=text='REC':x=20:y=h-40:fontsize=16:fontcolor=red@0.9:${fontSpec}:borderw=1:bordercolor=black@0.5:enable='lt(mod(t\\,2)\\,1.5)'`
		);
		filters.push(
			"drawbox=x=56:y=h-38:w=8:h=8:color=red@0.9:t=fill:enable='lt(mod(t\\,2)\\,1.5)'"
		);
	}

	return filters.join(',');
}

/**
 * Process a video with SCP body cam effects.
 * Returns a promise that resolves when processing is complete.
 */
export async function processVideo(
	jobId: string,
	inputPath: string,
	outputPath: string,
	effects: VideoEffects
): Promise<void> {
	// Ensure output directory exists
	const outDir = dirname(outputPath);
	if (!existsSync(outDir)) {
		await mkdir(outDir, { recursive: true });
	}

	return new Promise((resolve, reject) => {
		const filterChain = buildFilterChain(effects);
		const qualityInfo = OUTPUT_QUALITY_INFO[effects.outputQuality];

		let command = ffmpeg(inputPath);

		// Apply video filter chain
		if (filterChain) {
			command = command.videoFilters(filterChain);
		}

		command
			.outputOptions([
				'-c:v', 'libx264',
				'-crf', String(qualityInfo.crf),
				'-preset', 'medium',
				'-c:a', 'copy', // Keep original audio
				'-movflags', '+faststart' // Optimize for web playback
			])
			.on('start', (cmdline: string) => {
				console.log(`[video-processor] Job ${jobId} started: ${cmdline}`);
				updateJob(jobId, { status: 'processing', progress: 0 });
			})
			.on('progress', (progress: { percent?: number }) => {
				const pct = Math.min(Math.round(progress.percent || 0), 99);
				updateJob(jobId, { progress: pct });
			})
			.on('end', () => {
				console.log(`[video-processor] Job ${jobId} completed`);
				updateJob(jobId, { status: 'complete', progress: 100 });
				resolve();
			})
			.on('error', (err: Error) => {
				console.error(`[video-processor] Job ${jobId} failed:`, err.message);
				updateJob(jobId, { status: 'error', error: err.message });
				reject(err);
			})
			.save(outputPath);
	});
}
