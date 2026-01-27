/**
 * Foundation sites database
 * Based on SCP wiki canonical sites with additional generated sites
 */

export interface FoundationSite {
	designation: string;
	type: 'Site' | 'Area' | 'Sector' | 'Unit';
	location: string;
	specialty: string;
	description?: string;
	notableSCPs?: string[];
	securityLevel: 'standard' | 'high' | 'maximum' | 'classified';
}

// Major canonical sites
export const CANONICAL_SITES: FoundationSite[] = [
	{
		designation: 'Site-01',
		type: 'Site',
		location: '[REDACTED]',
		specialty: 'O5 Council Headquarters',
		description: 'Primary administrative facility and O5 Council meeting location',
		securityLevel: 'classified'
	},
	{
		designation: 'Site-06',
		type: 'Site',
		location: '[REDACTED], Europe',
		specialty: 'Humanoid containment',
		description: 'Specializes in containment of humanoid anomalies',
		securityLevel: 'high'
	},
	{
		designation: 'Site-17',
		type: 'Site',
		location: '[REDACTED], North America',
		specialty: 'Low-risk humanoid containment',
		description: 'Houses primarily Safe and Euclid-class humanoid entities',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-19',
		type: 'Site',
		location: '[REDACTED], United States',
		specialty: 'General containment',
		description: 'Largest Foundation facility, contains numerous SCPs',
		notableSCPs: ['SCP-173', 'SCP-682', 'SCP-343', 'SCP-914'],
		securityLevel: 'high'
	},
	{
		designation: 'Site-23',
		type: 'Site',
		location: '[REDACTED], United States',
		specialty: 'Viral and biological anomalies',
		description: 'Handles biological and viral containment',
		securityLevel: 'maximum'
	},
	{
		designation: 'Site-28',
		type: 'Site',
		location: 'New York City, United States',
		specialty: 'Anomalous items storage',
		description: 'Handles containment of Safe-class anomalous items',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-36',
		type: 'Site',
		location: '[REDACTED], India',
		specialty: 'Research facility',
		description: 'Primary research facility for anomalous physics',
		securityLevel: 'high'
	},
	{
		designation: 'Site-43',
		type: 'Site',
		location: 'Ontario, Canada',
		specialty: 'Acroamatic abatement',
		description: 'Handles processing and neutralization of anomalous waste',
		securityLevel: 'high'
	},
	{
		designation: 'Site-45',
		type: 'Site',
		location: '[REDACTED], Australia',
		specialty: 'Research and containment',
		description: 'Multi-purpose research and containment facility',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-62',
		type: 'Site',
		location: '[REDACTED], Indonesia',
		specialty: 'Dimensional anomalies',
		description: 'Specializes in extradimensional anomaly research',
		securityLevel: 'high'
	},
	{
		designation: 'Site-64',
		type: 'Site',
		location: 'Portland, Oregon, United States',
		specialty: 'Anomalous technology',
		description: 'Research into anomalous technology and electronics',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-77',
		type: 'Site',
		location: '[REDACTED], Italy',
		specialty: 'Historical anomalies',
		description: 'Contains anomalies of historical significance',
		securityLevel: 'high'
	},
	{
		designation: 'Site-81',
		type: 'Site',
		location: '[REDACTED], United States',
		specialty: 'Anomalous objects',
		description: 'Large-scale anomalous object containment',
		securityLevel: 'high'
	},
	{
		designation: 'Site-88',
		type: 'Site',
		location: '[REDACTED], United States',
		specialty: 'Research facility',
		description: 'Multi-disciplinary research complex',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-91',
		type: 'Site',
		location: 'Yorkshire, United Kingdom',
		specialty: 'British operations center',
		description: 'Primary UK facility and European coordination',
		securityLevel: 'high'
	},
	{
		designation: 'Site-104',
		type: 'Site',
		location: '[REDACTED], Egypt',
		specialty: 'Archaeological anomalies',
		description: 'Handles ancient and archaeological anomalies',
		securityLevel: 'standard'
	},
	{
		designation: 'Site-120',
		type: 'Site',
		location: '[REDACTED], Poland',
		specialty: 'Thaumatological research',
		description: 'Specializes in magical and thaumatological anomalies',
		securityLevel: 'high'
	}
];

// Armed containment areas
export const CANONICAL_AREAS: FoundationSite[] = [
	{
		designation: 'Area-02',
		type: 'Area',
		location: '[REDACTED]',
		specialty: 'Armed Reliquary and Containment Area',
		description: 'High-security containment for dangerous anomalies',
		securityLevel: 'maximum'
	},
	{
		designation: 'Area-12',
		type: 'Area',
		location: '[REDACTED]',
		specialty: 'Biological containment',
		description: 'Handles extremely hazardous biological anomalies',
		securityLevel: 'maximum'
	},
	{
		designation: 'Area-14',
		type: 'Area',
		location: '[REDACTED]',
		specialty: 'Keter-class containment',
		description: 'High-security facility for Keter-class entities',
		securityLevel: 'maximum'
	},
	{
		designation: 'Area-179',
		type: 'Area',
		location: '[REDACTED], Pacific Ocean',
		specialty: 'Aquatic anomalies',
		description: 'Underwater containment facility',
		securityLevel: 'high'
	}
];

// All sites combined
export const ALL_SITES: FoundationSite[] = [...CANONICAL_SITES, ...CANONICAL_AREAS];

// Site designations for quick reference
export const SITE_DESIGNATIONS = ALL_SITES.map((s) => s.designation);

// Common locations for generated sites
export const GENERATED_SITE_LOCATIONS = [
	'[REDACTED], North America',
	'[REDACTED], South America',
	'[REDACTED], Europe',
	'[REDACTED], Asia',
	'[REDACTED], Africa',
	'[REDACTED], Australia',
	'[REDACTED], Antarctica',
	'[REDACTED], Pacific Ocean',
	'[REDACTED], Atlantic Ocean',
	'Underground facility, [REDACTED]',
	'Remote island, [CLASSIFIED]',
	'Mountain installation, [REDACTED]',
	'Desert facility, [REDACTED]',
	'Arctic research station',
	'Urban concealed facility'
] as const;

// Site specialties for generation
export const SITE_SPECIALTIES = [
	'General containment',
	'Humanoid containment',
	'Biological containment',
	'Research facility',
	'Anomalous technology',
	'Dimensional anomalies',
	'Memetic hazards',
	'Temporal anomalies',
	'Cognitohazard containment',
	'Safe-class storage',
	'Keter-class containment',
	'Medical research',
	'Administrative hub',
	'MTF staging area',
	'Emergency shelter',
	'Decommissioning facility'
] as const;

// Get site by designation
export function getSiteByDesignation(designation: string): FoundationSite | undefined {
	return ALL_SITES.find((s) => s.designation === designation);
}

// Get sites by specialty
export function getSitesBySpecialty(specialty: string): FoundationSite[] {
	return ALL_SITES.filter((s) => s.specialty.toLowerCase().includes(specialty.toLowerCase()));
}

// Get sites by security level
export function getSitesBySecurityLevel(level: FoundationSite['securityLevel']): FoundationSite[] {
	return ALL_SITES.filter((s) => s.securityLevel === level);
}
