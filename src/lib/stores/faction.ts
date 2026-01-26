import { writable } from 'svelte/store';

export type Faction =
	| 'foundation'
	| 'chaos-insurgency'
	| 'goc'
	| 'serpents-hand'
	| 'mcd'
	| 'broken-god'
	| 'wondertainment'
	| 'ouroboros';

export interface FactionInfo {
	id: Faction;
	name: string;
	shortName: string;
	description: string;
}

export const FACTIONS: FactionInfo[] = [
	{
		id: 'foundation',
		name: 'SCP Foundation',
		shortName: 'Foundation',
		description: 'Secure. Contain. Protect.'
	},
	{
		id: 'chaos-insurgency',
		name: 'Chaos Insurgency',
		shortName: 'CI',
		description: 'Former Foundation splinter group'
	},
	{
		id: 'goc',
		name: 'Global Occult Coalition',
		shortName: 'GOC',
		description: 'United Nations paranormal agency'
	},
	{
		id: 'serpents-hand',
		name: "The Serpent's Hand",
		shortName: 'SH',
		description: 'Advocates for anomalous liberation'
	},
	{
		id: 'mcd',
		name: 'Marshall, Carter & Dark Ltd.',
		shortName: 'MC&D',
		description: 'Exclusive club dealing in the anomalous'
	},
	{
		id: 'broken-god',
		name: 'Church of the Broken God',
		shortName: 'CotBG',
		description: 'Worship through mechanical transcendence'
	},
	{
		id: 'wondertainment',
		name: 'Dr. Wondertainment',
		shortName: 'Wondertainment',
		description: 'Anomalous toy manufacturer'
	},
	{
		id: 'ouroboros',
		name: 'Ouroboros Foundation',
		shortName: 'Ouroboros',
		description: 'The cycle continues eternally'
	}
];

function createFactionStore() {
	const stored = typeof localStorage !== 'undefined'
		? localStorage.getItem('scp-faction') as Faction | null
		: null;

	const { subscribe, set, update } = writable<Faction>(stored || 'foundation');

	return {
		subscribe,
		set: (faction: Faction) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('scp-faction', faction);
			}
			set(faction);
		},
		getFactionInfo: (id: Faction): FactionInfo | undefined => {
			return FACTIONS.find(f => f.id === id);
		}
	};
}

export const factionStore = createFactionStore();
