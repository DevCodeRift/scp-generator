import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Interview entry schema
export const InterviewEntrySchema = z.object({
	id: z.string(),
	speaker: z.string(),
	designation: z.string().optional(),
	content: z.string(),
	isAction: z.boolean().default(false) // For stage directions like "[Pause]"
});
export type InterviewEntry = z.infer<typeof InterviewEntrySchema>;

// Participant schema
export const ParticipantSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	designation: z.string().optional(),
	role: z.enum(['interviewer', 'interviewee', 'observer']).optional()
});
export type Participant = z.infer<typeof ParticipantSchema>;

// Interview log schema
export const InterviewLogSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('interview'),

	// Header
	logNumber: z.string().min(1, 'Log number is required'),
	date: z.string(),
	time: z.string().optional(),
	location: z.string().optional(),

	// Participants
	interviewer: ParticipantSchema,
	interviewee: ParticipantSchema,
	observers: z.array(z.string()).default([]),

	// Related items
	relatedSCPs: z.array(z.string()).default([]),

	// Content
	foreword: z.string().optional(),
	entries: z.array(InterviewEntrySchema).default([]),
	afterword: z.string().optional(),

	// Additional notes
	notes: z.string().optional()
});
export type InterviewLog = z.infer<typeof InterviewLogSchema>;

// Default values for new interview log
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

// Common interviewer designations
export const INTERVIEWER_DESIGNATIONS = [
	'Dr.',
	'Researcher',
	'Agent',
	'Director',
	'O5-#',
	'MTF Commander'
];

// Common interviewee designations
export const INTERVIEWEE_DESIGNATIONS = [
	'D-Class',
	'SCP-XXXX',
	'SCP-XXXX-1',
	'PoI-####',
	'Former Agent',
	'Civilian',
	'Witness'
];
