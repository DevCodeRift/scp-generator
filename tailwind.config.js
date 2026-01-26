/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// SCP Foundation colors
				scp: {
					black: '#0a0a0a',
					dark: '#1a1a1a',
					gray: '#333333',
					light: '#e0e0e0',
					muted: '#808080',
					red: '#990000',
					danger: '#cc0000',
					warning: '#cc8800'
				}
			},
			fontFamily: {
				mono: ['VT323', 'Courier Prime', 'Courier New', 'monospace'],
				terminal: ['VT323', 'monospace'],
				document: ['Courier Prime', 'Courier New', 'monospace']
			},
			animation: {
				'crt-flicker': 'crt-flicker 0.15s infinite',
				'scanline': 'scanline 8s linear infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			},
			keyframes: {
				'crt-flicker': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.98' }
				},
				'scanline': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100%)' }
				},
				'glow-pulse': {
					'0%, 100%': { textShadow: '0 0 4px currentColor' },
					'50%': { textShadow: '0 0 8px currentColor, 0 0 12px currentColor' }
				}
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography')
	]
};
