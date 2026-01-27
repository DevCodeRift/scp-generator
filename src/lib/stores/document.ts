import { writable, derived } from 'svelte/store';
import type { SCPDocument, ResearchReport, Letter, InterviewLog, PersonnelFile, IncidentReport, MissionBriefing, ContainmentBreach, AnomalyCard, ExplorationLog, AutopsyReport, Directive, NewspaperClipping, AVLog, IDBadge } from '$lib/schemas';
import { defaultSCPDocument } from '$lib/schemas/scp';
import { defaultResearchReport } from '$lib/schemas/research';
import { defaultLetter } from '$lib/schemas/letter';
import { defaultInterviewLog } from '$lib/schemas/interview';
import { defaultPersonnelFile } from '$lib/schemas/personnel';
import { defaultIncidentReport } from '$lib/schemas/incident';
import { defaultMissionBriefing } from '$lib/schemas/mission';
import { defaultContainmentBreach } from '$lib/schemas/breach';
import { defaultAnomalyCard } from '$lib/schemas/anomaly-card';
import { defaultExplorationLog } from '$lib/schemas/exploration';
import { defaultAutopsyReport } from '$lib/schemas/autopsy';
import { defaultDirective } from '$lib/schemas/directive';
import { defaultNewspaperClipping } from '$lib/schemas/newspaper';
import { defaultAVLog } from '$lib/schemas/avlog';
import { defaultIDBadge } from '$lib/schemas/id-badge';

export type Document = SCPDocument | ResearchReport | Letter | InterviewLog | PersonnelFile | IncidentReport | MissionBriefing | ContainmentBreach | AnomalyCard | ExplorationLog | AutopsyReport | Directive | NewspaperClipping | AVLog | IDBadge;
export type DocumentType = 'scp' | 'research' | 'letter' | 'interview' | 'personnel' | 'incident' | 'mission' | 'breach' | 'anomaly-card' | 'exploration' | 'autopsy' | 'directive' | 'newspaper' | 'avlog' | 'id-badge';

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
				case 'personnel':
					set({ ...defaultPersonnelFile });
					break;
				case 'incident':
					set({ ...defaultIncidentReport });
					break;
				case 'mission':
					set({ ...defaultMissionBriefing });
					break;
				case 'breach':
					set({ ...defaultContainmentBreach });
					break;
				case 'anomaly-card':
					set({ ...defaultAnomalyCard });
					break;
				case 'exploration':
					set({ ...defaultExplorationLog });
					break;
				case 'autopsy':
					set({ ...defaultAutopsyReport });
					break;
				case 'directive':
					set({ ...defaultDirective });
					break;
				case 'newspaper':
					set({ ...defaultNewspaperClipping });
					break;
				case 'avlog':
					set({ ...defaultAVLog });
					break;
				case 'id-badge':
					set({ ...defaultIDBadge });
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
		case 'personnel':
			return !!$doc.staffId && !!$doc.fullName;
		case 'incident':
			return !!$doc.incidentNumber && !!$doc.summary && !!$doc.location;
		case 'mission':
			return !!$doc.missionCode && !!$doc.objective && !!$doc.operationArea;
		case 'breach':
			return !!$doc.breachId && !!$doc.scpNumber && !!$doc.breachDescription;
		case 'anomaly-card':
			return !!$doc.itemNumber && !!$doc.briefDescription;
		case 'exploration':
			return !!$doc.logNumber && !!$doc.teamDesignation;
		case 'autopsy':
			return !!$doc.caseNumber && !!$doc.subjectDesignation;
		case 'directive':
			return !!$doc.directiveNumber && !!$doc.subject && !!$doc.directiveContent;
		case 'newspaper':
			return !!$doc.publicationName && !!$doc.headline && !!$doc.bodyContent;
		case 'avlog':
			return !!$doc.logDesignation;
		case 'id-badge':
			return !!$doc.staffId && !!$doc.fullName;
		default:
			return false;
	}
});
