// vite.config.ts
import { defineConfig } from "file:///home/user/Documents/Checkouts/github.com/YUT4K4/openpredict/node_modules/.pnpm/vite@4.4.6/node_modules/vite/dist/node/index.js";
import { sveltekit } from "file:///home/user/Documents/Checkouts/github.com/YUT4K4/openpredict/node_modules/.pnpm/@sveltejs+kit@1.22.3_svelte@3.59.2_vite@4.4.6/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import inject from "file:///home/user/Documents/Checkouts/github.com/YUT4K4/openpredict/node_modules/.pnpm/@rollup+plugin-inject@5.0.3_rollup@3.26.3/node_modules/@rollup/plugin-inject/dist/es/index.js";
import { NodeGlobalsPolyfillPlugin } from "file:///home/user/Documents/Checkouts/github.com/YUT4K4/openpredict/node_modules/.pnpm/@esbuild-plugins+node-globals-polyfill@0.2.3_esbuild@0.18.16/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { nodePolyfills } from "file:///home/user/Documents/Checkouts/github.com/YUT4K4/openpredict/node_modules/.pnpm/vite-plugin-node-polyfills@0.14.1_rollup@3.26.3_vite@4.4.6/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    nodePolyfills()
  ],
  ssr: { noExternal: ["svelte-headlessui"] },
  resolve: {
    alias: {
      path: "path-browserify"
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
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
      plugins: [inject({
        Buffer: ["buffer", "Buffer"]
      })]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS91c2VyL0RvY3VtZW50cy9DaGVja291dHMvZ2l0aHViLmNvbS9ZVVQ0SzQvb3BlbnByZWRpY3QvcGFja2FnZXMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3VzZXIvRG9jdW1lbnRzL0NoZWNrb3V0cy9naXRodWIuY29tL1lVVDRLNC9vcGVucHJlZGljdC9wYWNrYWdlcy9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS91c2VyL0RvY3VtZW50cy9DaGVja291dHMvZ2l0aHViLmNvbS9ZVVQ0SzQvb3BlbnByZWRpY3QvcGFja2FnZXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XG5pbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCc7XG5pbXBvcnQgeyBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luIH0gZnJvbSAnQGVzYnVpbGQtcGx1Z2lucy9ub2RlLWdsb2JhbHMtcG9seWZpbGwnXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICBzdmVsdGVraXQoKSxcbiAgICAgICAgbm9kZVBvbHlmaWxscygpXG4gICAgXSxcbiAgICBzc3I6IHsgbm9FeHRlcm5hbDogW1wic3ZlbHRlLWhlYWRsZXNzdWlcIl0gfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBwYXRoOiAncGF0aC1icm93c2VyaWZ5JyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgICAgICAgLy8gTm9kZS5qcyBnbG9iYWwgdG8gYnJvd3NlciBnbG9iYWxUaGlzXG4gICAgICAgICAgICBkZWZpbmU6IHtcbiAgICAgICAgICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIEVuYWJsZSBlc2J1aWxkIHBvbHlmaWxsIHBsdWdpbnNcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luKHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiB0cnVlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFtpbmplY3QoeyBcbiAgICAgICAgICAgICAgICBCdWZmZXI6IFsnYnVmZmVyJywgJ0J1ZmZlciddLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICB9LFxuICAgIH0sXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQTRaLFNBQVMsb0JBQW9CO0FBQ3piLFNBQVMsaUJBQWlCO0FBQzFCLE9BQU8sWUFBWTtBQUNuQixTQUFTLGlDQUFpQztBQUMxQyxTQUFTLHFCQUFxQjtBQUU5QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxVQUFVO0FBQUEsSUFDVixjQUFjO0FBQUEsRUFDbEI7QUFBQSxFQUNBLEtBQUssRUFBRSxZQUFZLENBQUMsbUJBQW1CLEVBQUU7QUFBQSxFQUN6QyxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxNQUFNO0FBQUEsSUFDVjtBQUFBLEVBQ0o7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLGdCQUFnQjtBQUFBO0FBQUEsTUFFWixRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsTUFDWjtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDTCwwQkFBMEI7QUFBQSxVQUN0QixRQUFRO0FBQUEsUUFDWixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxlQUFlO0FBQUEsTUFDWCxTQUFTLENBQUMsT0FBTztBQUFBLFFBQ2IsUUFBUSxDQUFDLFVBQVUsUUFBUTtBQUFBLE1BQy9CLENBQUMsQ0FBQztBQUFBLElBQ047QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
