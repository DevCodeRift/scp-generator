import { z } from 'zod';
import { DocumentMetadataSchema } from './common';

export const DirectivePrioritySchema = z.enum([
	'routine',
	'priority',
	'urgent',
	'critical',
	'omega'
]);
export type DirectivePriority = z.infer<typeof DirectivePrioritySchema>;

export const IssuingAuthoritySchema = z.enum([
	'o5-council',
	'o5-individual',
	'ethics-committee',
	'administrator',
	'regional-director',
	'site-director'
]);
export type IssuingAuthority = z.infer<typeof IssuingAuthoritySchema>;

export const DirectiveTypeSchema = z.enum([
	'general-order',
	'containment-revision',
	'personnel-action',
	'resource-allocation',
	'information-control',
	'termination-order',
	'amnesty',
	'special-protocol'
]);
export type DirectiveType = z.infer<typeof DirectiveTypeSchema>;

export const DirectiveSchema = z.object({
	metadata: DocumentMetadataSchema,
	type: z.literal('directive'),
	directiveNumber: z.string().min(1, 'Directive number is required'),
	directiveType: DirectiveTypeSchema,
	priority: DirectivePrioritySchema,
	issuingAuthority: IssuingAuthoritySchema,
	o5Designation: z.string().optional(),
	dateIssued: z.string().optional(),
	effectiveDate: z.string().optional(),
	expirationDate: z.string().optional(),
	subject: z.string().min(1, 'Subject is required'),
	relatedSCPs: z.string().optional(),
	affectedSites: z.string().optional(),
	affectedPersonnel: z.string().optional(),
	preamble: z.string().optional(),
	directiveContent: z.string().min(1, 'Directive content is required'),
	justification: z.string().optional(),
	complianceRequirements: z.string().optional(),
	reportingRequirements: z.string().optional(),
	penalties: z.string().optional(),
	signatures: z.string().optional(),
	showSeal: z.boolean().default(true),
	showClassificationBars: z.boolean().default(true),
	showRedactedSections: z.boolean().default(false)
});
export type Directive = z.infer<typeof DirectiveSchema>;

export const defaultDirective: Directive = {
	metadata: {
		faction: 'foundation',
		classification: 'top-secret',
		clearanceLevel: '5'
	},
	type: 'directive',
	directiveNumber: 'O5-DIR-XXXX',
	directiveType: 'general-order',
	priority: 'priority',
	issuingAuthority: 'o5-council',
	subject: '',
	directiveContent: '',
	showSeal: true,
	showClassificationBars: true,
	showRedactedSections: false
};

export const DIRECTIVE_PRIORITY_INFO: Record<DirectivePriority, { label: string; color: string }> = {
	'routine': { label: 'Routine', color: '#888888' },
	'priority': { label: 'Priority', color: '#0088cc' },
	'urgent': { label: 'Urgent', color: '#ff8800' },
	'critical': { label: 'Critical', color: '#cc0000' },
	'omega': { label: 'OMEGA PRIORITY', color: '#000000' }
};

export const ISSUING_AUTHORITY_INFO: Record<IssuingAuthority, { label: string }> = {
	'o5-council': { label: 'O5 Council (Collective)' },
	'o5-individual': { label: 'O5 Council Member' },
	'ethics-committee': { label: 'Ethics Committee' },
	'administrator': { label: 'The Administrator' },
	'regional-director': { label: 'Regional Director' },
	'site-director': { label: 'Site Director' }
};

export const DIRECTIVE_TYPE_INFO: Record<DirectiveType, { label: string }> = {
	'general-order': { label: 'General Order' },
	'containment-revision': { label: 'Containment Revision' },
	'personnel-action': { label: 'Personnel Action' },
	'resource-allocation': { label: 'Resource Allocation' },
	'information-control': { label: 'Information Control' },
	'termination-order': { label: 'Termination Order' },
	'amnesty': { label: 'Amnesty Grant' },
	'special-protocol': { label: 'Special Protocol' }
};
