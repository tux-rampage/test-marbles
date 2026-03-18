import { defineConfig, ViteUserConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'marble-testing',
    include: ['spec/**/*.spec.ts'],
  },
} as ViteUserConfig);
