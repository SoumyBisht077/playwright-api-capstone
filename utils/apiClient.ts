// apiClient.ts — HTTP abstraction layer.
// ApiClient is the base class wrapping Playwright's APIRequestContext.
// UsersApi and ProductsApi extend it with domain-specific methods.
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(protected request: APIRequestContext, protected base = '') {}

  get(path: string, opts?: object): Promise<APIResponse> {
    return this.request.get(this.base + path, opts);
  }
  post(path: string, data?: object): Promise<APIResponse> {
    return this.request.post(this.base + path, { data });
  }
  put(path: string, data?: object): Promise<APIResponse> {
    return this.request.put(this.base + path, { data });
  }
  patch(path: string, data?: object): Promise<APIResponse> {
    return this.request.patch(this.base + path, { data });
  }
  delete(path: string): Promise<APIResponse> {
    return this.request.delete(this.base + path);
  }
}

export class UsersApi extends ApiClient {
  create(user: object)              { return this.post('/users/add', user); }
  getById(id: number)               { return this.get(`/users/${id}`); }
  update(id: number, data: object)  { return this.put(`/users/${id}`, data); }
  remove(id: number)                { return this.delete(`/users/${id}`); }
  list(params?: string)             { return this.get(`/users${params ?? ''}`); }
}

export class ProductsApi extends ApiClient {
  getById(id: number)               { return this.get(`/products/${id}`); }
  list(params?: string)             { return this.get(`/products${params ?? ''}`); }
  search(q: string)                 { return this.get(`/products/search?q=${q}`); }
  listByCategory(cat: string)       { return this.get(`/products/category/${cat}`); }
}
