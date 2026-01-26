/**
 * Name banks for NPC generation
 * Mix of canonical SCP wiki names and procedurally-friendly additions
 */

// Researcher first names
export const RESEARCHER_FIRST_NAMES = [
	// Male names
	'Alexander',
	'Benjamin',
	'Charles',
	'Daniel',
	'Edward',
	'Frederick',
	'George',
	'Henry',
	'Isaac',
	'James',
	'Kenneth',
	'Leonard',
	'Michael',
	'Nathan',
	'Oliver',
	'Patrick',
	'Robert',
	'Samuel',
	'Thomas',
	'Victor',
	'William',
	// Female names
	'Alice',
	'Barbara',
	'Catherine',
	'Diana',
	'Eleanor',
	'Frances',
	'Grace',
	'Helena',
	'Irene',
	'Julia',
	'Katherine',
	'Laura',
	'Margaret',
	'Nancy',
	'Olivia',
	'Patricia',
	'Rachel',
	'Sarah',
	'Teresa',
	'Victoria',
	// Gender-neutral names
	'Alex',
	'Cameron',
	'Jordan',
	'Morgan',
	'Riley',
	'Taylor'
] as const;

// Researcher last names (includes some canonical SCP researchers)
export const RESEARCHER_LAST_NAMES = [
	// Canonical
	'Bright',
	'Clef',
	'Gears',
	'Kondraki',
	'Rights',
	'Glass',
	'King',
	'Mann',
	'Crow',
	'Iceberg',
	'Light',
	'Sorts',
	// Additional
	'Anderson',
	'Baker',
	'Chen',
	'Davidson',
	'Evans',
	'Fischer',
	'Garcia',
	'Harrison',
	'Ivanov',
	'Johnson',
	'Kowalski',
	'Larsson',
	'Mitchell',
	'Nakamura',
	'O\'Brien',
	'Petrov',
	'Quinn',
	'Rodriguez',
	'Schmidt',
	'Thompson',
	'Ulyanov',
	'Volkov',
	'Williams',
	'Xu',
	'Yamamoto',
	'Zhang'
] as const;

// Researcher titles
export const RESEARCHER_TITLES = [
	'Dr.',
	'Professor',
	'Researcher',
	'Senior Researcher',
	'Junior Researcher',
	'Research Assistant',
	'Lead Researcher',
	'Site Director',
	'Department Head'
] as const;

// MTF phonetic alphabet for callsigns
export const NATO_PHONETIC = [
	'Alpha',
	'Bravo',
	'Charlie',
	'Delta',
	'Echo',
	'Foxtrot',
	'Golf',
	'Hotel',
	'India',
	'Juliet',
	'Kilo',
	'Lima',
	'Mike',
	'November',
	'Oscar',
	'Papa',
	'Quebec',
	'Romeo',
	'Sierra',
	'Tango',
	'Uniform',
	'Victor',
	'Whiskey',
	'X-Ray',
	'Yankee',
	'Zulu'
] as const;

// MTF nicknames/callsigns
export const MTF_NICKNAMES = [
	'Ghost',
	'Hammer',
	'Wraith',
	'Phantom',
	'Shadow',
	'Reaper',
	'Viper',
	'Falcon',
	'Wolf',
	'Bear',
	'Eagle',
	'Hawk',
	'Tiger',
	'Cobra',
	'Raven',
	'Storm',
	'Thunder',
	'Lightning',
	'Blade',
	'Steel',
	'Iron',
	'Stone',
	'Frost',
	'Blaze',
	'Spectre',
	'Knight',
	'Bishop',
	'Rook',
	'Castle',
	'Crown'
] as const;

// D-Class identifiers (format: D-XXXX)
export const D_CLASS_PREFIX = 'D-';

// Security personnel first names (more military style)
export const SECURITY_FIRST_NAMES = [
	'Marcus',
	'Jake',
	'Ryan',
	'Derek',
	'Kyle',
	'Travis',
	'Brandon',
	'Tyler',
	'Justin',
	'Eric',
	'Sean',
	'Keith',
	'Carlos',
	'Miguel',
	'Andre',
	'Wayne',
	'Bruce',
	'Grant',
	'Cole',
	'Blake'
] as const;

