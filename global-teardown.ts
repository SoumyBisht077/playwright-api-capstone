// global-teardown.ts — runs once after all tests complete.
// Cleans up the .auth/token.json file created by global-setup.ts.
import * as fs from 'fs';
import * as path from 'path';
import type { FullConfig } from '@playwright/test';

export default async function globalTeardown(_config: FullConfig) {
  const tokenFile = path.resolve(process.cwd(), '.auth', 'token.json');
  if (fs.existsSync(tokenFile)) {
    fs.rmSync(tokenFile);
    console.log('[global-teardown] .auth/token.json removed ✓');
  }
}
