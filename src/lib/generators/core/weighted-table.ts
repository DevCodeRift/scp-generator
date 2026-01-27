/**
 * Weighted random selection utilities
 * For tables where some options are more likely than others
 */

import type { RandomGenerator } from './random';
import { createRandom } from './random';

/**
 * A weighted item with value and weight
 */
export interface WeightedItem<T> {
	value: T;
	weight: number;
}

/**
 * A weighted table for random selection
 */
export interface WeightedTable<T> {
	items: WeightedItem<T>[];
	totalWeight: number;
}

/**
 * Create a weighted table from items
 */
export function createWeightedTable<T>(items: WeightedItem<T>[]): WeightedTable<T> {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	return { items, totalWeight };
}

/**
 * Create a weighted table from a record of value -> weight
 */
export function createTableFromRecord<T extends string>(
	record: Record<T, number>
): WeightedTable<T> {
	const items: WeightedItem<T>[] = Object.entries(record).map(([value, weight]) => ({
		value: value as T,
		weight: weight as number
	}));
	return createWeightedTable(items);
}

/**
 * Pick a random item from a weighted table
 */
export function pickFromTable<T>(table: WeightedTable<T>, rng?: RandomGenerator): T {
	const random = rng ?? createRandom();
	let roll = random.float(0, table.totalWeight);

	for (const item of table.items) {
		roll -= item.weight;
		if (roll <= 0) {
			return item.value;
		}
	}

	// Fallback to last item (shouldn't happen with proper weights)
	return table.items[table.items.length - 1].value;
}

/**
 * Pick multiple items from a weighted table (with replacement)
 */
export function pickMultipleFromTable<T>(
	table: WeightedTable<T>,
	count: number,
	rng?: RandomGenerator
): T[] {
	const results: T[] = [];
	for (let i = 0; i < count; i++) {
		results.push(pickFromTable(table, rng));
	}
	return results;
}

/**
 * Pick multiple unique items from a weighted table (without replacement)
 * Note: Weights are recalculated after each pick
 */
export function pickUniqueFromTable<T>(
	table: WeightedTable<T>,
	count: number,
	rng?: RandomGenerator
): T[] {
	if (count > table.items.length) {
		throw new Error('Cannot pick more unique items than table contains');
	}

	const random = rng ?? createRandom();
	const remaining = [...table.items];
	const results: T[] = [];

	for (let i = 0; i < count; i++) {
		const tempTable = createWeightedTable(remaining);
		const picked = pickFromTable(tempTable, random);
		results.push(picked);

		// Remove picked item from remaining
		const index = remaining.findIndex((item) => item.value === picked);
		if (index !== -1) {
			remaining.splice(index, 1);
		}
	}

	return results;
}

/**
 * Pre-built weighted tables for common SCP generation needs
 */

// Object class distribution (based on SCP wiki statistics)
export const OBJECT_CLASS_WEIGHTS = createTableFromRecord({
	safe: 35,
	euclid: 45,
	keter: 15,
	thaumiel: 3,
	neutralized: 1,
	explained: 1
});

// Anomaly type distribution
export const ANOMALY_TYPE_WEIGHTS = createTableFromRecord({
	object: 40,
	entity: 30,
	location: 15,
	phenomenon: 10,
	concept: 5
});

// NPC role distribution
export const NPC_ROLE_WEIGHTS = createTableFromRecord({
	researcher: 35,
	security: 20,
	mtf: 15,
	'd-class': 15,
	administrative: 10,
	medical: 5
});

// Event severity distribution
export const EVENT_SEVERITY_WEIGHTS = createTableFromRecord({
	minor: 40,
	moderate: 35,
	major: 20,
	critical: 5
});

// Containment difficulty distribution
export const CONTAINMENT_DIFFICULTY_WEIGHTS = createTableFromRecord({
	minimal: 25,
	standard: 40,
	significant: 25,
	extreme: 10
});

// Room type distribution for facility generation
export const ROOM_TYPE_WEIGHTS = createTableFromRecord({
	corridor: 25,
	office: 15,
	laboratory: 12,
	'containment-cell': 10,
	storage: 10,
	'security-checkpoint': 8,
	'medical-bay': 5,
	cafeteria: 5,
	'server-room': 4,
	armory: 3,
	elevator: 2,
	stairs: 1
});
