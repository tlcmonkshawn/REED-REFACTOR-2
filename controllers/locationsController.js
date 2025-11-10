const pool = require('../models/db');

exports.createLocation = async (req, res) => {
    // Role check
    if (req.user.role !== 'agent' && req.user.role !== 'bootie_boss') {
        return res.status(403).json({ msg: 'Authorization denied' });
    }

    const { name, address } = req.body;
    try {
        const newLocation = await pool.query(
            'INSERT INTO locations (name, address) VALUES ($1, $2) RETURNING *',
            [name, address]
        );
        res.status(201).json(newLocation.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await pool.query('SELECT * FROM locations ORDER BY name');
        res.json(locations.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
