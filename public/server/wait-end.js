const express = require('express');
const router = express.Router();
const pool = require('./database');

router.post('/waitlist', async (req, res) => {
    const { email } = req.body;
    
    try {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Check for existing email
            const existingEmail = await client.query(
                'SELECT position FROM waitlist WHERE email = $1',
                [email]
            );
            
            if (existingEmail.rows.length > 0) {
                return res.json({
                    success: true,
                    position: existingEmail.rows[0].position,
                    message: 'Email already registered'
                });
            }
            
            // Get next position
            const positionResult = await client.query(
                'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM waitlist'
            );
            const position = positionResult.rows[0].next_position;
            
            // Add to waitlist
            await client.query(
                'INSERT INTO waitlist (email, position) VALUES ($1, $2)',
                [email, position]
            );
            
            await client.query('COMMIT');
            
            res.json({
                success: true,
                position,
                message: position <= 100 
                    ? 'Early access granted!' 
                    : 'Added to waitlist'
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error in waitlist signup:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;