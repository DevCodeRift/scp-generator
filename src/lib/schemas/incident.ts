import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Incident severity levels
export const IncidentSeveritySchema = z.enum([
	'minor',
	'moderate',
	'major',
	'critical',
	'catastrophic'
]);
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>;

// Incident status
export const IncidentStatusSchema = z.enum([
	'ongoing',
	'contained',
	'resolved',
	'under-investigation',
	'classified'
]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

// Incident type
export const IncidentTypeSchema = z.enum([
	'containment-breach',
	'security-breach',
	'anomalous-event',
	'personnel-incident',
	'equipment-failure',
	'external-threat',
	'information-leak',
	'other'
]);
export type IncidentType = z.infer<typeof IncidentTypeSchema>;

// Casualty info
export const CasualtySchema = z.object({
	fatalities: z.number().default(0),
	injuries: z.number().default(0),
	missing: z.number().default(0),
	amnesticized: z.number().default(0)
});
export type Casualty = z.infer<typeof CasualtySchema>;

// Main Incident Report schema
export const IncidentReportSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('incident'),

	// Identification
	incidentNumber: z.string().min(1, 'Incident number is required'),
	incidentType: IncidentTypeSchema,
	severity: IncidentSeveritySchema,
	status: IncidentStatusSchema,

	// When and where
	dateOccurred: z.string().min(1, 'Date is required'),
	timeOccurred: z.string().optional(),
	location: z.string().min(1, 'Location is required'),

	// Related entities
	relatedSCPs: z.string().optional(),
	personnelInvolved: z.string().optional(),
	respondingTeams: z.string().optional(),

	// Report content
	summary: z.string().min(1, 'Summary is required'),
	timeline: z.string().optional(),
	containmentActions: z.string().optional(),
	damage: z.string().optional(),
	casualties: CasualtySchema.default({ fatalities: 0, injuries: 0, missing: 0, amnesticized: 0 }),

	// Follow-up
	recommendations: z.string().optional(),
	lessonsLearned: z.string().optional(),

	// Report metadata
	reportedBy: z.string().optional(),
	approvedBy: z.string().optional(),

	// Display options
	showCasualties: z.boolean().default(true),
	showTimeline: z.boolean().default(true)
});
export type IncidentReport = z.infer<typeof IncidentReportSchema>;

// Default values
export const defaultIncidentReport: IncidentReport = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'incident',
	incidentNumber: 'INC-XXXX-XXX',
	incidentType: 'anomalous-event',
	severity: 'moderate',
	status: 'under-investigation',
	dateOccurred: '',
	location: '',
	summary: '',
	casualties: { fatalities: 0, injuries: 0, missing: 0, amnesticized: 0 },
	showCasualties: true,
	showTimeline: true
};

// Labels for UI
export const INCIDENT_SEVERITY_INFO: Record<IncidentSeverity, { label: string; color: string }> = {
	'minor': { label: 'Minor', color: '#00aa00' },
	'moderate': { label: 'Moderate', color: '#cccc00' },
	'major': { label: 'Major', color: '#ff8800' },
	'critical': { label: 'Critical', color: '#cc0000' },
	'catastrophic': { label: 'Catastrophic', color: '#660000' }
};

export const INCIDENT_STATUS_INFO: Record<IncidentStatus, { label: string; color: string }> = {
	'ongoing': { label: 'Ongoing', color: '#cc0000' },
	'contained': { label: 'Contained', color: '#ff8800' },
	'resolved': { label: 'Resolved', color: '#00aa00' },
	'under-investigation': { label: 'Under Investigation', color: '#cccc00' },
	'classified': { label: 'Classified', color: '#888888' }
};

export const INCIDENT_TYPE_INFO: Record<IncidentType, { label: string }> = {
	'containment-breach': { label: 'Containment Breach' },
	'security-breach': { label: 'Security Breach' },
	'anomalous-event': { label: 'Anomalous Event' },
	'personnel-incident': { label: 'Personnel Incident' },
	'equipment-failure': { label: 'Equipment Failure' },
	'external-threat': { label: 'External Threat' },
	'information-leak': { label: 'Information Leak' },
	'other': { label: 'Other' }
};
