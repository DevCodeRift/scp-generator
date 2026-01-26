import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

// Clearance levels for badges
export const BadgeClearanceSchema = z.enum([
	'level-0',
	'level-1',
	'level-2',
	'level-3',
	'level-4',
	'level-5',
	'o5'
]);
export type BadgeClearance = z.infer<typeof BadgeClearanceSchema>;

// Badge types
export const BadgeTypeSchema = z.enum([
	'standard',
	'temporary',
	'visitor',
	'd-class',
	'contractor',
	'mtf'
]);
export type BadgeType = z.infer<typeof BadgeTypeSchema>;

// Badge style
export const BadgeStyleSchema = z.enum([
	'modern',
	'classic',
	'minimal',
	'secure'
]);
export type BadgeStyle = z.infer<typeof BadgeStyleSchema>;

// Main ID Badge schema
export const IDBadgeSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('id-badge'),

	// Identity
	staffId: z.string().min(1, 'Staff ID is required'),
	fullName: z.string().min(1, 'Full name is required'),
	title: z.string().optional(),

	// Assignment
	department: z.string().optional(),
	site: z.string().optional(),
	clearanceLevel: BadgeClearanceSchema,
	badgeType: BadgeTypeSchema,

	// Validity
	issueDate: z.string().optional(),
	expiryDate: z.string().optional(),

	// Photo
	photoUrl: z.string().optional(),

	// Access
	accessZones: z.string().optional(),
	restrictions: z.string().optional(),

	// Display options
	badgeStyle: BadgeStyleSchema,
	showBarcode: z.boolean().default(true),
	showPhoto: z.boolean().default(true),
	showAccessZones: z.boolean().default(false),
	showExpiry: z.boolean().default(true)
});
export type IDBadge = z.infer<typeof IDBadgeSchema>;

// Default values
export const defaultIDBadge: IDBadge = {
	metadata: {
		faction: 'foundation',
		classification: 'restricted',
		clearanceLevel: '2'
	},
	type: 'id-badge',
	staffId: 'SC-XXXXX',
	fullName: '',
	clearanceLevel: 'level-2',
	badgeType: 'standard',
	badgeStyle: 'modern',
	showBarcode: true,
	showPhoto: true,
	showAccessZones: false,
	showExpiry: true
};

// Labels for UI
export const BADGE_CLEARANCE_INFO: Record<BadgeClearance, { label: string; color: string; bgColor: string }> = {
	'level-0': { label: 'LEVEL 0', color: '#ffffff', bgColor: '#666666' },
	'level-1': { label: 'LEVEL 1', color: '#ffffff', bgColor: '#228b22' },
	'level-2': { label: 'LEVEL 2', color: '#000000', bgColor: '#ffd700' },
	'level-3': { label: 'LEVEL 3', color: '#ffffff', bgColor: '#ff8c00' },
	'level-4': { label: 'LEVEL 4', color: '#ffffff', bgColor: '#dc143c' },
	'level-5': { label: 'LEVEL 5', color: '#ffffff', bgColor: '#8b0000' },
	'o5': { label: 'O5 COUNCIL', color: '#ffffff', bgColor: '#000000' }
};

export const BADGE_TYPE_INFO: Record<BadgeType, { label: string; borderColor: string }> = {
	'standard': { label: 'Standard Personnel', borderColor: '#333333' },
	'temporary': { label: 'Temporary Access', borderColor: '#ff8c00' },
	'visitor': { label: 'Visitor Pass', borderColor: '#4169e1' },
	'd-class': { label: 'D-Class Personnel', borderColor: '#ff4500' },
	'contractor': { label: 'External Contractor', borderColor: '#9932cc' },
	'mtf': { label: 'Mobile Task Force', borderColor: '#006400' }
};

export const BADGE_STYLE_INFO: Record<BadgeStyle, { label: string }> = {
	'modern': { label: 'Modern' },
	'classic': { label: 'Classic' },
	'minimal': { label: 'Minimal' },
	'secure': { label: 'High Security' }
};
