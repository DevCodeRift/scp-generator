// Event Generation Data

export const EVENT_TYPES = [
	'containment-breach',
	'anomalous-manifestation',
	'security-incident',
	'equipment-malfunction',
	'personnel-incident',
	'external-threat',
	'dimensional-anomaly',
	'cognitohazard-exposure',
	'facility-emergency'
] as const;
export type EventType = typeof EVENT_TYPES[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
	'containment-breach': 'Containment Breach',
	'anomalous-manifestation': 'Anomalous Manifestation',
	'security-incident': 'Security Incident',
	'equipment-malfunction': 'Equipment Malfunction',
	'personnel-incident': 'Personnel Incident',
	'external-threat': 'External Threat',
	'dimensional-anomaly': 'Dimensional Anomaly',
	'cognitohazard-exposure': 'Cognitohazard Exposure',
	'facility-emergency': 'Facility Emergency'
};

export const EVENT_TITLES: Record<EventType, string[]> = {
	'containment-breach': [
		'Containment Cell Failure',
		'Breach in Sector [REDACTED]',
		'Entity Escape Protocol',
		'Containment Compromise',
		'Structural Containment Failure',
		'Behavioral Containment Bypass',
		'Multiple Breach Alert',
		'Cascade Breach Event'
	],
	'anomalous-manifestation': [
		'Spontaneous Manifestation',
		'Unexpected Anomalous Activity',
		'Reality Fluctuation Detected',
		'Uncontained Phenomenon',
		'New Anomaly Emergence',
		'Localized Reality Distortion',
		'Unexplained Occurrence',
		'Anomalous Event in Progress'
	],
	'security-incident': [
		'Unauthorized Access Attempt',
		'Security Protocol Violation',
		'Intruder Alert',
		'Information Security Breach',
		'Hostile Entity Infiltration',
		'Security System Override',
		'Personnel Security Concern',
		'External Security Threat'
	],
	'equipment-malfunction': [
		'Containment System Failure',
		'Power Grid Instability',
		'Communication Blackout',
		'Monitoring System Offline',
		'Environmental Control Failure',
		'Security System Malfunction',
		'Backup System Failure',
		'Critical Infrastructure Damage'
	],
	'personnel-incident': [
		'Personnel Affected by Anomaly',
		'Staff Behavioral Anomaly',
		'Medical Emergency',
		'Missing Personnel Report',
		'Psychological Episode',
		'Personnel Contamination',
		'Staff Conflict Escalation',
		'Cognitive Influence Detected'
	],
	'external-threat': [
		'GOI Activity Detected',
		'External Attack Imminent',
		'Hostile Organization Operation',
		'Civilian Exposure Risk',
		'Government Inquiry',
		'Media Attention Alert',
		'Cult Activity Nearby',
		'Unknown Entity Approach'
	],
	'dimensional-anomaly': [
		'Dimensional Rift Detected',
		'Spatial Distortion Event',
		'Extradimensional Breach',
		'Reality Anchor Failure',
		'Pocket Dimension Collapse',
		'Dimensional Overlap',
		'Timeline Inconsistency',
		'Parallel Universe Contact'
	],
	'cognitohazard-exposure': [
		'Memetic Contamination',
		'Infohazard Release',
		'Mass Hallucination Event',
		'Cognitohazard Breach',
		'Pattern Recognition Anomaly',
		'Compulsion Effect Detected',
		'Memory Alteration Event',
		'Perception Distortion'
	],
	'facility-emergency': [
		'Fire Suppression Activated',
		'Structural Integrity Warning',
		'Toxic Atmosphere Alert',
		'Radiation Leak Detected',
		'Biological Hazard',
		'Lockdown Protocol Active',
		'Evacuation Order',
		'Site-Wide Emergency'
	]
};

