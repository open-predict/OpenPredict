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
    logLevel: "info",
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
        target: "esnext", // or "es2019"
        rollupOptions: {
            plugins: [inject({ 
                Buffer: ['buffer', 'Buffer'],
            })],
        },
    },
});