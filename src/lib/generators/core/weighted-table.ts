import type { RandomGenerator } from './random';
import { createRandom } from './random';

export interface WeightedItem<T> {
	value: T;
	weight: number;
}

export interface WeightedTable<T> {
	items: WeightedItem<T>[];
	totalWeight: number;
}

export function createWeightedTable<T>(items: WeightedItem<T>[]): WeightedTable<T> {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	return { items, totalWeight };
}

export function createTableFromRecord<T extends string>(
	record: Record<T, number>
): WeightedTable<T> {
	const items: WeightedItem<T>[] = Object.entries(record).map(([value, weight]) => ({
		value: value as T,
		weight: weight as number
	}));
	return createWeightedTable(items);
}

export function pickFromTable<T>(table: WeightedTable<T>, rng?: RandomGenerator): T {
	const random = rng ?? createRandom();
	let roll = random.float(0, table.totalWeight);

	for (const item of table.items) {
		roll -= item.weight;
		if (roll <= 0) {
			return item.value;
		}
	}

	return table.items[table.items.length - 1].value;
}

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

		const index = remaining.findIndex((item) => item.value === picked);
		if (index !== -1) {
			remaining.splice(index, 1);
		}
	}

	return results;
}

export const OBJECT_CLASS_WEIGHTS = createTableFromRecord({
	safe: 35,
	euclid: 45,
	keter: 15,
	thaumiel: 3,
	neutralized: 1,
	explained: 1
});

export const ANOMALY_TYPE_WEIGHTS = createTableFromRecord({
	object: 40,
	entity: 30,
	location: 15,
	phenomenon: 10,
	concept: 5
});

export const NPC_ROLE_WEIGHTS = createTableFromRecord({
	researcher: 35,
	security: 20,
	mtf: 15,
	'd-class': 15,
	administrative: 10,
	medical: 5
});

export const EVENT_SEVERITY_WEIGHTS = createTableFromRecord({
	minor: 40,
	moderate: 35,
	major: 20,
	critical: 5
});

export const CONTAINMENT_DIFFICULTY_WEIGHTS = createTableFromRecord({
	minimal: 25,
	standard: 40,
	significant: 25,
	extreme: 10
});

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
