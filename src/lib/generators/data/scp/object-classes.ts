// SCP Object Classes and Classification Data

export const OBJECT_CLASSES = ['Safe', 'Euclid', 'Keter', 'Thaumiel', 'Neutralized', 'Apollyon', 'Archon'] as const;
export type ObjectClass = typeof OBJECT_CLASSES[number];

export const OBJECT_CLASS_DESCRIPTIONS: Record<ObjectClass, string> = {
	Safe: 'Anomalies that are easily and safely contained. May still be dangerous when activated or triggered.',
	Euclid: 'Anomalies that require more resources to contain or are unpredictable in nature.',
	Keter: 'Anomalies that are exceedingly difficult to contain consistently or reliably.',
	Thaumiel: 'Anomalies utilized to contain or counteract other anomalies.',
	Neutralized: 'Anomalies that are no longer anomalous through destruction or disabling.',
	Apollyon: 'Anomalies that cannot be contained and pose an existential threat.',
	Archon: 'Anomalies that could theoretically be contained but should not be.'
};

export const DISRUPTION_CLASSES = ['Dark', 'Vlam', 'Keneq', 'Ekhi', 'Amida'] as const;
export type DisruptionClass = typeof DISRUPTION_CLASSES[number];

export const DISRUPTION_CLASS_DESCRIPTIONS: Record<DisruptionClass, string> = {
	Dark: 'Disruption is essentially nonexistent. Containment does not disrupt the status quo.',
	Vlam: 'Disruption is localized to a small group of people.',
	Keneq: 'Disruption extends to a single city or small region.',
	Ekhi: 'Disruption extends to an entire country or continent.',
	Amida: 'Disruption affects the entire known world or reality itself.'
};

export const RISK_CLASSES = ['Notice', 'Caution', 'Warning', 'Danger', 'Critical'] as const;
export type RiskClass = typeof RISK_CLASSES[number];

export const RISK_CLASS_DESCRIPTIONS: Record<RiskClass, string> = {
	Notice: 'Poses no threat to personnel interacting with it.',
	Caution: 'Poses slight risk that can be avoided with minimal precautions.',
	Warning: 'Poses significant risk requiring protective measures.',
	Danger: 'Poses extreme risk with high likelihood of injury or death.',
	Critical: 'Poses immediate existential danger to all who encounter it.'
};
