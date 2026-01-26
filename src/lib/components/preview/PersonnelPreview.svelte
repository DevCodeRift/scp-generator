<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS } from '$lib/stores/faction';
	import {
		PERSONNEL_CLEARANCE_INFO,
		PERSONNEL_STATUS_INFO,
		PERSONNEL_TYPE_INFO,
		type PersonnelFile
	} from '$lib/schemas/personnel';

	import foundationLogo from '$lib/assets/logos/foundation.svg';
	import chaosInsurgencyLogo from '$lib/assets/logos/chaos-insurgency.svg';
	import gocLogo from '$lib/assets/logos/goc.svg';
	import serpentsHandLogo from '$lib/assets/logos/serpents-hand.svg';
	import mcdLogo from '$lib/assets/logos/mcd.svg';
	import brokenGodLogo from '$lib/assets/logos/broken-god.svg';
	import wondertainmentLogo from '$lib/assets/logos/wondertainment.svg';

	const logos: Record<string, string> = {
		'foundation': foundationLogo,
		'chaos-insurgency': chaosInsurgencyLogo,
		'goc': gocLogo,
		'serpents-hand': serpentsHandLogo,
		'mcd': mcdLogo,
		'broken-god': brokenGodLogo,
		'wondertainment': wondertainmentLogo
	};

	let doc = $state<PersonnelFile | null>(null);
	let currentFaction = $state('foundation');

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'personnel') {
				doc = d as PersonnelFile;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	$effect(() => {
		const unsub = factionStore.subscribe(f => {
			currentFaction = f;
		});
		return unsub;
	});

	let faction = $derived(FACTIONS.find(f => f.id === currentFaction));
	let logo = $derived(logos[currentFaction] || null);
	let clearanceInfo = $derived(doc ? PERSONNEL_CLEARANCE_INFO[doc.clearanceLevel] : null);
	let statusInfo = $derived(doc ? PERSONNEL_STATUS_INFO[doc.status] : null);
	let typeInfo = $derived(doc ? PERSONNEL_TYPE_INFO[doc.personnelType] : null);

	interface Props {
		scale?: number;
	}

	let { scale = 1 }: Props = $props();
</script>

{#if doc}
	<div
		class="document-container shadow-xl"
		style="transform: scale({scale}); transform-origin: top center;"
		id="document-preview"
	>
		<!-- Document Header -->
		<div class="document-header">
			{#if logo}
				<img src={logo} alt="{faction?.name} Logo" class="document-logo" />
			{/if}
			<h1 class="text-xl font-bold">{faction?.name || 'SCP Foundation'}</h1>
			<div class="text-sm text-gray-600 mt-1 uppercase tracking-wider">Personnel File</div>
		</div>

		<!-- Classification Banner -->
		{#if doc.metadata.classification && doc.metadata.classification !== 'unrestricted'}
			<div class="bg-gray-800 text-white text-center py-1 text-sm uppercase tracking-wider mb-4">
				{doc.metadata.classification}
			</div>
		{/if}

		<!-- Main Content Grid -->
		<div class="flex gap-6">
			<!-- Photo Section -->
			{#if doc.showPhoto}
				<div class="w-32 flex-shrink-0">
					<div class="border-2 border-gray-400 bg-gray-200 aspect-[3/4] flex items-center justify-center text-gray-500 text-xs text-center p-2">
						[PHOTO]<br/>ID BADGE
					</div>
				</div>
			{/if}

			<!-- Identity Info -->
			<div class="flex-1">
				<div class="mb-4">
					<div class="text-2xl font-bold">{doc.fullName || '[NAME]'}</div>
					<div class="text-lg text-gray-600">{doc.staffId}</div>
				</div>

				<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
					<div><strong>Type:</strong> {typeInfo?.label || doc.personnelType}</div>
					<div>
						<strong>Clearance:</strong>
						<span style="color: {clearanceInfo?.color}">{clearanceInfo?.label || doc.clearanceLevel}</span>
					</div>
					<div>
						<strong>Status:</strong>
						<span style="color: {statusInfo?.color}">{statusInfo?.label || doc.status}</span>
					</div>
					{#if doc.department}
						<div><strong>Dept:</strong> {doc.department}</div>
					{/if}
					{#if doc.site}
						<div><strong>Site:</strong> {doc.site}</div>
					{/if}
					{#if doc.supervisor}
						<div><strong>Reports To:</strong> {doc.supervisor}</div>
					{/if}
				</div>
			</div>
		</div>

		<hr class="border-gray-400 my-4" />

		<!-- Personal Information -->
		<div class="document-section">
			<div class="document-section-title">Personal Information</div>
			<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
				{#if doc.aliases}
					<div class="col-span-2"><strong>Aliases:</strong> {doc.aliases}</div>
				{/if}
				{#if doc.dateOfBirth}
					<div><strong>DOB:</strong> {doc.dateOfBirth}</div>
				{/if}
				{#if doc.nationality}
					<div><strong>Nationality:</strong> {doc.nationality}</div>
				{/if}
				{#if doc.dateJoined}
					<div><strong>Date Joined:</strong> {doc.dateJoined}</div>
				{/if}
				{#if doc.languages}
					<div class="col-span-2"><strong>Languages:</strong> {doc.languages}</div>
				{/if}
			</div>
		</div>

		<!-- Background -->
		{#if doc.education || doc.specializations || doc.previousAssignments}
			<div class="document-section">
				<div class="document-section-title">Background & Qualifications</div>
				{#if doc.education}
					<div class="mb-2">
						<strong class="text-sm">Education:</strong>
						<div class="whitespace-pre-wrap text-sm">{doc.education}</div>
					</div>
				{/if}
				{#if doc.specializations}
					<div class="mb-2">
						<strong class="text-sm">Specializations:</strong>
						<div class="whitespace-pre-wrap text-sm">{doc.specializations}</div>
					</div>
				{/if}
				{#if doc.previousAssignments}
					<div>
						<strong class="text-sm">Previous Assignments:</strong>
						<div class="whitespace-pre-wrap text-sm">{doc.previousAssignments}</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Evaluations -->
		{#if doc.psychProfile || doc.medicalNotes}
			<div class="document-section">
				<div class="document-section-title">Evaluations</div>
				{#if doc.psychProfile}
					<div class="mb-2">
						<strong class="text-sm">Psychological Profile:</strong>
						{#if doc.showRedactedSections}
							<div class="bg-black text-black text-sm p-2 mt-1">[REDACTED]</div>
						{:else}
							<div class="whitespace-pre-wrap text-sm">{doc.psychProfile}</div>
						{/if}
					</div>
				{/if}
				{#if doc.medicalNotes}
					<div>
						<strong class="text-sm">Medical Notes:</strong>
						{#if doc.showRedactedSections}
							<div class="bg-black text-black text-sm p-2 mt-1">[REDACTED]</div>
						{:else}
							<div class="whitespace-pre-wrap text-sm">{doc.medicalNotes}</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Additional Notes -->
		{#if doc.notes}
			<div class="document-section">
				<div class="document-section-title">Additional Notes</div>
				<div class="whitespace-pre-wrap text-sm">{doc.notes}</div>
			</div>
		{/if}

		<!-- Footer -->
		<div class="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-500 text-center">
			<p>This document is the property of the {faction?.name || 'SCP Foundation'}.</p>
			<p>Unauthorized access or distribution is strictly prohibited.</p>
		</div>
	</div>
{:else}
	<div class="document-container text-center py-16">
		<p class="text-gray-500">No document to preview</p>
	</div>
{/if}

<style>
	.document-container {
		background-color: #f5f5f0;
		color: #1a1a1a;
		font-family: 'Courier Prime', 'Courier New', monospace;
	}
</style>
