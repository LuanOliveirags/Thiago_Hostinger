import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  root: '.',
  publicDir: 'public',

  // Remove console.log e debugger apenas no build de produção
  esbuild: command === 'build' ? { drop: ['console', 'debugger'], legalComments: 'none' } : {},

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2015',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Sentry em chunk separado para não bloquear o bundle principal
        manualChunks: {
          sentry: ['@sentry/browser'],
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.js'],
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      include: ['src/**/*.js'],
      thresholds: {
        lines: 70,
        functions: 70,
      },
    },
  },
}));
