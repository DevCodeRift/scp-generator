/**
 * Mobile Task Force units database
 * Based on canonical SCP wiki MTF units
 */

export interface MTFUnit {
	designation: string;
	name: string;
	specialty: string;
	description: string;
	typicalSize: 'small' | 'medium' | 'large' | 'variable';
	threatLevel: 'standard' | 'high' | 'extreme' | 'classified';
}

// Canonical MTF units
export const MTF_UNITS: MTFUnit[] = [
	{
		designation: 'Alpha-1',
		name: 'Red Right Hand',
		specialty: 'O5 Command operations',
		description:
			'Direct action task force reporting only to the O5 Council. Handles the most sensitive operations.',
		typicalSize: 'variable',
		threatLevel: 'classified'
	},
	{
		designation: 'Alpha-4',
		name: 'Pony Express',
		specialty: 'Interception of anomalous mail',
		description:
			'Specializes in tracking and intercepting anomalous items transmitted through postal services.',
		typicalSize: 'medium',
		threatLevel: 'standard'
	},
	{
		designation: 'Alpha-9',
		name: 'Last Hope',
		specialty: 'Anomalous humanoid operatives',
		description:
			'Employs anomalous humanoids in field operations. Highly controversial program.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Beta-1',
		name: 'Cauterizers',
		specialty: 'Information suppression',
		description: 'Handles cover-ups and information suppression after anomalous events.',
		typicalSize: 'large',
		threatLevel: 'standard'
	},
	{
		designation: 'Beta-7',
		name: 'Maz Hatters',
		specialty: 'Hazardous anomalies',
		description:
			'Responds to anomalies involving chemical, biological, radiological hazards.',
		typicalSize: 'medium',
		threatLevel: 'extreme'
	},
	{
		designation: 'Gamma-5',
		name: 'Red Herrings',
		specialty: 'Disinformation',
		description: 'Creates and maintains cover stories for anomalous events.',
		typicalSize: 'medium',
		threatLevel: 'standard'
	},
	{
		designation: 'Gamma-6',
		name: 'Deep Feeders',
		specialty: 'Deep-sea anomalies',
		description: 'Handles investigation and containment of underwater anomalies.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Delta-5',
		name: 'Front Runners',
		specialty: 'Fast response',
		description: 'Rapid response team for emerging anomalous situations.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Epsilon-6',
		name: 'Village Idiots',
		specialty: 'Rural anomalies',
		description: 'Investigates anomalies in rural and isolated communities.',
		typicalSize: 'small',
		threatLevel: 'standard'
	},
	{
		designation: 'Epsilon-9',
		name: 'Fire Eaters',
		specialty: 'Incendiary anomalies',
		description: 'Handles anomalies involving fire or extreme heat.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Epsilon-11',
		name: 'Nine-Tailed Fox',
		specialty: 'Containment breach response',
		description:
			'Primary response team for site-wide containment breaches. Heavily armed and highly trained.',
		typicalSize: 'large',
		threatLevel: 'extreme'
	},
	{
		designation: 'Zeta-9',
		name: 'Mole Rats',
		specialty: 'Underground exploration',
		description: 'Explores and investigates subterranean anomalies and locations.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Eta-5',
		name: 'Jäeger Bombers',
		specialty: 'Large-scale entity capture',
		description: 'Specializes in capture and containment of massive anomalous entities.',
		typicalSize: 'large',
		threatLevel: 'extreme'
	},
	{
		designation: 'Eta-10',
		name: 'See No Evil',
		specialty: 'Visual cognitohazards',
		description: 'Responds to anomalies that pose visual cognitohazards.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Eta-11',
		name: 'Savage Beasts',
		specialty: 'Auditory anomalies',
		description: 'Handles anomalies involving sound or auditory hazards.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Theta-4',
		name: 'Gardeners',
		specialty: 'Plant-based anomalies',
		description: 'Investigates and contains botanical anomalies.',
		typicalSize: 'small',
		threatLevel: 'standard'
	},
	{
		designation: 'Theta-90',
		name: 'Angle Grinders',
		specialty: 'Spatial anomalies',
		description: 'Handles anomalies involving warped space or non-Euclidean geometry.',
		typicalSize: 'medium',
		threatLevel: 'extreme'
	},
	{
		designation: 'Iota-10',
		name: 'Damn Feds',
		specialty: 'Law enforcement liaison',
		description: 'Operates undercover within civilian law enforcement.',
		typicalSize: 'large',
		threatLevel: 'standard'
	},
	{
		designation: 'Kappa-10',
		name: 'Skynet',
		specialty: 'Digital anomalies',
		description: 'Handles anomalies existing in digital or virtual spaces.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Lambda-4',
		name: 'Birdwatchers',
		specialty: 'Aerial anomalies',
		description: 'Investigates and contains airborne or flying anomalies.',
		typicalSize: 'medium',
		threatLevel: 'standard'
	},
	{
		designation: 'Lambda-5',
		name: 'White Rabbits',
		specialty: 'Dimensional breaches',
		description: 'Investigates extradimensional anomalies and breaches.',
		typicalSize: 'small',
		threatLevel: 'extreme'
	},
	{
		designation: 'Mu-4',
		name: 'Debuggers',
		specialty: 'Electronic anomalies',
		description: 'Handles anomalies affecting electronic devices.',
		typicalSize: 'medium',
		threatLevel: 'standard'
	},
	{
		designation: 'Mu-13',
		name: 'Ghostbusters',
		specialty: 'Spectral entities',
		description: 'Investigates and contains incorporeal or spectral anomalies.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Nu-7',
		name: 'Hammer Down',
		specialty: 'Heavy assault',
		description:
			'Battalion-strength combat unit for large-scale hostile entity engagement.',
		typicalSize: 'large',
		threatLevel: 'extreme'
	},
	{
		designation: 'Xi-3',
		name: 'Body Snatchers',
		specialty: 'Infiltrating entities',
		description: 'Identifies and neutralizes shapeshifting or body-snatching entities.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Omicron-Rho',
		name: 'The Dream Team',
		specialty: 'Oneiric anomalies',
		description: 'Investigates anomalies affecting dreams and sleep.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Pi-1',
		name: 'City Slickers',
		specialty: 'Urban anomalies',
		description: 'Handles anomalies in densely populated urban areas.',
		typicalSize: 'large',
		threatLevel: 'standard'
	},
	{
		designation: 'Rho-1',
		name: 'The Professors',
		specialty: 'Academic infiltration',
		description: 'Operates undercover in academic institutions.',
		typicalSize: 'small',
		threatLevel: 'standard'
	},
	{
		designation: 'Sigma-3',
		name: 'Bibliographers',
		specialty: 'Anomalous texts',
		description: 'Handles books, documents, and written anomalies.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Tau-5',
		name: 'Samsara',
		specialty: 'Regenerative operatives',
		description:
			'Composed of regenerating humanoid entities. Used for extremely dangerous operations.',
		typicalSize: 'small',
		threatLevel: 'extreme'
	},
	{
		designation: 'Upsilon-4',
		name: 'Sugar Pill',
		specialty: 'Medical anomalies',
		description: 'Investigates anomalies affecting human health and medicine.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Phi-2',
		name: 'Clever Girls',
		specialty: 'Anomalous fauna',
		description: 'Handles anomalous animals and creature containment.',
		typicalSize: 'medium',
		threatLevel: 'high'
	},
	{
		designation: 'Chi-3',
		name: 'Exorcists',
		specialty: 'Possession anomalies',
		description: 'Deals with entities that possess or control humans.',
		typicalSize: 'small',
		threatLevel: 'high'
	},
	{
		designation: 'Psi-7',
		name: 'Home Improvement',
		specialty: 'Anomalous structures',
		description: 'Investigates buildings and structures with anomalous properties.',
		typicalSize: 'medium',
		threatLevel: 'standard'
	},
	{
		designation: 'Psi-8',
		name: 'The Silencers',
		specialty: 'Witness amnesticization',
		description: 'Handles large-scale amnestic distribution.',
		typicalSize: 'large',
		threatLevel: 'standard'
	},
	{
		designation: 'Omega-0',
		name: 'Ará Orún',
		specialty: 'Deceased operatives',
		description:
			'Controversial unit reportedly composed of consciousness-preserved deceased personnel.',
		typicalSize: 'variable',
		threatLevel: 'classified'
	},
	{
		designation: 'Omega-7',
		name: 'Pandora\'s Box',
		specialty: 'Anomalous humanoid deployment',
		description:
			'[DECOMMISSIONED] Former unit that deployed anomalous humanoids as operatives.',
		typicalSize: 'small',
		threatLevel: 'extreme'
	},
	{
		designation: 'Omega-12',
		name: 'Achilles\' Heels',
		specialty: 'Seemingly invulnerable anomalies',
		description: 'Researches methods to neutralize "invulnerable" anomalies.',
		typicalSize: 'small',
		threatLevel: 'extreme'
	}
];

// Get MTF by designation
export function getMTFByDesignation(designation: string): MTFUnit | undefined {
	return MTF_UNITS.find((m) => m.designation === designation);
}

// Get MTFs by specialty
export function getMTFsBySpecialty(specialty: string): MTFUnit[] {
	return MTF_UNITS.filter((m) => m.specialty.toLowerCase().includes(specialty.toLowerCase()));
}

// Get MTFs by threat level
export function getMTFsByThreatLevel(level: MTFUnit['threatLevel']): MTFUnit[] {
	return MTF_UNITS.filter((m) => m.threatLevel === level);
}

// MTF designations for quick reference
export const MTF_DESIGNATIONS = MTF_UNITS.map((m) => m.designation);

// MTF names for quick reference
export const MTF_NAMES = MTF_UNITS.map((m) => m.name);
