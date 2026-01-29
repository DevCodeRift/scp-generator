import { parseDatFile } from './parser';
import type { DatDocument } from './types';

export interface PresetTemplate {
	id: string;
	name: string;
	description: string;
	filename: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
	{
		id: 'project',
		name: 'RSD Project Template',
		description: 'Standard research project documentation',
		filename: 'RSD Project Template.dat'
	},
	{
		id: 'experiment',
		name: 'RSD Experiment Template',
		description: 'Experiment logging and results',
		filename: 'RSD Experiment Template.dat'
	},
	{
		id: 'crosstest-1',
		name: 'RSD Crosstest Template (1)',
		description: 'Cross-testing between SCPs',
		filename: 'RSD Crosstest Template (1).dat'
	},
	{
		id: 'crosstest-2',
		name: 'RSD Crosstest Template (2)',
		description: 'Alternate crosstest format',
		filename: 'RSD Crosstest Template (2).dat'
	},
	{
		id: 'classification',
		name: 'RSD New SCP Classification',
		description: 'New SCP object classification',
		filename: 'RSD New SCP Classification Template.dat'
	},
	{
		id: 'classification-alt',
		name: 'RSD New SCP Classification (Alt)',
		description: 'Alternate classification format',
		filename: 'RSD New SCP Classification Template (1).dat'
	},
	{
		id: 'sample-permit',
		name: 'RSD Sample Permit Template',
		description: 'Sample collection permits',
		filename: 'RSD Sample Permit Template.dat'
	}
];

/**
 * Fetch and parse a preset template by ID.
 */
export async function loadPresetTemplate(id: string): Promise<DatDocument> {
	const preset = PRESET_TEMPLATES.find((p) => p.id === id);
	if (!preset) {
		throw new Error(`Unknown preset template: ${id}`);
	}

	const response = await fetch(`/templates/${encodeURIComponent(preset.filename)}`);
	if (!response.ok) {
		throw new Error(`Failed to load template: ${response.statusText}`);
	}

	const text = await response.text();
	return parseDatFile(text);
}
