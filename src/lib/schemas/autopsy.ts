import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Subject type
export const SubjectTypeSchema = z.enum([
	'humanoid',
	'entity',
	'd-class',
	'personnel',
	'civilian',
	'creature',
	'unknown'
]);
export type SubjectType = z.infer<typeof SubjectTypeSchema>;

// Cause of death categories
export const CauseOfDeathSchema = z.enum([
	'anomalous-effect',
	'physical-trauma',
	'biological',
	'memetic',
	'cognitohazard',
	'environmental',
	'unknown',
	'classified'
]);
export type CauseOfDeath = z.infer<typeof CauseOfDeathSchema>;

// Main Autopsy Report schema
export const AutopsyReportSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('autopsy'),

	// Case info
	caseNumber: z.string().min(1, 'Case number is required'),
	relatedSCP: z.string().optional(),
	relatedIncident: z.string().optional(),

	// Subject info
	subjectType: SubjectTypeSchema,
	subjectDesignation: z.string().min(1, 'Subject designation is required'),
	subjectDescription: z.string().optional(),
	dateOfDeath: z.string().optional(),
	dateOfExamination: z.string().optional(),
	locationRecovered: z.string().optional(),

	// Physical examination
	externalExamination: z.string().optional(),
	anomalousFeatures: z.string().optional(),
	internalExamination: z.string().optional(),
	tissueAnalysis: z.string().optional(),

	// Findings
	causeOfDeath: CauseOfDeathSchema,
	causeDetails: z.string().optional(),
	toxicologyResults: z.string().optional(),
	anomalousFindings: z.string().optional(),

	// Conclusions
	conclusions: z.string().optional(),
	recommendations: z.string().optional(),

	// Examiner
	examiner: z.string().optional(),
	witnesses: z.string().optional(),

	// Display options
	showDiagram: z.boolean().default(true),
	showClinicalStyle: z.boolean().default(true),
	showWarnings: z.boolean().default(true)
});
export type AutopsyReport = z.infer<typeof AutopsyReportSchema>;

// Default values
export const defaultAutopsyReport: AutopsyReport = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'autopsy',
	caseNumber: 'AUT-XXXX',
	subjectType: 'humanoid',
	subjectDesignation: '',
	causeOfDeath: 'unknown',
	showDiagram: true,
	showClinicalStyle: true,
	showWarnings: true
};

// Info labels
export const SUBJECT_TYPE_INFO: Record<SubjectType, { label: string }> = {
	'humanoid': { label: 'Humanoid Entity' },
	'entity': { label: 'Anomalous Entity' },
	'd-class': { label: 'D-Class Personnel' },
	'personnel': { label: 'Foundation Personnel' },
	'civilian': { label: 'Civilian' },
	'creature': { label: 'Anomalous Creature' },
	'unknown': { label: 'Unknown' }
};

export const CAUSE_OF_DEATH_INFO: Record<CauseOfDeath, { label: string; color: string }> = {
	'anomalous-effect': { label: 'Anomalous Effect', color: '#9900cc' },
	'physical-trauma': { label: 'Physical Trauma', color: '#cc0000' },
	'biological': { label: 'Biological Agent', color: '#00aa00' },
	'memetic': { label: 'Memetic Exposure', color: '#ff8800' },
	'cognitohazard': { label: 'Cognitohazard', color: '#cc00cc' },
	'environmental': { label: 'Environmental', color: '#0088cc' },
	'unknown': { label: 'Unknown', color: '#888888' },
	'classified': { label: '[CLASSIFIED]', color: '#000000' }
};
