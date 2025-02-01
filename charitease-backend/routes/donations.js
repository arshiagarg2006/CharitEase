const router = require('express').Router();
const pool = require('../db');

// Create a new donation
router.post('/', async (req, res) => {
    try {
        const { 
            donor_id, 
            org_id, 
            item_description, 
            pickup_address,
            pickup_time 
        } = req.body;

        const newDonation = await pool.query(
            'INSERT INTO donations (donor_id, org_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [donor_id, org_id, item_description, 'pending']
        );

        // Create delivery record for pickup
        await pool.query(
            'INSERT INTO deliveries (donation_id, pickup_address, pickup_time) VALUES ($1, $2, $3)',
            [newDonation.rows[0].donation_id, pickup_address, pickup_time]
        );

        res.json(newDonation.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all donations for an organization
router.get('/organization/:orgId', async (req, res) => {
    try {
        const { orgId } = req.params;
        const donations = await pool.query(
            `SELECT d.*, u.full_name as donor_name, dl.pickup_address, dl.pickup_time 
             FROM donations d 
             JOIN users u ON d.donor_id = u.user_id 
             JOIN deliveries dl ON d.donation_id = dl.donation_id 
             WHERE d.org_id = $1 
             ORDER BY dl.pickup_time`,
            [orgId]
        );
        res.json(donations.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all donations for a donor
router.get('/donor/:donorId', async (req, res) => {
    try {
        const { donorId } = req.params;
        const donations = await pool.query(
            `SELECT d.*, o.name as organization_name, dl.pickup_address, dl.pickup_time 
             FROM donations d 
             JOIN organizations o ON d.org_id = o.org_id 
             JOIN deliveries dl ON d.donation_id = dl.donation_id 
             WHERE d.donor_id = $1 
             ORDER BY dl.pickup_time`,
            [donorId]
        );
        res.json(donations.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 