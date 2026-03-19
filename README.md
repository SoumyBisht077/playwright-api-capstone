# Playwright API Capstone

![CI](https://github.com/soumbish/playwright-api-capstone/actions/workflows/ci.yml/badge.svg)

End-to-end API test suite built with [@playwright/test](https://playwright.dev/docs/api-testing) against [DummyJSON](https://dummyjson.com).

## Structure

```
playwright-api-capstone/
├── .auth/                        # Auto-generated — bearer token saved by global-setup (gitignored)
├── .github/workflows/ci.yml      # GitHub Actions CI pipeline
├── fixtures/
│   └── api.fixture.ts            # Custom test fixtures (usersApi, productsApi)
├── tests/api/
│   ├── users.spec.ts             # Users CRUD + negative + lifecycle tests
│   ├── products.spec.ts          # Products list/filter/perf/resilience tests
│   ├── crud-chain.spec.ts        # Full Create→Get→Update→Delete chain
│   └── auth.spec.ts              # Login edge cases + bearer token tests
├── utils/
│   ├── apiClient.ts              # ApiClient base class + UsersApi + ProductsApi
│   ├── dataFactory.ts            # Test data builders (newUser, newProduct)
│   ├── schemas.ts                # AJV JSON schema definitions
│   └── schemaValidator.ts        # Schema validation helper
├── global-setup.ts               # Runs before all tests — health check + login + save token
├── global-teardown.ts            # Runs after all tests — cleans up .auth/token.json
├── playwright.config.ts          # Playwright configuration
├── .env                          # Local environment variables (gitignored)
├── .env.example                  # Safe template for environment variables
└── tsconfig.json
```

## Running Tests

```bash
# Install dependencies
npm ci
npx playwright install --with-deps

# Run all tests
npm test

# Run only smoke tests
npm run test:smoke

# Run only regression tests
npm run test:regression

# Run only auth tests
npm run test:auth

# Run in CI mode (single worker, no retries)
npm run test:ci

# Open HTML report
npm run test:report
```

## Environment Variables

| Variable            | Default                  | Description                        |
|---------------------|--------------------------|------------------------------------|
| `API_BASE`          | `https://dummyjson.com`  | Base URL for all API requests      |
| `AUTH_USERNAME`     | —                        | Username for global-setup login    |
| `AUTH_PASSWORD`     | —                        | Password for global-setup login    |
| `TEST_USER_EMAIL`   | `testuser@example.com`   | Email used in user data factory    |
| `TEST_USER_PASSWORD`| `pass1234`               | Password used in user data factory |

Copy `.env.example` to `.env` and fill in your values before running locally.

## Tags

| Tag           | Purpose                            | Run command              |
|---------------|------------------------------------|--------------------------|
| `@smoke`      | Critical happy-path tests          | `npm run test:smoke`     |
| `@regression` | Full coverage including edge cases | `npm run test:regression`|
| `@api`        | All API tests                      | `npm test`               |

## Test Summary

| File                | Tests | Coverage                                      |
|---------------------|-------|-----------------------------------------------|
| `users.spec.ts`     | 12    | CRUD, schema, negative, headers, lifecycle    |
| `products.spec.ts`  | 10    | List, filter, pagination, perf, resilience    |
| `crud-chain.spec.ts`| 1     | End-to-end Create→Get→Update→Delete chain     |
| `auth.spec.ts`      | 6     | Login edge cases, bearer token, 401 guards    |
| **Total**           | **29**|                                               |

