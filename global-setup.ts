// global-setup.ts — runs once before all tests.
// Performs API health check, logs in, and saves the bearer token to .auth/token.json.
import { request } from '@playwright/test';
import type { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.API_BASE ?? 'https://dummyjson.com';
  const username = process.env.AUTH_USERNAME;
  const password = process.env.AUTH_PASSWORD;

  const req = await request.newContext({ baseURL });

  try {
    // ── HEALTH CHECK ──────────────────────────────────────────────────────────
    const health = await req.get('/products/1');
    if (!health.ok()) throw new Error(`[global-setup] API health check failed: ${health.status()}`);
    console.log('[global-setup] API reachable ✓');

    if (!username || !password) {
      console.warn('[global-setup] AUTH_USERNAME/AUTH_PASSWORD not set; skipping login.');
      return;
    }

    const res = await req.post('/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password },
    });

    if (!res.ok()) {
      const text = await res.text().catch(() => '');
      throw new Error(`[global-setup] Login failed: ${res.status()} ${text}`);
    }

    const data = await res.json();
    const token: string | undefined = data?.token ?? data?.accessToken;
    if (!token) throw new Error('[global-setup] No token/accessToken in login response');

    const authDir = path.resolve(process.cwd(), '.auth');
    fs.mkdirSync(authDir, { recursive: true });
    fs.writeFileSync(path.join(authDir, 'token.json'), JSON.stringify({ token }), 'utf-8');

    process.env.TOKEN = token;
    console.log('[global-setup] Token saved to ./.auth/token.json');
  } finally {
    await req.dispose();
  }
}
