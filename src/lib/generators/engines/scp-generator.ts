// SCP Generator Engine
import { createRandom, generateSeed, type RandomGenerator } from '../core/random';
import { createWeightedTable, pickFromTable, type WeightedTable } from '../core/weighted-table';
import type { GeneratedSCP, GeneratedContent, SCPConfig, ObjectClass, DisruptionClass, RiskClass, AnomalyCategory } from '../types';
import {
	ANOMALY_FORMS,
	PRIMARY_EFFECTS,
	SECONDARY_EFFECTS,
	TRIGGER_CONDITIONS,
	ORIGINS
} from '../data/scp/anomaly-types';
import {
	CONTAINMENT_LOCATIONS,
	CONTAINMENT_MATERIALS,
	ACCESS_REQUIREMENTS,
	MONITORING_REQUIREMENTS,
	EMERGENCY_PROCEDURES,
	MAINTENANCE_REQUIREMENTS,
	SPECIAL_REQUIREMENTS
} from '../data/scp/containment';
import { ALL_SITES } from '../data/sites';

// Weighted tables for generation
const objectClassTable: WeightedTable<ObjectClass> = createWeightedTable([
	{ value: 'Safe', weight: 30 },
	{ value: 'Euclid', weight: 40 },
	{ value: 'Keter', weight: 20 },
	{ value: 'Thaumiel', weight: 3 },
	{ value: 'Neutralized', weight: 2 },
	{ value: 'Apollyon', weight: 1 },
	{ value: 'Archon', weight: 4 }
]);

const disruptionClassTable: WeightedTable<DisruptionClass> = createWeightedTable([
	{ value: 'Dark', weight: 25 },
	{ value: 'Vlam', weight: 35 },
	{ value: 'Keneq', weight: 25 },
	{ value: 'Ekhi', weight: 12 },
	{ value: 'Amida', weight: 3 }
]);

const riskClassTable: WeightedTable<RiskClass> = createWeightedTable([
	{ value: 'Notice', weight: 15 },
	{ value: 'Caution', weight: 30 },
	{ value: 'Warning', weight: 30 },
	{ value: 'Danger', weight: 20 },
	{ value: 'Critical', weight: 5 }
]);

const categoryTable: WeightedTable<AnomalyCategory> = createWeightedTable([
	{ value: 'Biological', weight: 15 },
	{ value: 'Mechanical', weight: 10 },
	{ value: 'Spatial', weight: 10 },
	{ value: 'Temporal', weight: 8 },
	{ value: 'Memetic', weight: 8 },
	{ value: 'Cognitohazardous', weight: 8 },
	{ value: 'Infohazardous', weight: 5 },
	{ value: 'Reality-Bending', weight: 5 },
	{ value: 'Extradimensional', weight: 7 },
	{ value: 'Spectral', weight: 6 },
	{ value: 'Technological', weight: 5 },
	{ value: 'Organic', weight: 5 },
	{ value: 'Mineral', weight: 3 },
	{ value: 'Aquatic', weight: 3 },
	{ value: 'Atmospheric', weight: 2 }
]);

export const defaultSCPConfig: SCPConfig = {
	includeSecondaryEffects: true,
	includeOrigin: true,
	includeSpecialRequirements: true,
	complexity: 'standard'
};

function generateItemNumber(rng: RandomGenerator): string {
	// Generate a plausible SCP number
	const series = rng.int(1, 7); // Series 1-7
	let num: number;

	if (series === 1) {
		num = rng.int(2, 999);
	} else {
		const baseNum = (series - 1) * 1000;
		num = rng.int(baseNum, baseNum + 999);
	}

	return String(num).padStart(3, '0');
}

function generateContainmentProcedures(
	rng: RandomGenerator,
	objectClass: ObjectClass,
	_category: AnomalyCategory,
	includeSpecialRequirements: boolean,
	complexity: 'minimal' | 'standard' | 'detailed'
): string[] {
	const procedures: string[] = [];

	// Location based on danger level
	const location = rng.pick(CONTAINMENT_LOCATIONS);
	const material = rng.pick(CONTAINMENT_MATERIALS);

	procedures.push(`SCP is to be contained in a ${location} constructed with ${material}.`);

	// Access requirements
	procedures.push(rng.pick(ACCESS_REQUIREMENTS) + '.');

	// Monitoring for Euclid and above
	if (objectClass !== 'Safe' && objectClass !== 'Neutralized') {
		procedures.push(rng.pick(MONITORING_REQUIREMENTS) + ' is required.');
	}

	// Standard complexity adds maintenance
	if (complexity !== 'minimal') {
		procedures.push(rng.pick(MAINTENANCE_REQUIREMENTS) + '.');
	}

	// Detailed adds emergency procedures
	if (complexity === 'detailed') {
		procedures.push(rng.pick(EMERGENCY_PROCEDURES) + '.');
	}

	// Special requirements for Keter and above, or if specifically requested
	if (includeSpecialRequirements && (objectClass === 'Keter' || objectClass === 'Apollyon' || rng.chance(0.3))) {
		procedures.push(`Additionally, the object ${rng.pick(SPECIAL_REQUIREMENTS)}.`);
	}

	return procedures;
}