export const EVENT_DESCRIPTIONS: Record<EventType, string[]> = {
	'containment-breach': [
		'SCP entity has breached primary containment and is loose in the facility.',
		'Containment cell integrity has been compromised through unknown means.',
		'Entity has demonstrated previously unknown capabilities to escape containment.',
		'Multiple containment cells in the sector have failed simultaneously.',
		'Subject has manipulated personnel to facilitate breach.'
	],
	'anomalous-manifestation': [
		'A previously unknown anomaly has manifested within the facility.',
		'Unexpected anomalous activity detected by monitoring systems.',
		'Reality seems to be shifting in the affected area.',
		'New phenomenon has appeared with unknown properties.',
		'Spontaneous anomalous events occurring without clear source.'
	],
	'security-incident': [
		'Unauthorized personnel detected in restricted areas.',
		'Security systems show signs of external manipulation.',
		'Suspected hostile agent activity within the facility.',
		'Classified information may have been compromised.',
		'Security breach at facility perimeter.'
	],
	'equipment-malfunction': [
		'Critical containment equipment has unexpectedly failed.',
		'Facility-wide power fluctuations affecting multiple systems.',
		'Communication systems are operating intermittently or not at all.',
		'Environmental controls have ceased functioning properly.',
		'Backup systems failed to activate during primary failure.'
	],
	'personnel-incident': [
		'Staff member showing signs of anomalous influence.',
		'Personnel have gone missing from their assigned stations.',
		'Affected individuals exhibiting unusual behavior patterns.',
		'Medical emergency requiring immediate intervention.',
		'Personnel conflict has escalated to a dangerous level.'
	],
	'external-threat': [
		'Group of Interest operatives detected in the vicinity.',
		'Hostile organization has launched an operation against the facility.',
		'Civilian witnesses to anomalous events require management.',
		'Government officials demanding access to classified areas.',
		'Unknown entities approaching the facility perimeter.'
	],
	'dimensional-anomaly': [
		'A rift to another dimension has opened within the facility.',
		'Local space appears to be folding or distorting.',
		'Objects or entities from another dimension are appearing.',
		'Reality anchors are failing to maintain local stability.',
		'Timeline inconsistencies detected in affected areas.'
	],
	'cognitohazard-exposure': [
		'Personnel have been exposed to memetic or cognitohazardous material.',
		'Uncontrolled spread of infectious information patterns.',
		'Multiple staff members experiencing identical hallucinations.',
		'Compulsive behavior spreading through personnel.',
		'Memory alterations detected in affected individuals.'
	],
	'facility-emergency': [
		'Fire has broken out in multiple areas of the facility.',
		'Structural damage threatens building integrity.',
		'Hazardous materials have been released into the environment.',
		'Facility-wide lockdown has been initiated.',
		'Emergency evacuation procedures may be required.'
	]
};

export const IMMEDIATE_EFFECTS = [
	'All personnel in the area are to shelter in place immediately.',
	'Emergency response teams have been dispatched.',
	'Affected sector has been sealed pending assessment.',
	'Security personnel are establishing a perimeter.',
	'Medical teams are on standby for potential casualties.',
	'All non-essential personnel are being evacuated.',
	'Communication channels are being monitored for updates.',
	'Power has been rerouted to critical systems.',
	'Backup containment protocols have been activated.',
	'Mobile Task Force has been alerted.'
];

export const COMPLICATIONS = [
	'Secondary containment breach in adjacent sector',
	'Communication systems failing intermittently',
	'Key personnel are unaccounted for',
	'Anomalous effects spreading faster than anticipated',
	'Emergency equipment malfunctioning',
	'Hostile entities converging on location',
	'Structural damage blocking evacuation routes',
	'Multiple casualties among response teams',
	'Reality distortions interfering with operations',
	'Amnestic supplies running low',
	'Backup generators failing',
	'Additional anomalies manifesting',
	'Civilian witnesses at perimeter',
	'GOI operatives detected nearby',
	'Weather conditions hampering response',
	'Chain of command disrupted',
	'Vital research data at risk',
	'D-Class personnel have escaped during confusion',
	'Fire suppression systems depleted',
	'Psychological effects on personnel'
];

export const SUGGESTED_RESPONSES = [
	'Initiate full site lockdown and await MTF arrival.',
	'Deploy specialized containment equipment and personnel.',
	'Establish secondary containment perimeter.',
	'Begin emergency amnestic distribution protocols.',
	'Activate Scranton Reality Anchors in affected areas.',
	'Implement evacuation of non-essential personnel.',
	'Request O5 authorization for advanced countermeasures.',
	'Establish communication with entity if possible.',
	'Deploy anti-memetic countermeasures.',
	'Prepare for potential site-wide emergency protocols.',
	'Contact relevant GOI for potential assistance.',
	'Begin information suppression protocols.',
	'Activate emergency medical stations.',
	'Deploy remote observation drones.',
	'Initiate on-site nuclear fail-safe standby.'
];
