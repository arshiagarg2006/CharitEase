const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // We'll create this next

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, user_type } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (email, password, full_name, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, full_name, user_type]
        );
        
        // Create token
        const token = jwt.sign({ id: newUser.rows[0].user_id }, process.env.JWT_SECRET);
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create token
        const token = jwt.sign({ id: user.rows[0].user_id }, process.env.JWT_SECRET);
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 