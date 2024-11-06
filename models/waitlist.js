const db = require('../db');

const addEmailToWaitlist = async (email) => {
    const result = await db.query(
        'INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *',
        [email]
    );
    return result.rows[0];
};

const getWaitlistPosition = async (email) => {
    const result = await db.query(
        `SELECT COUNT(*) AS position FROM waitlist WHERE joined_at <= (SELECT joined_at FROM waitlist WHERE email = $1)`,
        [email]
    );
    return result.rows[0]?.position || null;
};

module.exports = { addEmailToWaitlist, getWaitlistPosition };
