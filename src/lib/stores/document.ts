import { writable, derived } from 'svelte/store';
import type { SCPDocument, ResearchReport, Letter, InterviewLog } from '$lib/schemas';
import { defaultSCPDocument } from '$lib/schemas/scp';
import { defaultResearchReport } from '$lib/schemas/research';
import { defaultLetter } from '$lib/schemas/letter';
import { defaultInterviewLog } from '$lib/schemas/interview';

export type Document = SCPDocument | ResearchReport | Letter | InterviewLog;
export type DocumentType = 'scp' | 'research' | 'letter' | 'interview';

// Create the document store
function createDocumentStore() {
	const { subscribe, set, update } = writable<Document | null>(null);

	return {
		subscribe,
		set,
		update,

		// Initialize a new document of a specific type
		initDocument(type: DocumentType): void {
			switch (type) {
				case 'scp':
					set({ ...defaultSCPDocument });
					break;
				case 'research':
					set({ ...defaultResearchReport });
					break;
				case 'letter':
					set({ ...defaultLetter });
					break;
				case 'interview':
					set({ ...defaultInterviewLog });
					break;
			}
		},

		// Clear the current document
		clear(): void {
			set(null);
		},

		// Save to localStorage (reads current value without triggering update loop)
		save(): void {
			let currentDoc: Document | null = null;
			const unsub = subscribe(d => { currentDoc = d; });
			unsub();

			if (currentDoc && typeof localStorage !== 'undefined') {
				const doc = currentDoc as Document;
				const key = `scp-doc-${doc.type}`;
				localStorage.setItem(key, JSON.stringify(doc));
			}
		},

		// Load from localStorage
		load(type: DocumentType): boolean {
			if (typeof localStorage !== 'undefined') {
				const key = `scp-doc-${type}`;
				const saved = localStorage.getItem(key);
				if (saved) {
					try {
						const doc = JSON.parse(saved);
						set(doc);
						return true;
					} catch {
						return false;
					}
				}
			}
			return false;
		}
	};
}

export const documentStore = createDocumentStore();

// Derived store to check if document is valid (basic check)
export const isDocumentValid = derived(documentStore, ($doc) => {
	if (!$doc) return false;

	switch ($doc.type) {
		case 'scp':
			return !!$doc.itemNumber && !!$doc.containmentProcedures && !!$doc.description;
		case 'research':
			return !!$doc.title && !!$doc.abstract && !!$doc.findings && !!$doc.conclusions;
		case 'letter':
			return !!$doc.subject && !!$doc.body && !!$doc.from.name && !!$doc.to.name;
		case 'interview':
			return !!$doc.logNumber && !!$doc.interviewer.name && !!$doc.interviewee.name;
		default:
			return false;
	}
});
