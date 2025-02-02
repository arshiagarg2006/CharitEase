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

        console.log('1. Registration data received:', { 
            email, user_type, org_name, categories, description, address, phone 
        });
        
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
            console.log('2. User created with ID:', userId);
            
            // If organization, create org record and add categories
            if (user_type === 'organization') {
                console.log('3. Creating organization record');
                
                // Create organization
                const orgQuery = `
                    INSERT INTO organizations 
                    (name, description, address, phone, email) 
                    VALUES ($1, $2, $3, $4, $5) 
                    RETURNING org_id
                `;
                
                const orgValues = [
                    org_name || full_name,
                    description,
                    address,
                    phone,
                    email
                ];

                console.log('4. Organization query:', { query: orgQuery, values: orgValues });
                
                const orgResult = await client.query(orgQuery, orgValues);
                const orgId = orgResult.rows[0].org_id;
                console.log('5. Organization created with ID:', orgId);
                
                // Add categories
                if (categories && categories.length > 0) {
                    console.log('6. Adding categories:', categories);
                    for (let categoryId of categories) {
                        await client.query(
                            'INSERT INTO organization_categories (org_id, category_id) VALUES ($1, $2)',
                            [orgId, categoryId]
                        );
                    }
                    console.log('7. Categories added successfully');
                }
            }
            
            await client.query('COMMIT');
            console.log('8. Transaction committed successfully');
            
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
        console.error('Final registration error:', err);
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