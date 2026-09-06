// ABOUTME: Runs browser regressions against the production static output.
// ABOUTME: Uses a local server and an optional installed Chromium for developer machines.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4330',
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4330 --bind 127.0.0.1 --directory .vercel/output/static',
    url: 'http://127.0.0.1:4330',
    reuseExistingServer: !process.env.CI,
  },
});
