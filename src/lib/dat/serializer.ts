import type { DatDocument, DatElement, DatPage, DatDocumentType } from './types';
import type { Document } from '$lib/stores/document';

/**
 * Serialize a DatDocument back to a JSON string suitable for saving as a .dat file.
 */
export function serializeDatDocument(doc: DatDocument): string {
	return JSON.stringify(doc);
}

/**
 * Trigger a browser download of a DatDocument as a .dat file.
 */
export function downloadDatFile(doc: DatDocument, filename?: string): void {
	const json = serializeDatDocument(doc);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename || `${doc.fields.title || 'document'}.dat`;
	link.click();
	URL.revokeObjectURL(url);
}

/**
 * Generate a pseudo-random draft ID (mimics Gmod's ID format).
 */
function generateDraftId(): number {
	return Math.floor(Math.random() * 9000000000000) + 1000000000000;
}

/**
 * Helper to create a text element.
 */
function textEl(type: 'header' | 'header2' | 'header3' | 'paragraph' | 'smalltext', content: string): DatElement {
	return { type, content };
}

/**
 * Helper to create a line separator.
 */
function lineEl(): DatElement {
	return { type: 'line', content: 'New Line' };
}

/**
 * Helper to create a dotted line separator.
 */
function dottedLineEl(): DatElement {
	return { type: 'dottedline', content: 'New Dotted Line' };
}

/**
 * Helper to create a signature box.
 */
function signatureEl(): DatElement {
	return {
		type: 'signature',
		content: 'New Signature Box',
		uid: Math.floor(Math.random() * 999999999)
	};
}

/**
 * Convert an app Document into a DatDocument for export.
 * Maps each app document type to a multi-page .dat structure.
 */
