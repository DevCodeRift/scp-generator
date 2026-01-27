<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SiteStatus from '$lib/components/session/SiteStatus.svelte';
	import ContainmentBoard from '$lib/components/session/ContainmentBoard.svelte';
	import PersonnelTracker from '$lib/components/session/PersonnelTracker.svelte';
	import CommsLog from '$lib/components/session/CommsLog.svelte';
	import QuickRollers from '$lib/components/session/QuickRollers.svelte';
	import { sessionStore, sessionStats, ALERT_LEVELS } from '$lib/stores/session';

	let session = $derived($sessionStore);
	let stats = $derived($sessionStats);

	// New session form state
	let newSiteName = $state('Site-19');

	function handleStartSession() {
		if (newSiteName.trim()) {
			sessionStore.startNewSession(newSiteName.trim());
		}
	}

	function handleEndSession() {
		if (confirm('End current session? All tracking data will be cleared.')) {
			sessionStore.resetSession();
		}
	}

	// Check if session is active (has an ID)
	const isSessionActive = $derived(!!session.id);
</script>

<svelte:head>
	<title>Session Control | SCP Document Generator</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
		<div class="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-terminal crt-glow text-[var(--color-accent)] hover:opacity-80">
					SCP://DOCGEN
				</a>
				<span class="text-[var(--color-text-muted)]">/</span>
				<span class="text-sm font-bold uppercase">SESSION CONTROL</span>
				{#if isSessionActive}
					<Badge variant="success">LIVE</Badge>
					<span class="text-sm text-[var(--color-text-muted)]">{session.siteName}</span>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				{#if isSessionActive}
					<span class="text-xs text-[var(--color-text-muted)]">
						Started: {new Date(session.startedAt).toLocaleTimeString()}
					</span>
					<Button variant="danger" size="sm" onclick={handleEndSession}>
						End Session
					</Button>
				{/if}
				<a href="/">
					<Button variant="ghost" size="sm">
						Back
					</Button>
				</a>
				<FactionSelector />
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 bg-[var(--color-background)]">
		{#if !isSessionActive}
			<!-- Session Start Screen -->
			<div class="max-w-md mx-auto px-4 py-16">
				<div class="terminal-window">
					<div class="terminal-header">INITIALIZE SESSION</div>
					<div class="p-6">
						<div class="text-center mb-6">
							<div class="text-6xl mb-4 opacity-30">[ GM ]</div>
							<p class="text-[var(--color-text-muted)]">
								Start a session to access the GM control center with live tracking, communications, and quick rollers.
							</p>
						</div>

						<Input
							value={newSiteName}
							label="Site Name"
							placeholder="Site-19"
							onchange={(v) => newSiteName = v}
							class="mb-4"
						/>

						<Button variant="primary" onclick={handleStartSession} class="w-full">
							Start Session
						</Button>

						<div class="mt-6 pt-6 border-t border-[var(--color-border)]">
							<div class="text-xs text-[var(--color-text-muted)] space-y-2">
								<p><strong>Session features:</strong></p>
								<ul class="list-disc list-inside space-y-1 ml-2">
									<li>Alert level & lockdown zone tracking</li>
									<li>SCP containment status board</li>
									<li>Personnel tracker with quick NPC generation</li>
									<li>Communications log with export</li>
									<li>Quick rollers for improvisation</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Active Session Dashboard -->
			<div class="max-w-[1800px] mx-auto px-4 py-4">
				<!-- Stats Bar -->
				<div class="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
					<div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center">
						<div class="text-2xl font-bold" style="color: {ALERT_LEVELS[session.alertLevel].color}">
							{ALERT_LEVELS[session.alertLevel].label}
						</div>
						<div class="text-xs text-[var(--color-text-muted)]">Alert Level</div>
					</div>
					<div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center">
						<div class="text-2xl font-bold {stats.breached > 0 ? 'text-red-500' : 'text-green-500'}">
							{stats.breached}/{stats.totalSCPs}
						</div>
						<div class="text-xs text-[var(--color-text-muted)]">Breached/Total SCPs</div>
					</div>
					<div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center">
						<div class="text-2xl font-bold {stats.casualties > 0 ? 'text-red-500' : 'text-green-500'}">
							{stats.active}/{stats.totalPersonnel}
						</div>
						<div class="text-xs text-[var(--color-text-muted)]">Active Personnel</div>
					</div>
					<div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center">
						<div class="text-2xl font-bold text-red-500">
							{session.lockdownZones.length}
						</div>
						<div class="text-xs text-[var(--color-text-muted)]">Lockdown Zones</div>
					</div>
					<div class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center">
						<div class="text-2xl font-bold">
							{stats.commsCount}
						</div>
						<div class="text-xs text-[var(--color-text-muted)]">Transmissions</div>
					</div>
				</div>

				<!-- Main Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<!-- Left Column: Site Status + Quick Rollers -->
					<div class="space-y-4">
						<SiteStatus {session} />
						<QuickRollers />
					</div>

					<!-- Middle Column: Containment + Personnel -->
					<div class="space-y-4">
						<ContainmentBoard {session} />
						<PersonnelTracker {session} />
					</div>

					<!-- Right Column: Comms Log -->
					<div>
						<CommsLog {session} />
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