// Administrative staff names
export const ADMIN_FIRST_NAMES = [
	'Jennifer',
	'Michelle',
	'Amanda',
	'Stephanie',
	'Nicole',
	'Rebecca',
	'Lisa',
	'Karen',
	'Susan',
	'Linda',
	'David',
	'Richard',
	'Mark',
	'Paul',
	'Steven',
	'Andrew',
	'Christopher',
	'Matthew',
	'Anthony',
	'Brian'
] as const;

// Medical staff names
export const MEDICAL_FIRST_NAMES = [
	'Elizabeth',
	'Mary',
	'Emily',
	'Jessica',
	'Christine',
	'Anne',
	'Helen',
	'Ruth',
	'John',
	'William',
	'Peter',
	'Joseph',
	'David',
	'James',
	'Robert',
	'Michael'
] as const;

// Departments
export const DEPARTMENTS = [
	'Containment',
	'Research',
	'Security',
	'Medical',
	'Administration',
	'Logistics',
	'Engineering',
	'Information Technology',
	'Human Resources',
	'Ethics Committee Liaison',
	'External Affairs',
	'Internal Security',
	'Anomalous Materials',
	'Memetics Division',
	'Antimemetics Division',
	'Temporal Anomalies',
	'Biological Research',
	'Paranormal Studies',
	'Tactical Response'
] as const;

// NPC backgrounds
export const NPC_BACKGROUNDS = [
	'Former military intelligence officer',
	'Recruited from prestigious university research program',
	'Survivor of an anomalous event',
	'Former GOC operative',
	'Transferred from another Foundation site',
	'Witness to containment breach, subsequently recruited',
	'Child of Foundation personnel',
	'Discovered anomalous abilities at young age',
	'Former police detective specializing in unexplained cases',
	'Academic researcher who stumbled onto Foundation activity',
	'Ex-Chaos Insurgency defector',
	'Recruited through Foundation front company',
	'Former paramedic with unusual incident history',
	'Cryptographer recruited from government agency',
	'Anthropologist with expertise in anomalous cultures',
	'Engineer who designed containment systems',
	'Psychologist specializing in anomalous cognition',
	'Former journalist who got too close to the truth',
	'Religious scholar researching occult phenomena',
	'Physicist researching theoretical anomalies'
] as const;

// NPC quirks/personality traits
export const NPC_QUIRKS = [
	'Always carries a lucky charm',
	'Refuses to work after midnight',
	'Obsessively documents everything',
	'Never makes eye contact',
	'Speaks in technical jargon constantly',
	'Has an unusual pet in their office',
	'Collects memorabilia from contained anomalies',
	'Insists on triple-checking all containment protocols',
	'Known for dark humor about dangerous SCPs',
	'Always wears sunglasses indoors',
	'Has a nervous tic when discussing specific SCPs',
	'Keeps personal distance from all colleagues',
	'Overuses military terminology',
	'Writes poetry about anomalies',
	'Has an encyclopedic memory for SCP numbers',
	'Paranoid about memetic hazards',
	'Always carries emergency amnestics',
	'Refuses to enter certain site sectors',
	'Has survived an unusual number of incidents',
	'Known to talk to inanimate objects',
	'Extremely superstitious despite scientific background',
	'Never eats in the cafeteria',
	'Sleeps in their office regularly',
	'Has unusual scars they refuse to explain'
] as const;

// Specializations
export const SPECIALIZATIONS = [
	'Memetics',
	'Antimemetics',
	'Cognitohazards',
	'Infohazards',
	'Temporal mechanics',
	'Spatial anomalies',
	'Biological containment',
	'Chemical containment',
	'Entity psychology',
	'Anomalous linguistics',
	'Thaumatology',
	'Reality anchoring',
	'Cross-testing protocols',
	'Keter-class containment',
	'Neutralization procedures',
	'Amnestic application',
	'Witness handling',
	'Disinformation campaigns',
	'Rapid response tactics',
	'Anomalous technology reverse-engineering'
] as const;

// Generate D-Class designation
export function generateDClassDesignation(): string {
	const num = Math.floor(Math.random() * 9000) + 1000;
	return `${D_CLASS_PREFIX}${num}`;
}

// Generate MTF callsign
export function generateMTFCallsign(): string {
	const letter = NATO_PHONETIC[Math.floor(Math.random() * NATO_PHONETIC.length)];
	const num = Math.floor(Math.random() * 12) + 1;
	return `${letter}-${num}`;
}
