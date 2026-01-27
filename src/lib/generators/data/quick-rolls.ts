/**
 * Quick Roll Tables for mid-session improvisation
 * One-click generation of complications, discoveries, and responses
 */

export const COMPLICATIONS = [
	// Power/Infrastructure
	'The lights flicker and die in this sector.',
	'Emergency lighting activates with a red glow.',
	'A power surge causes nearby electronics to spark.',
	'The ventilation system shuts down unexpectedly.',
	'Blast doors begin closing throughout the corridor.',
	'Fire suppression system activates without cause.',
	'The elevator stops between floors.',
	'Emergency bulkheads seal, trapping personnel.',

	// Audio/Sensory
	'A scream echoes from somewhere nearby.',
	'Static bursts from all nearby radios simultaneously.',
	'An alarm begins blaring - wrong sector, wrong type.',
	'The PA system crackles with an unintelligible message.',
	'Distant gunfire - three shots, then silence.',
	'Metal scraping on concrete, getting closer.',
	'A child\'s laughter echoes through the vents.',
	'Complete silence falls - unnaturally so.',

	// Personnel
	'A security guard rounds the corner, visibly shaken.',
	'Someone is pounding on a sealed door ahead.',
	'A researcher stumbles past, refusing to make eye contact.',
	'Radio check reveals one team member isn\'t responding.',
	'Blood trail leads around the next corner.',
	'The previous team left their equipment behind.',
	'Someone has scrawled a warning on the wall.',
	'A D-Class is running the opposite direction, screaming.',

	// Anomalous
	'Your reflection in the glass moves wrong.',
	'The temperature drops sharply - breath becomes visible.',
	'Shadows in the corner don\'t match their sources.',
	'Objects on a nearby desk have been rearranged.',
	'The same corridor ahead that you just came from.',
	'Writing appears on the wall that wasn\'t there before.',
	'Your radio picks up your own voice - from an hour ago.',
	'The lights are on, but something is eating the shadows.',

	// Equipment/Technical
	'Your flashlight batteries are suddenly dead.',
	'GPS shows you\'re 200 meters underground.',
	'Cameras in this sector have been disabled.',
	'Your keycard no longer works.',
	'The containment door opens on its own.',
	'Someone has erased the last hour of security footage.',
	'Your equipment is reading impossible values.',
	'All the clocks in sight show different times.'
] as const;

export const DISCOVERIES = [
	// Bodies/Evidence
	'A body, security uniform, recently deceased.',
	'Blood smear leading into the vents.',
	'A D-Class corpse with a smile frozen on its face.',
	'Claw marks on the inside of a containment cell door.',
	'Shell casings scattered across the floor.',
	'A severed hand still clutching a keycard.',
	'Bite marks on the walls, human-sized.',
	'Someone wrote their final message in blood.',

	// Documents/Intel
	'A researcher\'s journal, last entry today.',
	'Scattered papers - looks like classified reports.',
	'A security badge, clearance level above yours.',
	'A handwritten note: "DON\'T TRUST THE DOCTOR".',
	'Photographs of something that shouldn\'t exist.',
	'A tablet, still logged into the containment database.',
	'Evacuation orders dated three days ago.',
	'A torn page from a containment protocol.',

	// Equipment
	'An abandoned medical kit, partially used.',
	'A weapon, recently fired, discarded.',
	'Someone\'s radio, still receiving transmissions.',
	'Night vision goggles with one lens cracked.',
	'A hazmat suit, removed in a hurry.',
	'Empty amnestic vials scattered on the floor.',
	'A containment device, activated but empty.',
	'Scranton Reality Anchor, its light blinking red.',

	// Anomalous Items
	'An object that doesn\'t quite look right.',
	'Something moving in a sealed specimen jar.',
	'A mirror reflecting an empty room.',
	'A music box, playing by itself.',
	'Flowers growing from the concrete.',
	'A clock running backwards.',
	'Photographs that change when you look away.',
	'A locked box that\'s warm to the touch.',

	// Environmental
	'Signs of a struggle - furniture overturned.',
	'An open containment cell, supposedly occupied.',
	'Scratch marks on the ceiling - deep gouges.',
	'The walls here are covered in some kind of growth.',
	'A puddle of liquid that isn\'t water.',
	'Footprints that end in the middle of the room.',
	'Everything in this room is exactly 10cm out of place.',
	'A perfectly circular hole in the wall.'
] as const;

