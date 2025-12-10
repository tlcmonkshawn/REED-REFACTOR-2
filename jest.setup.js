// Jest setup file
// This runs before each test file

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.GEMINI_API_KEY = 'test-gemini-api-key-for-testing-only';
process.env.DATABASE_URL = 'postgres://test_user:test_password@localhost:5432/test_db';

// Suppress console.log in tests (uncomment if desired)
// global.console = {
//     ...console,
//     log: jest.fn(),
//     debug: jest.fn(),
//     info: jest.fn(),
//     warn: jest.fn(),
//     error: jest.fn(),
// };
