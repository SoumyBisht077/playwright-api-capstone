import { test, expect } from '../../fixtures/api.fixture';
import { newUser } from '../../utils/dataFactory';

/**
 * Full CRUD chain: Create → Get → Update → Delete
 */
test.describe('@regression @api CRUD Chain', () => {

  test('Users: Create → Get → Update → Delete', async ({ usersApi }) => {
    // CREATE
    const createRes = await usersApi.create(newUser());
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();

    const id: number = created.id;

    // GET  (DummyJSON echoes the new user back; real APIs would persist it)
    const getRes = await usersApi.getById(id <= 100 ? id : 1);
    expect(getRes.ok()).toBeTruthy();

    // UPDATE
    const updateRes = await usersApi.update(id <= 100 ? id : 1, { firstName: 'Updated' });
    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.firstName).toBe('Updated');

    // DELETE
    const delRes = await usersApi.remove(id <= 100 ? id : 1);
    expect([200, 204]).toContain(delRes.status());
    if (delRes.status() === 200) {
      const deleted = await delRes.json();
      expect(deleted).toHaveProperty('isDeleted', true);
    }
  });

});
