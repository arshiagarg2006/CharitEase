const router = require('express').Router();
const pool = require('../db');

// Get all organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await pool.query(
            'SELECT * FROM organizations ORDER BY name'
        );
        res.json(organizations.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single organization
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await pool.query(
            'SELECT * FROM organizations WHERE org_id = $1',
            [id]
        );

        if (organization.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json(organization.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create organization
router.post('/', async (req, res) => {
    try {
        const { name, description, address, phone, email } = req.body;
        
        const newOrg = await pool.query(
            'INSERT INTO organizations (name, description, address, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, address, phone, email]
        );
        
        res.status(201).json(newOrg.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update organization
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, phone, email } = req.body;
        
        const updatedOrg = await pool.query(
            'UPDATE organizations SET name = $1, description = $2, address = $3, phone = $4, email = $5 WHERE org_id = $6 RETURNING *',
            [name, description, address, phone, email, id]
        );

        if (updatedOrg.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json(updatedOrg.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify organization
router.put('/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const { verified } = req.body;
        
        const updatedOrg = await pool.query(
            'UPDATE organizations SET verified = $1 WHERE org_id = $2 RETURNING *',
            [verified, id]
        );

        if (updatedOrg.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json(updatedOrg.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get organization's donations
router.get('/:id/donations', async (req, res) => {
    try {
        const { id } = req.params;
        const donations = await pool.query(
            'SELECT d.*, u.full_name as donor_name, c.name as category_name FROM donations d LEFT JOIN users u ON d.donor_id = u.user_id LEFT JOIN categories c ON d.category_id = c.category_id WHERE d.org_id = $1 ORDER BY d.created_at DESC',
            [id]
        );
        
        res.json(donations.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 