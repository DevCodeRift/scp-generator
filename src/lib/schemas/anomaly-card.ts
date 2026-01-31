import { z } from 'zod';
import { DocumentMetadataSchema } from './common';
import { ObjectClassSchema, DisruptionClassSchema, RiskClassSchema } from './scp';

export const CardStyleSchema = z.enum([
	'standard',
	'compact',
	'detailed',
	'warning'
]);
export type CardStyle = z.infer<typeof CardStyleSchema>;

export const AnomalyCardSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('anomaly-card'),
	itemNumber: z.string().min(1, 'Item number is required'),
	nickname: z.string().optional(),
	objectClass: ObjectClassSchema,
	disruptionClass: DisruptionClassSchema.optional(),
	riskClass: RiskClassSchema.optional(),
	briefDescription: z.string().min(1, 'Brief description is required'),
	primaryHazards: z.string().optional(),
	containmentSummary: z.string().optional(),
	specialRequirements: z.string().optional(),
	location: z.string().optional(),
	assignedPersonnel: z.string().optional(),
	lastIncident: z.string().optional(),
	cardStyle: CardStyleSchema.default('standard'),
	showACS: z.boolean().default(false),
	showHazards: z.boolean().default(true)
});
export type AnomalyCard = z.infer<typeof AnomalyCardSchema>;

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

export const CARD_STYLE_INFO: Record<CardStyle, { label: string; description: string }> = {
	'standard': { label: 'Standard', description: 'Standard reference card' },
	'compact': { label: 'Compact', description: 'Minimal info, smaller size' },
	'detailed': { label: 'Detailed', description: 'Extended information' },
	'warning': { label: 'Warning', description: 'High visibility warning style' }
};
