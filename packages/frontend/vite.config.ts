import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import inject from '@rollup/plugin-inject';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        sveltekit(),
        nodePolyfills()
    ],
    ssr: { noExternal: ["svelte-headlessui"] },
    resolve: {
        alias: {
            path: 'path-browserify',
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                }),
            ]
        }
    },
    build: {
        rollupOptions: {
            plugins: [inject({ 
                Buffer: ['buffer', 'Buffer'],
            })],
        },
    },
});