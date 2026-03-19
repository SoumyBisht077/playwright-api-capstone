// dataFactory.ts — test data builders.
// Returns fresh objects on every call.
// Dynamic username uses Date.now() to guarantee uniqueness across parallel runs.
export const newUser = () => ({
  firstName: 'Test',
  lastName: 'User',
  age: 28,
  email: process.env.TEST_USER_EMAIL || 'testuser@example.com',
  username: `user_${Date.now()}`,
  password: process.env.TEST_USER_PASSWORD || 'pass1234',
});

// newProduct — builder for product test data.
export const newProduct = () => ({
  title: `Product_${Date.now()}`,
  price: 99.99,
  stock: 10,
  category: 'smartphones',
  description: 'A test product created by the data factory',
});
