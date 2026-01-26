<script lang="ts">
	import '../app.css';
	import CRTOverlay from '$lib/components/ui/CRTOverlay.svelte';
	import { factionStore } from '$lib/stores/faction';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Apply faction to document root for CSS custom properties
	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-faction', $factionStore);
		}
	});
</script>

<svelte:head>
	<title>SCP Document Generator</title>
	<meta name="description" content="Generate authentic-looking SCP Foundation documents, research reports, and correspondence" />
</svelte:head>

<div class="crt-container min-h-screen">
	{@render children()}
	<CRTOverlay />
</div>
