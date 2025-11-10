const pool = require('../models/db');

exports.createBootie = async (req, res) => {
    const { title, description, status, category, location_id } = req.body;
    const user_id = req.user.id;

    try {
        const newBootie = await pool.query(
            'INSERT INTO booties (title, description, status, category, user_id, location_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, status || 'unlisted', category, user_id, location_id]
        );
        res.status(201).json(newBootie.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllBooties = async (req, res) => {
    try {
        const booties = await pool.query('SELECT * FROM booties ORDER BY created_at DESC');
        res.json(booties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getBootieById = async (req, res) => {
    try {
        const bootie = await pool.query('SELECT * FROM booties WHERE id = $1', [req.params.id]);
        if (bootie.rows.length === 0) {
            return res.status(404).json({ msg: 'Bootie not found' });
        }
        res.json(bootie.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateBootie = async (req, res) => {
    const { title, description, status, category, location_id } = req.body;

    try {
        // Check if bootie exists and belongs to the user
        let bootie = await pool.query('SELECT * FROM booties WHERE id = $1', [req.params.id]);
        if (bootie.rows.length === 0) {
            return res.status(404).json({ msg: 'Bootie not found' });
        }

        // Add role-based access control here if needed, e.g. agent can edit any bootie
        if (bootie.rows[0].user_id !== req.user.id && req.user.role !== 'agent' && req.user.role !== 'bootie_boss') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedBootie = await pool.query(
            'UPDATE booties SET title = $1, description = $2, status = $3, category = $4, location_id = $5, updated_at = current_timestamp WHERE id = $6 RETURNING *',
            [title, description, status, category, location_id, req.params.id]
        );

        res.json(updatedBootie.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteBootie = async (req, res) => {
    try {
        let bootie = await pool.query('SELECT * FROM booties WHERE id = $1', [req.params.id]);
        if (bootie.rows.length === 0) {
            return res.status(404).json({ msg: 'Bootie not found' });
        }

        if (bootie.rows[0].user_id !== req.user.id && req.user.role !== 'bootie_boss') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await pool.query('DELETE FROM booties WHERE id = $1', [req.params.id]);

        res.json({ msg: 'Bootie removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
