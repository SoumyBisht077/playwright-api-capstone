import { test, expect } from '../../fixtures/api.fixture';
import * as fs from 'fs';
import * as path from 'path';

const BASE = process.env.API_BASE || 'https://dummyjson.com';

function readToken(): string {
  const tokenFile = path.resolve(process.cwd(), '.auth', 'token.json');
  if (!fs.existsSync(tokenFile)) throw new Error('[auth.spec] .auth/token.json not found. Did global-setup run?');
  const { token } = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));
  return token;
}

test.describe('@smoke @regression @api Auth', () => {

  // ── LOGIN EDGE CASES ────────────────────────────────────────────────────────

  test('@regression login with invalid credentials returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'invaliduser', password: 'wrongpassword' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  test('@regression login with missing credentials returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  test('@smoke login with valid credentials returns token', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: process.env.AUTH_USERNAME, password: process.env.AUTH_PASSWORD },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body.username).toBe(process.env.AUTH_USERNAME);
  });

  // ── BEARER TOKEN USAGE ──────────────────────────────────────────────────────

  test('@smoke authenticated request to /auth/me returns logged-in user', async ({ request }) => {
    const token = readToken();

    const res = await request.get(`${BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.username).toBe(process.env.AUTH_USERNAME);
    expect(body).toHaveProperty('email');
    //console.log(token);
  });

  test('@regression request to /auth/me without token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/auth/me`);
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('message');
    
  });

  test('@regression request to /auth/me with invalid token returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/auth/me`, {
      headers: {
        Authorization: 'Bearer invalidtoken123',
      },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

});
