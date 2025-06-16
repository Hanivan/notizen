import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			// Configure Vercel adapter
			// runtime: 'nodejs@20.x',
			// Don't split the app into multiple functions
			split: false,
			// Include content files in the build
			external: ['src/content/**/*'],
			// Ensure content is included in deployment
			includeFiles: ['src/content/**/*']
		}),
		// Add files to be included in the build
		files: {
			assets: 'static',
			hooks: {
				client: 'src/hooks.client',
				server: 'src/hooks.server'
			},
			lib: 'src/lib',
			params: 'src/params',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			appTemplate: 'src/app.html',
			errorTemplate: 'src/error.html'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
