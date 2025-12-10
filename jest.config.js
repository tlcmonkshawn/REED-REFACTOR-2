module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js',
        '!**/node_modules/**',
        '!**/frontend/**',
        '!**/REED REFACTOR 2/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 30,
            functions: 30,
            lines: 30,
            statements: 30
        }
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testTimeout: 10000
};
