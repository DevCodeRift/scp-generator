import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const InterviewEntrySchema = z.object({
	id: z.string(),
	speaker: z.string(),
	designation: z.string().optional(),
	content: z.string(),
	isAction: z.boolean().default(false)
});
export type InterviewEntry = z.infer<typeof InterviewEntrySchema>;

export const ParticipantSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	designation: z.string().optional(),
	role: z.enum(['interviewer', 'interviewee', 'observer']).optional()
});
export type Participant = z.infer<typeof ParticipantSchema>;

export const InterviewLogSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('interview'),
	logNumber: z.string().min(1, 'Log number is required'),
	date: z.string(),
	time: z.string().optional(),
	location: z.string().optional(),
	interviewer: ParticipantSchema,
	interviewee: ParticipantSchema,
	observers: z.array(z.string()).default([]),
	relatedSCPs: z.array(z.string()).default([]),
	foreword: z.string().optional(),
	entries: z.array(InterviewEntrySchema).default([]),
	afterword: z.string().optional(),
	notes: z.string().optional()
});
export type InterviewLog = z.infer<typeof InterviewLogSchema>;

export const defaultInterviewLog: InterviewLog = {
	metadata: {
		faction: 'foundation',
		classification: 'confidential',
		clearanceLevel: '2'
	},
	type: 'interview',
	logNumber: '',
	date: new Date().toISOString().split('T')[0],
	time: '',
	location: '',
	interviewer: {
		name: '',
		designation: '',
		role: 'interviewer'
	},
	interviewee: {
		name: '',
		designation: '',
		role: 'interviewee'
	},
	observers: [],
	relatedSCPs: [],
	foreword: '',
	entries: [],
	afterword: '',
	notes: ''
};

export const INTERVIEWER_DESIGNATIONS = [
	'Dr.',
	'Researcher',
	'Agent',
	'Director',
	'O5-#',
	'MTF Commander'
];

export const INTERVIEWEE_DESIGNATIONS = [
	'D-Class',
	'SCP-XXXX',
	'SCP-XXXX-1',
	'PoI-####',
	'Former Agent',
	'Civilian',
	'Witness'
];
