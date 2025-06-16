import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { cpSync, existsSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// Plugin to copy content files during build
function copyContentPlugin() {
	return {
		name: 'copy-content',
		buildStart() {
			// Copy content during build
			const sourceDir = resolve('src/content');
			const targetDir = resolve('content');

			if (existsSync(sourceDir)) {
				try {
					cpSync(sourceDir, targetDir, { recursive: true });
					console.log('✅ Content files copied to build directory');
				} catch (error) {
					console.error('❌ Error copying content files:', error);
				}
			}
		}
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),
		copyContentPlugin()
	],
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
