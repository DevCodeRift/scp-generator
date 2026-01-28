import { z } from 'zod';

export const ColorGradeSchema = z.enum(['green', 'gray', 'blue', 'sepia', 'none']);
export type ColorGrade = z.infer<typeof ColorGradeSchema>;

export const OutputQualitySchema = z.enum(['low', 'medium', 'high']);
export type OutputQuality = z.infer<typeof OutputQualitySchema>;

export const VideoEffectsSchema = z.object({
	// Scanlines overlay
	scanlines: z.boolean().default(true),

	// Running timestamp display
	timestamp: z.boolean().default(true),

	// Camera / facility label (top-left)
	facilityId: z.string().default('CAM-07 // SITE-19'),

	// Vignette (darkened edges)
	vignette: z.boolean().default(true),
	vignetteIntensity: z.number().min(0).max(1).default(0.5),

	// Color grading preset
	colorGrade: ColorGradeSchema.default('green'),

	// Film grain / static noise
	noise: z.boolean().default(true),
	noiseIntensity: z.number().min(0).max(1).default(0.3),

	// Blinking REC indicator
	recIndicator: z.boolean().default(true),

	// Subtle camera shake
	cameraShake: z.boolean().default(false),
	shakeIntensity: z.number().min(0).max(1).default(0.2),

	// SCP Foundation watermark logo
	scpWatermark: z.boolean().default(false),

	// Output encoding quality
	outputQuality: OutputQualitySchema.default('medium')
});
export type VideoEffects = z.infer<typeof VideoEffectsSchema>;

export const defaultVideoEffects: VideoEffects = {
	scanlines: true,
	timestamp: true,
	facilityId: 'CAM-07 // SITE-19',
	vignette: true,
	vignetteIntensity: 0.5,
	colorGrade: 'green',
	noise: true,
	noiseIntensity: 0.3,
	recIndicator: true,
	cameraShake: false,
	shakeIntensity: 0.2,
	scpWatermark: false,
	outputQuality: 'medium'
};

// Preset configurations
export const VIDEO_EFFECT_PRESETS: Record<string, { label: string; effects: Partial<VideoEffects> }> = {
	bodycam: {
		label: 'Standard Body Cam',
		effects: {
			scanlines: true,
			timestamp: true,
			facilityId: 'BODYCAM-01 // MTF UNIT',
			vignette: true,
			vignetteIntensity: 0.4,
			colorGrade: 'green',
			noise: true,
			noiseIntensity: 0.25,
			recIndicator: true,
			cameraShake: true,
			shakeIntensity: 0.15
		}
	},
	surveillance: {
		label: 'Surveillance CCTV',
		effects: {
			scanlines: true,
			timestamp: true,
			facilityId: 'CAM-07 // SITE-19',
			vignette: true,
			vignetteIntensity: 0.6,
			colorGrade: 'gray',
			noise: true,
			noiseIntensity: 0.2,
			recIndicator: true,
			cameraShake: false
		}
	},
	recovered: {
		label: 'Recovered Tape',
		effects: {
			scanlines: true,
			timestamp: true,
			facilityId: 'RECOVERED MEDIA // UNCLASSIFIED',
			vignette: true,
			vignetteIntensity: 0.7,
			colorGrade: 'sepia',
			noise: true,
			noiseIntensity: 0.5,
			recIndicator: false,
			cameraShake: true,
			shakeIntensity: 0.3
		}
	},
	corrupted: {
		label: 'Corrupted Feed',
		effects: {
			scanlines: true,
			timestamp: true,
			facilityId: '[DATA CORRUPTED]',
			vignette: true,
			vignetteIntensity: 0.8,
			colorGrade: 'green',
			noise: true,
			noiseIntensity: 0.7,
			recIndicator: true,
			cameraShake: true,
			shakeIntensity: 0.5
		}
	}
};

export const COLOR_GRADE_INFO: Record<ColorGrade, { label: string }> = {
	green: { label: 'Night Vision Green' },
	gray: { label: 'Grayscale' },
	blue: { label: 'Cold Blue' },
	sepia: { label: 'Aged Sepia' },
	none: { label: 'No Color Grade' }
};

export const OUTPUT_QUALITY_INFO: Record<OutputQuality, { label: string; crf: number }> = {
	low: { label: 'Low (Smaller file)', crf: 28 },
	medium: { label: 'Medium', crf: 23 },
	high: { label: 'High (Larger file)', crf: 18 }
};
