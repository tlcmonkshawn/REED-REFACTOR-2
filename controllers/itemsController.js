// Helper function to get client IP
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           'unknown';
}

// GET all items
exports.getAllItems = async (req, res) => {
    const pool = req.app.get('pool');
    const auditLogger = req.app.get('auditLogger');
    try {
      const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
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
};

// GET single item by ID
exports.getItemById = async (req, res) => {
    const pool = req.app.get('pool');
    const auditLogger = req.app.get('auditLogger');
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
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
};

// POST create new item
exports.createItem = async (req, res) => {
    const pool = req.app.get('pool');
    const auditLogger = req.app.get('auditLogger');
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: 'Name is required' });
      }
      const result = await pool.query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name, description || null]
      );
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
};

// PUT update item
exports.updateItem = async (req, res) => {
    const pool = req.app.get('pool');
    const auditLogger = req.app.get('auditLogger');
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const oldResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
      const oldData = oldResult.rows[0];
      const result = await pool.query(
        'UPDATE items SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [name, description || null, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
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
};

// DELETE item
exports.deleteItem = async (req, res) => {
    const pool = req.app.get('pool');
    const auditLogger = req.app.get('auditLogger');
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
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
};
