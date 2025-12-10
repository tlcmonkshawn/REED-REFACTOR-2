module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    plugins: ['security'],
    rules: {
        // Security rules
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        
        // Best practices
        'no-console': 'warn',
        'no-unused-vars': ['warn', { 
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        'no-var': 'error',
        'prefer-const': 'warn',
        
        // Code quality
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-throw-literal': 'error',
        
        // Style (non-blocking)
        'semi': ['warn', 'always'],
        'quotes': ['warn', 'single', { avoidEscape: true }],
        'comma-dangle': ['warn', 'never']
    },
    ignorePatterns: [
        'node_modules/',
        'frontend/build/',
        'REED REFACTOR 2/',
        '*.min.js'
    ]
};
