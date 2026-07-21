import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@openstrata/ai-ui-kit': fileURLToPath(
        new URL('../ai-ui-kit/src/index.ts', import.meta.url),
      ),
    },
    dedupe: ['mermaid'],
  },
  optimizeDeps: {
    // `mermaid` is an optional, lazily-loaded dep of ai-ui-kit (imported from
    // the aliased source, outside this project root). List it so Vite resolves
    // it from this project's node_modules during dep pre-bundling.
    include: ['mermaid'],
  },
  server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } },
  // `mermaid` is an optional, lazily-loaded dependency of ai-ui-kit; the
  // MermaidRenderer degrades gracefully when it is absent.
  build: {
    rollupOptions: {
      external: ['mermaid'],
    },
  },
});
