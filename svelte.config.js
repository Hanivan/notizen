import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			// Include content files in the serverless functions
			external: [],
			split: false
		})
	},
	extensions: ['.svelte', '.svx']
};

export default config;
