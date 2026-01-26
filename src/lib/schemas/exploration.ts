import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Exploration status
export const ExplorationStatusSchema = z.enum([
	'in-progress',
	'completed',
	'aborted',
	'lost-contact',
	'casualties'
]);
export type ExplorationStatus = z.infer<typeof ExplorationStatusSchema>;

// Environment type
export const EnvironmentTypeSchema = z.enum([
	'extradimensional',
	'subterranean',
	'aquatic',
	'aerial',
	'urban',
	'wilderness',
	'arctic',
	'desert',
	'anomalous-space',
	'pocket-dimension',
	'other'
]);
export type EnvironmentType = z.infer<typeof EnvironmentTypeSchema>;

// Waypoint entry
export const WaypointSchema = z.object({
	id: z.string(),
	timestamp: z.string(),
	designation: z.string(),
	description: z.string(),
	hazards: z.string().optional(),
	discoveries: z.string().optional(),
	personnelStatus: z.string().optional()
});
export type Waypoint = z.infer<typeof WaypointSchema>;

// Main Exploration Log schema
export const ExplorationLogSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('exploration'),

	// Mission info
	logNumber: z.string().min(1, 'Log number is required'),
	missionTitle: z.string().optional(),
	relatedSCP: z.string().optional(),
	environmentType: EnvironmentTypeSchema,
	status: ExplorationStatusSchema,

	// Team
	teamDesignation: z.string().min(1, 'Team designation is required'),
	teamLeader: z.string().optional(),
	teamMembers: z.string().optional(),
	equipmentList: z.string().optional(),

	// Mission details
	missionDate: z.string().optional(),
	entryPoint: z.string().optional(),
	objectives: z.string().optional(),

	// Log entries / waypoints
	waypoints: z.array(WaypointSchema).default([]),

	// Outcome
	finalNotes: z.string().optional(),
	recoveredMaterials: z.string().optional(),
	recommendedActions: z.string().optional(),

	// Display options
	showHandwrittenStyle: z.boolean().default(true),
	showDamageEffects: z.boolean().default(false),
	showTimestamps: z.boolean().default(true)
});
export type ExplorationLog = z.infer<typeof ExplorationLogSchema>;

// Default values
export const defaultExplorationLog: ExplorationLog = {
	metadata: {
		faction: 'foundation',
		classification: 'secret',
		clearanceLevel: '3'
	},
	type: 'exploration',
	logNumber: 'EXPL-XXXX',
	environmentType: 'extradimensional',
	status: 'in-progress',
	teamDesignation: '',
	waypoints: [],
	showHandwrittenStyle: true,
	showDamageEffects: false,
	showTimestamps: true
};

// Info labels
export const EXPLORATION_STATUS_INFO: Record<ExplorationStatus, { label: string; color: string }> = {
	'in-progress': { label: 'In Progress', color: '#0088cc' },
	'completed': { label: 'Completed', color: '#00aa00' },
	'aborted': { label: 'Aborted', color: '#ff8800' },
	'lost-contact': { label: 'Lost Contact', color: '#cc0000' },
	'casualties': { label: 'Casualties Reported', color: '#660000' }
};

export const ENVIRONMENT_TYPE_INFO: Record<EnvironmentType, { label: string }> = {
	'extradimensional': { label: 'Extradimensional Space' },
	'subterranean': { label: 'Subterranean/Underground' },
	'aquatic': { label: 'Aquatic/Underwater' },
	'aerial': { label: 'Aerial/Atmospheric' },
	'urban': { label: 'Urban Environment' },
	'wilderness': { label: 'Wilderness/Forest' },
	'arctic': { label: 'Arctic/Polar' },
	'desert': { label: 'Desert/Arid' },
	'anomalous-space': { label: 'Anomalous Space' },
	'pocket-dimension': { label: 'Pocket Dimension' },
	'other': { label: 'Other/Unknown' }
};
