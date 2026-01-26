<script lang="ts">
	import { documentStore } from '$lib/stores/document';
	import { factionStore, FACTIONS, type Faction } from '$lib/stores/faction';
	import {
		BADGE_CLEARANCE_INFO,
		BADGE_TYPE_INFO,
		type IDBadge,
		type BadgeClearance,
		type BadgeType
	} from '$lib/schemas/id-badge';

	// Faction header colors for badges
	const FACTION_COLORS: Record<Faction, string> = {
		'foundation': '#1a1a1a',
		'chaos-insurgency': '#8B0000',
		'goc': '#1e3a5f',
		'serpents-hand': '#2d5a27',
		'mcd': '#4a0080',
		'broken-god': '#8B4513',
		'wondertainment': '#ff6b9d',
		'ouroboros': '#333333'
	};

	let { scale = 1 } = $props<{ scale?: number }>();

	let doc = $state<IDBadge | null>(null);
	let faction = $state<Faction>($factionStore);

	$effect(() => {
		const unsub = documentStore.subscribe(d => {
			if (d && d.type === 'id-badge') {
				doc = d as IDBadge;
			} else {
				doc = null;
			}
		});
		return unsub;
	});

	$effect(() => {
		const unsub = factionStore.subscribe(f => {
			faction = f;
		});
		return unsub;
	});

	function getClearanceInfo(level: BadgeClearance) {
		return BADGE_CLEARANCE_INFO[level];
	}

	function getBadgeTypeInfo(type: BadgeType) {
		return BADGE_TYPE_INFO[type];
	}

	function getFactionInfo() {
		return FACTIONS.find(f => f.id === faction) || FACTIONS[0];
	}

	function generateBarcode(id: string): string {
		// Generate a simple barcode-like pattern
		let result = '';
		for (let i = 0; i < id.length; i++) {
			const charCode = id.charCodeAt(i);
			result += (charCode % 2 === 0) ? '█' : '▌';
		}
		// Pad to minimum length
		while (result.length < 20) {
			result += '█▌';
		}
		return result;
	}

	function formatDate(dateStr: string | undefined): string {
		if (!dateStr) return 'N/A';
		try {
			return new Date(dateStr).toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
		} catch {
			return dateStr;
		}
	}
</script>

