/**
 * Seeded pseudo-random number generator utilities
 * Uses a Linear Congruential Generator (LCG) for reproducible randomness
 */

// LCG constants (same as glibc)
const LCG_A = 1103515245;
const LCG_C = 12345;
const LCG_M = 2147483648; // 2^31

/**
 * Create a seeded random number generator
 * @param seed - Initial seed value (defaults to current timestamp)
 * @returns Object with random utility methods
 */
export function createRandom(seed?: number) {
	let state = seed ?? Date.now();

	// Ensure seed is a valid integer
	state = Math.abs(Math.floor(state)) % LCG_M;
	if (state === 0) state = 1;

	/**
	 * Generate next random number in sequence
	 * @returns Number between 0 and 1
	 */
	function next(): number {
		state = (LCG_A * state + LCG_C) % LCG_M;
		return state / LCG_M;
	}

	/**
	 * Generate random integer in range [min, max] (inclusive)
	 */
	function int(min: number, max: number): number {
		return Math.floor(next() * (max - min + 1)) + min;
	}

	/**
	 * Generate random float in range [min, max)
	 */
	function float(min: number, max: number): number {
		return next() * (max - min) + min;
	}

	/**
	 * Pick a random element from an array
	 */
	function pick<T>(array: readonly T[]): T {
		if (array.length === 0) {
			throw new Error('Cannot pick from empty array');
		}
		return array[int(0, array.length - 1)];
	}

	/**
	 * Pick multiple unique random elements from an array
	 */
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

	/**
	 * Shuffle an array in place using Fisher-Yates algorithm
	 */
	function shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = int(0, i);
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	/**
	 * Return true with given probability (0-1)
	 */
	function chance(probability: number): boolean {
		return next() < probability;
	}

	/**
	 * Roll dice in NdS format (e.g., 2d6 = roll 2 six-sided dice)
	 */
	function roll(count: number, sides: number): number {
		let total = 0;
		for (let i = 0; i < count; i++) {
			total += int(1, sides);
		}
		return total;
	}

	/**
	 * Get current seed state (for reproduction)
	 */
	function getSeed(): number {
		return state;
	}

	/**
	 * Set seed state
	 */
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

/**
 * Generate a random seed value
 */
export function generateSeed(): number {
	return Math.floor(Math.random() * LCG_M);
}

/**
 * Quick random pick from array (non-seeded)
 */
export function quickPick<T>(array: readonly T[]): T {
	if (array.length === 0) {
		throw new Error('Cannot pick from empty array');
	}
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Quick random integer (non-seeded)
 */
export function quickInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
