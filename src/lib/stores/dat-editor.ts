import { writable, derived, get } from 'svelte/store';
import type { DatDocument, DatPage, DatElement, DatElementType } from '$lib/dat/types';

export interface EditorState {
	document: DatDocument | null;
	selectedPageIndex: number;
	selectedElementIndex: number | null;
	isDirty: boolean;
	history: DatDocument[];
	historyIndex: number;
	clipboard: DatElement | null;
}

const initialState: EditorState = {
	document: null,
	selectedPageIndex: 0,
	selectedElementIndex: null,
	isDirty: false,
	history: [],
	historyIndex: -1,
	clipboard: null
};

function createDatEditorStore() {
	const { subscribe, set, update } = writable<EditorState>(initialState);

	function pushHistory(doc: DatDocument) {
		update(state => {
			const newHistory = state.history.slice(0, state.historyIndex + 1);
			newHistory.push(JSON.parse(JSON.stringify(doc)));
			return {
				...state,
				history: newHistory.slice(-50), // Keep last 50 states
				historyIndex: newHistory.length - 1
			};
		});
	}

	return {
		subscribe,

		// Load a document into the editor
		loadDocument(doc: DatDocument) {
			const cloned = JSON.parse(JSON.stringify(doc));
			set({
				document: cloned,
				selectedPageIndex: 0,
				selectedElementIndex: null,
				isDirty: false,
				history: [cloned],
				historyIndex: 0,
				clipboard: null
			});
		},

		// Create a new blank document
		newDocument() {
			const doc: DatDocument = {
				type: 'foundation_research_study',
				draftId: Math.floor(Math.random() * 9000000000000) + 1000000000000,
				date: Math.floor(Date.now() / 1000),
				allowScanning: true,
				settings: {
					noCheckboxWhenStickied: false,
					singleSign: false
				},
				fields: {
					title: 'Untitled Document',
					authorized: '',
					participating: '',
					subjects: '',
					conducted: ''
				},
				pages: [{
					elements: [
						{ type: 'header', content: 'Untitled Document' }
					],
					effects: []
				}],
				signatures: []
			};
			this.loadDocument(doc);
		},

		// Update document and mark dirty
		updateDocument(updater: (doc: DatDocument) => DatDocument) {
			update(state => {
				if (!state.document) return state;
				const newDoc = updater(JSON.parse(JSON.stringify(state.document)));
				pushHistory(newDoc);
				return {
					...state,
					document: newDoc,
					isDirty: true
				};
			});
		},

		// Select a page
		selectPage(index: number) {
			update(state => ({
				...state,
				selectedPageIndex: index,
				selectedElementIndex: null
			}));
		},

		// Select an element
		selectElement(index: number | null) {
			update(state => ({
				...state,
				selectedElementIndex: index
			}));
		},

		// Add a new page
		addPage() {
			this.updateDocument(doc => {
				doc.pages.push({
					elements: [{ type: 'paragraph', content: '' }],
					effects: []
				});
				return doc;
			});
			update(state => ({
				...state,
				selectedPageIndex: state.document?.pages.length ? state.document.pages.length - 1 : 0
			}));
		},

		// Delete a page
		deletePage(index: number) {
			this.updateDocument(doc => {
				if (doc.pages.length > 1) {
					doc.pages.splice(index, 1);
				}
				return doc;
			});
			update(state => ({
				...state,
				selectedPageIndex: Math.min(state.selectedPageIndex, (state.document?.pages.length || 1) - 1)
			}));
		},

		// Duplicate a page
		duplicatePage(index: number) {
			this.updateDocument(doc => {
				const page = JSON.parse(JSON.stringify(doc.pages[index]));
				doc.pages.splice(index + 1, 0, page);
				return doc;
			});
		},

		// Move page
		movePage(fromIndex: number, toIndex: number) {
			this.updateDocument(doc => {
				const [page] = doc.pages.splice(fromIndex, 1);
				doc.pages.splice(toIndex, 0, page);
				return doc;
			});
			update(state => ({
				...state,
				selectedPageIndex: toIndex
			}));
		},

		// Add element to current page
		addElement(type: DatElementType, afterIndex?: number) {
			this.updateDocument(doc => {
				const page = doc.pages[get({ subscribe }).selectedPageIndex];
				if (!page) return doc;

				let element: DatElement;
				switch (type) {
					case 'image':
						element = {
							type: 'image',
							content: 'New Image',
							params: { align: 0.5, scale: 0.5 },
							args: { url: '' }
						};
						break;
					case 'signature':
						element = {
							type: 'signature',
							content: 'Signature Box',
							uid: Math.floor(Math.random() * 999999999)
						};
						break;
					case 'checkbox':
						element = {
							type: 'checkbox',
							content: 'Checkbox',
							params: { toggle: false, rightAlign: false },
							args: { text: 'Checkbox label' }
						};
						break;
					default:
						element = { type, content: type === 'line' ? '' : type === 'dottedline' ? '' : '' };
				}

				const insertIndex = afterIndex !== undefined ? afterIndex + 1 : page.elements.length;
				page.elements.splice(insertIndex, 0, element);
				return doc;
			});
		},

		// Update an element
		updateElement(pageIndex: number, elementIndex: number, updates: Partial<DatElement>) {
			this.updateDocument(doc => {
				const element = doc.pages[pageIndex]?.elements[elementIndex];
				if (element) {
					Object.assign(element, updates);
				}
				return doc;
			});
		},

		// Delete an element
		deleteElement(pageIndex: number, elementIndex: number) {
			this.updateDocument(doc => {
				doc.pages[pageIndex]?.elements.splice(elementIndex, 1);
				return doc;
			});
			update(state => ({
				...state,
				selectedElementIndex: null
			}));
		},

		// Move element within page
		moveElement(pageIndex: number, fromIndex: number, toIndex: number) {
			this.updateDocument(doc => {
				const page = doc.pages[pageIndex];
				if (page) {
					const [element] = page.elements.splice(fromIndex, 1);
					page.elements.splice(toIndex, 0, element);
				}
				return doc;
			});
		},

		// Copy element to clipboard
		copyElement(pageIndex: number, elementIndex: number) {
			update(state => {
				const element = state.document?.pages[pageIndex]?.elements[elementIndex];
				return {
					...state,
					clipboard: element ? JSON.parse(JSON.stringify(element)) : null
				};
			});
		},

		// Paste element from clipboard
		pasteElement(pageIndex: number, afterIndex?: number) {
			const state = get({ subscribe });
			if (!state.clipboard) return;

			this.updateDocument(doc => {
				const page = doc.pages[pageIndex];
				if (page) {
					const element = JSON.parse(JSON.stringify(state.clipboard));
					// Generate new UID for signatures
					if (element.type === 'signature') {
						element.uid = Math.floor(Math.random() * 999999999);
					}
					const insertIndex = afterIndex !== undefined ? afterIndex + 1 : page.elements.length;
					page.elements.splice(insertIndex, 0, element);
				}
				return doc;
			});
		},

		// Undo
		undo() {
			update(state => {
				if (state.historyIndex > 0) {
					const newIndex = state.historyIndex - 1;
					return {
						...state,
						document: JSON.parse(JSON.stringify(state.history[newIndex])),
						historyIndex: newIndex,
						isDirty: true
					};
				}
				return state;
			});
		},

		// Redo
		redo() {
			update(state => {
				if (state.historyIndex < state.history.length - 1) {
					const newIndex = state.historyIndex + 1;
					return {
						...state,
						document: JSON.parse(JSON.stringify(state.history[newIndex])),
						historyIndex: newIndex,
						isDirty: true
					};
				}
				return state;
			});
		},

		// Update document fields
		updateFields(fields: Partial<DatDocument['fields']>) {
			this.updateDocument(doc => {
				doc.fields = { ...doc.fields, ...fields };
				return doc;
			});
		},

		// Update document settings
		updateSettings(settings: Partial<DatDocument['settings']>) {
			this.updateDocument(doc => {
				doc.settings = { ...doc.settings, ...settings };
				return doc;
			});
		},

		// Mark as saved
		markSaved() {
			update(state => ({ ...state, isDirty: false }));
		},

		// Get current document
		getDocument(): DatDocument | null {
			return get({ subscribe }).document;
		},

		// Reset editor
		reset() {
			set(initialState);
		}
	};
}

export const datEditorStore = createDatEditorStore();

// Derived stores for convenience
export const currentPage = derived(datEditorStore, $state =>
	$state.document?.pages[$state.selectedPageIndex] || null
);

export const currentElement = derived(datEditorStore, $state => {
	if ($state.selectedElementIndex === null) return null;
	return $state.document?.pages[$state.selectedPageIndex]?.elements[$state.selectedElementIndex] || null;
});

export const canUndo = derived(datEditorStore, $state => $state.historyIndex > 0);
export const canRedo = derived(datEditorStore, $state => $state.historyIndex < $state.history.length - 1);
