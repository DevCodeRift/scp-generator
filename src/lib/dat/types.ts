import { z } from 'zod';

// Element types found in .dat templates
export const DatElementTypeSchema = z.enum([
	'header',
	'header2',
	'header3',
	'line',
	'dottedline',
	'paragraph',
	'smalltext',
	'image',
	'signature',
	'checkbox'
]);
export type DatElementType = z.infer<typeof DatElementTypeSchema>;

// Base element (shared fields)
const DatBaseElementSchema = z.object({
	type: DatElementTypeSchema,
	content: z.string()
});

// Image element with alignment/scale params and URL
export const DatImageElementSchema = DatBaseElementSchema.extend({
	type: z.literal('image'),
	params: z.object({
		align: z.number().min(0).max(1),
		scale: z.number().min(0).max(1)
	}),
	args: z.object({
		url: z.string()
	})
});
export type DatImageElement = z.infer<typeof DatImageElementSchema>;

// Signature box with unique ID
export const DatSignatureElementSchema = DatBaseElementSchema.extend({
	type: z.literal('signature'),
	uid: z.number()
});
export type DatSignatureElement = z.infer<typeof DatSignatureElementSchema>;

// Checkbox with toggle state and label text
export const DatCheckboxElementSchema = DatBaseElementSchema.extend({
	type: z.literal('checkbox'),
	params: z.object({
		toggle: z.boolean(),
		rightAlign: z.boolean()
	}),
	args: z.object({
		text: z.string()
	})
});
export type DatCheckboxElement = z.infer<typeof DatCheckboxElementSchema>;

// Text-only elements (header, header2, header3, line, dottedline, paragraph, smalltext)
export const DatTextElementSchema = DatBaseElementSchema.extend({
	type: z.enum(['header', 'header2', 'header3', 'line', 'dottedline', 'paragraph', 'smalltext'])
});
export type DatTextElement = z.infer<typeof DatTextElementSchema>;

// Union of all element types
export const DatElementSchema = z.discriminatedUnion('type', [
	DatTextElementSchema,
	DatImageElementSchema,
	DatSignatureElementSchema,
	DatCheckboxElementSchema
]);
export type DatElement = z.infer<typeof DatElementSchema>;

// Page containing elements and optional effects
export const DatPageSchema = z.object({
	elements: z.array(DatElementSchema),
	effects: z.array(z.unknown()).optional().default([])
});
export type DatPage = z.infer<typeof DatPageSchema>;

// Document settings
export const DatSettingsSchema = z.object({
	noCheckboxWhenStickied: z.boolean().default(false),
	singleSign: z.boolean().default(false)
});
export type DatSettings = z.infer<typeof DatSettingsSchema>;

// Template fields (metadata shown on the document)
export const DatFieldsSchema = z.object({
	title: z.string().optional(),
	authorized: z.string().optional(),
	participating: z.string().optional(),
	subjects: z.string().optional(),
	conducted: z.string().optional()
}).passthrough(); // Allow additional custom fields
export type DatFields = z.infer<typeof DatFieldsSchema>;

// Document type as used by the Gmod addon
export const DatDocumentTypeSchema = z.enum([
	'foundation_research_study',
	'foundation_report'
]);
export type DatDocumentType = z.infer<typeof DatDocumentTypeSchema>;

// Top-level .dat document schema
export const DatDocumentSchema = z.object({
	type: DatDocumentTypeSchema,
	draftId: z.number(),
	date: z.number(), // Unix timestamp
	creator: z.string().optional(), // SteamID64
	allowScanning: z.boolean().optional().default(true),
	settings: DatSettingsSchema,
	fields: DatFieldsSchema,
	pages: z.array(DatPageSchema),
	signatures: z.array(z.unknown()).default([])
});
export type DatDocument = z.infer<typeof DatDocumentSchema>;
