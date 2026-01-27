/**
 * NPC Generator Engine
 * Generates random Foundation personnel, D-Class, MTF operatives, etc.
 */

import { createRandom, type RandomGenerator } from '../core/random';
import { pickFromTable, NPC_ROLE_WEIGHTS } from '../core/weighted-table';
import {
	RESEARCHER_FIRST_NAMES,
	RESEARCHER_LAST_NAMES,
	RESEARCHER_TITLES,
	SECURITY_FIRST_NAMES,
	ADMIN_FIRST_NAMES,
	MEDICAL_FIRST_NAMES,
	NATO_PHONETIC,
	MTF_NICKNAMES,
	DEPARTMENTS,
	NPC_BACKGROUNDS,
	NPC_QUIRKS,
	SPECIALIZATIONS,
	D_CLASS_PREFIX
} from '../data/names';
import { SITE_DESIGNATIONS } from '../data/sites';
import { MTF_UNITS } from '../data/mtf-units';
import type { NPCConfig, GeneratedNPC, NPCRole, GeneratedContent } from '../types';

// Default configuration
export const defaultNPCConfig: NPCConfig = {
	role: 'researcher',
	includeBackground: true,
	includeQuirks: true,
	clearanceLevel: undefined
};

/**
 * Generate a random researcher name
 */
function generateResearcherName(rng: RandomGenerator): { name: string; title: string } {
	const firstName = rng.pick(RESEARCHER_FIRST_NAMES);
	const lastName = rng.pick(RESEARCHER_LAST_NAMES);
	const title = rng.pick(RESEARCHER_TITLES);
	return {
		name: `${firstName} ${lastName}`,
		title
	};
}

/**
 * Generate a random security personnel name
 */
function generateSecurityName(rng: RandomGenerator): string {
	const firstName = rng.pick(SECURITY_FIRST_NAMES);
	const lastName = rng.pick(RESEARCHER_LAST_NAMES);
	return `${firstName} ${lastName}`;
}

/**
 * Generate a random administrative staff name
 */
function generateAdminName(rng: RandomGenerator): string {
	const firstName = rng.pick(ADMIN_FIRST_NAMES);
	const lastName = rng.pick(RESEARCHER_LAST_NAMES);
	return `${firstName} ${lastName}`;
}

/**
 * Generate a random medical staff name
 */
function generateMedicalName(rng: RandomGenerator): { name: string; title: string } {
	const firstName = rng.pick(MEDICAL_FIRST_NAMES);
	const lastName = rng.pick(RESEARCHER_LAST_NAMES);
	return {
		name: `${firstName} ${lastName}`,
		title: 'Dr.'
	};
}

/**
 * Generate a D-Class designation
 */
function generateDClassDesignation(rng: RandomGenerator): string {
	const num = rng.int(1000, 9999);
	return `${D_CLASS_PREFIX}${num}`;
}

/**
 * Generate an MTF callsign
 */
function generateMTFCallsign(rng: RandomGenerator): string {
	const letter = rng.pick(NATO_PHONETIC);
	const num = rng.int(1, 12);
	return `${letter}-${num}`;
}

/**
 * Generate an MTF nickname
 */
function generateMTFNickname(rng: RandomGenerator): string {
	return rng.pick(MTF_NICKNAMES);
}

/**
 * Get clearance level based on role
 */
function getClearanceForRole(role: NPCRole, rng: RandomGenerator, specified?: number): number {
	if (specified !== undefined) return specified;

	switch (role) {
		case 'researcher':
			return rng.int(2, 4);
		case 'mtf':
			return rng.int(2, 4);
		case 'security':
			return rng.int(1, 3);
		case 'd-class':
			return 0;
		case 'administrative':
			return rng.int(1, 3);
		case 'medical':
			return rng.int(2, 4);
		default:
			return rng.int(1, 3);
	}
}

/**
 * Get department based on role
 */
function getDepartmentForRole(role: NPCRole, rng: RandomGenerator): string {
	const roleDepartments: Record<NPCRole, string[]> = {
		researcher: ['Research', 'Containment', 'Anomalous Materials', 'Memetics Division', 'Biological Research', 'Paranormal Studies', 'Temporal Anomalies'],
		mtf: ['Tactical Response', 'Security', 'Containment'],
		security: ['Security', 'Internal Security', 'Containment'],
		'd-class': ['Research', 'Containment'],
		administrative: ['Administration', 'Human Resources', 'Logistics', 'External Affairs'],
		medical: ['Medical', 'Biological Research']
	};

	const options = roleDepartments[role] || DEPARTMENTS;
	return rng.pick(options);
}

