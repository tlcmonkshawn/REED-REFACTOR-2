const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const AuditLogger = require('./audit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'reed_refactor_2',
  user: 'reed_user',
  password: 'reed_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize audit logger
const auditLogger = new AuditLogger(pool);

// Helper function to get client IP
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         'unknown';
}

// Initialize database table
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

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'REED REFACTOR 2 is running!',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL connected'
  });
});

app.get('/health', (req, res) => {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now
    });
  });
});

// Health HTML page with audit logs
app.get('/health.html', async (req, res) => {
  try {
    // Get health status
    const dbCheck = await pool.query('SELECT NOW(), version()');
    const dbStatus = dbCheck.rows[0];
    
    // Get database stats
    const itemCount = await pool.query('SELECT COUNT(*) as count FROM items');
    const auditStats = await auditLogger.getStats();
    const recentLogs = await auditLogger.getRecentLogsFromDB(50);
    
    // Get pool stats
    const poolStats = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>REED REFACTOR 2 - Health & Audit Logs</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1em; }
        .content { padding: 30px; }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #667eea;
        }
        .status-card h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        .status-card .value {
            font-size: 1.8em;
            font-weight: bold;
            color: #28a745;
        }
        .status-card .label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .endpoints {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
        }
        .endpoint {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #28a745;
        }
        .endpoint .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.85em;
            margin-right: 10px;
        }
        .method.get { background: #28a745; color: white; }
        .method.post { background: #007bff; color: white; }
        .method.put { background: #ffc107; color: #333; }
        .method.delete { background: #dc3545; color: white; }
        .endpoint .path {
            font-family: 'Courier New', monospace;
            color: #333;
            font-weight: 500;
        }
        .endpoint .desc {
            color: #666;
            margin-top: 5px;
            font-size: 0.9em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .badge.success { background: #d4edda; color: #155724; }
        .badge.info { background: #d1ecf1; color: #0c5460; }
        .badge.warning { background: #fff3cd; color: #856404; }
        .badge.danger { background: #f8d7da; color: #721c24; }
        .json-preview {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            max-height: 100px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .refresh-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 1em;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s;
        }
        .refresh-btn:hover {
            transform: scale(1.05);
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Health & Audit Dashboard</h1>
            <p>REED REFACTOR 2 - System Status & Database Audit Logs</p>
        </div>
        <div class="content">
            <div class="status-grid">
                <div class="status-card">
                    <h3>System Status</h3>
                    <div class="value">🟢 Online</div>
                    <div class="label">All systems operational</div>
                </div>
                <div class="status-card">
                    <h3>Database Status</h3>
                    <div class="value">🟢 Connected</div>
                    <div class="label">PostgreSQL ${dbStatus.version.split(' ')[0]} ${dbStatus.version.split(' ')[1]}</div>
                </div>
                <div class="status-card">
                    <h3>Server Time</h3>
                    <div class="value">${new Date(dbStatus.now).toLocaleTimeString()}</div>
                    <div class="label">${new Date(dbStatus.now).toLocaleDateString()}</div>
                </div>
                <div class="status-card">
                    <h3>Items in Database</h3>
                    <div class="value">${itemCount.rows[0].count}</div>
                    <div class="label">Total records</div>
                </div>
                <div class="status-card">
                    <h3>Connection Pool</h3>
                    <div class="value">${poolStats.totalCount} active</div>
                    <div class="label">${poolStats.idleCount} idle, ${poolStats.waitingCount} waiting</div>
                </div>
                <div class="status-card">
                    <h3>Audit Logs</h3>
                    <div class="value">${recentLogs.length}</div>
                    <div class="label">Recent entries shown</div>
                </div>
            </div>

            <div class="section">
                <h2>📡 API Endpoints</h2>
                <div class="endpoints">
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/</span>
                        <div class="desc">Root endpoint - Service information</div>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/health</span>
                        <div class="desc">JSON health check endpoint</div>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/health.html</span>
                        <div class="desc">This health dashboard page</div>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/api/items</span>
                        <div class="desc">Get all items from database</div>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/api/items/:id</span>
                        <div class="desc">Get a specific item by ID</div>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="path">/api/items</span>
                        <div class="desc">Create a new item (requires JSON body with name and description)</div>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <span class="path">/api/items/:id</span>
                        <div class="desc">Update an existing item (requires JSON body)</div>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DELETE</span>
                        <span class="path">/api/items/:id</span>
                        <div class="desc">Delete an item by ID</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>📊 Audit Statistics</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Count</th>
                            <th>Last Occurrence</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${auditStats.length > 0 ? auditStats.map(stat => `
                        <tr>
                            <td><span class="badge ${stat.action === 'CREATE' ? 'success' : stat.action === 'UPDATE' ? 'info' : stat.action === 'DELETE' ? 'danger' : 'warning'}">${stat.action}</span></td>
                            <td>${stat.count}</td>
                            <td class="timestamp">${new Date(stat.last_occurrence).toLocaleString()}</td>
                        </tr>
                        `).join('') : '<tr><td colspan="3" style="text-align: center; color: #666;">No audit statistics available yet</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>📝 Recent Audit Logs</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Table</th>
                            <th>Record ID</th>
                            <th>Method</th>
                            <th>Path</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentLogs.length > 0 ? recentLogs.map(log => `
                        <tr>
                            <td class="timestamp">${new Date(log.created_at).toLocaleString()}</td>
                            <td><span class="badge ${log.action === 'CREATE' ? 'success' : log.action === 'UPDATE' ? 'info' : log.action === 'DELETE' ? 'danger' : 'warning'}">${log.action}</span></td>
                            <td>${log.table_name || '-'}</td>
                            <td>${log.record_id || '-'}</td>
                            <td><span class="method ${log.request_method?.toLowerCase() || ''}">${log.request_method || '-'}</span></td>
                            <td><code>${log.request_path || '-'}</code></td>
                            <td>${log.ip_address || '-'}</td>
                        </tr>
                        `).join('') : '<tr><td colspan="7" style="text-align: center; color: #666;">No audit logs available yet. Make some API calls to see logs here!</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>
    `;
    
    res.send(html);
  } catch (err) {
    console.error('Error generating health page:', err);
    res.status(500).send(`
      <html>
        <head><title>Health Check Error</title></head>
        <body>
          <h1>Error loading health page</h1>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
});

// Database routes

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    
    // Audit log
    await auditLogger.log('READ', {
      tableName: 'items',
      ipAddress: getClientIp(req),
      requestMethod: req.method,
      requestPath: req.path
    });
    
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    
    // Audit log
    await auditLogger.log('READ', {
      tableName: 'items',
      recordId: parseInt(id),
      ipAddress: getClientIp(req),
      requestMethod: req.method,
      requestPath: req.path
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    
    // Audit log
    await auditLogger.log('CREATE', {
      tableName: 'items',
      recordId: result.rows[0].id,
      ipAddress: getClientIp(req),
      requestMethod: req.method,
      requestPath: req.path,
      newData: result.rows[0]
    });
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Get old data for audit
    const oldResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    const oldData = oldResult.rows[0];
    
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Audit log
    await auditLogger.log('UPDATE', {
      tableName: 'items',
      recordId: parseInt(id),
      ipAddress: getClientIp(req),
      requestMethod: req.method,
      requestPath: req.path,
      oldData: oldData,
      newData: result.rows[0]
    });
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Audit log
    await auditLogger.log('DELETE', {
      tableName: 'items',
      recordId: parseInt(id),
      ipAddress: getClientIp(req),
      requestMethod: req.method,
      requestPath: req.path,
      oldData: result.rows[0]
    });
    
    res.json({ success: true, message: 'Item deleted', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database API available at http://0.0.0.0:${PORT}/api/items`);
  });
});
