import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Letter types
export const LetterTypeSchema = z.enum([
	'internal-memo',
	'formal-letter',
	'urgent-notice',
	'personnel-notice',
	'incident-notice',
	'directive'
]);
export type LetterType = z.infer<typeof LetterTypeSchema>;

// Person schema for from/to fields
export const PersonSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	title: z.string().optional(),
	department: z.string().optional(),
	site: z.string().optional()
});
export type Person = z.infer<typeof PersonSchema>;

// Letter schema
export const LetterSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('letter'),
	letterType: LetterTypeSchema,

	// Header
	date: z.string(),
	from: PersonSchema,
	to: PersonSchema,
	cc: z.array(z.string()).default([]),

	// Content
	subject: z.string().min(1, 'Subject is required'),
	body: z.string().min(1, 'Body is required'),

	// Signature
	includeSignature: z.boolean().default(true),
	includeStamp: z.boolean().default(false)
});
export type Letter = z.infer<typeof LetterSchema>;

// Default values for new letter
export const defaultLetter: Letter = {
	metadata: {
		faction: 'foundation',
		classification: 'restricted',
		clearanceLevel: '2'
	},
	type: 'letter',
	letterType: 'internal-memo',
	date: new Date().toISOString().split('T')[0],
	from: {
		name: '',
		title: '',
		department: '',
		site: ''
	},
	to: {
		name: '',
		title: '',
		department: '',
		site: ''
	},
	cc: [],
	subject: '',
	body: '',
	includeSignature: true,
	includeStamp: false
};

// Letter type display info
export const LETTER_TYPE_INFO: Record<LetterType, { label: string; description: string }> = {
	'internal-memo': {
		label: 'Internal Memo',
		description: 'Standard internal communication'
	},
	'formal-letter': {
		label: 'Formal Letter',
		description: 'Official correspondence'
	},
	'urgent-notice': {
		label: 'Urgent Notice',
		description: 'Time-sensitive communication'
	},
	'personnel-notice': {
		label: 'Personnel Notice',
		description: 'HR-related communication'
	},
	'incident-notice': {
		label: 'Incident Notice',
		description: 'Incident-related communication'
	},
	'directive': {
		label: 'Directive',
		description: 'Command or order from leadership'
	}
};

// Common sites
export const COMMON_SITES = [
	'Site-01',
	'Site-06',
	'Site-15',
	'Site-17',
	'Site-19',
	'Site-23',
	'Site-43',
	'Site-64',
	'Site-77',
	'Site-81',
	'Site-88',
	'Site-91',
	'Area-02',
	'Area-12',
	'Area-14',
	'Area-179'
];