export const RESPONSES = [
	// MTF/Security
	'MTF squad is inbound, ETA 5 minutes.',
	'Security teams are establishing a perimeter.',
	'Reinforcements have been delayed - another incident.',
	'An MTF unit requests your position.',
	'Armed response team is holding at the checkpoint.',
	'Security advises you proceed with extreme caution.',
	'Backup is not available - you\'re on your own.',
	'A recovery team is en route to your last known position.',

	// Command
	'Site Director orders immediate lockdown expansion.',
	'Site Director authorizes lethal force.',
	'Command orders you to hold position.',
	'New orders: Abort mission, evacuate immediately.',
	'Priority update: Primary objective has changed.',
	'Command has lost communication with Site-[STATIC].',
	'O5 Command has taken direct control of the situation.',
	'Ethics Committee has authorized Protocol [REDACTED].',

	// Containment
	'Re-containment specialists are being deployed.',
	'Containment breach protocols are now in effect.',
	'Secondary containment measures have failed.',
	'Amnestic teams are standing by.',
	'Scranton anchors are being activated site-wide.',
	'Thaumaturgy division has been notified.',
	'Cognitohazard containment procedures initiated.',
	'Nuclear failsafe is on standby.',

	// Updates
	'The situation is escalating faster than predicted.',
	'Additional anomalies have been detected.',
	'Casualties are mounting in Sector [designation].',
	'Evacuation of non-essential personnel is underway.',
	'Medical teams report overwhelming injuries.',
	'Communications are being jammed from an unknown source.',
	'Foundation aircraft are on approach.',
	'External authorities are asking questions.'
] as const;

export const SOUNDS = [
	'Distant gunfire - controlled, tactical bursts.',
	'An explosion, somewhere deeper in the facility.',
	'Metal groaning under immense stress.',
	'Footsteps overhead - many, running.',
	'A containment alarm from an adjacent sector.',
	'Something large moving through the walls.',
	'Dripping - too rhythmic to be natural.',
	'Whispers from the ventilation system.',
	'A door slamming, then slamming again, and again.',
	'The hum of machinery winding down.',
	'Screaming - abruptly cut off.',
	'A wet, tearing sound from nearby.',
	'Classical music, echoing from unknown source.',
	'Breathing - heavy, close, but you can\'t see anyone.',
	'Static building to an unbearable pitch.',
	'Complete silence - your own heartbeat deafening.',
	'A voice calling your name.',
	'Something dragging across the floor above.',
	'Glass breaking in a cascade.',
	'The distinct sound of containment cell doors unlocking.'
] as const;

export const QUICK_NPCS = [
	// Researchers
	{ name: 'Dr. Vasquez', role: 'Researcher', trait: 'Hands won\'t stop shaking' },
	{ name: 'Dr. Chen', role: 'Researcher', trait: 'Refuses to look at shadows' },
	{ name: 'Dr. Morrison', role: 'Researcher', trait: 'Keeps checking their watch' },
	{ name: 'Dr. Okafor', role: 'Researcher', trait: 'Speaking only in whispers' },
	{ name: 'Dr. Petrov', role: 'Researcher', trait: 'Clutching a sealed document' },
	{ name: 'Dr. Williams', role: 'Researcher', trait: 'Blood on their lab coat' },

	// Security
	{ name: 'Officer Reyes', role: 'Security', trait: 'Down to their last magazine' },
	{ name: 'Officer Burke', role: 'Security', trait: 'Injured, still fighting' },
	{ name: 'Officer Kim', role: 'Security', trait: 'Won\'t leave their post' },
	{ name: 'Officer Thompson', role: 'Security', trait: 'Saw something they can\'t explain' },
	{ name: 'Officer Novak', role: 'Security', trait: 'Radio damaged, isolated' },
	{ name: 'Officer Singh', role: 'Security', trait: 'Carrying a wounded colleague' },

	// D-Class
	{ name: 'D-4891', role: 'D-Class', trait: 'Knows more than they should' },
	{ name: 'D-7732', role: 'D-Class', trait: 'Former military, taking charge' },
	{ name: 'D-2156', role: 'D-Class', trait: 'In shock, unresponsive' },
	{ name: 'D-8844', role: 'D-Class', trait: 'Begging to be left behind' },
	{ name: 'D-3367', role: 'D-Class', trait: 'Survived previous breach' },
	{ name: 'D-5501', role: 'D-Class', trait: 'Strangely calm about everything' },

	// Other
	{ name: 'Agent Shaw', role: 'Field Agent', trait: 'Here on a classified mission' },
	{ name: 'Tech Kowalski', role: 'Technician', trait: 'Can restore power - for a price' },
	{ name: 'Nurse Tanaka', role: 'Medical', trait: 'Running low on supplies' },
	{ name: 'Chaplain Hayes', role: 'Counselor', trait: 'Praying, loudly' },
	{ name: 'Director Young', role: 'Administrator', trait: 'Demanding evacuation priority' },
	{ name: 'Janitor Marcus', role: 'Maintenance', trait: 'Knows every secret passage' }
] as const;

// Quick generator functions
import { quickPick } from '../core/random';

export function rollComplication(): string {
	return quickPick([...COMPLICATIONS]);
}

export function rollDiscovery(): string {
	return quickPick([...DISCOVERIES]);
}

export function rollResponse(): string {
	return quickPick([...RESPONSES]);
}

export function rollSound(): string {
	return quickPick([...SOUNDS]);
}

export function rollQuickNPC(): { name: string; role: string; trait: string } {
	return { ...quickPick([...QUICK_NPCS]) };
}