{#if doc}
	{@const clearanceInfo = getClearanceInfo(doc.clearanceLevel)}
	{@const badgeTypeInfo = getBadgeTypeInfo(doc.badgeType)}
	{@const factionInfo = getFactionInfo()}

	<div
		id="document-preview"
		class="badge-container"
		style="transform: scale({scale}); transform-origin: top left;"
	>
		<!-- Badge Card -->
		<div
			class="badge-card"
			class:style-modern={doc.badgeStyle === 'modern'}
			class:style-classic={doc.badgeStyle === 'classic'}
			class:style-minimal={doc.badgeStyle === 'minimal'}
			class:style-secure={doc.badgeStyle === 'secure'}
			style="--badge-border-color: {badgeTypeInfo.borderColor}; --clearance-bg: {clearanceInfo.bgColor}; --clearance-color: {clearanceInfo.color};"
		>
			<!-- Header with Organization -->
			<div class="badge-header" style="background: {FACTION_COLORS[faction]};">
				<div class="org-name">{factionInfo.name.toUpperCase()}</div>
				<div class="badge-type-label">{badgeTypeInfo.label}</div>
			</div>

			<!-- Main Content Area -->
			<div class="badge-content">
				<!-- Photo Section -->
				{#if doc.showPhoto}
					<div class="photo-section">
						{#if doc.photoUrl}
							<img src={doc.photoUrl} alt="Personnel Photo" class="photo" />
						{:else}
							<div class="photo-placeholder">
								<span>PHOTO</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Info Section -->
				<div class="info-section">
					<div class="name">{doc.fullName || 'UNNAMED'}</div>
					{#if doc.title}
						<div class="title">{doc.title}</div>
					{/if}
					<div class="staff-id">ID: {doc.staffId}</div>
					{#if doc.department}
						<div class="department">{doc.department}</div>
					{/if}
					{#if doc.site}
						<div class="site">{doc.site}</div>
					{/if}
				</div>
			</div>

			<!-- Clearance Level Banner -->
			<div class="clearance-banner" style="background: {clearanceInfo.bgColor}; color: {clearanceInfo.color};">
				<span class="clearance-text">CLEARANCE: {clearanceInfo.label}</span>
			</div>

			<!-- Access Zones (if enabled) -->
			{#if doc.showAccessZones && doc.accessZones}
				<div class="access-zones">
					<div class="access-label">AUTHORIZED ZONES:</div>
					<div class="access-list">{doc.accessZones}</div>
				</div>
			{/if}

			<!-- Validity Dates -->
			{#if doc.showExpiry}
				<div class="validity">
					<div class="validity-item">
						<span class="validity-label">ISSUED:</span>
						<span class="validity-value">{formatDate(doc.issueDate)}</span>
					</div>
					<div class="validity-item">
						<span class="validity-label">EXPIRES:</span>
						<span class="validity-value">{formatDate(doc.expiryDate)}</span>
					</div>
				</div>
			{/if}

			<!-- Barcode -->
			{#if doc.showBarcode}
				<div class="barcode-section">
					<div class="barcode">{generateBarcode(doc.staffId)}</div>
					<div class="barcode-text">{doc.staffId}</div>
				</div>
			{/if}

			<!-- Footer -->
			<div class="badge-footer">
				<span>UNAUTHORIZED USE IS A CLASS-A OFFENSE</span>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center text-gray-400 py-8">
		No document loaded
	</div>
{/if}

<style>
	.badge-container {
		display: inline-block;
	}

	.badge-card {
		width: 340px;
		background: #f5f5f0;
		border: 3px solid var(--badge-border-color, #333);
		border-radius: 12px;
		overflow: hidden;
		font-family: 'Arial', sans-serif;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	/* Style variants */
	.style-modern {
		border-radius: 12px;
	}

	.style-classic {
		border-radius: 4px;
		background: #fff8dc;
	}

	.style-minimal {
		border-radius: 8px;
		border-width: 2px;
	}

	.style-secure {
		border-radius: 4px;
		border-width: 4px;
		background: linear-gradient(135deg, #f5f5f0 0%, #e0e0d8 100%);
	}

	.badge-header {
		padding: 12px 16px;
		color: white;
		text-align: center;
	}

	.org-name {
		font-size: 14px;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.badge-type-label {
		font-size: 10px;
		opacity: 0.9;
		margin-top: 2px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.badge-content {
		display: flex;
		padding: 16px;
		gap: 16px;
	}

	.photo-section {
		flex-shrink: 0;
	}

	.photo {
		width: 100px;
		height: 120px;
		object-fit: cover;
		border: 2px solid #333;
	}

	.photo-placeholder {
		width: 100px;
		height: 120px;
		background: #ddd;
		border: 2px solid #333;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		font-size: 12px;
		font-weight: bold;
	}

	.info-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.name {
		font-size: 18px;
		font-weight: bold;
		color: #111;
		margin-bottom: 4px;
	}

	.title {
		font-size: 12px;
		color: #444;
		font-style: italic;
		margin-bottom: 8px;
	}

	.staff-id {
		font-size: 14px;
		font-weight: bold;
		color: #333;
		font-family: 'Courier New', monospace;
		margin-bottom: 4px;
	}

	.department, .site {
		font-size: 11px;
		color: #555;
	}

	.clearance-banner {
		padding: 8px 16px;
		text-align: center;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.clearance-text {
		font-size: 14px;
	}

	.access-zones {
		padding: 8px 16px;
		background: #eee;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}

	.access-label {
		font-size: 9px;
		color: #666;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.access-list {
		font-size: 10px;
		color: #333;
		margin-top: 2px;
	}

	.validity {
		display: flex;
		justify-content: space-between;
		padding: 8px 16px;
		background: #f0f0e8;
	}

	.validity-item {
		font-size: 10px;
	}

	.validity-label {
		color: #666;
		font-weight: bold;
	}

	.validity-value {
		color: #333;
		margin-left: 4px;
		font-family: 'Courier New', monospace;
	}

	.barcode-section {
		padding: 8px 16px;
		text-align: center;
		background: #fff;
	}

	.barcode {
		font-family: 'Libre Barcode 39', 'Courier New', monospace;
		font-size: 32px;
		letter-spacing: -2px;
		color: #000;
		line-height: 1;
	}

	.barcode-text {
		font-size: 10px;
		color: #333;
		font-family: 'Courier New', monospace;
		margin-top: 2px;
	}

	.badge-footer {
		padding: 6px 16px;
		background: #333;
		color: #ccc;
		text-align: center;
		font-size: 8px;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
</style>
