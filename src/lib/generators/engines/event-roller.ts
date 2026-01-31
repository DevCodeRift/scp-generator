import { createRandom, generateSeed, type RandomGenerator } from '../core/random';
import { createWeightedTable, pickFromTable, type WeightedTable } from '../core/weighted-table';
import type { GeneratedEvent, GeneratedContent, EventConfig, EventSeverity, EventType } from '../types';
import {
	EVENT_TYPE_LABELS,
	EVENT_TITLES,
	EVENT_DESCRIPTIONS,
	IMMEDIATE_EFFECTS,
	COMPLICATIONS,
	SUGGESTED_RESPONSES
} from '../data/events';

const severityTable: WeightedTable<EventSeverity> = createWeightedTable([
	{ value: 'minor', weight: 40 },
	{ value: 'moderate', weight: 35 },
	{ value: 'major', weight: 20 },
	{ value: 'critical', weight: 5 }
]);

const eventTypeTable: WeightedTable<EventType> = createWeightedTable([
	{ value: 'containment-breach', weight: 20 },
	{ value: 'anomalous-manifestation', weight: 15 },
	{ value: 'security-incident', weight: 15 },
	{ value: 'equipment-malfunction', weight: 12 },
	{ value: 'personnel-incident', weight: 12 },
	{ value: 'external-threat', weight: 8 },
	{ value: 'dimensional-anomaly', weight: 6 },
	{ value: 'cognitohazard-exposure', weight: 6 },
	{ value: 'facility-emergency', weight: 6 }
]);

export const defaultEventConfig: EventConfig = {
	severity: undefined,
	eventType: undefined
};

function getComplicationCount(severity: EventSeverity): number {
	switch (severity) {
		case 'minor': return 0;
		case 'moderate': return 1;
		case 'major': return 2;
		case 'critical': return 3;
	}
}

function getEffectCount(severity: EventSeverity): number {
	switch (severity) {
		case 'minor': return 1;
		case 'moderate': return 2;
		case 'major': return 3;
		case 'critical': return 4;
	}
}

export function generateEvent(
	config: Partial<EventConfig> = {},
	seed?: number
): GeneratedContent<GeneratedEvent> {
	const finalSeed = seed ?? generateSeed();
	const rng = createRandom(finalSeed);
	const finalConfig = { ...defaultEventConfig, ...config };

	const severity = finalConfig.severity ?? pickFromTable(severityTable, rng);
	const eventType = finalConfig.eventType ?? pickFromTable(eventTypeTable, rng);
	const eventTypeLabel = EVENT_TYPE_LABELS[eventType];

	const titles = EVENT_TITLES[eventType];
	const title = rng.pick([...titles]);

	const descriptions = EVENT_DESCRIPTIONS[eventType];
	const description = rng.pick([...descriptions]);

	const effectCount = getEffectCount(severity);
	const immediateEffects = rng.pickMultiple([...IMMEDIATE_EFFECTS], effectCount);

	const complicationCount = getComplicationCount(severity);
	const complications = complicationCount > 0
		? rng.pickMultiple([...COMPLICATIONS], complicationCount)
		: undefined;

	const suggestedResponse = severity !== 'minor'
		? rng.pick([...SUGGESTED_RESPONSES])
		: undefined;

	const event: GeneratedEvent = {
		title,
		severity,
		eventType: eventTypeLabel,
		description,
		immediateEffects,
		complications,
		suggestedResponse
	};

	return {
		data: event,
		seed: finalSeed,
		timestamp: new Date().toISOString()
	};
}

export function generateEvents(
	count: number,
	config: Partial<EventConfig> = {},
	baseSeed?: number
): GeneratedContent<GeneratedEvent>[] {
	const seed = baseSeed ?? generateSeed();
	const results: GeneratedContent<GeneratedEvent>[] = [];

	for (let i = 0; i < count; i++) {
		const itemSeed = seed + i * 1000;
		results.push(generateEvent(config, itemSeed));
	}

	return results;
}

export function getSeverityLabel(severity: EventSeverity): string {
	const labels: Record<EventSeverity, string> = {
		minor: 'Minor',
		moderate: 'Moderate',
		major: 'Major',
		critical: 'Critical'
	};
	return labels[severity];
}
