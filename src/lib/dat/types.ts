import { z } from 'zod';

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

const DatBaseElementSchema = z.object({
	type: DatElementTypeSchema,
	content: z.string()
});

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

export const DatSignatureElementSchema = DatBaseElementSchema.extend({
	type: z.literal('signature'),
	uid: z.number()
});
export type DatSignatureElement = z.infer<typeof DatSignatureElementSchema>;

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

export const DatTextElementSchema = DatBaseElementSchema.extend({
	type: z.enum(['header', 'header2', 'header3', 'line', 'dottedline', 'paragraph', 'smalltext'])
});
export type DatTextElement = z.infer<typeof DatTextElementSchema>;

export const DatElementSchema = z.discriminatedUnion('type', [
	DatTextElementSchema,
	DatImageElementSchema,
	DatSignatureElementSchema,
	DatCheckboxElementSchema
]);
export type DatElement = z.infer<typeof DatElementSchema>;

export const DatPageSchema = z.object({
	elements: z.array(DatElementSchema),
	effects: z.array(z.unknown()).optional().default([])
});
export type DatPage = z.infer<typeof DatPageSchema>;

export const DatSettingsSchema = z.object({
	noCheckboxWhenStickied: z.boolean().default(false),
	singleSign: z.boolean().default(false)
});
export type DatSettings = z.infer<typeof DatSettingsSchema>;

export const DatFieldsSchema = z.object({
	title: z.string().optional(),
	authorized: z.string().optional(),
	participating: z.string().optional(),
	subjects: z.string().optional(),
	conducted: z.string().optional()
}).passthrough();
export type DatFields = z.infer<typeof DatFieldsSchema>;

export const DatDocumentTypeSchema = z.enum([
	'foundation_research_study',
	'foundation_report'
]);
export type DatDocumentType = z.infer<typeof DatDocumentTypeSchema>;

export const DatDocumentSchema = z.object({
	type: DatDocumentTypeSchema,
	draftId: z.number(),
	date: z.number(),
	creator: z.string().optional(),
	allowScanning: z.boolean().optional().default(true),
	settings: DatSettingsSchema,
	fields: DatFieldsSchema,
	pages: z.array(DatPageSchema),
	signatures: z.array(z.unknown()).default([])
});
export type DatDocument = z.infer<typeof DatDocumentSchema>;
