import { DatDocumentSchema, type DatDocument } from './types';

/**
 * Parse a raw JSON string (from a .dat file) into a validated DatDocument.
 * Throws a descriptive error if parsing or validation fails.
 */
export function parseDatFile(rawContent: string): DatDocument {
	let json: unknown;
	try {
		json = JSON.parse(rawContent);
	} catch (e) {
		throw new Error(`Invalid JSON in .dat file: ${e instanceof Error ? e.message : 'Unknown parse error'}`);
	}

	const result = DatDocumentSchema.safeParse(json);
	if (!result.success) {
		const issues = result.error.issues
			.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
			.join('\n');
		throw new Error(`Invalid .dat document structure:\n${issues}`);
	}

	return result.data;
}

/**
 * Read a File object (from a file input / drag-and-drop) and parse it as a DatDocument.
 */
export async function parseDatFileFromUpload(file: File): Promise<DatDocument> {
	const text = await file.text();
	return parseDatFile(text);
}

/**
 * Extract a human-readable title from a DatDocument.
 * Uses the fields.title if available, otherwise derives from the first header element.
 */
export function getDatDocumentTitle(doc: DatDocument): string {
	if (doc.fields.title) {
		return doc.fields.title.trim();
	}

	// Fall back to first header element content
	for (const page of doc.pages) {
		for (const el of page.elements) {
			if (el.type === 'header' || el.type === 'header2' || el.type === 'header3') {
				const text = el.content.trim();
				if (text && text !== 'New Header') {
					return text;
				}
			}
		}
	}

	return 'Untitled Document';
}

/**
 * Get summary statistics for a DatDocument.
 */
export function getDatDocumentStats(doc: DatDocument) {
	let totalElements = 0;
	let signatures = 0;
	let images = 0;
	let checkboxes = 0;

	for (const page of doc.pages) {
		totalElements += page.elements.length;
		for (const el of page.elements) {
			if (el.type === 'signature') signatures++;
			if (el.type === 'image') images++;
			if (el.type === 'checkbox') checkboxes++;
		}
	}

	return {
		pages: doc.pages.length,
		totalElements,
		signatures,
		images,
		checkboxes,
		type: doc.type,
		date: doc.date ? new Date(doc.date * 1000) : null
	};
}
