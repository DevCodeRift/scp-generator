import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const PersonnelClearanceSchema = z.enum([
	'level-0',
	'level-1',
	'level-2',
	'level-3',
	'level-4',
	'level-5',
	'o5-council'
]);
export type PersonnelClearance = z.infer<typeof PersonnelClearanceSchema>;

export const PersonnelStatusSchema = z.enum([
	'active',
	'inactive',
	'field-duty',
	'medical-leave',
	'suspended',
	'deceased',
	'mia',
	'kia',
	'terminated',
	'amnesticized'
]);
export type PersonnelStatus = z.infer<typeof PersonnelStatusSchema>;

export const PersonnelTypeSchema = z.enum([
	'researcher',
	'security',
	'mtf',
	'd-class',
	'administrative',
	'medical',
	'technical',
	'field-agent',
	'other'
]);
export type PersonnelType = z.infer<typeof PersonnelTypeSchema>;

export const PersonnelFileSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('personnel'),
	staffId: z.string().min(1, 'Staff ID is required'),
	fullName: z.string().min(1, 'Full name is required'),
	aliases: z.string().optional(),
	dateOfBirth: z.string().optional(),
	nationality: z.string().optional(),
	photoUrl: z.string().optional(),
	personnelType: PersonnelTypeSchema,
	clearanceLevel: PersonnelClearanceSchema,
	department: z.string().optional(),
	site: z.string().optional(),
	supervisor: z.string().optional(),
	status: PersonnelStatusSchema,
	dateJoined: z.string().optional(),
	education: z.string().optional(),
	specializations: z.string().optional(),
	languages: z.string().optional(),
	previousAssignments: z.string().optional(),
	psychProfile: z.string().optional(),
	medicalNotes: z.string().optional(),
	notes: z.string().optional(),
	showPhoto: z.boolean().default(true),
	showRedactedSections: z.boolean().default(false)
});
export type PersonnelFile = z.infer<typeof PersonnelFileSchema>;

export const defaultPersonnelFile: PersonnelFile = {
	metadata: {
		faction: 'foundation',
		classification: 'confidential',
		clearanceLevel: '2'
	},
	type: 'personnel',
	staffId: 'SC-XXXXX',
	fullName: '',
	personnelType: 'researcher',
	clearanceLevel: 'level-2',
	status: 'active',
	showPhoto: true,
	showRedactedSections: false
};

export const PERSONNEL_CLEARANCE_INFO: Record<PersonnelClearance, { label: string; color: string }> = {
	'level-0': { label: 'Level 0 (Public)', color: '#888888' },
	'level-1': { label: 'Level 1 (Official Use)', color: '#00aa00' },
	'level-2': { label: 'Level 2 (Restricted)', color: '#cccc00' },
	'level-3': { label: 'Level 3 (Secret)', color: '#ff8800' },
	'level-4': { label: 'Level 4 (Top Secret)', color: '#cc0000' },
	'level-5': { label: 'Level 5 (Thaumiel)', color: '#990000' },
	'o5-council': { label: 'O5 Council', color: '#000000' }
};

export const PERSONNEL_STATUS_INFO: Record<PersonnelStatus, { label: string; color: string }> = {
	'active': { label: 'Active', color: '#00aa00' },
	'inactive': { label: 'Inactive', color: '#888888' },
	'field-duty': { label: 'Field Duty', color: '#0088cc' },
	'medical-leave': { label: 'Medical Leave', color: '#cccc00' },
	'suspended': { label: 'Suspended', color: '#ff8800' },
	'deceased': { label: 'Deceased', color: '#cc0000' },
	'mia': { label: 'Missing In Action', color: '#990000' },
	'kia': { label: 'Killed In Action', color: '#660000' },
	'terminated': { label: 'Terminated', color: '#000000' },
	'amnesticized': { label: 'Amnesticized', color: '#666666' }
};

export const PERSONNEL_TYPE_INFO: Record<PersonnelType, { label: string }> = {
	'researcher': { label: 'Researcher' },
	'security': { label: 'Security Personnel' },
	'mtf': { label: 'Mobile Task Force' },
	'd-class': { label: 'D-Class Personnel' },
	'administrative': { label: 'Administrative Staff' },
	'medical': { label: 'Medical Staff' },
	'technical': { label: 'Technical Specialist' },
	'field-agent': { label: 'Field Agent' },
	'other': { label: 'Other' }
};
