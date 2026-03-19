// schemaValidator.ts — AJV schema validation helper.
// Compiles a schema and validates data against it.
// Throws a descriptive error if validation fails so Playwright marks the test as failed.
import Ajv from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: object, data: unknown): void {
  const valid = ajv.compile(schema)(data);
  if (!valid) {
    throw new Error(`Schema validation failed: ${ajv.errorsText(ajv.compile(schema).errors)}`);
  }
}
