<script lang="ts">
	import FactionSelector from '$lib/components/ui/FactionSelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import type { Tab } from '$lib/components/ui/Tabs.svelte';

	let activeTab = $state('initiative');

	const tabs: Tab[] = [
		{ id: 'initiative', label: 'Initiative', icon: '⚔️' },
		{ id: 'casualties', label: 'Casualties', icon: '💀' },
		{ id: 'containment', label: 'Containment', icon: '🔒' },
		{ id: 'timeline', label: 'Timeline', icon: '📋' }
	];

	let sessionActive = $state(false);
	let sessionName = $state('');

	function startSession() {
		if (sessionName.trim()) {
			sessionActive = true;
		}
	}

	function endSession() {
		if (confirm('End current session? Progress will be saved.')) {
			sessionActive = false;
			sessionName = '';
		}
	}
</script>

<svelte:head>
	<title>Session Management | SCP Document Generator</title>
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
				<span class="text-sm font-bold uppercase">SESSION MANAGEMENT</span>
				{#if sessionActive}
					<Badge variant="success">ACTIVE</Badge>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<a href="/">
					<Button variant="ghost" size="sm">
						Back to Home
					</Button>
				</a>
				<FactionSelector />
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
		{#if !sessionActive}
			<!-- Session Start -->
			<div class="terminal-window max-w-md mx-auto">
				<div class="terminal-header">START NEW SESSION</div>
				<div class="p-6">
					<p class="text-[var(--color-text-muted)] mb-4">
						Start a session to track initiative, casualties, containment status, and events during your game.
					</p>
					<div class="mb-4">
						<label for="session-name" class="block text-sm mb-2">Session Name</label>
						<input
							type="text"
							id="session-name"
							bind:value={sessionName}
							placeholder="e.g., Breach at Site-19"
							class="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
						/>
					</div>
					<Button variant="primary" onclick={startSession} disabled={!sessionName.trim()}>
						Start Session
					</Button>
				</div>
			</div>

			<!-- Recent Sessions Placeholder -->
			<div class="terminal-window mt-6 max-w-md mx-auto">
				<div class="terminal-header">RECENT SESSIONS</div>
				<div class="p-4 text-center text-[var(--color-text-muted)]">
					<p class="text-sm">No recent sessions found.</p>
				</div>
			</div>
		{:else}
			<!-- Active Session -->
			<div class="terminal-window mb-6">
				<div class="terminal-header flex items-center justify-between">
					<span>SESSION: {sessionName.toUpperCase()}</span>
					<Button variant="danger" size="sm" onclick={endSession}>
						End Session
					</Button>
				</div>
			</div>

			<!-- Session Tabs -->
			<Tabs {tabs} {activeTab} ontabchange={(id) => activeTab = id}>
				<div class="terminal-window">
					{#if activeTab === 'initiative'}
						<div class="terminal-header">INITIATIVE TRACKER</div>
						<div class="p-8 text-center">
							<div class="text-6xl mb-4 opacity-30">⚔️</div>
							<p class="text-[var(--color-text-muted)]">
								Initiative tracker coming soon...
							</p>
							<p class="text-sm text-[var(--color-text-muted)] mt-2">
								Track turn order for combat and breach scenarios.
							</p>
						</div>
					{:else if activeTab === 'casualties'}
						<div class="terminal-header">CASUALTY TRACKER</div>
						<div class="p-8 text-center">
							<div class="text-6xl mb-4 opacity-30">💀</div>
							<p class="text-[var(--color-text-muted)]">
								Casualty tracker coming soon...
							</p>
							<p class="text-sm text-[var(--color-text-muted)] mt-2">
								Track personnel status: Active, Injured, KIA, MIA.
							</p>
						</div>
					{:else if activeTab === 'containment'}
						<div class="terminal-header">CONTAINMENT STATUS BOARD</div>
						<div class="p-8 text-center">
							<div class="text-6xl mb-4 opacity-30">🔒</div>
							<p class="text-[var(--color-text-muted)]">
								Containment board coming soon...
							</p>
							<p class="text-sm text-[var(--color-text-muted)] mt-2">
								Monitor SCP containment status during sessions.
							</p>
						</div>
					{:else if activeTab === 'timeline'}
						<div class="terminal-header">SESSION TIMELINE</div>
						<div class="p-8 text-center">
							<div class="text-6xl mb-4 opacity-30">📋</div>
							<p class="text-[var(--color-text-muted)]">
								Timeline tracker coming soon...
							</p>
							<p class="text-sm text-[var(--color-text-muted)] mt-2">
								Log events and decisions during the session.
							</p>
						</div>
					{/if}
				</div>
			</Tabs>
		{/if}
	</main>
</div>
