import type { Config } from '../../src/config.js';

export function createTestConfig(overrides?: Partial<Config>): Config {
  return {
    JOTTY_BASE_URL: 'http://localhost:1122',
    JOTTY_API_KEY: 'ck_test_key_12345',
    API_KEY: 'test_api_key',
    ...overrides,
  };
}