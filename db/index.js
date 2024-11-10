const { Pool } = require('pg');
const config = require('../public/config/config.js');

const pool = new Pool(config.db);

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database!');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool // Export pool in case you need direct access
};