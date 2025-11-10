const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// @route   POST api/v1/auth/register
// @desc    Register a new user
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        let user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Save user
        const newUser = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
            [username, hashedPassword, role || 'player']
        );

        res.status(201).json({
            msg: 'User registered successfully',
            user: newUser.rows[0],
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please provide username and password' });
    }

    try {
        // Check for user
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const user = userResult.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // TODO: Move JWT_SECRET to environment variables
        jwt.sign(payload, 'supersecretjwtkey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
