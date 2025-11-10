// Database audit logging system
const { Pool } = require('pg');

class AuditLogger {
  constructor(pool) {
    this.pool = pool;
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs in memory
    this.initTable();
  }

  async initTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          action VARCHAR(50) NOT NULL,
          table_name VARCHAR(100),
          record_id INTEGER,
          user_id VARCHAR(100),
          ip_address VARCHAR(45),
          request_method VARCHAR(10),
          request_path VARCHAR(255),
          old_data JSONB,
          new_data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Audit logs table initialized');
    } catch (err) {
      console.error('Error initializing audit logs table:', err);
    }
  }

  async log(action, options = {}) {
    const {
      tableName,
      recordId,
      userId,
      ipAddress,
      requestMethod,
      requestPath,
      oldData,
      newData
    } = options;

    const logEntry = {
      action,
      tableName,
      recordId,
      userId,
      ipAddress,
      requestMethod,
      requestPath,
      oldData,
      newData,
      timestamp: new Date()
    };

    // Add to in-memory logs
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Save to database
    try {
      await this.pool.query(
        `INSERT INTO audit_logs 
         (action, table_name, record_id, user_id, ip_address, request_method, request_path, old_data, new_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [action, tableName, recordId, userId, ipAddress, requestMethod, requestPath, 
         oldData ? JSON.stringify(oldData) : null, newData ? JSON.stringify(newData) : null]
      );
    } catch (err) {
      console.error('Error saving audit log:', err);
    }

    return logEntry;
  }

  getRecentLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }

  async getRecentLogsFromDB(limit = 100) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      return [];
    }
  }

  async getStats() {
    try {
      const result = await this.pool.query(`
        SELECT 
          action,
          COUNT(*) as count,
          MAX(created_at) as last_occurrence
        FROM audit_logs
        GROUP BY action
        ORDER BY count DESC
      `);
      return result.rows;
    } catch (err) {
      console.error('Error fetching audit stats:', err);
      return [];
    }
  }
}

module.exports = AuditLogger;

