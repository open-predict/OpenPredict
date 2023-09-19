import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import inject from '@rollup/plugin-inject';

export default defineConfig({
    plugins: [
        sveltekit(),
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
                })
            ]
        }
    },
    build: {
        rollupOptions: {
            plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
        },
    },
});