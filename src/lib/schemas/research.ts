import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const ResearchReportSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('research'),
	reportNumber: z.string().min(1, 'Report number is required'),
	title: z.string().min(1, 'Title is required'),
	department: z.string().optional(),
	date: z.string(),
	leadResearcher: z.string().min(1, 'Lead researcher is required'),
	team: z.array(z.string()).default([]),
	supervisor: z.string().optional(),
	relatedSCPs: z.array(z.string()).default([]),
	abstract: z.string().min(1, 'Abstract is required'),
	methodology: z.string().optional(),
	findings: z.string().min(1, 'Findings are required'),
	conclusions: z.string().min(1, 'Conclusions are required'),
	recommendations: z.string().optional(),
	appendices: z.array(z.object({
		id: z.string(),
		title: z.string(),
		content: z.string()
	})).default([])
});
export type ResearchReport = z.infer<typeof ResearchReportSchema>;

export const defaultResearchReport: ResearchReport = {
	metadata: {
		faction: 'foundation',
		classification: 'confidential',
		clearanceLevel: '2'
	},
	type: 'research',
	reportNumber: '',
	title: '',
	department: '',
	date: new Date().toISOString().split('T')[0],
	leadResearcher: '',
	team: [],
	supervisor: '',
	relatedSCPs: [],
	abstract: '',
	methodology: '',
	findings: '',
	conclusions: '',
	recommendations: '',
	appendices: []
};

export const RESEARCH_DEPARTMENTS = [
	'Anomalous Materials',
	'Biological Studies',
	'Cognitohazard Research',
	'Containment Engineering',
	'Counter-Memetics',
	'Dimensional Studies',
	'Esoteric Research',
	'Field Research',
	'Historical Analysis',
	'Memetics Division',
	'Paratech Development',
	'Psychological Studies',
	'Reality Anchoring',
	'Temporal Studies',
	'Thaumatology'
];
