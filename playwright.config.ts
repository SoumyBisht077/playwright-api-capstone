import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: '50%',
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.API_BASE || 'https://dummyjson.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
