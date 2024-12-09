/// <reference types="vitest" />
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(function ({ mode }) {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react({ tsDecorators: true }),
      tsconfigPaths(),
      TanStackRouterVite(),
      {
        // This plugin is used to transform the index.html file to add the correct base URL and og:image and twitter:image
        name: 'html-transform',
        transformIndexHtml(html) {
          const baseUrl = env.VITE_BASE_URL || 'https://siis.example.com';

          const transformed = html
            .replace(
              /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
              `<meta property="og:url" content="${baseUrl}" />`,
            )
            .replace(
              /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
              `<meta property="og:image" content="${baseUrl}/og-image.png" />`,
            )
            .replace(
              /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="twitter:image" content="${baseUrl}/og-image.png" />`,
            );

          return transformed;
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
    test: {
      globals: true,
      setupFiles: './src/test/setup.tsx',
      environment: 'jsdom',
    },
  };
});
