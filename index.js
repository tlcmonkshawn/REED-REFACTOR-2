const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./models/db');
const AuditLogger = require('./audit');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize audit logger
const auditLogger = new AuditLogger(pool);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('pool', pool);
app.set('auditLogger', auditLogger);


// Routes
const itemsRoutes = require('./routes/items');
const healthRoutes = require('./routes/health');

app.use('/api/items', itemsRoutes);
app.use('/', healthRoutes);


// Initialize database and start server
async function initDatabase() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Database table initialized');
      // Initialize audit logger table
      await auditLogger.initTable();
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database API available at http://0.0.0.0:${PORT}/api/items`);
  });
});
