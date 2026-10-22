import { beforeAll, afterAll } from 'vitest';

// Ensure predictable test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5005';
process.env.JWT_SECRET =
  'a_cryptographically_strong_random_jwt_secret_for_thinkwires_testing_1234567890';

// Suppress excessive logger noise during testing
beforeAll(() => {
  // Setup any global mocks or test environment state
});

afterAll(async () => {
  // Teardown any dangling timers or handles
});
