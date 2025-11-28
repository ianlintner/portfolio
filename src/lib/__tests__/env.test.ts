import type {} from '@jest/globals';

describe('env validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws in production when NEXTAUTH_SECRET is missing', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.NEXTAUTH_SECRET;
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../env');
    }).toThrow(/NEXTAUTH_SECRET is required in production/);
  });

  it('parses when NEXTAUTH_SECRET is set in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXTAUTH_SECRET = 'test-secret';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../env');
    expect(env.NEXTAUTH_SECRET).toBe('test-secret');
  });

  it('does not throw in development when NEXTAUTH_SECRET is missing', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.NEXTAUTH_SECRET;

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../env');
    }).not.toThrow();
  });
});
