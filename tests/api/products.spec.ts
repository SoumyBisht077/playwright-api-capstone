import { test, expect } from '../../fixtures/api.fixture';
import { validateSchema } from '../../utils/schemaValidator';
import { productSchema, productListSchema } from '../../utils/schemas';

const PERF_BUDGET_MS = 800;

test.describe('@smoke @regression @api Products Module', () => {

  // ── LIST & PAGINATION ────────────────────────────────────────────────────────

  test('@smoke list products returns paginated structure', async ({ productsApi }) => {
    const res = await productsApi.list('?limit=10&skip=0');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toMatchObject({
      products: expect.any(Array),
      total:    expect.any(Number),
      skip:     0,
      limit:    10,
    });
    expect(body.products.length).toBeLessThanOrEqual(10);
  });

  test('@regression list products — schema validation', async ({ productsApi }) => {
    const res = await productsApi.list();
    validateSchema(productListSchema, await res.json());
  });

  test('@regression list products — second page has different items', async ({ productsApi }) => {
    const page1 = await (await productsApi.list('?limit=5&skip=0')).json();
    const page2 = await (await productsApi.list('?limit=5&skip=5')).json();

    const ids1: number[] = page1.products.map((p: { id: number }) => p.id);
    const ids2: number[] = page2.products.map((p: { id: number }) => p.id);
    const overlap = ids1.filter(id => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  test('@regression filter products by category', async ({ productsApi }) => {
    const res = await productsApi.listByCategory('smartphones');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach((p: { category: string }) => {
      expect(p.category).toBe('smartphones');
    });
  });

  test('@regression search products returns relevant results', async ({ productsApi }) => {
    const res = await productsApi.search('phone');

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.products.length).toBeGreaterThan(0);
  });

  // ── GET BY ID ────────────────────────────────────────────────────────────────

  test('@smoke get product by ID returns 200', async ({ productsApi }) => {
    const res = await productsApi.getById(1);

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      id:     1,
      title:  expect.any(String),
      price:  expect.any(Number),
      rating: expect.any(Number),
    });
  });

  test('@regression get product — invalid ID returns 404', async ({ productsApi }) => {
    const res = await productsApi.getById(99999);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  test('@regression product has required nested fields', async ({ productsApi }) => {
    const res = await productsApi.getById(1);
    const body = await res.json();

    expect(body).toMatchObject({
      id:          expect.any(Number),
      title:       expect.any(String),
      description: expect.any(String),
      price:       expect.any(Number),
      rating:      expect.any(Number),
      stock:       expect.any(Number),
      brand:       expect.any(String),
      category:    expect.any(String),
    });
    expect(body.images).toEqual(expect.arrayContaining([expect.any(String)]));
  });

  // ── PERFORMANCE ──────────────────────────────────────────────────────────────

  test(`@smoke GET /products responds within ${PERF_BUDGET_MS}ms`, async ({ productsApi }) => {
    const start = Date.now();
    const res = await productsApi.list('?limit=10');
    const elapsed = Date.now() - start;

    expect(res.ok()).toBeTruthy();
    expect(elapsed).toBeLessThan(PERF_BUDGET_MS);
  });

});

// ── RESILIENCE TESTS ─────────────────────────────────────────────────────────

test.describe('@regression @api Products Resilience', () => {

  test('@regression product endpoint is stable and returns valid data', async ({ productsApi }) => {
    // test.slow() — marks this test as slow, tripling its timeout.
    // Used here because we are making multiple sequential requests
    test.slow();

    // expect.poll() — keeps re-running the callback every 500ms until
    // the assertion passes or the timeout of 10 seconds is reached.
    await expect.poll(
      async () => {
        const res = await productsApi.getById(1);
        const body = await res.json();
        return body.id;
      },
      {
        message: 'Expected product ID 1 to be returned consistently',
        timeout:   10_000,
        intervals: [500],
      }
    ).toBe(1);

    // After polling confirms the endpoint is stable,
    // do a final deep assertion on the full response shape.
    const res = await productsApi.getById(1);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toMatchObject({
      id:       1,
      title:    expect.any(String),
      price:    expect.any(Number),
      category: expect.any(String),
    });
  });

});
