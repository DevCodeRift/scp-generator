<script lang="ts">
	import { browser } from '$app/environment';

	let crtEnabled = $state(true);

	$effect(() => {
		if (browser) {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			crtEnabled = !mediaQuery.matches;

			const handler = (e: MediaQueryListEvent) => {
				crtEnabled = !e.matches;
			};

			mediaQuery.addEventListener('change', handler);
			return () => mediaQuery.removeEventListener('change', handler);
		}
	});
</script>

{#if crtEnabled}
	<div class="crt-scanlines" aria-hidden="true"></div>
	<div class="crt-flicker" aria-hidden="true"></div>
	<div class="crt-vignette" aria-hidden="true"></div>
{/if}
