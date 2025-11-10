import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',   // kap screenshot vetëm në dështim
    trace: 'on-first-retry',         // kap trace për debug në retry të parë
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
  retries: 1, // rekomandoj 1 retry në CI për testet forestall-flaky
  reporter: [ ['list'], ['html', { open: 'never' }] ],
});
