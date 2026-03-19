import { test, expect } from '../../fixtures/api.fixture';
import { newUser } from '../../utils/dataFactory';
import { validateSchema } from '../../utils/schemaValidator';
import { userSchema } from '../../utils/schemas';

test.describe('@smoke @regression @api Users Module', () => {

  // ── CREATE ──────────────────────────────────────────────────────────────────

  test('@smoke create user returns 201 with correct fields', async ({ usersApi }) => {
    const res = await usersApi.create(newUser());

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      id:        expect.any(Number),
      firstName: 'Test',
      lastName:  'User',
    });
  });

  test('@regression create user — schema validation', async ({ usersApi }) => {
    const res = await usersApi.create(newUser());
    expect(res.status()).toBe(201);
    validateSchema(userSchema, await res.json());
  });

  test('@regression create user — missing required fields still returns response', async ({ usersApi }) => {
    // DummyJSON accepts partial payloads; we assert the response is at least 2xx
    const res = await usersApi.create({});
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(300);
  });

  // ── GET ─────────────────────────────────────────────────────────────────────

  test('@smoke get existing user returns 200', async ({ usersApi }) => {
    const res = await usersApi.getById(1);

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      id:        1,
      firstName: expect.any(String),
      lastName:  expect.any(String),
      email:     expect.stringContaining('@'),
    });
  });

  test('@regression get user — invalid ID returns 404', async ({ usersApi }) => {
    const res = await usersApi.getById(99999);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  test('@regression list users returns paginated structure', async ({ usersApi }) => {
    const res = await usersApi.list('?limit=5&skip=0');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toMatchObject({
      users: expect.any(Array),
      total: expect.any(Number),
      skip:  0,
      limit: 5,
    });
    expect(body.users.length).toBeLessThanOrEqual(5);
  });

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  test('@regression update user returns 200 with updated field', async ({ usersApi }) => {
    const res = await usersApi.update(1, { firstName: 'Updated' });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.firstName).toBe('Updated');
  });

  // ── DELETE ───────────────────────────────────────────────────────────────────

  test('@regression delete user returns 200 with isDeleted flag', async ({ usersApi }) => {
    const res = await usersApi.remove(1);

    expect([200, 204]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toHaveProperty('isDeleted', true);
    }
  });

  test('@regression delete user — invalid ID returns 404', async ({ usersApi }) => {
    const res = await usersApi.remove(99999);
    expect(res.status()).toBe(404);
  });

  // ── RESPONSE HEADERS ────────────────────────────────────────────────────────

  test('@regression response contains correct content-type header', async ({ usersApi }) => {
    const res = await usersApi.getById(1);
    const headers = res.headers();
    expect(headers['content-type']).toContain('application/json');
  });

  // ── NEGATIVE SCHEMA TEST ─────────────────────────────────────────────────────

  test('@regression schema validator catches invalid data shape', async () => {
    const invalidUser = { firstName: 123, lastName: true };
    expect(() => validateSchema(userSchema, invalidUser)).toThrow('Schema validation failed');
  });

});
