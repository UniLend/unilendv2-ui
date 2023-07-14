import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const production = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: { // 👈 optimizedeps
    esbuildOptions: {
      target: "esnext", 
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      supported: { 
        bigint: true 
      },
    }
  }, 

  build: {
    target: ["esnext"], // 👈 build.target
  },
  plugins: [
    react(),
    // ↓ Needed for development mode
    !production &&
      nodePolyfills({
        include: [
          'node_modules/**/*.js',
          new RegExp('node_modules/.vite/.*js'),
        ],
      }),
  ],
  build: {
    minify: false,
   sourcemap: false,
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills(),
      ],
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    
  }
});
