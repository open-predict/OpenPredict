import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
	plugins: [
        sveltekit(),
        NodeGlobalsPolyfillPlugin({
            process: true,
        })
    ],
    ssr: { noExternal: ["svelte-headlessui"] }, 
});