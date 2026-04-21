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
    // Minificação CSS inline (atributos style=)
    cssMinify: true,
    // Minificação HTML
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Chunks separados: Sentry isolado + features agrupadas por domínio
        manualChunks(id) {
          if (id.includes('@sentry')) {
            return 'vendor-sentry';
          }
          if (id.includes('src/features/analytics')) {
            return 'feature-analytics';
          }
          if (id.includes('src/features/feedbacks') || id.includes('src/features/resultados')) {
            return 'feature-media';
          }
        },
        // Nomes de chunk com hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
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
