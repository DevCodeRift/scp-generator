import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// Disable server timeouts so large video uploads don't get killed mid-transfer
function disableServerTimeouts(): Plugin {
	return {
		name: 'disable-server-timeouts',
		configureServer(server) {
			server.httpServer?.on('listening', () => {
				if (server.httpServer) {
					server.httpServer.requestTimeout = 0;
					server.httpServer.headersTimeout = 0;
					server.httpServer.timeout = 0;
				}
			});
		}
	};
}

export default defineConfig({
	plugins: [disableServerTimeouts(), sveltekit()],
	build: {
		rollupOptions: {
			external: ['fluent-ffmpeg']
		}
	}
});
