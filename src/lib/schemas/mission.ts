import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Mission priority levels
export const MissionPrioritySchema = z.enum([
	'low',
	'standard',
	'high',
	'critical',
	'omega'
]);
export type MissionPriority = z.infer<typeof MissionPrioritySchema>;

// Mission status
export const MissionStatusSchema = z.enum([
	'planning',
	'briefed',
	'in-progress',
	'completed',
	'failed',
	'aborted',
	'classified'
]);
export type MissionStatus = z.infer<typeof MissionStatusSchema>;

// Mission type
export const MissionTypeSchema = z.enum([
	'containment',
	'recovery',
	'reconnaissance',
	'extraction',
	'elimination',
	'protection',
	'investigation',
	'support',
	'other'
]);
export type MissionType = z.infer<typeof MissionTypeSchema>;

// Team member
export const TeamMemberSchema = z.object({
	callsign: z.string(),
	role: z.string(),
	notes: z.string().optional()
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Main Mission Briefing schema
export const MissionBriefingSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('mission'),

	// Mission identification
	missionCode: z.string().min(1, 'Mission code is required'),
	missionName: z.string().optional(),
	missionType: MissionTypeSchema,
	priority: MissionPrioritySchema,
	status: MissionStatusSchema,

	// Assignment
	assignedTeam: z.string().min(1, 'Assigned team is required'),
	teamLeader: z.string().optional(),
	teamMembers: z.array(TeamMemberSchema).default([]),

	// Timing
	dateIssued: z.string().optional(),
	deploymentDate: z.string().optional(),
	expectedDuration: z.string().optional(),

	// Location
	operationArea: z.string().min(1, 'Operation area is required'),
	insertionPoint: z.string().optional(),
	extractionPoint: z.string().optional(),

	// Mission details
	objective: z.string().min(1, 'Objective is required'),
	secondaryObjectives: z.string().optional(),
	backgroundIntel: z.string().optional(),
	threatAssessment: z.string().optional(),

	// Equipment and rules
	authorizedEquipment: z.string().optional(),
	rulesOfEngagement: z.string().optional(),
	contingencyProtocols: z.string().optional(),

	// Related entities
	relatedSCPs: z.string().optional(),

	// Authorization
	authorizedBy: z.string().optional(),

	// Display options
	showTeamRoster: z.boolean().default(true),
	showThreatLevel: z.boolean().default(true)
});
export type MissionBriefing = z.infer<typeof MissionBriefingSchema>;

// Default values
export const defaultMissionBriefing: MissionBriefing = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'mission',
	missionCode: 'OP-XXXX-XXX',
	missionType: 'containment',
	priority: 'standard',
	status: 'planning',
	assignedTeam: 'MTF ',
	operationArea: '',
	objective: '',
	teamMembers: [],
	showTeamRoster: true,
	showThreatLevel: true
};

// Labels for UI
export const MISSION_PRIORITY_INFO: Record<MissionPriority, { label: string; color: string }> = {
	'low': { label: 'Low Priority', color: '#00aa00' },
	'standard': { label: 'Standard', color: '#cccc00' },
	'high': { label: 'High Priority', color: '#ff8800' },
	'critical': { label: 'Critical', color: '#cc0000' },
	'omega': { label: 'Omega Priority', color: '#660000' }
};

export const MISSION_STATUS_INFO: Record<MissionStatus, { label: string; color: string }> = {
	'planning': { label: 'Planning', color: '#888888' },
	'briefed': { label: 'Briefed', color: '#0088cc' },
	'in-progress': { label: 'In Progress', color: '#cccc00' },
	'completed': { label: 'Completed', color: '#00aa00' },
	'failed': { label: 'Failed', color: '#cc0000' },
	'aborted': { label: 'Aborted', color: '#ff8800' },
	'classified': { label: 'Classified', color: '#000000' }
};

export const MISSION_TYPE_INFO: Record<MissionType, { label: string }> = {
	'containment': { label: 'Containment Operation' },
	'recovery': { label: 'Recovery Operation' },
	'reconnaissance': { label: 'Reconnaissance' },
	'extraction': { label: 'Extraction' },
	'elimination': { label: 'Elimination' },
	'protection': { label: 'Protection Detail' },
	'investigation': { label: 'Investigation' },
	'support': { label: 'Support Operation' },
	'other': { label: 'Other' }
};
