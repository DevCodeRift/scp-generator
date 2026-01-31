import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const MediaTypeSchema = z.enum([
	'audio',
	'video',
	'surveillance',
	'bodycam',
	'recovered-tape',
	'radio-transmission',
	'phone-call'
]);
export type MediaType = z.infer<typeof MediaTypeSchema>;

export const RecordingQualitySchema = z.enum([
	'clear',
	'degraded',
	'heavily-degraded',
	'partial',
	'corrupted'
]);
export type RecordingQuality = z.infer<typeof RecordingQualitySchema>;

export const TranscriptEntrySchema = z.object({
	id: z.string(),
	timestamp: z.string(),
	speaker: z.string(),
	content: z.string(),
	notes: z.string().optional(),
	isRedacted: z.boolean().default(false)
});
export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;

export const AVLogSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('avlog'),
	logDesignation: z.string().min(1, 'Log designation is required'),
	mediaType: MediaTypeSchema,
	recordingQuality: RecordingQualitySchema,
	recordingDate: z.string().optional(),
	duration: z.string().optional(),
	location: z.string().optional(),
	equipmentUsed: z.string().optional(),
	recoveryInfo: z.string().optional(),
	relatedSCP: z.string().optional(),
	relatedIncident: z.string().optional(),
	participants: z.string().optional(),
	preTranscriptNotes: z.string().optional(),
	transcript: z.array(TranscriptEntrySchema).default([]),
	postTranscriptNotes: z.string().optional(),
	analysisNotes: z.string().optional(),
	anomaliesDetected: z.string().optional(),
	transcribedBy: z.string().optional(),
	verifiedBy: z.string().optional(),
	showStaticEffects: z.boolean().default(true),
	showTimestamps: z.boolean().default(true),
	showScanlines: z.boolean().default(true),
	terminalStyle: z.boolean().default(true)
});
export type AVLog = z.infer<typeof AVLogSchema>;

export const defaultAVLog: AVLog = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'avlog',
	logDesignation: 'AV-LOG-XXXX',
	mediaType: 'video',
	recordingQuality: 'clear',
	transcript: [],
	showStaticEffects: true,
	showTimestamps: true,
	showScanlines: true,
	terminalStyle: true
};

export const MEDIA_TYPE_INFO: Record<MediaType, { label: string; icon: string }> = {
	'audio': { label: 'Audio Recording', icon: '🎵' },
	'video': { label: 'Video Recording', icon: '📹' },
	'surveillance': { label: 'Surveillance Footage', icon: '📷' },
	'bodycam': { label: 'Body Camera', icon: '🎥' },
	'recovered-tape': { label: 'Recovered Tape', icon: '📼' },
	'radio-transmission': { label: 'Radio Transmission', icon: '📻' },
	'phone-call': { label: 'Phone Call', icon: '📞' }
};

export const RECORDING_QUALITY_INFO: Record<RecordingQuality, { label: string; color: string }> = {
	'clear': { label: 'Clear', color: '#00aa00' },
	'degraded': { label: 'Degraded', color: '#cccc00' },
	'heavily-degraded': { label: 'Heavily Degraded', color: '#ff8800' },
	'partial': { label: 'Partial Recording', color: '#cc0000' },
	'corrupted': { label: 'Corrupted', color: '#660000' }
};
