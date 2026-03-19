import { test as base } from '@playwright/test';
import { UsersApi, ProductsApi } from '../utils/apiClient';

type ApiFixtures = {
  usersApi: UsersApi;
  productsApi: ProductsApi;
};

const BASE = process.env.API_BASE || 'https://dummyjson.com';

export const test = base.extend<ApiFixtures>({
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request, BASE));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request, BASE));
  },
});

export const expect = test.expect;