export function convertAppDocumentToDat(doc: Document): DatDocument {
	const pages: DatPage[] = [];
	let title = 'Untitled';
	let datType: DatDocumentType = 'foundation_research_study';

	switch (doc.type) {
		case 'scp': {
			title = `SCP-${doc.itemNumber || 'XXXX'}`;
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('header3', `Object Class: ${doc.objectClass || 'Unknown'}`),
				lineEl(),
				textEl('paragraph', `Clearance Level: ${doc.metadata.clearanceLevel || '3'}`)
			]));
			if (doc.containmentProcedures) {
				pages.push(makePage([
					textEl('header', 'Special Containment Procedures'),
					lineEl(),
					textEl('smalltext', doc.containmentProcedures)
				]));
			}
			if (doc.description) {
				pages.push(makePage([
					textEl('header', 'Description'),
					lineEl(),
					textEl('smalltext', doc.description)
				]));
			}
			if (doc.addenda && doc.addenda.length > 0) {
				for (const addendum of doc.addenda) {
					pages.push(makePage([
						textEl('header2', `Addendum: ${addendum.title || ''}`),
						lineEl(),
						textEl('smalltext', addendum.content || '')
					]));
				}
			}
			break;
		}

		case 'research': {
			title = doc.title || 'Research Report';
			datType = 'foundation_research_study';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Report #${doc.reportNumber || 'XXXX'}`),
				textEl('smalltext', `Department: ${doc.department || 'N/A'}`),
				textEl('smalltext', `Lead Researcher: ${doc.leadResearcher || 'N/A'}`)
			]));
			if (doc.abstract) {
				pages.push(makePage([
					textEl('header2', 'Abstract'),
					lineEl(),
					textEl('smalltext', doc.abstract)
				]));
			}
			if (doc.methodology) {
				pages.push(makePage([
					textEl('header2', 'Methodology'),
					lineEl(),
					textEl('smalltext', doc.methodology)
				]));
			}
			if (doc.findings) {
				pages.push(makePage([
					textEl('header2', 'Findings'),
					lineEl(),
					textEl('smalltext', doc.findings)
				]));
			}
			if (doc.conclusions) {
				pages.push(makePage([
					textEl('header2', 'Conclusions'),
					lineEl(),
					textEl('smalltext', doc.conclusions)
				]));
			}
			break;
		}

		case 'letter': {
			title = doc.subject || 'Memorandum';
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', 'INTERNAL MEMORANDUM'),
				lineEl(),
				textEl('paragraph', `Subject: ${doc.subject}`),
				textEl('smalltext', `From: ${doc.from.name} - ${doc.from.title || ''}`),
				textEl('smalltext', `To: ${doc.to.name} - ${doc.to.title || ''}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`),
				lineEl(),
				textEl('smalltext', doc.body || '')
			]));
			break;
		}

		case 'interview': {
			title = `Interview Log ${doc.logNumber || 'XXXX'}`;
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('smalltext', `Interviewer: ${doc.interviewer.name || 'N/A'}`),
				textEl('smalltext', `Interviewee: ${doc.interviewee.name || 'N/A'}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`),
				textEl('smalltext', `Location: ${doc.location || 'N/A'}`)
			]));
			if (doc.transcript && doc.transcript.length > 0) {
				const transcriptElements: DatElement[] = [
					textEl('header2', 'Transcript'),
					lineEl()
				];
				for (const entry of doc.transcript) {
					transcriptElements.push(
						textEl('paragraph', `${entry.speaker}:`),
						textEl('smalltext', entry.content || '[No content]'),
						lineEl()
					);
				}
				pages.push(makePage(transcriptElements));
			}
			break;
		}

		case 'personnel': {
			title = `Personnel File: ${doc.fullName || 'Unknown'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Staff ID: ${doc.staffId || 'N/A'}`),
				textEl('smalltext', `Position: ${doc.position || 'N/A'}`),
				textEl('smalltext', `Department: ${doc.department || 'N/A'}`),
				textEl('smalltext', `Clearance Level: ${doc.clearanceLevel || 'N/A'}`)
			]));
			if (doc.background) {
				pages.push(makePage([
					textEl('header2', 'Background'),
					lineEl(),
					textEl('smalltext', doc.background)
				]));
			}
			break;
		}

		case 'incident': {
			title = `Incident Report ${doc.incidentNumber || 'XXXX'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Location: ${doc.location || 'N/A'}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`),
				lineEl(),
				textEl('header2', 'Summary'),
				lineEl(),
				textEl('smalltext', doc.summary || '')
			]));
			if (doc.eventDescription) {
				pages.push(makePage([
					textEl('header2', 'Event Description'),
					lineEl(),
					textEl('smalltext', doc.eventDescription)
				]));
			}
			break;
		}

		case 'mission': {
			title = `Mission Briefing: ${doc.missionCode || 'XXXX'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Objective: ${doc.objective || 'N/A'}`),
				textEl('smalltext', `Operation Area: ${doc.operationArea || 'N/A'}`),
				textEl('smalltext', `Team: ${doc.teamDesignation || 'N/A'}`)
			]));
			break;
		}

		case 'breach': {
			title = `Containment Breach ${doc.breachId || 'XXXX'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `SCP: ${doc.scpNumber || 'N/A'}`),
				textEl('smalltext', `Status: ${doc.status || 'N/A'}`),
				lineEl(),
				textEl('header2', 'Breach Description'),
				lineEl(),
				textEl('smalltext', doc.breachDescription || '')
			]));
			break;
		}

		case 'anomaly-card': {
			title = `Anomaly Card: SCP-${doc.itemNumber || 'XXXX'}`;
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('smalltext', doc.briefDescription || '')
			]));
			break;
		}

		case 'exploration': {
			title = `Exploration Log ${doc.logNumber || 'XXXX'}`;
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Team: ${doc.teamDesignation || 'N/A'}`),
				textEl('smalltext', `Location: ${doc.location || 'N/A'}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`)
			]));
			break;
		}

		case 'autopsy': {
			title = `Autopsy Report ${doc.caseNumber || 'XXXX'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Subject: ${doc.subjectDesignation || 'N/A'}`),
				textEl('smalltext', `Examiner: ${doc.examiner || 'N/A'}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`)
			]));
			break;
		}

		case 'directive': {
			title = `O5 Directive ${doc.directiveNumber || 'XXXX'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', title),
				lineEl(),
				textEl('paragraph', `Subject: ${doc.subject || 'N/A'}`),
				textEl('smalltext', `Date: ${doc.date || 'N/A'}`),
				lineEl(),
				textEl('smalltext', doc.directiveContent || '')
			]));
			pages.push(makePage([
				textEl('header2', 'Authorization'),
				lineEl(),
				signatureEl()
			]));
			break;
		}

		case 'newspaper': {
			title = doc.headline || 'News Article';
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', doc.publicationName || 'The Daily'),
				lineEl(),
				textEl('header2', title),
				textEl('smalltext', `By ${doc.author || 'Unknown'} | ${doc.date || 'N/A'}`),
				lineEl(),
				textEl('smalltext', doc.bodyContent || '')
			]));
			break;
		}

		case 'avlog': {
			title = doc.logDesignation || 'AV-LOG-XXXX';
			pages.push(makePage([
				textEl('header', `Audio/Video Log: ${title}`),
				lineEl(),
				textEl('paragraph', `Media Type: ${doc.mediaType}`),
				textEl('smalltext', `Quality: ${doc.recordingQuality}`),
				textEl('smalltext', `Duration: ${doc.duration || 'N/A'}`),
				textEl('smalltext', `Location: ${doc.location || 'N/A'}`)
			]));
			if (doc.transcript && doc.transcript.length > 0) {
				const transcriptElements: DatElement[] = [
					textEl('header2', 'Transcript'),
					lineEl()
				];
				for (const entry of doc.transcript) {
					if (entry.isRedacted) {
						transcriptElements.push(
							textEl('paragraph', `[${entry.timestamp || '??:??:??'}] ${entry.speaker}: [REDACTED]`)
						);
					} else {
						transcriptElements.push(
							textEl('paragraph', `[${entry.timestamp || '??:??:??'}] ${entry.speaker}:`),
							textEl('smalltext', entry.content || '')
						);
					}
				}
				pages.push(makePage(transcriptElements));
			}
			break;
		}

		case 'id-badge': {
			title = `ID Badge: ${doc.fullName || 'Unknown'}`;
			datType = 'foundation_report';
			pages.push(makePage([
				textEl('header', 'IDENTIFICATION BADGE'),
				lineEl(),
				textEl('paragraph', `Name: ${doc.fullName || 'N/A'}`),
				textEl('smalltext', `Staff ID: ${doc.staffId || 'N/A'}`),
				textEl('smalltext', `Department: ${doc.department || 'N/A'}`),
				textEl('smalltext', `Clearance Level: ${doc.clearanceLevel || 'N/A'}`)
			]));
			break;
		}

		default:
			pages.push(makePage([
				textEl('header', 'Exported Document'),
				lineEl(),
				textEl('smalltext', 'This document was exported from the SCP Document Generator.')
			]));
	}

	// Ensure at least one page exists
	if (pages.length === 0) {
		pages.push(makePage([textEl('header', title)]));
	}

	return {
		type: datType,
		draftId: generateDraftId(),
		date: Math.floor(Date.now() / 1000),
		settings: {
			noCheckboxWhenStickied: false,
			singleSign: false
		},
		fields: {
			title,
			authorized: '- N/A',
			participating: '- N/A',
			subjects: '- N/A',
			conducted: '- N/A'
		},
		pages,
		signatures: []
	};
}

function makePage(elements: DatElement[]): DatPage {
	return { elements, effects: [] };
}