function generateDescription(
	rng: RandomGenerator,
	category: AnomalyCategory,
	includeSecondaryEffects: boolean,
	includeOrigin: boolean
): string {
	const parts: string[] = [];

	// Form
	const forms = ANOMALY_FORMS[category];
	const form = rng.pick(forms as unknown as string[]);

	// Primary effect
	const primaryEffect = rng.pick(PRIMARY_EFFECTS);

	// Opening line
	const openers = [
		`SCP-XXXX is a ${form} that ${primaryEffect}.`,
		`SCP-XXXX appears to be a ${form}. Its primary anomalous property is that it ${primaryEffect}.`,
		`SCP-XXXX takes the form of a ${form}. When active, it ${primaryEffect}.`,
		`SCP-XXXX is a ${form} with the anomalous ability to ${primaryEffect.replace('causes', 'cause').replace('creates', 'create').replace('induces', 'induce')}.`
	];
	parts.push(rng.pick(openers));

	// Trigger condition
	const trigger = rng.pick(TRIGGER_CONDITIONS);
	const triggerSentences = [
		`This effect is triggered ${trigger}.`,
		`The anomalous properties manifest ${trigger}.`,
		`Activation occurs ${trigger}.`,
		`The effect initiates ${trigger}.`
	];
	parts.push(rng.pick(triggerSentences));

	// Secondary effect
	if (includeSecondaryEffects && rng.chance(0.7)) {
		parts.push(rng.pick(SECONDARY_EFFECTS) + '.');
	}

	// Origin
	if (includeOrigin) {
		const origin = rng.pick(ORIGINS);
		const originSentences = [
			`SCP-XXXX was originally ${origin}.`,
			`The object was ${origin}.`,
			`Recovery occurred after SCP-XXXX was ${origin}.`,
			`Initial discovery: ${origin}.`
		];
		parts.push(originSentences[rng.int(0, originSentences.length - 1)]);
	}

	return parts.join(' ');
}

function generateAdditionalNotes(
	rng: RandomGenerator,
	_objectClass: ObjectClass
): string[] | undefined {
	// Only generate notes sometimes
	if (!rng.chance(0.5)) return undefined;

	const possibleNotes = [
		'Research into the origins of this anomaly is ongoing.',
		'Cross-testing with other SCP objects is strictly prohibited without O5 approval.',
		'Personnel reporting unusual dreams after exposure should report to site psychologist.',
		'Historical records suggest similar anomalies have been documented throughout history.',
		'The full extent of this object\'s capabilities remains unknown.',
		'Classification is currently under review by the Classification Committee.',
		'Related anomalies have been reported in [REDACTED] regions.',
		'Ethics Committee review is pending regarding proposed testing protocols.',
		'Neutralization attempts have proven unsuccessful.',
		'Long-term containment effects on personnel are being studied.',
		'Possible connections to Group of Interest activities are being investigated.',
		'Upgrade to Keter classification has been proposed following Incident XXXX-A.',
		'Thaumiel applications are currently being researched.',
		'Object may be sentient; further study required.',
		'Attempts at communication have yielded inconclusive results.'
	];

	const noteCount = rng.int(1, 2);
	const selectedNotes = rng.pickMultiple(possibleNotes, noteCount);

	return selectedNotes.length > 0 ? selectedNotes : undefined;
}

export function generateSCP(
	config: Partial<SCPConfig> = {},
	seed?: number
): GeneratedContent<GeneratedSCP> {
	const finalSeed = seed ?? generateSeed();
	const rng = createRandom(finalSeed);
	const finalConfig = { ...defaultSCPConfig, ...config };

	// Generate or use specified classifications
	const objectClass = config.objectClass ?? pickFromTable(objectClassTable, rng);
	const category = config.category ?? pickFromTable(categoryTable, rng);
	const disruptionClass = pickFromTable(disruptionClassTable, rng);
	const riskClass = pickFromTable(riskClassTable, rng);

	// Generate item number
	const itemNumber = generateItemNumber(rng);

	// Select containment site
	const site = rng.pick(ALL_SITES);

	// Generate containment procedures
	const containmentProcedures = generateContainmentProcedures(
		rng,
		objectClass,
		category,
		finalConfig.includeSpecialRequirements,
		finalConfig.complexity
	);

	// Generate description
	const description = generateDescription(
		rng,
		category,
		finalConfig.includeSecondaryEffects,
		finalConfig.includeOrigin
	);

	// Generate additional notes
	const additionalNotes = generateAdditionalNotes(rng, objectClass);

	const scp: GeneratedSCP = {
		itemNumber: `SCP-${itemNumber}`,
		objectClass,
		disruptionClass,
		riskClass,
		category,
		containmentSite: site.designation,
		containmentProcedures,
		description,
		additionalNotes
	};

	return {
		data: scp,
		seed: finalSeed,
		timestamp: new Date().toISOString()
	};
}

export function generateSCPs(
	count: number,
	config: Partial<SCPConfig> = {},
	baseSeed?: number
): GeneratedContent<GeneratedSCP>[] {
	const seed = baseSeed ?? generateSeed();
	const results: GeneratedContent<GeneratedSCP>[] = [];

	for (let i = 0; i < count; i++) {
		// Use deterministic seeds for reproducibility
		const itemSeed = seed + i * 1000;
		results.push(generateSCP(config, itemSeed));
	}

	return results;
}

// Helper functions for labels
export function getObjectClassLabel(objectClass: ObjectClass): string {
	return objectClass;
}

export function getDisruptionClassLabel(disruption: DisruptionClass): string {
	return disruption;
}

export function getRiskClassLabel(risk: RiskClass): string {
	return risk;
}

export function getCategoryLabel(category: AnomalyCategory): string {
	return category;
}
