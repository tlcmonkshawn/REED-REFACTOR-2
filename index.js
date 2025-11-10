const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const pool = require('./models/db');
const AuditLogger = require('./audit');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes - MUST be first
app.use(cors()); 

// Initialize audit logger
const auditLogger = new AuditLogger(pool);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('pool', pool);
app.set('auditLogger', auditLogger);


// Routes
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const bootiesRoutes = require('./routes/booties');
const locationsRoutes = require('./routes/locations');
const usersRoutes = require('./routes/users');
const geminiRoutes = require('./routes/gemini');

app.use('/api/v1/gemini', geminiRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/booties', bootiesRoutes);
app.use('/api/v1/auth', authRoutes);

// Deprecated scaffolding routes - to be removed
const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);

app.use('/', healthRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
