const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // We'll create this next

// Register
router.post('/register', async (req, res) => {
    try {
        const { 
            email, 
            password, 
            user_type, 
            full_name,
            org_name,
            description,
            address,
            phone,
            categories 
        } = req.body;

        console.log('Received registration data:', { 
            email, user_type, org_name, categories 
        }); // Debug log
        
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
            console.log('Created user with ID:', userId); // Debug log
            
            // If organization, create org record and add categories
            if (user_type === 'organization') {
                // Create organization
                const orgResult = await client.query(
                    `INSERT INTO organizations 
                    (name, description, address, phone, email) 
                    VALUES ($1, $2, $3, $4, $5) 
                    RETURNING org_id`,
                    [org_name || full_name, description, address, phone, email]
                );
                
                const orgId = orgResult.rows[0].org_id;
                console.log('Created organization with ID:', orgId); // Debug log
                
                // Add categories
                if (categories && categories.length > 0) {
                    for (let categoryId of categories) {
                        await client.query(
                            'INSERT INTO organization_categories (org_id, category_id) VALUES ($1, $2)',
                            [orgId, categoryId]
                        );
                        console.log('Added category:', categoryId, 'to org:', orgId); // Debug log
                    }
                }
            }
            
            await client.query('COMMIT');
            console.log('Transaction committed successfully'); // Debug log
            
            // Generate token
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.status(201).json({ token, userId });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Registration error:', err);
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Registration error:', err);
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