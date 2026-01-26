import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Object class enumeration
export const ObjectClassSchema = z.enum([
	'safe',
	'euclid',
	'keter',
	'thaumiel',
	'apollyon',
	'archon',
	'neutralized',
	'explained',
	'pending'
]);
export type ObjectClass = z.infer<typeof ObjectClassSchema>;

// Disruption class (ACS)
export const DisruptionClassSchema = z.enum([
	'dark',
	'vlam',
	'keneq',
	'ekhi',
	'amida'
]);
export type DisruptionClass = z.infer<typeof DisruptionClassSchema>;

// Risk class (ACS)
export const RiskClassSchema = z.enum([
	'notice',
	'caution',
	'warning',
	'danger',
	'critical'
]);
export type RiskClass = z.infer<typeof RiskClassSchema>;

// Addendum types
export const AddendumTypeSchema = z.enum([
	'general',
	'incident-report',
	'experiment-log',
	'recovery-log',
	'update',
	'note'
]);
export type AddendumType = z.infer<typeof AddendumTypeSchema>;

// Addendum schema
export const AddendumSchema = z.object({
	id: z.string(),
	type: AddendumTypeSchema,
	title: z.string(),
	date: z.string().optional(),
	content: z.string()
});
export type Addendum = z.infer<typeof AddendumSchema>;

// Main SCP document schema
export const SCPDocumentSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('scp'),

	// Core fields
	itemNumber: z.string().min(1, 'Item number is required'),
	objectClass: ObjectClassSchema,
	disruptionClass: DisruptionClassSchema.optional(),
	riskClass: RiskClassSchema.optional(),

	// Main content sections
	containmentProcedures: z.string().min(1, 'Containment procedures are required'),
	description: z.string().min(1, 'Description is required'),

	// Optional sections
	addenda: z.array(AddendumSchema).default([]),

	// Display options
	showACSModule: z.boolean().default(false),
	showWarningBox: z.boolean().default(false),
	warningMessage: z.string().optional()
});
export type SCPDocument = z.infer<typeof SCPDocumentSchema>;

// Default values for new SCP document
export const defaultSCPDocument: SCPDocument = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'scp',
	itemNumber: 'SCP-XXXX',
	objectClass: 'euclid',
	containmentProcedures: '',
	description: '',
	addenda: [],
	showACSModule: false,
	showWarningBox: false
};

// Object class descriptions for UI
export const OBJECT_CLASS_INFO: Record<ObjectClass, { color: string; description: string }> = {
	safe: {
		color: '#00aa00',
		description: 'Can be safely contained with minimal resources'
	},
	euclid: {
		color: '#cccc00',
		description: 'Requires more resources to contain or behavior is unpredictable'
	},
	keter: {
		color: '#cc0000',
		description: 'Difficult to contain consistently or reliably'
	},
	thaumiel: {
		color: '#6666ff',
		description: 'Used to contain or counteract other anomalies'
	},
	apollyon: {
		color: '#990000',
		description: 'Cannot be contained and will cause an XK-class end-of-world scenario'
	},
	archon: {
		color: '#aa00aa',
		description: 'Could theoretically be contained but should not be'
	},
	neutralized: {
		color: '#666666',
		description: 'No longer anomalous or has been destroyed'
	},
	explained: {
		color: '#888888',
		description: 'Anomaly fully understood and explainable by mainstream science'
	},
	pending: {
		color: '#888888',
		description: 'Classification pending further analysis'
	}
};
