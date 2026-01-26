import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Breach level (based on scale)
export const BreachLevelSchema = z.enum([
	'alpha',      // Minor, localized
	'beta',       // Significant, contained to site
	'gamma',      // Major, potential external exposure
	'delta',      // Severe, confirmed external exposure
	'epsilon',    // Critical, widespread threat
	'omega'       // Catastrophic, potential K-class scenario
]);
export type BreachLevel = z.infer<typeof BreachLevelSchema>;

// Breach status
export const BreachStatusSchema = z.enum([
	'active',
	'partially-contained',
	'contained',
	'neutralized',
	'ongoing-cleanup'
]);
export type BreachStatus = z.infer<typeof BreachStatusSchema>;

// Response protocols
export const ResponseProtocolSchema = z.enum([
	'standard',
	'lockdown',
	'evacuation',
	'site-wide-alert',
	'mtf-response',
	'nuclear-option',
	'omega-protocol'
]);
export type ResponseProtocol = z.infer<typeof ResponseProtocolSchema>;

// Main Containment Breach Report schema
export const ContainmentBreachSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('breach'),

	// Identification
	breachId: z.string().min(1, 'Breach ID is required'),
	scpNumber: z.string().min(1, 'SCP number is required'),
	scpClass: z.string().optional(),

	// Severity
	breachLevel: BreachLevelSchema,
	status: BreachStatusSchema,
	responseProtocol: ResponseProtocolSchema,

	// When and where
	dateTime: z.string().min(1, 'Date/time is required'),
	originalContainmentSite: z.string().min(1, 'Original containment site is required'),
	currentLocation: z.string().optional(),
	affectedAreas: z.string().optional(),

	// What happened
	breachDescription: z.string().min(1, 'Breach description is required'),
	causeOfBreach: z.string().optional(),
	anomalousBehavior: z.string().optional(),

	// Response
	initialResponse: z.string().optional(),
	containmentEfforts: z.string().optional(),
	respondingUnits: z.string().optional(),

	// Casualties
	personnelCasualties: z.number().default(0),
	civilianExposure: z.number().default(0),

	// Status
	recontainmentStatus: z.string().optional(),
	estimatedRecontainment: z.string().optional(),

	// Authorization
	reportingOfficer: z.string().optional(),
	incidentCommander: z.string().optional(),

	// Display options
	showCasualties: z.boolean().default(true),
	showUrgentBanner: z.boolean().default(true)
});
export type ContainmentBreach = z.infer<typeof ContainmentBreachSchema>;

// Default values
export const defaultContainmentBreach: ContainmentBreach = {
	metadata: {
		faction: 'foundation',
		classification: 'top-secret',
		clearanceLevel: '4'
	},
	type: 'breach',
	breachId: 'CB-XXXX-XXX',
	scpNumber: 'SCP-',
	breachLevel: 'beta',
	status: 'active',
	responseProtocol: 'lockdown',
	dateTime: '',
	originalContainmentSite: '',
	breachDescription: '',
	personnelCasualties: 0,
	civilianExposure: 0,
	showCasualties: true,
	showUrgentBanner: true
};

// Labels for UI
export const BREACH_LEVEL_INFO: Record<BreachLevel, { label: string; color: string; description: string }> = {
	'alpha': { label: 'Alpha', color: '#cccc00', description: 'Minor, localized breach' },
	'beta': { label: 'Beta', color: '#ff8800', description: 'Significant, contained to site' },
	'gamma': { label: 'Gamma', color: '#ff4400', description: 'Major, potential external exposure' },
	'delta': { label: 'Delta', color: '#cc0000', description: 'Severe, confirmed external exposure' },
	'epsilon': { label: 'Epsilon', color: '#990000', description: 'Critical, widespread threat' },
	'omega': { label: 'Omega', color: '#000000', description: 'Catastrophic, potential K-class scenario' }
};

export const BREACH_STATUS_INFO: Record<BreachStatus, { label: string; color: string }> = {
	'active': { label: 'ACTIVE', color: '#cc0000' },
	'partially-contained': { label: 'Partially Contained', color: '#ff8800' },
	'contained': { label: 'Contained', color: '#cccc00' },
	'neutralized': { label: 'Neutralized', color: '#00aa00' },
	'ongoing-cleanup': { label: 'Ongoing Cleanup', color: '#888888' }
};

export const RESPONSE_PROTOCOL_INFO: Record<ResponseProtocol, { label: string }> = {
	'standard': { label: 'Standard Protocol' },
	'lockdown': { label: 'Site Lockdown' },
	'evacuation': { label: 'Evacuation Protocol' },
	'site-wide-alert': { label: 'Site-Wide Alert' },
	'mtf-response': { label: 'MTF Response Required' },
	'nuclear-option': { label: 'Nuclear Option Authorized' },
	'omega-protocol': { label: 'Omega Protocol' }
};
