const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const waitlistRoutes = require('./routes/waitlist');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection verification
const verifyDatabaseConnection = async () => {
    try {
        await db.query('SELECT NOW()');
        console.log('✅ Database connection successful');
        console.log('Environment Variables:');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('Database URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
        if (process.env.DATABASE_URL) {
            // Log only the host part of the URL for security
            const urlParts = process.env.DATABASE_URL.split('@');
            if (urlParts.length > 1) {
                console.log('Database host:', urlParts[1].split('/')[0]);
            }
        }
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        // Don't exit in production, but log the error
        if (process.env.NODE_ENV !== 'production') {
            console.error('Exiting due to database connection failure');
            process.exit(1);
        }
    }
};

// Routes
app.use('/api/waitlist', waitlistRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        environment: process.env.NODE_ENV,
        dbConnected: !!db.pool
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // In production, you might want to use a process manager to restart the server
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

// Start server
const startServer = async () => {
    try {
        await verifyDatabaseConnection();
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`🔥 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();