import { z } from 'zod';

export const FactionSchema = z.enum([
	'foundation',
	'chaos-insurgency',
	'goc',
	'serpents-hand',
	'mcd',
	'broken-god',
	'wondertainment',
	'ouroboros'
]);
export type Faction = z.infer<typeof FactionSchema>;

export const DocumentTypeSchema = z.enum([
	'scp',
	'research',
	'letter',
	'interview',
	'personnel',
	'incident',
	'mission',
	'breach',
	'anomaly-card',
	'exploration',
	'autopsy',
	'directive',
	'newspaper',
	'avlog'
]);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const ClassificationLevelSchema = z.enum([
	'unrestricted',
	'restricted',
	'confidential',
	'secret',
	'top-secret'
]);
export type ClassificationLevel = z.infer<typeof ClassificationLevelSchema>;

export const ClearanceLevelSchema = z.enum(['1', '2', '3', '4', '5']);
export type ClearanceLevel = z.infer<typeof ClearanceLevelSchema>;

export const DocumentMetadataSchema = z.object({
	id: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	faction: FactionSchema,
	classification: ClassificationLevelSchema.optional(),
	clearanceLevel: ClearanceLevelSchema.optional()
});
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
