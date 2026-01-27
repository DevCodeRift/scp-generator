// Artifact Generator Engine
import { createRandom, generateSeed, type RandomGenerator } from '../core/random';
import type { GeneratedArtifact, GeneratedContent, ArtifactConfig } from '../types';
import {
	ARTIFACT_FORMS,
	ARTIFACT_MATERIALS,
	ARTIFACT_ERAS,
	ARTIFACT_EFFECTS,
	ARTIFACT_ACTIVATIONS,
	ARTIFACT_DRAWBACKS,
	ARTIFACT_ORIGINS
} from '../data/artifacts';

export const defaultArtifactConfig: ArtifactConfig = {
	minorOnly: false,
	includeDrawbacks: true
};

function generateArtifactName(
	rng: RandomGenerator,
	form: string,
	material: string,
	era: string
): string {
	const formats = [
		`The ${era} ${material} ${form}`,
		`${material.charAt(0).toUpperCase() + material.slice(1)} ${form} of unknown origin`,
		`"The ${form.charAt(0).toUpperCase() + form.slice(1)}"`,
		`Anomalous ${form} (${era})`,
		`${era} ${form}`
	];
	return rng.pick(formats);
}

export function generateArtifact(
	config: Partial<ArtifactConfig> = {},
	seed?: number
): GeneratedContent<GeneratedArtifact> {
	const finalSeed = seed ?? generateSeed();
	const rng = createRandom(finalSeed);
	const finalConfig = { ...defaultArtifactConfig, ...config };

	// Generate base properties
	const form = rng.pick([...ARTIFACT_FORMS]);
	const material = rng.pick([...ARTIFACT_MATERIALS]);
	const era = rng.pick([...ARTIFACT_ERAS]);

	// Generate name
	const name = generateArtifactName(rng, form, material, era);

	// Generate primary effect
	const primaryEffect = rng.pick([...ARTIFACT_EFFECTS]);

	// Generate activation condition
	const activation = rng.pick([...ARTIFACT_ACTIVATIONS]);

	// Generate drawback (if enabled)
	const drawback = finalConfig.includeDrawbacks && rng.chance(0.7)
		? rng.pick([...ARTIFACT_DRAWBACKS])
		: undefined;

	// Generate origin (70% chance)
	const origin = rng.chance(0.7)
		? rng.pick([...ARTIFACT_ORIGINS])
		: undefined;

	const artifact: GeneratedArtifact = {
		name,
		form,
		material,
		primaryEffect,
		activation,
		drawback,
		origin
	};

	return {
		data: artifact,
		seed: finalSeed,
		timestamp: new Date().toISOString()
	};
}

export function generateArtifacts(
	count: number,
	config: Partial<ArtifactConfig> = {},
	baseSeed?: number
): GeneratedContent<GeneratedArtifact>[] {
	const seed = baseSeed ?? generateSeed();
	const results: GeneratedContent<GeneratedArtifact>[] = [];

	for (let i = 0; i < count; i++) {
		const itemSeed = seed + i * 1000;
		results.push(generateArtifact(config, itemSeed));
	}

	return results;
}
