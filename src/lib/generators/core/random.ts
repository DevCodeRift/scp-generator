const LCG_A = 1103515245;
const LCG_C = 12345;
const LCG_M = 2147483648; // 2^31

export function createRandom(seed?: number) {
	let state = seed ?? Date.now();

	state = Math.abs(Math.floor(state)) % LCG_M;
	if (state === 0) state = 1;

	function next(): number {
		state = (LCG_A * state + LCG_C) % LCG_M;
		return state / LCG_M;
	}

	function int(min: number, max: number): number {
		return Math.floor(next() * (max - min + 1)) + min;
	}

	function float(min: number, max: number): number {
		return next() * (max - min) + min;
	}

	function pick<T>(array: readonly T[]): T {
		if (array.length === 0) {
			throw new Error('Cannot pick from empty array');
		}
		return array[int(0, array.length - 1)];
	}

	function pickMultiple<T>(array: readonly T[], count: number): T[] {
		if (count > array.length) {
			throw new Error('Cannot pick more elements than array contains');
		}
		const copy = [...array];
		const result: T[] = [];
		for (let i = 0; i < count; i++) {
			const index = int(0, copy.length - 1);
			result.push(copy[index]);
			copy.splice(index, 1);
		}
		return result;
	}

	function shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = int(0, i);
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function chance(probability: number): boolean {
		return next() < probability;
	}

	function roll(count: number, sides: number): number {
		let total = 0;
		for (let i = 0; i < count; i++) {
			total += int(1, sides);
		}
		return total;
	}

	function getSeed(): number {
		return state;
	}

	function setSeed(newSeed: number): void {
		state = Math.abs(Math.floor(newSeed)) % LCG_M;
		if (state === 0) state = 1;
	}

	return {
		next,
		int,
		float,
		pick,
		pickMultiple,
		shuffle,
		chance,
		roll,
		getSeed,
		setSeed
	};
}

export type RandomGenerator = ReturnType<typeof createRandom>;

export function generateSeed(): number {
	return Math.floor(Math.random() * LCG_M);
}

export function quickPick<T>(array: readonly T[]): T {
	if (array.length === 0) {
		throw new Error('Cannot pick from empty array');
	}
	return array[Math.floor(Math.random() * array.length)];
}

export function quickInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
