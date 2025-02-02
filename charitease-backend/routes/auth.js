const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // We'll create this next

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, user_type, categories } = req.body;
        
        // Start transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Create user
            const hashedPassword = await bcrypt.hash(password, 10);
            const userResult = await client.query(
                'INSERT INTO users (email, password, full_name, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id',
                [email, hashedPassword, full_name, user_type]
            );
            
            const userId = userResult.rows[0].user_id;
            
            // If organization, create org record and add categories
            if (user_type === 'organization') {
                const orgResult = await client.query(
                    'INSERT INTO organizations (name, email) VALUES ($1, $2) RETURNING org_id',
                    [full_name, email]
                );
                
                const orgId = orgResult.rows[0].org_id;
                
                // Add categories
                for (let categoryId of categories) {
                    await client.query(
                        'INSERT INTO organization_categories (org_id, category_id) VALUES ($1, $2)',
                        [orgId, categoryId]
                    );
                }
            }
            
            await client.query('COMMIT');
            
            // Generate token
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.status(201).json({ token, userId });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
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