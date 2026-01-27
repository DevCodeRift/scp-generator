/**
 * Core generator type definitions
 */

// Base generator interface
export interface Generator<TConfig, TOutput> {
	name: string;
	description: string;
	defaultConfig: TConfig;
	generate(config: TConfig, seed?: number): TOutput;
	// Optional: convert output to an existing document type
	outputToDocument?(output: TOutput): unknown;
}

// Generated content with metadata
export interface GeneratedContent<T> {
	data: T;
	seed: number;
	timestamp: string;
}

// NPC Types
export type NPCRole = 'researcher' | 'mtf' | 'd-class' | 'security' | 'administrative' | 'medical';

export interface NPCConfig {
	role: NPCRole;
	includeBackground: boolean;
	includeQuirks: boolean;
	clearanceLevel?: number;
}

export interface GeneratedNPC {
	name: string;
	designation: string;
	role: NPCRole;
	clearanceLevel: number;
	department?: string;
	site?: string;
	background?: string;
	quirks?: string[];
	specializations?: string[];
}

// SCP Types
export type ObjectClass = 'Safe' | 'Euclid' | 'Keter' | 'Thaumiel' | 'Neutralized' | 'Apollyon' | 'Archon';
export type DisruptionClass = 'Dark' | 'Vlam' | 'Keneq' | 'Ekhi' | 'Amida';
export type RiskClass = 'Notice' | 'Caution' | 'Warning' | 'Danger' | 'Critical';
export type AnomalyCategory =
	| 'Biological' | 'Mechanical' | 'Spatial' | 'Temporal'
	| 'Memetic' | 'Cognitohazardous' | 'Infohazardous'
	| 'Reality-Bending' | 'Extradimensional' | 'Spectral'
	| 'Technological' | 'Organic' | 'Mineral' | 'Aquatic' | 'Atmospheric';

export interface SCPConfig {
	objectClass?: ObjectClass;
	category?: AnomalyCategory;
	complexity: 'minimal' | 'standard' | 'detailed';
	includeSecondaryEffects: boolean;
	includeOrigin: boolean;
	includeSpecialRequirements: boolean;
}

export interface GeneratedSCP {
	itemNumber: string;
	objectClass: ObjectClass;
	disruptionClass: DisruptionClass;
	riskClass: RiskClass;
	category: AnomalyCategory;
	containmentSite: string;
	containmentProcedures: string[];
	description: string;
	additionalNotes?: string[];
}

// Artifact Types
export interface ArtifactConfig {
	minorOnly: boolean;
	includeDrawbacks: boolean;
}

export interface GeneratedArtifact {
	name: string;
	form: string;
	material?: string;
	primaryEffect: string;
	activation?: string;
	drawback?: string;
	origin?: string;
}

// Event Types
export type EventSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type EventType =
	| 'containment-breach'
	| 'anomalous-manifestation'
	| 'security-incident'
	| 'equipment-malfunction'
	| 'personnel-incident'
	| 'external-threat'
	| 'dimensional-anomaly'
	| 'cognitohazard-exposure'
	| 'facility-emergency';

export interface EventConfig {
	severity?: EventSeverity;
	eventType?: EventType;
}

export interface GeneratedEvent {
	title: string;
	severity: EventSeverity;
	eventType: string;
	description: string;
	immediateEffects: string[];
	complications?: string[];
	suggestedResponse?: string;
}

// Facility Map Types
export type RoomType =
	| 'containment-cell'
	| 'corridor'
	| 'office'
	| 'laboratory'
	| 'security-checkpoint'
	| 'medical-bay'
	| 'cafeteria'
	| 'storage'
	| 'elevator'
	| 'stairs'
	| 'server-room'
	| 'armory';

export interface FacilityConfig {
	width: number;
	height: number;
	density: 'sparse' | 'normal' | 'dense';
	includeContainment: boolean;
	floorLevel: number;
}

export interface FacilityRoom {
	id: string;
	type: RoomType;
	x: number;
	y: number;
	width: number;
	height: number;
	label?: string;
	securityLevel?: number;
}

export interface FacilityConnection {
	from: string;
	to: string;
	type: 'door' | 'security-door' | 'airlock' | 'open';
}

export interface GeneratedFacility {
	name: string;
	floorLevel: number;
	rooms: FacilityRoom[];
	connections: FacilityConnection[];
	gridWidth: number;
	gridHeight: number;
}

// Location Types
export type LocationCategory = 'anomalous-site' | 'goi-facility' | 'dimensional' | 'extradimensional';

export interface LocationConfig {
	category?: LocationCategory;
	dangerLevel: 'safe' | 'moderate' | 'dangerous' | 'extreme';
}

export interface GeneratedLocation {
	name: string;
	category: LocationCategory;
	description: string;
	dangerLevel: string;
	notableFeatures: string[];
	inhabitants?: string;
	accessMethod?: string;
}

// Breach Scenario Types
export interface BreachPhase {
	name: string;
	description: string;
	objectives: string[];
	complications: string[];
	duration?: string;
}

export interface BreachConfig {
	scpInvolved?: string;
	severity: EventSeverity;
	phaseCount: number;
}

export interface GeneratedBreachScenario {
	title: string;
	scpInvolved: string;
	severity: EventSeverity;
	initialSituation: string;
	phases: BreachPhase[];
	possibleOutcomes: string[];
	recommendedMTF?: string;
}
