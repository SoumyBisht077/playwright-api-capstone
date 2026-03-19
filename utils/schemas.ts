// schemas.ts — AJV JSON schema definitions.
// Defines the expected shape and types of API responses.
// additionalProperties: true allows extra fields the API may return.
export const userSchema = {
  type: 'object',
  required: ['id', 'firstName', 'lastName', 'email'],
  properties: {
    id:        { type: 'number' },
    firstName: { type: 'string' },
    lastName:  { type: 'string' },
    email:     { type: 'string' },
    age:       { type: 'number' },
  },
  additionalProperties: true,
};

export const productSchema = {
  type: 'object',
  required: ['id', 'title', 'price', 'rating'],
  properties: {
    id:     { type: 'number' },
    title:  { type: 'string' },
    price:  { type: 'number' },
    rating: { type: 'number' },
  },
  additionalProperties: true,
};

export const productListSchema = {
  type: 'object',
  required: ['products', 'total', 'skip', 'limit'],
  properties: {
    products: { type: 'array' },
    total:    { type: 'number' },
    skip:     { type: 'number' },
    limit:    { type: 'number' },
  },
  additionalProperties: true,
};
