import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';
import deno from '@deno/astro-adapter';

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	output: 'server',
	adapter: deno(),
	// vite config needed for astro-font
	vite: {
		ssr: {
			external: ['node:buffer', 'node:path', 'node:fs', 'node:os', 'node:crypto'],
		},
		resolve: {
			alias: {path: 'node:path', fs: 'node:fs', os: 'node:os', crypto: 'node:crypto'},
		},
	},
});
