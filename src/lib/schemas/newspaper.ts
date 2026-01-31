import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const ArticleTypeSchema = z.enum([
	'breaking-news',
	'local-news',
	'national',
	'international',
	'opinion',
	'science',
	'obituary',
	'classified-ad'
]);
export type ArticleType = z.infer<typeof ArticleTypeSchema>;

export const PaperStyleSchema = z.enum([
	'broadsheet',
	'tabloid',
	'vintage',
	'modern'
]);
export type PaperStyle = z.infer<typeof PaperStyleSchema>;

export const NewspaperClippingSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('newspaper'),
	publicationName: z.string().min(1, 'Publication name is required'),
	publicationDate: z.string().optional(),
	edition: z.string().optional(),
	pageNumber: z.string().optional(),
	articleType: ArticleTypeSchema,
	headline: z.string().min(1, 'Headline is required'),
	subheadline: z.string().optional(),
	byline: z.string().optional(),
	dateline: z.string().optional(),
	leadParagraph: z.string().optional(),
	bodyContent: z.string().min(1, 'Article content is required'),
	pullQuote: z.string().optional(),
	relatedSCP: z.string().optional(),
	coverStoryNotes: z.string().optional(),
	paperStyle: PaperStyleSchema.default('broadsheet'),
	showPhotoPlaceholder: z.boolean().default(true),
	photoCaption: z.string().optional(),
	showAgedEffect: z.boolean().default(true),
	showTornEdges: z.boolean().default(false),
	showHighlighting: z.boolean().default(false)
});
export type NewspaperClipping = z.infer<typeof NewspaperClippingSchema>;

export const defaultNewspaperClipping: NewspaperClipping = {
	metadata: {
		faction: 'foundation',
		classification: 'restricted'
	},
	type: 'newspaper',
	publicationName: 'The Daily Herald',
	articleType: 'local-news',
	headline: '',
	bodyContent: '',
	paperStyle: 'broadsheet',
	showPhotoPlaceholder: true,
	showAgedEffect: true,
	showTornEdges: false,
	showHighlighting: false
};

export const ARTICLE_TYPE_INFO: Record<ArticleType, { label: string }> = {
	'breaking-news': { label: 'Breaking News' },
	'local-news': { label: 'Local News' },
	'national': { label: 'National' },
	'international': { label: 'International' },
	'opinion': { label: 'Opinion/Editorial' },
	'science': { label: 'Science & Technology' },
	'obituary': { label: 'Obituary' },
	'classified-ad': { label: 'Classified Ad' }
};

export const PAPER_STYLE_INFO: Record<PaperStyle, { label: string; description: string }> = {
	'broadsheet': { label: 'Broadsheet', description: 'Traditional newspaper format' },
	'tabloid': { label: 'Tabloid', description: 'Smaller, sensational format' },
	'vintage': { label: 'Vintage', description: '1920s-1950s style' },
	'modern': { label: 'Modern', description: 'Contemporary digital-age style' }
};
