/**
 * Environment Variable Validator
 * Validates required environment variables on application startup
 * Exits with clear error message if any required variables are missing
 */

const requiredEnvVars = [
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'DATABASE_URL'
];

function validateEnv() {
    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        } else if (process.env[varName].includes('YOUR_') || 
                   process.env[varName].includes('supersecret') ||
                   process.env[varName].trim() === '') {
            warnings.push(`${varName} appears to be a placeholder or default value`);
        }
    });

    // Exit if critical variables are missing
    if (missing.length > 0) {
        console.error('\n❌ ERROR: Missing required environment variables:');
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease set these variables in your .env file or environment.');
        console.error('Example .env file:');
        console.error('   JWT_SECRET=your-secret-key-here');
        console.error('   GEMINI_API_KEY=your-api-key-here');
        console.error('   DATABASE_URL=postgres://user:password@localhost:5432/dbname\n');
        process.exit(1);
    }

    // Warn about placeholder values
    if (warnings.length > 0) {
        console.warn('\n⚠️  WARNING: Some environment variables appear to be placeholders:');
        warnings.forEach(warning => {
            console.warn(`   - ${warning}`);
        });
        console.warn('Please update these with actual values before deploying to production.\n');
    }

    // Success message in development
    if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Environment variables validated successfully\n');
    }
}

module.exports = validateEnv;
