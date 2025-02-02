const express = require('express');
const cors = require('cors');
const app = express();

// Enable all CORS requests
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 