/**
 * Generate NPC based on configuration
 */
export function generateNPC(config: Partial<NPCConfig> = {}, seed?: number): GeneratedContent<GeneratedNPC> {
	const rng = createRandom(seed);
	const fullConfig = { ...defaultNPCConfig, ...config };

	// Determine role (random if not specified)
	const role = fullConfig.role || pickFromTable(NPC_ROLE_WEIGHTS, rng);

	// Generate name and designation based on role
	let name: string;
	let designation: string;

	switch (role) {
		case 'researcher': {
			const researcher = generateResearcherName(rng);
			name = researcher.name;
			designation = `${researcher.title} ${researcher.name}`;
			break;
		}
		case 'mtf': {
			const mtfName = generateSecurityName(rng);
			const callsign = generateMTFCallsign(rng);
			const nickname = generateMTFNickname(rng);
			name = mtfName;
			designation = `${callsign} "${nickname}"`;
			break;
		}
		case 'security': {
			name = generateSecurityName(rng);
			designation = `Officer ${name}`;
			break;
		}
		case 'd-class': {
			const dClass = generateDClassDesignation(rng);
			name = dClass;
			designation = dClass;
			break;
		}
		case 'administrative': {
			name = generateAdminName(rng);
			designation = name;
			break;
		}
		case 'medical': {
			const medical = generateMedicalName(rng);
			name = medical.name;
			designation = `${medical.title} ${medical.name}`;
			break;
		}
		default: {
			const defaultName = generateResearcherName(rng);
			name = defaultName.name;
			designation = `${defaultName.title} ${defaultName.name}`;
		}
	}

	// Generate other attributes
	const clearanceLevel = getClearanceForRole(role, rng, fullConfig.clearanceLevel);
	const department = getDepartmentForRole(role, rng);
	const site = rng.pick(SITE_DESIGNATIONS);

	// Optional background
	const background = fullConfig.includeBackground ? rng.pick(NPC_BACKGROUNDS) : undefined;

	// Optional quirks (1-3 quirks)
	let quirks: string[] | undefined;
	if (fullConfig.includeQuirks) {
		const quirkCount = rng.int(1, 3);
		quirks = rng.pickMultiple(NPC_QUIRKS, quirkCount);
	}

	// Specializations for researchers and medical staff
	let specializations: string[] | undefined;
	if (role === 'researcher' || role === 'medical') {
		const specCount = rng.int(1, 2);
		specializations = rng.pickMultiple(SPECIALIZATIONS, specCount);
	}

	// For MTF, add unit info
	let mtfUnit: string | undefined;
	if (role === 'mtf' && rng.chance(0.7)) {
		const unit = rng.pick(MTF_UNITS);
		mtfUnit = `${unit.designation} "${unit.name}"`;
	}

	const npc: GeneratedNPC = {
		name,
		designation,
		role,
		clearanceLevel,
		department,
		site,
		background,
		quirks,
		specializations
	};

	// Add MTF unit to department if applicable
	if (mtfUnit) {
		npc.department = mtfUnit;
	}

	return {
		data: npc,
		seed: rng.getSeed(),
		timestamp: new Date().toISOString()
	};
}

/**
 * Generate multiple NPCs
 */
export function generateNPCs(
	count: number,
	config: Partial<NPCConfig> = {},
	seed?: number
): GeneratedContent<GeneratedNPC>[] {
	const results: GeneratedContent<GeneratedNPC>[] = [];
	const baseSeed = seed ?? Date.now();

	for (let i = 0; i < count; i++) {
		results.push(generateNPC(config, baseSeed + i));
	}

	return results;
}

/**
 * Get display label for role
 */
export function getRoleLabel(role: NPCRole): string {
	const labels: Record<NPCRole, string> = {
		researcher: 'Researcher',
		mtf: 'MTF Operative',
		security: 'Security Personnel',
		'd-class': 'D-Class Personnel',
		administrative: 'Administrative Staff',
		medical: 'Medical Staff'
	};
	return labels[role] || role;
}

/**
 * Get clearance level label
 */
export function getClearanceLabel(level: number): string {
	const labels: Record<number, string> = {
		0: 'Level 0 (Unrestricted)',
		1: 'Level 1 (Confidential)',
		2: 'Level 2 (Restricted)',
		3: 'Level 3 (Secret)',
		4: 'Level 4 (Top Secret)',
		5: 'Level 5 (Thaumiel)'
	};
	return labels[level] || `Level ${level}`;
}
