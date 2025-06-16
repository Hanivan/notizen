import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			// Configure Vercel adapter for optimal deployment
			split: false,
			external: ['static/content/**/*']
		})
	},
	extensions: ['.svelte', '.svx']
};

export default config;
