/**
 * Session State Store
 * Manages the GM's live session state with localStorage persistence
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// Types
export type AlertLevel = 'green' | 'yellow' | 'red' | 'black';
export type ContainmentStatus = 'contained' | 'breaching' | 'loose' | 'neutralized' | 'unknown';
export type PersonnelStatus = 'active' | 'injured' | 'kia' | 'mia' | 'compromised';
export type CommQuality = 'clear' | 'static' | 'interference' | 'signal-lost';

export interface ContainmentEntry {
	id: string;
	designation: string; // e.g., "SCP-173"
	status: ContainmentStatus;
	threatLevel: 1 | 2 | 3 | 4 | 5;
	location: string;
	notes: string;
}

export interface PersonnelEntry {
	id: string;
	name: string;
	role: string;
	status: PersonnelStatus;
	location: string;
	notes: string;
}

export interface CommsEntry {
	id: string;
	timestamp: string;
	sender: string;
	message: string;
	quality: CommQuality;
}

export interface SessionState {
	id: string;
	siteName: string;
	startedAt: string;
	alertLevel: AlertLevel;
	lockdownZones: string[];
	powerStatus: 'normal' | 'fluctuating' | 'backup' | 'offline';
	commsStatus: 'normal' | 'interference' | 'limited' | 'offline';
	containment: ContainmentEntry[];
	personnel: PersonnelEntry[];
	commsLog: CommsEntry[];
}

// Default state
const defaultState: SessionState = {
	id: '',
	siteName: 'Site-19',
	startedAt: '',
	alertLevel: 'green',
	lockdownZones: [],
	powerStatus: 'normal',
	commsStatus: 'normal',
	containment: [],
	personnel: [],
	commsLog: []
};

// Storage key
const STORAGE_KEY = 'scp-session-state';

// Load from localStorage
function loadState(): SessionState {
	if (!browser) return { ...defaultState };

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.error('Failed to load session state:', e);
	}

	return { ...defaultState };
}

// Save to localStorage
function saveState(state: SessionState) {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save session state:', e);
	}
}

// Create the store
function createSessionStore() {
	const { subscribe, set, update } = writable<SessionState>(loadState());

	// Auto-save on changes
	subscribe((state) => {
		saveState(state);
	});

	return {
		subscribe,

		// Session management
		startNewSession(siteName: string = 'Site-19') {
			const newState: SessionState = {
				...defaultState,
				id: crypto.randomUUID(),
				siteName,
				startedAt: new Date().toISOString()
			};
			set(newState);
		},

		resetSession() {
			set({ ...defaultState });
		},

		// Alert level
		setAlertLevel(level: AlertLevel) {
			update(s => ({ ...s, alertLevel: level }));
		},

		// Lockdown zones
		addLockdownZone(zone: string) {
			update(s => ({
				...s,
				lockdownZones: [...s.lockdownZones, zone]
			}));
		},

		removeLockdownZone(zone: string) {
			update(s => ({
				...s,
				lockdownZones: s.lockdownZones.filter(z => z !== zone)
			}));
		},

		toggleLockdownZone(zone: string) {
			update(s => {
				if (s.lockdownZones.includes(zone)) {
					return { ...s, lockdownZones: s.lockdownZones.filter(z => z !== zone) };
				} else {
					return { ...s, lockdownZones: [...s.lockdownZones, zone] };
				}
			});
		},

		// Power/Comms status
		setPowerStatus(status: SessionState['powerStatus']) {
			update(s => ({ ...s, powerStatus: status }));
		},

		setCommsStatus(status: SessionState['commsStatus']) {
			update(s => ({ ...s, commsStatus: status }));
		},

		// Containment management
		addContainment(entry: Omit<ContainmentEntry, 'id'>) {
			const newEntry: ContainmentEntry = {
				...entry,
				id: crypto.randomUUID()
			};
			update(s => ({
				...s,
				containment: [...s.containment, newEntry]
			}));
			return newEntry.id;
		},

		updateContainment(id: string, updates: Partial<ContainmentEntry>) {
			update(s => ({
				...s,
				containment: s.containment.map(c =>
					c.id === id ? { ...c, ...updates } : c
				)
			}));
		},

		removeContainment(id: string) {
			update(s => ({
				...s,
				containment: s.containment.filter(c => c.id !== id)
			}));
		},

		setContainmentStatus(id: string, status: ContainmentStatus) {
			update(s => ({
				...s,
				containment: s.containment.map(c =>
					c.id === id ? { ...c, status } : c
				)
			}));
		},

		// Personnel management
		addPersonnel(entry: Omit<PersonnelEntry, 'id'>) {
			const newEntry: PersonnelEntry = {
				...entry,
				id: crypto.randomUUID()
			};
			update(s => ({
				...s,
				personnel: [...s.personnel, newEntry]
			}));
			return newEntry.id;
		},

		updatePersonnel(id: string, updates: Partial<PersonnelEntry>) {
			update(s => ({
				...s,
				personnel: s.personnel.map(p =>
					p.id === id ? { ...p, ...updates } : p
				)
			}));
		},

		removePersonnel(id: string) {
			update(s => ({
				...s,
				personnel: s.personnel.filter(p => p.id !== id)
			}));
		},

		setPersonnelStatus(id: string, status: PersonnelStatus) {
			update(s => ({
				...s,
				personnel: s.personnel.map(p =>
					p.id === id ? { ...p, status } : p
				)
			}));
		},

		// Comms log
		addCommsEntry(entry: Omit<CommsEntry, 'id' | 'timestamp'>) {
			const newEntry: CommsEntry = {
				...entry,
				id: crypto.randomUUID(),
				timestamp: new Date().toLocaleTimeString('en-US', {
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit'
				})
			};
			update(s => ({
				...s,
				commsLog: [...s.commsLog, newEntry]
			}));
			return newEntry.id;
		},

		updateCommsEntry(id: string, updates: Partial<CommsEntry>) {
			update(s => ({
				...s,
				commsLog: s.commsLog.map(c =>
					c.id === id ? { ...c, ...updates } : c
				)
			}));
		},

		removeCommsEntry(id: string) {
			update(s => ({
				...s,
				commsLog: s.commsLog.filter(c => c.id !== id)
			}));
		},

		clearCommsLog() {
			update(s => ({ ...s, commsLog: [] }));
		},

		// Export comms log as text
		exportCommsLog(): string {
			const state = get({ subscribe });
			if (state.commsLog.length === 0) return '';

			const header = `=== COMMUNICATIONS LOG ===\nSite: ${state.siteName}\nExported: ${new Date().toISOString()}\n${'='.repeat(30)}\n\n`;

			const entries = state.commsLog.map(entry => {
				let qualityMarker = '';
				switch (entry.quality) {
					case 'static': qualityMarker = ' [STATIC]'; break;
					case 'interference': qualityMarker = ' [INTERFERENCE]'; break;
					case 'signal-lost': qualityMarker = ' [SIGNAL LOST]'; break;
				}
				return `[${entry.timestamp}] ${entry.sender}${qualityMarker}: ${entry.message}`;
			}).join('\n');

			return header + entries;
		}
	};
}

export const sessionStore = createSessionStore();

// Derived stores for easy access
export const alertLevel = derived(sessionStore, $s => $s.alertLevel);
export const containmentList = derived(sessionStore, $s => $s.containment);
export const personnelList = derived(sessionStore, $s => $s.personnel);
export const commsLog = derived(sessionStore, $s => $s.commsLog);

// Stats derived store
export const sessionStats = derived(sessionStore, $s => ({
	totalSCPs: $s.containment.length,
	breached: $s.containment.filter(c => c.status === 'breaching' || c.status === 'loose').length,
	contained: $s.containment.filter(c => c.status === 'contained').length,
	totalPersonnel: $s.personnel.length,
	active: $s.personnel.filter(p => p.status === 'active').length,
	casualties: $s.personnel.filter(p => p.status === 'kia' || p.status === 'mia').length,
	commsCount: $s.commsLog.length
}));

// Alert level labels and colors
export const ALERT_LEVELS: Record<AlertLevel, { label: string; description: string; color: string }> = {
	green: {
		label: 'GREEN',
		description: 'Normal Operations',
		color: '#22c55e'
	},
	yellow: {
		label: 'YELLOW',
		description: 'Elevated Alert',
		color: '#eab308'
	},
	red: {
		label: 'RED',
		description: 'Active Threat',
		color: '#ef4444'
	},
	black: {
		label: 'BLACK',
		description: 'Catastrophic Event',
		color: '#1f2937'
	}
};

// Status labels
export const CONTAINMENT_STATUS_LABELS: Record<ContainmentStatus, string> = {
	contained: 'CONTAINED',
	breaching: 'BREACHING',
	loose: 'LOOSE',
	neutralized: 'NEUTRALIZED',
	unknown: 'UNKNOWN'
};

export const PERSONNEL_STATUS_LABELS: Record<PersonnelStatus, string> = {
	active: 'Active',
	injured: 'Injured',
	kia: 'KIA',
	mia: 'MIA',
	compromised: 'Compromised'
};
