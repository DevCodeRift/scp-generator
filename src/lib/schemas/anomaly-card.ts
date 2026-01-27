import { z } from 'zod';
import { DocumentMetadataSchema } from './common';
import { ObjectClassSchema, DisruptionClassSchema, RiskClassSchema } from './scp';

// Card style
export const CardStyleSchema = z.enum([
	'standard',
	'compact',
	'detailed',
	'warning'
]);
export type CardStyle = z.infer<typeof CardStyleSchema>;

// Main Anomaly Card schema (quick reference)
export const AnomalyCardSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('anomaly-card'),

	// Core identification
	itemNumber: z.string().min(1, 'Item number is required'),
	nickname: z.string().optional(),
	objectClass: ObjectClassSchema,

	// Optional ACS
	disruptionClass: DisruptionClassSchema.optional(),
	riskClass: RiskClassSchema.optional(),

	// Brief info
	briefDescription: z.string().min(1, 'Brief description is required'),
	primaryHazards: z.string().optional(),

	// Containment summary
	containmentSummary: z.string().optional(),
	specialRequirements: z.string().optional(),

	// Quick reference
	location: z.string().optional(),
	assignedPersonnel: z.string().optional(),
	lastIncident: z.string().optional(),

	// Display options
	cardStyle: CardStyleSchema.default('standard'),
	showACS: z.boolean().default(false),
	showHazards: z.boolean().default(true)
});
export type AnomalyCard = z.infer<typeof AnomalyCardSchema>;

// Default values
export const defaultAnomalyCard: AnomalyCard = {
	metadata: {
		faction: 'foundation',
		classification: 'restricted',
		clearanceLevel: '2'
	},
	type: 'anomaly-card',
	itemNumber: 'SCP-XXXX',
	objectClass: 'euclid',
	briefDescription: '',
	cardStyle: 'standard',
	showACS: false,
	showHazards: true
};

// Card style info
export const CARD_STYLE_INFO: Record<CardStyle, { label: string; description: string }> = {
	'standard': { label: 'Standard', description: 'Standard reference card' },
	'compact': { label: 'Compact', description: 'Minimal info, smaller size' },
	'detailed': { label: 'Detailed', description: 'Extended information' },
	'warning': { label: 'Warning', description: 'High visibility warning style' }
};
