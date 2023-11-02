import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import inject from '@rollup/plugin-inject';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import EntryShakingPlugin from 'vite-plugin-entry-shaking';

export default defineConfig({
    plugins: [
        sveltekit(),
        nodePolyfills(),
        await EntryShakingPlugin({
            targets: ['@tabler/icons-svelte'],
            extensions: ['svelte'],
        })
    ],
    logLevel: "info",
    ssr: { noExternal: ["svelte-headlessui"] },
    resolve: {
        alias: {
            path: 'path-browserify',
            crypto: "empty-module",
            assert: "empty-module",
            http: "empty-module",
            https: "empty-module",
            os: "empty-module",
            url: "empty-module",
            zlib: "empty-module",
            stream: "empty-module",
            _stream_duplex: "empty-module",
            _stream_passthrough: "empty-module",
            _stream_readable: "empty-module",
            _stream_writable: "empty-module",
            _stream_transform: "empty-module",
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